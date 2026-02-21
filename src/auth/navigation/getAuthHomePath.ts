import type { RoleContext } from "../auth.context";
import type { InstructorState } from "../types";

export function getAuthHomePath(
    isAuthenticated: boolean,
    role: RoleContext | null,
    instructorState?: InstructorState | null
): string {
    if (!isAuthenticated || !role) {
        return '/';
    }

    if (role === 'admin') {
        return '/admin';
    }

    if (role === 'instructor') {
        // Route based on application status
        if (!instructorState || instructorState === 'not_applied') {
            return '/instructor/apply';
        }
        if (instructorState === 'pending') {
            return '/instructor/status';
        }
        if (instructorState === 'rejected') {
            return '/instructor/status';  // Can reapply from status page
        }
        if (instructorState === 'approved') {
            return '/instructor/dashboard';
        }
    }

    return '/home';  // student default
}