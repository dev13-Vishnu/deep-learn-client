import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../useAuth';
import type { RoleContext } from '../auth.context';

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role,setRole] = useState<RoleContext>('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password, role);

      // TEMPERORY redirects (Step 2 only)
      if(role ==='admin') {
        navigate('/admin');
      } else if( role === 'instructor') {
        navigate('/instructor/dashboard');
      } else {
        navigate('/dashboard')
      }
      // navigate('/dashboard', { replace: true });
    } catch (err: any){
      setError(
        err?.response?.data?.message ||  'Invalid email or password'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[var(--container-sm)]">
      {/* Role Toggle */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Login as
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['student', 'instructor', 'admin'] as RoleContext[]).map(
            (r) => (
              <button
                key={r}
                type='button'
                onClick={() => setRole(r)}
                className={`py-2 rounded-md text-sm font-medium border transition
                  ${
                    role === r
                      ? 'bg-black text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
              >
                {r.charAt(0).toUpperCase() +r.slice(1)}
              </button>
            )
          )}
        </div>
      </div>
      
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
