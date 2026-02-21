import { Navigate } from "react-router-dom";
import type { RoleContext } from "../auth.context";
import { useAuth } from "../useAuth";
import type { JSX } from "react";

interface RequireRoleProps {
    allowed: RoleContext[];
    children: JSX.Element;
}

export default function RequireRole({
    allowed,
    children,
}: RequireRoleProps) {
    const { currentRole, isHydrating } = useAuth();

    if(isHydrating) {
        return null;
    }

    if(!currentRole || !allowed.includes(currentRole)) {
        // Role isolation: force re-login
        return <Navigate to="/login" replace />
    }

    return children;
}