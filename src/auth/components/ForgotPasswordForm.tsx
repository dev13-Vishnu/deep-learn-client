import { useState } from 'react';
import { authApi } from '../../api/auth.api';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      await authApi.requestPasswordResetOtp({ email });

      // Generic success message (no user enumeration)
      setMessage('If the email exists, a verification code has been sent.');
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[var(--container-sm)]">
      <h2 className="mb-3">Forgot your password?</h2>

      <p className="mb-6 text-sm text-[color:var(--color-muted)]">
        Enter your email address to receive a verification code.
      </p>

      <div className="mb-4">
        <label className="mb-1 block text-sm">Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[color:var(--color-primary)] py-3 text-white"
      >
        {loading ? 'Sending…' : 'Send verification code'}
      </button>

      {message && (
        <p className="mt-4 text-sm text-green-600">
          {message}
        </p>
      )}

      {error && (
        <p className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}
    </form>
  );
}
