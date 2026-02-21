import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth.api';
import { useNotify } from '../../notifications/useNotify';
import { FieldError } from '../../components/FieldError';
import { validatePassword, validateConfirmPassword } from '../../utils/validation';

interface Props {
  email: string;
}

export default function ResetPasswordForm({ email }: Props) {
  const navigate = useNavigate();
  const notify = useNotify();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  function validateAll(): boolean {
    const pErr = validatePassword(password);
    const cErr = validateConfirmPassword(password, confirmPassword);
    setPasswordError(pErr);
    setConfirmError(cErr);
    return !pErr && !cErr;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;

    setLoading(true);
    try {
      await authApi.resetPassword({ email, password });
      notify('Password updated successfully. Please sign in.', 'success');
      navigate('/login', { replace: true });
    } catch (err: any) {
      notify(
        err?.response?.data?.message || 'Failed to reset password. Please try again.',
        'error'
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

      <div className="mb-4">
        <label className="mb-1 block text-sm">New password</label>
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (passwordError) setPasswordError(validatePassword(e.target.value));
            // Keep confirm in sync if already touched
            if (confirmError)
              setConfirmError(validateConfirmPassword(e.target.value, confirmPassword));
          }}
          onBlur={() => setPasswordError(validatePassword(password))}
          className={passwordError ? 'border-[color:var(--color-danger)]' : ''}
          disabled={loading}
        />
        <FieldError message={passwordError} />
      </div>

      <div className="mb-6">
        <label className="mb-1 block text-sm">Confirm new password</label>
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (confirmError)
              setConfirmError(validateConfirmPassword(password, e.target.value));
          }}
          onBlur={() => setConfirmError(validateConfirmPassword(password, confirmPassword))}
          className={confirmError ? 'border-[color:var(--color-danger)]' : ''}
          disabled={loading}
        />
        <FieldError message={confirmError} />
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