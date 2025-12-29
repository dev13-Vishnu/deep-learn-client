import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '@presentation/pages/auth/LoginPage';
import RegisterPage from '@presentation/pages/auth/RegisterPage';
import Signup from '@presentation/pages/auth/Signup';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}
