import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth.api';
import { useAuth } from '../useAuth';

export default function OtpVerificationForm() {
  const navigate = useNavigate();

  const {authenticateWithToken} = useAuth();

  const [signupData, setSignupData] = useState<{
    email: string;
    password: string;
    role: string;
  } | null>(null);

  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [error, setError] = useState<string | null>(null);

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  // Load signup payload safely
  useEffect(() => {
    const storedPayload = sessionStorage.getItem('signupPayload');

    if (!storedPayload) {
      navigate('/signup');
      return;
    }

    setSignupData(JSON.parse(storedPayload));
  }, [navigate]);

  // Countdown timer
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  if (!signupData) {
    return null;
  }

  const { email, password } = signupData;

  const maskedEmail = email.replace(
    /^(.)(.*)(@.*)$/,
    (_, a, b, c) => `${a}${'*'.repeat(b.length)}${c}`,
  );

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await authApi.signup({
        email,
        otp: otp.join(''),
        password,
      });

      const { accessToken } = response.data;
      authenticateWithToken(accessToken);
navigate('/dashboard', { replace: true });


    } catch (err: any) {
      setError(err?.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[var(--container-sm)]">
      <h2 className="mb-2">Verify your email</h2>

      <p className="mb-6 text-sm text-[color:var(--color-muted)]">
        Enter the 6-digit code sent to <strong>{maskedEmail}</strong>
      </p>

      {error && <p className="mb-4 text-sm text-[color:var(--color-danger)]">{error}</p>}

      <div className="mb-6 flex justify-between gap-2">
        {otp.map((digit, index) => (
          <input
            key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="h-12 text-center text-lg"
          />
        ))}
      </div>

      <button
        type="submit"
        disabled={loading || otp.some((d) => d === '')}
        className="w-full bg-[color:var(--color-primary)] py-3 text-white disabled:opacity-60"
      >
        {loading ? 'Verifying…' : 'Verify'}
      </button>

      <div className="mt-4 text-center text-sm text-[color:var(--color-muted)]">
        {timer > 0 ? (
          <>Resend code in {timer}s</>
        ) : (
          <button type="button" onClick={() => setTimer(60)} className="underline">
            Resend code
          </button>
        )}
      </div>
    </form>
  );
}
