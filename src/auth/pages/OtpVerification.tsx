import { useLocation, Navigate } from 'react-router-dom';
import OtpVerificationForm from '../components/OtpVerificationForm';

type OtpPurpose = 'signup' | 'forgot-password';

interface OtpRouteState {
  email: string;
  purpose: OtpPurpose;
}

export default function OtpVerification() {
  const location = useLocation();
  const state = location.state as OtpRouteState | null;

  // Guard: prevent direct access
  if (!state?.email || !state?.purpose) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      {/* Left form */}
      <div className="flex w-full items-center justify-center md:w-1/2">
        <OtpVerificationForm email={state.email} purpose={state.purpose} />
      </div>

      {/* Right image */}
      <div className="hidden md:block md:w-1/2">
        <img src="/otp.jpg" alt="" className="h-full w-full object-cover" />
      </div>
    </div>
  );
}
