import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { tokenStorage } from '../../storage/token.storage';
import { authApi } from '../../api/auth.api';
import type { RoleContext } from '../auth.context';
import { getAuthHomePath } from '../navigation/getAuthHomePath';

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const processed = useRef(false); // Prevent double-run in React StrictMode

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const token = searchParams.get('token');
    const redirectTo = searchParams.get('redirect'); // backend sends '/dashboard' or '/onboarding'

    if (!token) {
      // No token = something went wrong on the backend
      navigate('/login?error=oauth_failed', { replace: true });
      return;
    }

    // 1. Save the access token
    tokenStorage.set(token);

    // 2. Immediately clear token from URL (security: don't leave it in browser history)
    window.history.replaceState({}, '', window.location.pathname);

    // 3. Fetch current user to get role + instructor state
    authApi.me()
      .then((response) => {
        const userData = response.data.user;

        // If backend sends redirectTo, use it; otherwise compute from role
        const finalPath = redirectTo || getAuthHomePath(
          true,
          userData.role as RoleContext,
          userData.instructorState ?? null
        );

        navigate(finalPath, { replace: true });
      })
      .catch((error) => {
        console.error('Failed to fetch user after OAuth:', error);
        // Token might be invalid; clear and redirect to login
        tokenStorage.clear();
        navigate('/login?error=oauth_invalid', { replace: true });
      });
  }, [searchParams, navigate]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <div style={{ 
        width: '50px', 
        height: '50px', 
        border: '5px solid #f3f3f3',
        borderTop: '5px solid #000',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <p>Completing sign-in…</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}