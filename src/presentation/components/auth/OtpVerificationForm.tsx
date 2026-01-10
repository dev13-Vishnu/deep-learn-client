import { useEffect, useRef, useState } from 'react';

type OtpPurpose = 'signup' | 'forgot-password';

interface Props {
  email: string;
  purpose: OtpPurpose;
}

export default function OtpVerificationForm({ email, purpose }: Props) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  // Countdown timer
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

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
    setLoading(true);

    // UI-only stub
    setTimeout(() => {
      setLoading(false);
      alert('OTP verified (stub)');
    }, 1000);
  };

  const heading = purpose === 'signup' ? 'Verify your email' : 'Verify to reset your password';

  const description =
    purpose === 'signup' ? 'Enter the 6-digit code sent to' : 'Enter the verification code sent to';

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[var(--container-sm)]">
      <h2 className="mb-2">{heading}</h2>

      <p className="mb-6 text-sm text-[color:var(--color-muted)]">
        {description} <strong>{maskedEmail}</strong>
      </p>

      <div className="mb-6 flex justify-between gap-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputsRef.current[index] = el)}
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
