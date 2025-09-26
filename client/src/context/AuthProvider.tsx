// // src/context/AuthContext.tsx
// import { createContext, useState, useEffect } from "react";
// import type { ReactNode } from "react";

// type AuthContextType = {
//   isAuthenticated: boolean;
//   login: (username: string, password: string) => Promise<void>;
//   logout: () => Promise<void>;
// };

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const API_BASE_URL =
//     import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const res = await fetch(`${API_BASE_URL}/api/me`, {
//           method: "GET",
//           credentials: "include", // send cookies
//         });
//         if (res.ok) {
//           setIsAuthenticated(true);
//           console.log("authenticated");
//         } else {
//           setIsAuthenticated(false);
//           console.log("unauthenticated");
//         }
//       } catch {
//         setIsAuthenticated(false);
//       }
//     };
//     checkAuth();
//   }, [API_BASE_URL]);

//   const login = async (username: string, password: string) => {
//     // POST to backend, backend sets HttpOnly cookie
//     const res = await fetch("/api/me", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       credentials: "include", // this is key!
//       body: JSON.stringify({ username, password }),
//     });

//     if (!res.ok) throw new Error("Login failed");
//     setIsAuthenticated(true);
//   };

//   const logout = async () => {
//     await fetch("/api/logout", {
//       method: "POST",
//       credentials: "include", // send cookies so backend can clear them
//     });
//     setIsAuthenticated(false);
//   };

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export { AuthContext };

// src/context/AuthContext.tsx
import { createContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>; // Add this for manual auth checking
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const checkAuth = useCallback(async () => {
    try {
      // Changed from /api/me to /me to match your backend route
      const res = await fetch(`${API_BASE_URL}/api/me`, {
        method: "GET",
        credentials: "include", // send cookies
      });
      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        console.error("Auth check failed not authenticated");
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsAuthenticated(false);
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
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
