import { createContext } from 'react';
import type { LoginDTO, RegisterDTO } from '../../application/dtos/auth';

interface AuthContextValue {
  isAuthenticated: boolean;
  login(data: LoginDTO): Promise<void>;
  register(data: RegisterDTO): Promise<void>;
  logout(): void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
