import apiClient from './axios';

export const authApi = {
  login(data: { email: string; password: string }) {
    return apiClient.post('/auth/login', data);
  },

  requestOtp(data: { email: string; purpose: 'signup' | 'forgot-password' }) {
    return apiClient.post('/auth/request-otp', data);
  },

  verifyOtpSignup(data: {
    email: string;
    otp: string;
    password: string;
    role: string;
  }) {
    return apiClient.post('/auth/verify-otp-signup', data);
  },

  resetPassword(data: {
    email: string;
    otp: string;
    newPassword: string;
  }) {
    return apiClient.post('/auth/reset-password', data);
  },
};
