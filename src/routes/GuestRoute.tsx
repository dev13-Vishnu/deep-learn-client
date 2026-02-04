import type React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { getAuthHomePath } from "../auth/navigation/getAuthHomePath";

export default function GuestRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, currentRole } = useAuth();

  if (isAuthenticated) {
    return (
        <Navigate
            to={getAuthHomePath(true, currentRole)}
            replace
        />
    );
  }

  return children;
}
