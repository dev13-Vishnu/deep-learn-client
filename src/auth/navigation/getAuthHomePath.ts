import type { RoleContext } from "../auth.context";

export function getAuthHomePath (
    isAuthenticated: boolean,
    role: RoleContext | null
) : string {
    if (!isAuthenticated) {
        return '/';
    }

    switch (role) {
        case 'admin':
            return '/admin';
        case 'instructor':
            return '/instructor/dashboard';
        case 'student':
        default:
            return '/home';
    }
}