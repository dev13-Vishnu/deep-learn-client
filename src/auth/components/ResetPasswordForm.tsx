import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth.api';

interface Props {
  email: string;
}

export default function ResetPasswordForm({ email }: Props) {
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);


    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await authApi.resetPassword({
        email, password,
      });

      navigate('/login',{replace: true});
    } catch (error: any) {
      setError(
        error?.response?.data?.message || 
        'Failed to reset password'
      );
    } finally {
      setLoading(false);
    }
    
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[var(--container-sm)]">
      <h2 className="mb-3">Reset your password</h2>

      <p className="mb-6 text-sm text-[color:var(--color-muted)]">
        Set a new password for <strong>{email}</strong>
      </p>

      {error && <p className="mb-4 text-sm text-[color:var(--color-danger)]">{error}</p>}

      <div className="mb-4">
        <label className="mb-1 block text-sm">New password</label>
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm">Confirm new password</label>
        <input
          type="password"
          placeholder="Confirm new password"
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
        {loading ? 'Updating…' : 'Update password'}
      </button>
    </form>
  );
}
