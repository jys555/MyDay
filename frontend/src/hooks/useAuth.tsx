import React, { createContext, useContext, useEffect, useState } from "react";
import { api, setUserIdHeader } from "../api/client";
import WebApp from "@twa-dev/sdk";

export interface User {
  id: number;
  telegramId: number;
  username?: string | null;
  firstName?: string | null;
  timezone: string;
  chatId?: string | null;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  error: null
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      try {
        WebApp.ready();
        WebApp.expand();

        const initData = WebApp.initData;
        if (!initData) {
          setError("Telegram initData not found. Please open via Telegram.");
          setLoading(false);
          return;
        }

        const res = await api.post("/auth/telegram", { initData });
        const u = res.data.user as User;
        setUser(u);
        setUserIdHeader(u.id);
      } catch (e: any) {
        setError(e?.response?.data?.error ?? "Failed to authenticate with Telegram");
      } finally {
        setLoading(false);
      }
    }

    void init();
  }, []);

  return <AuthContext.Provider value={{ user, loading, error }}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  return useContext(AuthContext);
}

