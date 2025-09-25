import React from "react"; // Needed for JSX namespace
import { Navigate } from "react-router-dom";
import useAuth from "../context/useAuth";

export const ProtectedRoute = ({
  children,
}: {
  children: React.JSX.Element;
}) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
