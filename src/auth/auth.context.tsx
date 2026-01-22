import { createContext } from 'react';

export interface AuthContextValue {
  user: any | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  authenticateWithToken: (token: string) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
