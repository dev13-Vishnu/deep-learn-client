import type React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function GuestRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, currentRole } = useAuth();

  if (isAuthenticated) {
    if (currentRole === "admin") {
      return <Navigate to="/admin" replace />;
    }

    if (currentRole === "instructor") {
      return <Navigate to="/instructor/dashboard" replace />;
    }

    // student (default)
    return <Navigate to="/home" replace />;
  }

  return children;
}
