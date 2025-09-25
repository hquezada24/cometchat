// src/context/AuthContext.tsx
import { createContext, useState } from "react";
import type { ReactNode } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
