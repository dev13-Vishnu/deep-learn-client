import { useState } from 'react';
import { AuthContext } from './auth.context';
import { tokenStorage } from '../storage/token.storage';
import { authApi } from '../api/auth.api';
import type { LoginDTO, RegisterDTO } from '../application/dtos/auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(tokenStorage.get()));

  async function login(data: LoginDTO) {
    const { accessToken } = await authApi.login(data);
    tokenStorage.set(accessToken);
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
