import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import GuestRoute from './GuestRoute';

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
import AdminRoute from './AdminRoute';
import AdminDashboardPage from '../pages/admin/AdminDashBoardPage';

// function DashboardPage() {
//   return <h1> Protected Dashboard</h1>;
// }

export default function AppRoutes() {
  return (
    <Routes>
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

<Route element = {<AppLayout/>}>
  <Route path='/' element= {<LandingPage/>}/>
  <Route
    path="/dashboard"
      element={
        <ProtectedRoute>
          <DashboardHome/>
        </ProtectedRoute>
      }
  />
  <Route
    path="/instructor/apply"
    element={
      <ProtectedRoute>
        <InstructorApplyPage />
      </ProtectedRoute>
    }
  />
  <Route
  path="/instructor/status"
  element={
    <ProtectedRoute>
      <InstructorStatusPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/instructor/dashboard"
  element={
    <ProtectedRoute>
      <InstructorDashboardPage />
    </ProtectedRoute>
  }
/>


//admin

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
