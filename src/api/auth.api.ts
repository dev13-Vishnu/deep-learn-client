import type {
  LoginDTO,
  LoginResult,
  RegisterDTO,
  RequestOtpDTO,
  VerifyOtpSignupDTO,
} from '../application/dtos/auth';
import apiClient from './axios';

export const authApi = {
  async login(data: LoginDTO): Promise<LoginResult> {
    const response = await apiClient.post<LoginResult>('/auth/login', data);
    return response.data;
  },

  async register(data: RegisterDTO): Promise<void> {
    await apiClient.post('/auth/register', data);
  },

  // ✅ NEW — request OTP (signup / forgot-password)
  async requestOtp(data: RequestOtpDTO): Promise<{ expiresAt: string }> {
    const response = await apiClient.post('/auth/request-otp', data);
    return response.data;
  },

  // ✅ NEW — verify OTP + create user
  async verifyOtpSignup(data: VerifyOtpSignupDTO): Promise<void> {
    await apiClient.post('/auth/verify-otp-signup', data);
  },
};
