import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../useAuth';

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/dashboard', { replace: true });
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[var(--container-sm)]">
      <h2 className="mb-6">Sign in to your account</h2>

      {error && <p className="mb-4 text-sm text-[color:var(--color-danger)]">{error}</p>}

      <div className="mb-4">
        <label className="mb-1 block text-sm">Email</label>
        <input
          type="email"
          placeholder="Username or Email ID"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm">Password</label>
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[color:var(--color-primary)] py-3 text-white disabled:opacity-60"
      >
        {loading ? 'Signing in…' : 'Sign in'}
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
        Don&apos;t have an account?{' '}
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
          className="flex-1 border border-[color:var(--color-border)] bg-white py-2"
        >
          Facebook
        </button>
        <button
          type="button"
          className="flex-1 border border-[color:var(--color-border)] bg-white py-2"
        >
          Google
        </button>
        <button
          type="button"
          className="flex-1 border border-[color:var(--color-border)] bg-white py-2"
        >
          Microsoft
        </button>
      </div>
    </form>
  );
}
