import { useCallback, useState } from 'react';
import { authApi } from '../../api/auth.api';

type OAuthProvider = 'google' | 'facebook' | 'microsoft';

interface UseOAuthReturn {
  isLoading: boolean;
  error: string | null;
  handleOAuthLogin: (provider: OAuthProvider) => void;
}

export function useOAuth(): UseOAuthReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const handleOAuthLogin = useCallback((provider: OAuthProvider) => {
    setError(null);
    setIsLoading(true);
    try {
      window.location.href = authApi.getOAuthRedirectUrl(provider);
    } catch {
      setError(`Failed to initiate ${provider} sign-in. Please try again.`);
      setIsLoading(false);
    }
  }, []);

  return { isLoading, handleOAuthLogin, error };
}