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

/* ------------------------------------------------
   Helpers
------------------------------------------------ */

type InstructorState = 
| 'not_applied'
| 'pending'
| 'approved'
| 'rejected' ;

function getInstructorState(user: any): InstructorState {
  if(!user?.instructorApplication) return 'not_applied';

  return user.instructorApplication.status;
}

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

function RequireInstructorState({
  allowed,
  children,
}: {
  allowed: InstructorState[];
  children: JSX.Element;
}) {
  const { user, isHydrating } = useAuth();

  if (isHydrating)  return null;

  const state = getInstructorState(user);

  if(!allowed.includes(state)) {
    if(state === 'approved') {
      return <Navigate to="/login" replace />;
    }

    return <Navigate to="/instructor/status" replace/>;
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
                <RequireInstructorState allowed={['not_applied']}>
                  <InstructorApplyPage />
                </RequireInstructorState>
              </RequireRole>
            </ProtectedRoute>
          }
        />

        <Route
          path="/instructor/status"
          element={
            <ProtectedRoute>
              <RequireRole allowed={['student', 'instructor']}>
                <RequireInstructorState
                  allowed={['pending', 'rejected']}
                >
                  <InstructorStatusPage />
                </RequireInstructorState>
              </RequireRole>
            </ProtectedRoute>
          }
        />

        <Route
          path="/instructor/dashboard"
          element={
            <ProtectedRoute>
              <RequireRole allowed={['instructor']}>
                <RequireInstructorState allowed={['approved']}>
                  <InstructorDashboardPage />
                </RequireInstructorState>
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
