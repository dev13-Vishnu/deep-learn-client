import { Routes, Route } from 'react-router-dom';
import RegisterPage from '@presentation/pages/auth/RegisterPage';
import Signup from '@presentation/pages/auth/Signup';
import ProtectedRoute from './ProtectedRoute';
import Login from '../pages/auth/Login';
import OtpVerification from '../pages/auth/OtpVerification';

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

    </Routes>
  );
}
