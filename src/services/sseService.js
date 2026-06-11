// Server-Sent Events client for Marq Studio.
//
// Backend expectations:
//   GET /api/v1/events/stream/messages?token=<jwt>
//   Content-Type: text/event-stream
//   Events emitted:
//     - "new-message"     (a fresh inbound or outbound message)
//     - "message-status"  (a status update for an existing message)
//     - "heartbeat"       (keep-alive, ignored by the client)
//
// Browser limitation: EventSource cannot set custom request headers. We
// authenticate by appending the access token as a query string. The backend
// must accept either a Bearer header OR a ?token=... query parameter on the
// SSE endpoint.
//
// Reconnect: EventSource already auto-reconnects on network errors. We layer
// on (a) explicit close on disconnect, (b) exponential backoff with jitter
// when we close and reopen ourselves, and (c) named-event fan-out so multiple
// components can subscribe without re-creating the connection.

import { useEffect, useRef, useState } from "react";

const SSE_BASE_URL = "/api/v1/events/stream/messages";
const MAX_BACKOFF_MS = 30_000;
const BASE_BACKOFF_MS = 1_000;

class SseClient {
    constructor() {
        this.source = null;
        this.url = null;
        this.listeners = new Map(); // eventName -> Set<callback>
        this.statusListeners = new Set();
        this.manualClose = false;
        this.reconnectAttempts = 0;
        this.reconnectTimer = null;
    }

    _notifyStatus(status, detail) {
        this.statusListeners.forEach((cb) => {
            try {
                cb(status, detail);
            } catch (err) {
                console.error("[sse] status listener threw", err);
            }
        });
    }

    _dispatch(eventName, data) {
        const set = this.listeners.get(eventName);
        if (!set) return;
        set.forEach((cb) => {
            try {
                cb(data);
            } catch (err) {
                console.error(`[sse] listener for ${eventName} threw`, err);
            }
        });
    }

    _buildUrl() {
        const token = localStorage.getItem("accessToken");
        if (!token) return null;
        // Use URLSearchParams for safe encoding
        const params = new URLSearchParams({ token });
        return `${SSE_BASE_URL}?${params.toString()}`;
    }

    connect() {
        if (this.source) {
            // Already connected — no-op. Caller should call disconnect() first
            // if they want a fresh connection.
            return;
        }

        const url = this._buildUrl();
        if (!url) {
            console.warn("[sse] connect skipped: no accessToken in localStorage");
            this._notifyStatus("unauthenticated");
            return;
        }

        this.url = url;
        this.manualClose = false;

        let source;
        try {
            source = new EventSource(url, { withCredentials: false });
        } catch (err) {
            console.error("[sse] failed to construct EventSource", err);
            this._scheduleReconnect();
            return;
        }

        this.source = source;
        this._notifyStatus("connecting");

        source.addEventListener("open", () => {
            this.reconnectAttempts = 0;
            this._notifyStatus("open");
        });

        source.addEventListener("error", (event) => {
            // EventSource has already closed. If we didn't ask it to close,
            // it will auto-reconnect, but we also surface the status.
            if (this.manualClose) return;
            this._notifyStatus("error", event);
            // If readyState is CLOSED, EventSource won't reconnect on its
            // own — we have to.
            if (source.readyState === EventSource.CLOSED) {
                this.source = null;
                this._scheduleReconnect();
            }
        });

        // Named events. Each backend event type gets its own listener channel.
        ["new-message", "message-status", "heartbeat"].forEach((name) => {
            source.addEventListener(name, (event) => {
                if (name === "heartbeat") return; // ignore keep-alives
                let payload = event.data;
                try {
                    payload = JSON.parse(event.data);
                } catch {
                    // Non-JSON payload — keep the raw string.
                }
                this._dispatch(name, payload);
            });
        });
    }

    _scheduleReconnect() {
        if (this.manualClose) return;
        if (this.reconnectTimer) return;

        const attempt = ++this.reconnectAttempts;
        const exp = Math.min(MAX_BACKOFF_MS, BASE_BACKOFF_MS * 2 ** (attempt - 1));
        const jitter = Math.random() * 500;
        const delay = exp + jitter;

        console.warn(`[sse] reconnecting in ${Math.round(delay)}ms (attempt ${attempt})`);
        this._notifyStatus("reconnecting", { attempt, delay });

        this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null;
            this.connect();
        }, delay);
    }

    disconnect() {
        this.manualClose = true;
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        if (this.source) {
            try {
                this.source.close();
            } catch (err) {
                console.error("[sse] error closing source", err);
            }
            this.source = null;
        }
        this._notifyStatus("closed");
    }

    // Subscribe to a named backend event ("new-message", "message-status", ...).
    // Returns an unsubscribe function.
    on(eventName, callback) {
        if (!this.listeners.has(eventName)) {
            this.listeners.set(eventName, new Set());
        }
        this.listeners.get(eventName).add(callback);
        return () => this.off(eventName, callback);
    }

    off(eventName, callback) {
        const set = this.listeners.get(eventName);
        if (!set) return;
        set.delete(callback);
        if (set.size === 0) this.listeners.delete(eventName);
    }

    onStatusChange(callback) {
        this.statusListeners.add(callback);
        return () => this.statusListeners.delete(callback);
    }

    isConnected() {
        return this.source?.readyState === EventSource.OPEN;
    }
}

const sseClient = new SseClient();
export default sseClient;

// React hook: useSseEvent("new-message", handler)
//
// Connects the SSE client on mount, disconnects on unmount, and subscribes
// the given callback to the named event. Re-subscribes automatically if the
// callback identity changes.
export function useSseEvent(eventName, handler, { enabled = true } = {}) {
    const handlerRef = useRef(handler);
    handlerRef.current = handler;

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

// React hook: useSseStatus() -> "connecting" | "open" | "error" | "closed" | "unauthenticated"
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
