import { useState } from 'react';
import { authApi } from '../../../infrastructure/api/auth.api';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Password do not match');
      return;
    }

    setLoading(true);

    try {
      await authApi.register({
        email,
        password,
        role: 'student',
      });

      alert('Signup successful. You can now log in.');
    } catch (err: unknown) {
      setError(err?.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[var(--container-sm)]">
      <h2 className="mb-6">Create Your Account</h2>

      {error && <p className="mb-4 text-sm text-[color:var(--color-danger)]">{error}</p>}

      <div className="mb-4 flex gap-3">
        <input type="text" placeholder="First Name" />
        <input type="text" placeholder="Last Name" />
      </div>

      <div className="mb-4 flex gap-3">
        <input
          type="email"
          placeholder="Email ID"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input type="tel" placeholder="Phone Number" />
      </div>

      <div className="mb-4 flex gap-3">
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[color:var(--color-primary)] py-3 text-white disabled:opacity-60"
      >
        {loading ? 'Creating ...' : 'Create Account'}
      </button>

      <div className="my-5 text-center text-sm text-[color:var(--color-muted)]">Sign up with</div>

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
