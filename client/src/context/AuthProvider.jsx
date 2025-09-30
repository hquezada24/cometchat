// src/context/AuthProvider.tsx
import { createContext, useState, useEffect, useCallback } from "react";

const AuthContext = (createContext < AuthContextType) | (undefined > undefined);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = (useState < User) | (null > null);
  const [selectedChat, setSelectedChat] = (useState < Chat) | (null > null);
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/me`, {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        setIsAuthenticated(true);
      } else {
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

  // New function to refresh user data
  const refreshUser = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/me`, {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  }, [API_BASE_URL, isAuthenticated]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (login, password) => {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ login, password }),
    });

    if (!res.ok) throw new Error("Login failed");

    const data = await res.json();

    if (data.user) {
      setUser(data.user);
    }

    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setSelectedChat(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        login,
        logout,
        checkAuth,
        selectedChat,
        setSelectedChat,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
