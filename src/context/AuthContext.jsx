import { useCallback, useEffect, useMemo, useState } from "react";
import AuthContext from "./AuthContextCore";
import sseClient from "../services/sseService";

const STORAGE_KEYS = ["accessToken", "user", "organization", "refreshToken"];

const readInitialAuth = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        return { token: null, user: null, organization: null };
    }
    try {
        const user = JSON.parse(localStorage.getItem("user") ?? "null");
        const organization = JSON.parse(
            localStorage.getItem("organization") ?? "null"
        );
        return { token, user, organization };
    } catch {
        // Corrupted storage — fail closed.
        STORAGE_KEYS.forEach((k) => localStorage.removeItem(k));
        return { token: null, user: null, organization: null };
    }
};

export const AuthProvider = ({ children }) => {
    const [{ token, user, organization }, setAuth] = useState(readInitialAuth);

    // Keep multiple tabs in sync. If a user logs out in one tab, every other
    // tab's AuthProvider is forced to re-read storage and re-render.
    useEffect(() => {
        const onStorage = (event) => {
            if (STORAGE_KEYS.includes(event.key)) {
                setAuth(readInitialAuth());
            }
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    const signIn = useCallback(({ accessToken, user, organization, refreshToken }) => {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("organization", JSON.stringify(organization));
        if (refreshToken) {
            localStorage.setItem("refreshToken", refreshToken);
        }
        setAuth({ token: accessToken, user, organization });
    }, []);

    const logout = useCallback(() => {
        // 0. Tear down any open SSE connection so it doesn't keep retrying
        //    with a now-invalid token.
        try {
            sseClient.disconnect();
        } catch (err) {
            console.error("[auth] sse disconnect failed", err);
        }
        // 1. Wipe every auth-related key (don't blow away unrelated prefs)
        STORAGE_KEYS.forEach((k) => localStorage.removeItem(k));
        try {
            sessionStorage.clear();
        } catch {
            /* sessionStorage can throw in some sandboxed iframes */
        }
        // 2. Drop any axios default Authorization header that was set as a
        //    fallback. Our per-request interceptor still re-reads from storage,
        //    so this is defense in depth.
        if (typeof window !== "undefined" && window?.axios) {
            delete window.axios.defaults.headers.common.Authorization;
        }
        // 3. Reset React state — every consumer of useAuth re-renders.
        setAuth({ token: null, user: null, organization: null });
    }, []);

    const value = useMemo(
        () => ({ token, user, organization, signIn, logout, isAuthenticated: !!token }),
        [token, user, organization, signIn, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
