const ROLE_CONTEXT_KEY = 'roleContext';

export type StoredRoleContext = 'student' | 'instructor' | 'admin';

export const roleContextStorage = {
    get(): StoredRoleContext | null {
        const value = localStorage.getItem(ROLE_CONTEXT_KEY)
        if(
            value === 'student' ||
            value === 'instructor' ||
            value === 'admin'
        ) {
            return value;
        }
        return null;
    },
    set(role: StoredRoleContext): void {
        localStorage.setItem(ROLE_CONTEXT_KEY,role);
    },
    clear(): void {
        localStorage.removeItem(ROLE_CONTEXT_KEY);
    },
};