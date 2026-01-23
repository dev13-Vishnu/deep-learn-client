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
import HomePage from '../pages/home/HomePage';

function DashboardPage() {
  return <h1> Protected Dashboard</h1>;
}

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
          <HomePage/>
        </ProtectedRoute>
      }
  />
</Route>
  
    </Routes>
  );
}
