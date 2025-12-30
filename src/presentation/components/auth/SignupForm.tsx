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
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      <h2>Create Your Account</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="row">
        <input type="text" placeholder="First Name" />
        <input type="text" placeholder="Last Name" />
      </div>

      <input
        type="email"
        placeholder="Email ID"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input type="tel" placeholder="Phone Number" />

      <div className="row">
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

      <button className="primary-btn" type="submit" disabled={loading}>
        {loading ? 'Creating ...' : 'Create Account'}
      </button>

      <div className="divider">Sign up with</div>

      <div className="social-buttons">
        <button type="button" className="social facebook">
          Facebook
        </button>
        <button type="button" className="social google">
          Google
        </button>
        <button type="button" className="social microsoft">
          Microsoft
        </button>
      </div>
    </form>
  );
}
