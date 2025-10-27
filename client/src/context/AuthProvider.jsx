import { createContext, useState, useEffect, useCallback } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/me`, {
        method: "GET",
        credentials: "include",
      });
      const userData = await res.json();
      if (userData.authenticated === true) {
        console.log("auth userData:", userData);
        // Normalize if nested
        const u = userData.user ?? userData;
        setUser(u);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        console.log("not authenticated");
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

  const refreshUser = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/me`, {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const userData = await res.json();
        const u = userData.user ?? userData;
        setUser(u);
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  }, [API_BASE_URL, isAuthenticated]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (loginParam, password) => {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ login: loginParam, password }),
    });

    // ADD THIS BLOCK TO SEE THE ACTUAL ERROR
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("Login failed with status:", res.status);
      console.error("Error response:", errorData);
      throw new Error(errorData.message || "Login failed");
    }

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
