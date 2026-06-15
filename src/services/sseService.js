import { useEffect, useRef, useState } from "react";

const SSE_BASE_URL = "/api/v1/events/stream/messages";
const MAX_BACKOFF_MS = 30_000;
const BASE_BACKOFF_MS = 1_000;

function getAccessToken() {
    return localStorage.getItem("accessToken");
}

function buildSseUrl(token) {
    const params = new URLSearchParams({ token });
    return `${SSE_BASE_URL}?${params.toString()}`;
}

function parseSseBlock(block) {
    const event = {
        name: "message",
        data: ""
    };

    block.split("\n").forEach((line) => {
        if (!line || line.startsWith(":")) return;

        const separatorIndex = line.indexOf(":");
        const field = separatorIndex >= 0 ? line.slice(0, separatorIndex) : line;
        const rawValue = separatorIndex >= 0 ? line.slice(separatorIndex + 1) : "";
        const value = rawValue.startsWith(" ") ? rawValue.slice(1) : rawValue;

        if (field === "event") {
            event.name = value || "message";
        }

        if (field === "data") {
            event.data += event.data ? `\n${value}` : value;
        }
    });

    return event;
}

class SseClient {
    constructor() {
        this.controller = null;
        this.listeners = new Map();
        this.statusListeners = new Set();
        this.manualClose = false;
        this.reconnectAttempts = 0;
        this.reconnectTimer = null;
        this.status = "idle";
        this.buffer = "";
    }

    _notifyStatus(status, detail) {
        this.status = status;
        this.statusListeners.forEach((callback) => {
            try {
                callback(status, detail);
            } catch (error) {
                console.error("[sse] status listener threw", error);
            }
        });
    }

    _dispatch(eventName, data) {
        const callbacks = this.listeners.get(eventName);
        if (!callbacks) return;

        callbacks.forEach((callback) => {
            try {
                callback(data);
            } catch (error) {
                console.error(`[sse] listener for ${eventName} threw`, error);
            }
        });
    }

    _handleEventBlock(block) {
        const event = parseSseBlock(block);
        if (!event.data || event.name === "heartbeat") return;

        let payload = event.data;
        try {
            payload = JSON.parse(event.data);
        } catch {
            // Keep raw text payloads as-is.
        }

        this._dispatch(event.name, payload);
    }

    _processChunk(chunk) {
        this.buffer += chunk.replace(/\r\n/g, "\n");

        let boundary = this.buffer.indexOf("\n\n");
        while (boundary >= 0) {
            const block = this.buffer.slice(0, boundary).trim();
            this.buffer = this.buffer.slice(boundary + 2);

            if (block) {
                this._handleEventBlock(block);
            }

            boundary = this.buffer.indexOf("\n\n");
        }
    }

    async _readStream(response, controller) {
        if (!response.body) {
            throw new Error("SSE response did not include a readable stream");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");

        try {
            while (!this.manualClose) {
                const { done, value } = await reader.read();
                if (done) break;
                this._processChunk(decoder.decode(value, { stream: true }));
            }
        } finally {
            try {
                reader.releaseLock();
            } catch {
                // Some browsers release automatically when the stream closes.
            }

            if (this.controller === controller) {
                this.controller = null;
            }
        }
    }

    async _open(controller, token) {
        const url = buildSseUrl(token);

        this._notifyStatus("connecting");

        const response = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "text/event-stream",
                Authorization: `Bearer ${token}`
            },
            credentials: "include",
            cache: "no-store",
            signal: controller.signal
        });

        if (response.status === 401 || response.status === 403) {
            this._notifyStatus("unauthenticated", {
                status: response.status
            });
            this.disconnect();
            return;
        }

        if (!response.ok) {
            throw new Error(`SSE connection failed with HTTP ${response.status}`);
        }

        this.reconnectAttempts = 0;
        this.buffer = "";
        this._notifyStatus("open");
        await this._readStream(response, controller);

        if (!this.manualClose) {
            this._scheduleReconnect();
        }
    }

    connect() {
        if (this.controller) {
            return;
        }

        const token = getAccessToken();
        if (!token) {
            console.warn("[sse] connect skipped: no accessToken in localStorage");
            this._notifyStatus("unauthenticated");
            return;
        }

        this.manualClose = false;
        const controller = new AbortController();
        this.controller = controller;

        this._open(controller, token).catch((error) => {
            if (this.manualClose || controller.signal.aborted) {
                return;
            }

            console.error("[sse] stream error", error);

            if (this.controller === controller) {
                this.controller = null;
            }

            this._notifyStatus("error", error);
            this._scheduleReconnect();
        });
    }

    _scheduleReconnect() {
        if (this.manualClose || this.reconnectTimer) return;

        const attempt = ++this.reconnectAttempts;
        const exp = Math.min(MAX_BACKOFF_MS, BASE_BACKOFF_MS * 2 ** (attempt - 1));
        const jitter = Math.random() * 500;
        const delay = exp + jitter;

        console.warn(`[sse] reconnecting in ${Math.round(delay)}ms (attempt ${attempt})`);
        this._notifyStatus("reconnecting", { attempt, delay });

        this.reconnectTimer = window.setTimeout(() => {
            this.reconnectTimer = null;
            this.connect();
        }, delay);
    }

    disconnect() {
        this.manualClose = true;

        if (this.reconnectTimer) {
            window.clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }

        if (this.controller) {
            this.controller.abort();
            this.controller = null;
        }

        this.buffer = "";
        this._notifyStatus("closed");
    }

    on(eventName, callback) {
        if (!this.listeners.has(eventName)) {
            this.listeners.set(eventName, new Set());
        }

        this.listeners.get(eventName).add(callback);
        return () => this.off(eventName, callback);
    }

    off(eventName, callback) {
        const callbacks = this.listeners.get(eventName);
        if (!callbacks) return;

        callbacks.delete(callback);
        if (callbacks.size === 0) {
            this.listeners.delete(eventName);
        }
    }

    onStatusChange(callback) {
        this.statusListeners.add(callback);
        return () => this.statusListeners.delete(callback);
    }

    isConnected() {
        return this.status === "open";
    }
}

const sseClient = new SseClient();
export default sseClient;

export function useSseEvent(eventName, handler, { enabled = true } = {}) {
    const handlerRef = useRef(handler);

    useEffect(() => {
        handlerRef.current = handler;
    }, [handler]);

    useEffect(() => {
        if (!enabled) return undefined;

        sseClient.connect();

        const unsubscribe = sseClient.on(eventName, (data) => {
            handlerRef.current?.(data);
        });

        return () => {
            unsubscribe();
        };
    }, [eventName, enabled]);
}

export function useSseStatus() {
    const [status, setStatus] = useState(() =>
        sseClient.isConnected() ? "open" : "idle"
    );

    useEffect(() => {
        const unsubscribe = sseClient.onStatusChange((next) => {
            setStatus(next);
        });
        return unsubscribe;
    }, []);

    return status;
}
