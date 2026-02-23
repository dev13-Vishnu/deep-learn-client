import { useState } from 'react';
import { authApi } from '../../api/auth.api';
import { useNavigate } from 'react-router-dom';
import { useNotify } from '../../notifications/useNotify';
import { FieldError } from '../../components/FieldError';
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateName,
} from '../../utils/validation';
import { useOAuth } from '../hooks/useOAuth';

type FormErrors = {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  password: string | null;
  confirmPassword: string | null;
};

export default function SignupForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({
    firstName: null,
    lastName: null,
    email: null,
    password: null,
    confirmPassword: null,
  });

  const navigate = useNavigate();
  const notify = useNotify();

  const { handleOAuthLogin, isLoading: oauthLoading } = useOAuth();

  function touch(field: keyof FormErrors, value: string) {
    setErrors((prev) => ({ ...prev, [field]: getFieldError(field, value) }));
  }

  function getFieldError(field: keyof FormErrors, value: string): string | null {
    switch (field) {
      case 'firstName': return validateName(value, 'First name');
      case 'lastName':  return validateName(value, 'Last name');
      case 'email':     return validateEmail(value);
      case 'password':  return validatePassword(value);
      case 'confirmPassword': return validateConfirmPassword(password, value);
      default: return null;
    }
  }

  function validateAll(): boolean {
    const next: FormErrors = {
      firstName:       validateName(firstName, 'First name'),
      lastName:        validateName(lastName, 'Last name'),
      email:           validateEmail(email),
      password:        validatePassword(password),
      confirmPassword: validateConfirmPassword(password, confirmPassword),
    };
    setErrors(next);
    return Object.values(next).every((e) => e === null);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;

    setLoading(true);
    try {
      await authApi.requestOtp({ email, purpose: 'signup' });

      sessionStorage.setItem(
        'signupPayload',
        JSON.stringify({ email, password, firstName, lastName })
      );

      navigate('/verify-otp', { state: { email, purpose: 'signup' } });
    } catch (err: any) {
      notify(
        err?.response?.data?.message || 'Signup failed. Please try again.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[var(--container-sm)]">
      <h2 className="mb-6">Create Your Account</h2>

      {/* Name row */}
      <div className="mb-4 flex gap-3">
        <div className="flex-1">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              if (errors.firstName) touch('firstName', e.target.value);
            }}
            onBlur={() => touch('firstName', firstName)}
            className={errors.firstName ? 'border-[color:var(--color-danger)]' : ''}
            disabled={loading}
          />
          <FieldError message={errors.firstName} />
        </div>

        <div className="flex-1">
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              if (errors.lastName) touch('lastName', e.target.value);
            }}
            onBlur={() => touch('lastName', lastName)}
            className={errors.lastName ? 'border-[color:var(--color-danger)]' : ''}
            disabled={loading}
          />
          <FieldError message={errors.lastName} />
        </div>
      </div>

      {/* Email */}
      <div className="mb-4">
        <input
          type="email"
          placeholder="Email ID"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) touch('email', e.target.value);
          }}
          onBlur={() => touch('email', email)}
          className={errors.email ? 'border-[color:var(--color-danger)]' : ''}
          disabled={loading}
        />
        <FieldError message={errors.email} />
      </div>

      {/* Password */}
      <div className="mb-4">
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) touch('password', e.target.value);
            if (errors.confirmPassword)
              setErrors((prev) => ({
                ...prev,
                confirmPassword: validateConfirmPassword(e.target.value, confirmPassword),
              }));
          }}
          onBlur={() => touch('password', password)}
          className={errors.password ? 'border-[color:var(--color-danger)]' : ''}
          disabled={loading}
        />
        <FieldError message={errors.password} />
      </div>

      {/* Confirm password */}
      <div className="mb-6">
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (errors.confirmPassword) touch('confirmPassword', e.target.value);
          }}
          onBlur={() => touch('confirmPassword', confirmPassword)}
          className={errors.confirmPassword ? 'border-[color:var(--color-danger)]' : ''}
          disabled={loading}
        />
        <FieldError message={errors.confirmPassword} />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[color:var(--color-primary)] py-3 text-white disabled:opacity-60"
      >
        {loading ? 'Creating…' : 'Create Account'}
      </button>

      <div className="mt-4 text-center text-sm text-[color:var(--color-muted)]">
        Already have an account?{' '}
        <span
          onClick={() => navigate('/login')}
          className="cursor-pointer font-medium text-[color:var(--color-primary)]"
        >
          Login
        </span>
      </div>

      <div className="my-5 text-center text-sm text-[color:var(--color-muted)]">Sign up with</div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => handleOAuthLogin('google')}
          disabled={loading || oauthLoading}
          className="flex-1 border border-[color:var(--color-border)] bg-white py-2"
        >
          Google
        </button>
      </div>
    </form>
  );
}