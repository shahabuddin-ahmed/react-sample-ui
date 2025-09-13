// src/hooks/useAuth.ts
import { useEffect, useMemo, useState } from "react";

export const useAuth = () => {
    const readToken = () => {
        const raw = localStorage.getItem("accessToken");
        try {
            return raw && (raw.startsWith('"') ? JSON.parse(raw) : raw);
        } catch {
            return raw;
        }
    };

    const [token, setToken] = useState<string | null>(() => readToken());

    // keep isAuthenticated derived from token
    const isAuthenticated = useMemo(() => Boolean(token), [token]);

    // react to changes (e.g., login/logout in other tabs or same tab)
    useEffect(() => {
        const onStorage = (e: StorageEvent) => {
            if (e.key === "accessToken") setToken(readToken());
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    // helper setters if you want to control token locally as well
    const setAuthToken = (t: string | null) => {
        if (t) {
            localStorage.setItem("accessToken", JSON.stringify(t));
            setToken(t);
        } else {
            localStorage.removeItem("accessToken");
            setToken(null);
        }
    };

    return { token, isAuthenticated, setAuthToken };
};
