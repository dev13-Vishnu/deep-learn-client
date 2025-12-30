import { createContext, useContext, useState } from 'react';
import { tokenStorage } from '../../infrastructure/token.storage';
import { authApi } from '../../infrastructure/api/auth.api';
import type { LoginDTO, RegisterDTO } from '../../application/dtos/auth';

interface AuthContextValue {
  isAuthenticated: boolean;
  login(data: LoginDTO): Promise<void>;
  register(data: RegisterDTO): Promise<void>;
  logout(): void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(tokenStorage.get()));

  async function login(data: LoginDTO) {
    const { token } = await authApi.login(data);
    tokenStorage.set(token);
    setIsAuthenticated(true);
  }

  async function register(data: RegisterDTO) {
    await authApi.register(data);
  }

  function logout() {
    tokenStorage.clear();
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used inside AuthProvider');
  }
  return ctx;
}
