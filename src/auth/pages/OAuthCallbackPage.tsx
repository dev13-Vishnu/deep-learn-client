import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { setFullAuth } from '../../store/auth/authSlice';
import { tokenStorage } from '../../storage/token.storage';
import { roleContextStorage } from '../../storage/roleContext.storage';
import { authApi } from '../../api/auth.api';
import type { RoleContext } from '../../store/auth/authSlice';
import { getAuthHomePath } from '../navigation/getAuthHomePath';

function toRoleContext(role: any): RoleContext {
  if (role === 1 || role === 'instructor') return 'instructor';
  if (role === 2 || role === 'admin') return 'admin';
  return 'student';
}

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const token = searchParams.get('token');

    if (!token) {
      navigate('/login?error=oauth_failed', { replace: true });
      return;
    }

    tokenStorage.set(token);
    window.history.replaceState({}, '', window.location.pathname);

    authApi.me()
      .then((response) => {
        const userData = response.data;

        const roleContext = toRoleContext(userData.role);

        roleContextStorage.set(roleContext);
        dispatch(setFullAuth({ user: userData, roleContext }));

        const finalPath = getAuthHomePath(
          true,
          roleContext,
          userData.instructorState ?? null
        );

        navigate(finalPath, { replace: true });
      })
      .catch((error) => {
        console.error('Failed to fetch user after OAuth:', error);
        tokenStorage.clear();
        navigate('/login?error=oauth_invalid', { replace: true });
      });
  }, [searchParams, navigate, dispatch]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      flexDirection: 'column',
      gap: '12px',
    }}>
      <div style={{
        width: 32,
        height: 32,
        border: '3px solid #e5e7eb',
        borderTopColor: '#6366f1',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ color: '#6b7280', fontSize: 14 }}>Signing you in…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}