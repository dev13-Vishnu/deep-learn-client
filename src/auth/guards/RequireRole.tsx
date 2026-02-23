import { Navigate } from "react-router-dom";
import { useAuth } from "../useAuth";
import type { JSX } from "react";
import type { RoleContext } from "../../store/auth/authSlice";

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
        return <Navigate to="/login" replace />
    }

    return children;
}