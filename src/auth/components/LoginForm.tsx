import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../useAuth';
import { getAuthHomePath } from '../navigation/getAuthHomePath';
import { useOAuth } from '../hooks/useOAuth';
import { useNotify } from '../../notifications/useNotify';
import { FieldError } from '../../components/FieldError';
import { validateEmail, validatePassword } from '../../utils/validation';
import type { RoleContext } from '../../store/auth/authSlice';

export default function LoginForm() {
  const { login } = useAuth();
  const { handleOAuthLogin, isLoading: oauthLoading } = useOAuth();
  const navigate = useNavigate();
  const notify = useNotify();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<RoleContext>('student');
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  function validateAll(): boolean {
    const eErr = validateEmail(email);

    const pErr = validatePassword(password);
    setEmailError(eErr);
    setPasswordError(pErr);
    return !eErr && !pErr;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;   // ← blocks submission if either field fails

    setLoading(true);
    try {
      const userData = await login(email, password, role);
      const homePath = getAuthHomePath(true, role, userData.instructorState ?? null);
      navigate(homePath, { replace: true });
    } catch (err: any) {
      notify(
        err?.response?.data?.message || 'Invalid email or password.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[var(--container-sm)]">
      {/* Role toggle */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Login as</label>
        <div className="grid grid-cols-3 gap-2">
          {(['student', 'instructor'] as RoleContext[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`py-2 rounded-md text-sm font-medium border transition capitalize ${
                role === r
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <h2 className="mb-6">Sign in to your account</h2>

      {/* Email */}
      <div className="mb-4">
        <label className="mb-1 block text-sm">Email</label>
        <input
          type="email"
          placeholder="Username or Email ID"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) setEmailError(validateEmail(e.target.value));
          }}
          onBlur={() => setEmailError(validateEmail(email))}
          className={emailError ? 'border-[color:var(--color-danger)]' : ''}
          disabled={loading}
        />
        <FieldError message={emailError} />
      </div>

      {/* Password */}
      <div className="mb-6">
        <label className="mb-1 block text-sm">Password</label>
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (passwordError) setPasswordError(validatePassword(e.target.value));
          }}
          onBlur={() => setPasswordError(validatePassword(password))}
          className={passwordError ? 'border-[color:var(--color-danger)]' : ''}
          disabled={loading}
        />
        <FieldError message={passwordError} />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[color:var(--color-primary)] py-3 text-white disabled:opacity-60"
      >
        {loading ? 'Signing in…' : `Sign in as ${role}`}
      </button>

      <div className="mt-3 text-sm text-[color:var(--color-muted)]">
        Forgot password?{' '}
        <span
          onClick={() => navigate('/forgot-password')}
          className="cursor-pointer font-medium underline"
        >
          Click here
        </span>
      </div>

      <div className="mt-4 text-center text-sm text-[color:var(--color-muted)]">
        Don't have an account?{' '}
        <span
          onClick={() => navigate('/signup')}
          className="cursor-pointer font-medium text-[color:var(--color-primary)]"
        >
          Sign up
        </span>
      </div>

      <div className="my-5 text-center text-sm text-[color:var(--color-muted)]">Sign in with</div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => handleOAuthLogin('google',role)}
          disabled={loading || oauthLoading}
          className="flex-1 border border-[color:var(--color-border)] bg-white py-2"
        >
          Google
        </button>
      </div>
    </form>
  );
}