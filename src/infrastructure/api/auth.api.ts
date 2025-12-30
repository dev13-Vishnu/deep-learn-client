import type { LoginDTO, LoginResult, RegisterDTO } from '../../application/dtos/auth';
import apiClient from './axios';

export const authApi = {
  async login(data: LoginDTO): Promise<LoginResult> {
    const response = await apiClient.post<LoginResult>('/auth/login', data);
    return response.data;
  },

  async register(data: RegisterDTO): Promise<void> {
    await apiClient.post('/auth/register', data);
  },
};
