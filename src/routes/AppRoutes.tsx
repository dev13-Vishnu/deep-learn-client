import { Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import GuestRoute from './GuestRoute';
import AdminRoute from './AdminRoute';

import AppLayout from '../layouts/AppLayout';

import Login from '../auth/pages/Login';
import Signup from '../auth/pages/Signup';
import ForgotPassword from '../auth/pages/ForgotPassword';
import OtpVerification from '../auth/pages/OtpVerification';
import ResetPassword from '../auth/pages/ResetPassword';

import LandingPage from '../pages/landing/LandingPage';
import DashboardHome from '../pages/dashboard/DashboardHome';

import InstructorApplyPage from '../pages/instructor/InstructorApplyPage';
import InstructorStatusPage from '../pages/instructor/InstructorStatusPage';
import InstructorDashboardPage from '../pages/instructor/InstructorDashboardPage';

import AdminLoginPage from '../pages/admin/AdminLoginPage';
import AdminDashboardPage from '../pages/admin/AdminDashBoardPage';

import { useAuth } from '../auth/useAuth';
import type { JSX } from 'react';

/* ---------------------------------------
   Role Guard (local to routes for now)
---------------------------------------- */

function RequireRole({
  allowed,
  children,
}: {
  allowed: Array<'student' | 'instructor' | 'admin'>;
  children: JSX.Element;
}) {
  const { currentRole, isHydrating } = useAuth();

  if (isHydrating) return null;

  if (!currentRole || !allowed.includes(currentRole)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

/* ---------------------------------------
   Routes
---------------------------------------- */

export default function AppRoutes() {
  return (
    <Routes>
      {/* ----------------- Guest Routes ----------------- */}
      <Route
        path="/login"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />

      <Route
        path="/signup"
        element={
          <GuestRoute>
            <Signup />
          </GuestRoute>
        }
      />

      <Route
        path="/forgot-password"
        element={
          <GuestRoute>
            <ForgotPassword />
          </GuestRoute>
        }
      />

      <Route path="/verify-otp" element={<OtpVerification />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* ----------------- App Layout ----------------- */}
      <Route element={<AppLayout />}>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />

        {/* ----------------- Student Routes ----------------- */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <RequireRole allowed={['student']}>
                <DashboardHome />
              </RequireRole>
            </ProtectedRoute>
          }
        />

        {/* ----------------- Instructor Routes ----------------- */}
        <Route
          path="/instructor/apply"
          element={
            <ProtectedRoute>
              <RequireRole allowed={['student']}>
                <InstructorApplyPage />
              </RequireRole>
            </ProtectedRoute>
          }
        />

        <Route
          path="/instructor/status"
          element={
            <ProtectedRoute>
              <RequireRole allowed={['student', 'instructor']}>
                <InstructorStatusPage />
              </RequireRole>
            </ProtectedRoute>
          }
        />

        <Route
          path="/instructor/dashboard"
          element={
            <ProtectedRoute>
              <RequireRole allowed={['instructor']}>
                <InstructorDashboardPage />
              </RequireRole>
            </ProtectedRoute>
          }
        />

        {/* ----------------- Admin Routes ----------------- */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />
      </Route>
    </Routes>
  );
}
