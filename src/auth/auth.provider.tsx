import { useState, useEffect, type ReactNode } from 'react';
import { AuthContext } from './auth.context';
import { authApi } from '../api/auth.api';
import { tokenStorage } from '../storage/token.storage';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(tokenStorage.get()));

  // Restore auth state on app load
  // useEffect(() => {
  //   setIsAuthenticated(Boolean(tokenStorage.get()));
  // }, []);

  async function login(email: string, password: string) {
    const response = await authApi.login({ email, password });

    const { accessToken } = response.data;

    tokenStorage.set(accessToken);
    setIsAuthenticated(true);
  }

  function logout() {
    tokenStorage.clear();
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
