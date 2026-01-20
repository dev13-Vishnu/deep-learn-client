import type React from "react";
import { useAuth } from "../auth/useAuth";
import { Navigate } from "react-router-dom";

export default function GuestRoute ( { children} : {  children: React.ReactNode}){
    const {isAuthenticated} = useAuth();

    if(isAuthenticated) {
        return<Navigate to="/dashboard" replace/>;
    }
    return children;
}