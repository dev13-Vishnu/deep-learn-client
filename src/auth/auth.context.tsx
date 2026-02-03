import { createContext } from 'react';
export type RoleContext = 'student' | 'instrucctor' | 'admin'

export interface AuthContextValue {
  user: any | null;
  isAuthenticated: boolean;
  isHydrating: boolean;

  currentRole: RoleContext | null;

  login: (
    email: string,
    password: string,
    roleContext: RoleContext
  ) => Promise<void>;


  
  authenticateWithToken: (
    token: string,
    roleContext: RoleContext
  ) => void;

  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
