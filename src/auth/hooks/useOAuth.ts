import { useCallback, useState } from 'react';
import { authApi } from '../../api/auth.api';
import type { RoleContext } from '../../store/auth/authSlice';

export const OAUTH_INTENDED_ROLE_KEY = 'oauthIntendedRole';

type OAuthProvider = 'google' | 'facebook' | 'microsoft';

interface UseOAuthReturn {
  isLoading: boolean;
  error: string | null;
  handleOAuthLogin: (provider: OAuthProvider, role?: RoleContext) => void;
}

export function useOAuth(): UseOAuthReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const handleOAuthLogin = useCallback(
    (provider: OAuthProvider, role: RoleContext = 'student') => {
      setError(null);
      setIsLoading(true);

      try {
        sessionStorage.setItem(OAUTH_INTENDED_ROLE_KEY, role);

        window.location.href = authApi.getOAuthRedirectUrl(provider);
      } catch {
        setError(`Failed to initiate ${provider} sign-in. Please try again.`);
        setIsLoading(false);
      }
    },
    []
  );

  return { isLoading, handleOAuthLogin, error };
}