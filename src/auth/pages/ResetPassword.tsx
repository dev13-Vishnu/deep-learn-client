import { Navigate, useLocation } from 'react-router-dom';
import ResetPasswordForm from '../components/ResetPasswordForm';

interface ResetPasswordRouteState {
  email: string;
}

export default function ResetPassword() {
  const location = useLocation();

  const state = location.state as ResetPasswordRouteState | null;

  if (!state?.email) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      {/* Left form */}
      <div className="flex w-full items-center justify-center md:w-1/2">
        <ResetPasswordForm email={state.email} />
      </div>
      {/* Right image */}
      <div className="hidden md:block md:w-1/2">
        <img src="/reset-password.jpg" alt="" className="h-full w-full object-cover" />
      </div>
    </div>
  );
}
