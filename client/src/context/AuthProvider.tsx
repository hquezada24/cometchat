// src/context/AuthContext.tsx
import { createContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import type { User } from "../types/userTypes";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/me`, {
        method: "GET",
        credentials: "include", // send cookies
      });
      if (res.ok) {
        const user = await res.json();
        setUser(user);
        setIsAuthenticated(true);
      } else {
        console.error("Auth check failed not authenticated");
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    checkAuth();
  }, [API_BASE_URL, checkAuth]);

  const login = async (login: string, password: string) => {
    // Changed to use consistent API_BASE_URL and /login endpoint
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // this is key!
      body: JSON.stringify({ login: login, password }), // Changed to match backend expectation
    });

    if (!res.ok) throw new Error("Login failed");

    // Get the response data (token and user info)
    const data = await res.json();

    // Store user information
    if (data.user) {
      setUser(data.user); // Add user state to your AuthProvider
    }

    // Immediately update auth state after successful login
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        credentials: "include", // send cookies so backend can clear them
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always set to false regardless of logout request success
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, isLoading, login, logout, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
