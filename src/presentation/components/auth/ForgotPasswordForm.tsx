import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    navigate('/verify-otp', {
      state: {
        email,
        purpose: 'forgot-password',
      },
    });
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
        />
      </div>

      <button type="submit" className="w-full bg-[color:var(--color-primary)] py-3 text-white">
        Send verification code
      </button>
    </form>
  );
}
