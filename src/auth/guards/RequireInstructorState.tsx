import type { JSX } from "react";
import { useAuth } from "../useAuth";
import { Navigate } from "react-router-dom";




interface RequireInstructorStateProps {
    children: JSX.Element;
}

export default function RequireInstructorState({
    children,
}: RequireInstructorStateProps) {
    const { currentRole, isHydrating } = useAuth();

    if (isHydrating) return null;


    if ( currentRole !== 'instructor') {

        return <Navigate to="/instructor/status" replace />;
    }
    
    return children;
}