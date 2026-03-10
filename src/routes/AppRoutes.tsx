import { Routes, Route } from 'react-router-dom';

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

import InstructorApplyPage from '../pages/instructor/InstructorApplyPage';
import InstructorStatusPage from '../pages/instructor/InstructorStatusPage';
import InstructorDashboardPage from '../pages/instructor/InstructorDashboardPage';
import CreateCoursePage from '../pages/instructor/CreateCoursePage';
import EditCoursePage from '../pages/instructor/EditCoursePage';
import ContentManagerPage from '../pages/instructor/ContentManagerPage';   

import PublicCoursesPage from '../pages/courses/PublicCoursesPage';           
import PublicCourseDetailPage from '../pages/courses/PublicCourseDetailPage'; 

import AdminDashboardPage from '../pages/admin/AdminDashBoardPage';

import { RequireInstructorState, RequireRole } from '../auth/guards';
import HomePage from '../pages/home/HomePage';
import ProfilePage from '../pages/profile/ProfilePage';
import OAuthCallbackPage from '../auth/pages/OAuthCallbackPage';



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

        {/* Public course browsing — no auth required */}
        <Route path="/courses" element={<PublicCoursesPage />} />
        <Route path="/courses/:courseId" element={<PublicCourseDetailPage />} />

        {/* ----------------- Student Routes ----------------- */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <RequireRole allowed={['student']}>
                <HomePage />
              </RequireRole>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* ----------------- Instructor Routes ----------------- */}
        <Route
          path="/instructor/apply"
          element={
            <ProtectedRoute>
              {/* <RequireRole allowed={['student']}> */}
                <InstructorApplyPage />
              {/* </RequireRole> */}
            </ProtectedRoute>
          }
        />

        <Route
          path="/instructor/status"
          element={
            <ProtectedRoute>
              {/* <RequireRole allowed={['student', 'instructor']}> */}
                <InstructorStatusPage />
              {/* </RequireRole> */}
            </ProtectedRoute>
          }
        />

        <Route
          path="/instructor/dashboard"
          element={
            <ProtectedRoute>
              <RequireRole allowed={['instructor']}>
                <RequireInstructorState>
                  <InstructorDashboardPage />
                </RequireInstructorState>
              </RequireRole>
            </ProtectedRoute>
          }
        />

        <Route
          path="/instructor/courses/new"
          element={
            <ProtectedRoute>
              <RequireRole allowed={['instructor']}>
                <RequireInstructorState>
                  <CreateCoursePage />
                </RequireInstructorState>
              </RequireRole>
            </ProtectedRoute>
          }
        />

        <Route
          path="/instructor/courses/:courseId/edit"
          element={
            <ProtectedRoute>
              <RequireRole allowed={['instructor']}>
                <RequireInstructorState>
                  <EditCoursePage />
                </RequireInstructorState>
              </RequireRole>
            </ProtectedRoute>
          }
        />

        <Route
          path="/instructor/courses/:courseId/content"
          element={
            <ProtectedRoute>
              <RequireRole allowed={['instructor']}>
                <RequireInstructorState>
                  <ContentManagerPage />
                </RequireInstructorState>
              </RequireRole>
            </ProtectedRoute>
          }
        />

        {/* ----------------- Admin Routes ----------------- */}
        {/* <Route path="/admin/login" element={<AdminLoginPage />} /> */}

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />
        <Route path="/auth/callback" element={<OAuthCallbackPage />} />
      </Route>
    </Routes>
  );
}