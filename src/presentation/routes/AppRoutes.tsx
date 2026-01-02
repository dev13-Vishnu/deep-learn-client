import { Routes, Route } from 'react-router-dom';
import LoginPage from '@presentation/pages/auth/LoginPage';
import RegisterPage from '@presentation/pages/auth/RegisterPage';
import Signup from '@presentation/pages/auth/Signup';
import ProtectedRoute from './ProtectedRoute';

function DashboardPage() {
  return <h1> Protected Dashboard</h1>;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
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
    </Routes>
  );
}
