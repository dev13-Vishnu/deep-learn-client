import type { JSX } from "react";
import { useAuth } from "../useAuth";
import { Navigate } from "react-router-dom";

interface RequireInstructorStateProps {
    children: JSX.Element;
}

export default function RequireInstructorState({
    children,
}: RequireInstructorStateProps) {
    const { instructorState, isHydrating } = useAuth();

    if (isHydrating) return null;


    // only approved instructor can access
    if (instructorState !== 'approved') {
        return <Navigate to="/instructor/status" replace />
    }
    
    return children;
}