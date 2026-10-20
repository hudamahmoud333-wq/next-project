"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { TOKEN_KEY, USER_KEY } from "@/lib/api";
import { decodeJwt } from "@/lib/utils";
import type { User } from "@/lib/types";

interface AuthState {
  token: string | null;
  user: User | null;
  userId: string | null;
  ready: boolean;
  login: (token: string, user?: User) => void;
  updateUser: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const qc = useQueryClient();

  // Restore the session after hydration (localStorage is browser-only).
  useEffect(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    const u = localStorage.getItem(USER_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (t) setToken(t);
    if (u) {
      try {
        setUser(JSON.parse(u));
      } catch {
        /* ignore corrupted value */
      }
    }
    setReady(true);
  }, []);

  const login = useCallback((t: string, u?: User) => {
    localStorage.setItem(TOKEN_KEY, t);
    setToken(t);
    if (u) {
      localStorage.setItem(USER_KEY, JSON.stringify(u));
      setUser(u);
    }
  }, []);

  const updateUser = useCallback((u: User) => {
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    qc.removeQueries({ queryKey: ["cart"] });
    qc.removeQueries({ queryKey: ["wishlist"] });
    qc.removeQueries({ queryKey: ["orders"] });
    qc.removeQueries({ queryKey: ["addresses"] });
  }, [qc]);

  const userId = useMemo(() => (token ? (decodeJwt(token)?.id ?? null) : null), [token]);

  const value = useMemo(
    () => ({ token, user, userId, ready, login, updateUser, logout }),
    [token, user, userId, ready, login, updateUser, logout],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
