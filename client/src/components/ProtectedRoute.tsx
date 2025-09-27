import React from "react"; // Needed for JSX namespace
import { Navigate } from "react-router-dom";
import useAuth from "../context/useAuth";

export const ProtectedRoute = ({
  children,
}: {
  children: React.JSX.Element;
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Or your loading component
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
