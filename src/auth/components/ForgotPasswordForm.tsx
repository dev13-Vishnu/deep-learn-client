import { useState } from 'react';
import { authApi } from '../../api/auth.api';
import { useNavigate } from 'react-router-dom';
import { useNotify } from '../../notifications/useNotify';
import { FieldError } from '../../components/FieldError';
import { validateEmail } from '../../utils/validation';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const navigate = useNavigate();
  const notify = useNotify();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const err = validateEmail(email);
    setEmailError(err);
    if (err) return;

    setLoading(true);
    try {
      await authApi.requestPasswordResetOtp({ email });

      // Generic message — never confirm or deny whether the email exists
      notify('If this email is registered, a verification code has been sent.', 'info');

      navigate('/verify-otp', { state: { email, purpose: 'forgot-password' } });
    } catch (err: any) {
      notify(
        err?.response?.data?.message || 'Something went wrong. Please try again.',
        'error'
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

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[color:var(--color-primary)] py-3 text-white disabled:opacity-60"
      >
        {loading ? 'Sending…' : 'Send verification code'}
      </button>
    </form>
  );
}