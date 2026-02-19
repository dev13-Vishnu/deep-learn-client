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
    firstName: string;
    lastName: string;
  }) {
    return apiClient.post('/auth/signup', data);
  },

  // resetPassword(data: {
  //   email: string;
  //   otp: string;
  //   newPassword: string;
  // }) {
  //   return apiClient.post('/auth/reset-password', data);
  // },

  requestPasswordResetOtp(data: { email: string }) {
  return apiClient.post(
    '/auth/forgot-password/request-otp',
    data
  );
},

verifyPasswordResetOtp(data: { email: string; otp: string }) {
  return apiClient.post(
    '/auth/forgot-password/verify-otp',
    data
  );
},

resetPassword(data: { email: string; password: string }) {
  return apiClient.post(
    '/auth/forgot-password/reset',
    data
  );
},

me() {
  return apiClient.get('/auth/me');
},

logout() {
  return apiClient.post('/auth/logout');
},

getOAuthRedirectUrl(provider: 'google' | 'facebook' | 'microsoft'): string {
  return `${import.meta.env.VITE_API_BASE_URL}/auth/oauth/${provider}`
}



};
