import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/useAuth';
import { useNotify } from '../../../notifications/useNotify';
import { validateEmail, validatePassword } from '../../../utils/validation';
import { FieldError } from '../../../components/FieldError';

export default function AdminLoginForm() {
  const { login }  = useAuth();
  const navigate   = useNavigate();
  const notify     = useNotify();

  const [email,         setEmail]         = useState('');
  const [password,      setPassword]      = useState('');
  const [loading,       setLoading]       = useState(false);
  const [emailError,    setEmailError]    = useState<string | null>(null);
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
    if (!validateAll()) return;

    setLoading(true);
    try {
      await login(email, password, 'admin');
      navigate('/admin', { replace: true });
    } catch (err: any) {
      notify(
        err?.response?.data?.message || 'Invalid credentials.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[var(--container-sm)]">
      <h2 className="mb-1">Admin Portal</h2>
      <p className="mb-6 text-sm text-[color:var(--color-muted)]">
        Sign in with your admin credentials to continue.
      </p>

      {/* Email */}
      <div className="mb-4">
        <label className="mb-1 block text-sm">Email</label>
        <input
          type="email"
          placeholder="Admin email"
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
          placeholder="Password"
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
        {loading ? 'Signing in…' : 'Sign in'}
      </button>

      {/* Forgot password — kept for account recovery */}
      <div className="mt-3 text-sm text-[color:var(--color-muted)]">
        Forgot password?{' '}
        <span
          onClick={() => navigate('/forgot-password')}
          className="cursor-pointer font-medium underline"
        >
          Click here
        </span>
      </div>
    </form>
  );
}