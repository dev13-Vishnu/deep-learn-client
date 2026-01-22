import { useEffect, useState, type ReactNode } from 'react';
import { AuthContext } from './auth.context';
import { authApi } from '../api/auth.api';
import { tokenStorage } from '../storage/token.storage';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<any | null> (null);
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(tokenStorage.get()));
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(()=> {
    const hydrate  = async () => {
      const token  = tokenStorage.get();

      if(!token) {
        setIsHydrating(false);
        return;
      }

      try {
        const res = await authApi.me();
        setUser(res.data.use);
        setIsAuthenticated(true);
      } catch (err: any) {
        if(err?.response?.status !== 401){
          console.error(err);
        }
        tokenStorage.clear();
        setUser(null);
        setIsAuthenticated(false);
      } finally{
        setIsAuthenticated(false);
      }
    };
    hydrate();
  },[]);


  

  // Restore auth state on app load
  // useEffect(() => {
  //   setIsAuthenticated(Boolean(tokenStorage.get()));
  // }, []);

  async function login(email: string, password: string) {
    const response = await authApi.login({ email, password });

    const { accessToken } = response.data;

    tokenStorage.set(accessToken);
    setUser(response.data.user)
    setIsAuthenticated(true);
  }
  function authenticateWithToken(token: string) {
  tokenStorage.set(token);
  setIsAuthenticated(true);
}


  function logout() {
    tokenStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider
      value={{
        user:null,
        isAuthenticated,
        isHydrating,
        login,
        authenticateWithToken,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
