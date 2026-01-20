import apiClient from './axios';

export const authApi = {
  login(data: { email: string; password: string }) {
    return apiClient.post('/auth/login', data);
  },

  requestOtp(data: { email: string; purpose: 'signup' | 'forgot-password' }) {
    return apiClient.post('/auth/request-otp', data);
  },

  signup(data: {
    email: string;
    otp: string;
    password: string;
  }) {
    return apiClient.post('/auth/signup', data);
  },

  resetPassword(data: {
    email: string;
    otp: string;
    newPassword: string;
  }) {
    return apiClient.post('/auth/reset-password', data);
  },
};
