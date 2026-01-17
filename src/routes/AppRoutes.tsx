import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Login from '../auth/pages/Login';
import OtpVerification from '../auth/pages/OtpVerification';
import ForgotPassword from '../auth/pages/ForgotPassword';
import ResetPassword from '../auth/pages/ResetPassword';
import RegisterPage from '../auth/pages/RegisterPage';
import Signup from '../auth/pages/Signup';

function DashboardPage() {
  return <h1> Protected Dashboard</h1>;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="/verify-otp" element={<OtpVerification />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
}
