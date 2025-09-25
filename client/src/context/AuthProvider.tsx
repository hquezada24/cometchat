// src/context/AuthContext.tsx
import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/me`, {
          method: "GET",
          credentials: "include", // send cookies
        });
        if (res.ok) setIsAuthenticated(true);
        else setIsAuthenticated(false);
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, [API_BASE_URL]);

  const login = async (username: string, password: string) => {
    // POST to backend, backend sets HttpOnly cookie
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // this is key!
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) throw new Error("Login failed");
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await fetch("/api/logout", {
      method: "POST",
      credentials: "include", // send cookies so backend can clear them
    });
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
