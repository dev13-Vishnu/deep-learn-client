import { useEffect, useState, type ReactNode } from 'react';
import { AuthContext, type RoleContext } from './auth.context';
import { authApi } from '../api/auth.api';
import { tokenStorage } from '../storage/token.storage';
import { roleContextStorage } from '../storage/roleContext.storage';
import type { InstructorState } from './types';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentRole, setCurrentRole] = useState<RoleContext | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isHydrating, setIsHydrating] = useState(true);
  const [instructorState, setInstructorState] = useState<InstructorState | null>(null);

  useEffect(() => {
    const hydrate = async () => {
      const token = tokenStorage.get();

      const storedRole = roleContextStorage.get();

      if (!token) {
        setIsHydrating(false);
        return;
      }

      //NEW - role context hydration
      setCurrentRole(storedRole ?? 'student');

      try {
        const res = await authApi.me();
        setUser(res.data.user);
        setInstructorState(res.data.user.instructorState ?? null);
        setIsAuthenticated(true);
      } catch (err: any) {
        if (err?.response?.status !== 401) {
          console.error(err);
        }
        tokenStorage.clear();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsHydrating(false);
      }
    };

    hydrate();
  }, []);

  async function login(
    email: string,
    password: string,
    roleContext: RoleContext = 'student'
  ): Promise<any> {
    const response = await authApi.login({ email, password });
    const { accessToken, user } = response.data;

    tokenStorage.set(accessToken);
    roleContextStorage.set(roleContext);

    setUser(user);
    setInstructorState(user.instructorState ?? null);
    setCurrentRole(roleContext);
    setIsAuthenticated(true);

    return user;
  }

  function authenticateWithToken(
    token: string,
    roleContext: RoleContext = 'student'
  ) {
    tokenStorage.set(token);
    roleContextStorage.set(roleContext);

    setCurrentRole(roleContext);
    setIsAuthenticated(true);
  }

  async function logout() {
    try {
      await authApi.logout();
    } catch {
      // ignore network errors on logout
    }

    tokenStorage.clear();
    roleContextStorage.clear();


    setUser(null);
    setCurrentRole(null);
    setInstructorState(null);
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isHydrating,
        currentRole,
        instructorState,
        login,
        authenticateWithToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
