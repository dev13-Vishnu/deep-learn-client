import { createContext } from 'react';
import type { InstructorState } from './types';

export type RoleContext = 'student' | 'instructor' | 'admin'

export interface AuthContextValue {
  user: any | null;
  isAuthenticated: boolean;
  isHydrating: boolean;

  currentRole: RoleContext | null;
  instructorState: InstructorState | null;

  login: (
    email: string,
    password: string,
    roleContext?: RoleContext
  ) => Promise<any>; // returns user data


  
  authenticateWithToken: (
    token: string,
    roleContext?: RoleContext
  ) => void;

  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
