import type { JSX } from "react";
import { useAuth } from "../useAuth";
import { Navigate } from "react-router-dom";

export type InstructorState = 
| 'not_applied'
| 'pending'
| 'approved'
| 'rejected' ;

function getInstructorState(user: any) : InstructorState {
    if (!user?.instructorApplication) return 'not_applied';
    return user.instructorApplication.status;
}

interface RequireInstructorStateProps {
    allowed: InstructorState[];
    children: JSX.Element;
}

export default function RequireInstructorState({
    allowed,
    children,
}: RequireInstructorStateProps) {
    const { user, isHydrating } = useAuth();

    if (isHydrating) return null;

    const state = getInstructorState(user);

    if (!allowed.includes(state)) {
        if(state === 'approved') {
            return <Navigate to="/login" replace />;
        }

        return <Navigate to="/instructor/status" replace />;
    }
    
    return children;
}