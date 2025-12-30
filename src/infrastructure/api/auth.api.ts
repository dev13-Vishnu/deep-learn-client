import type { LoginDTO, RegisterDTO } from '../../application/dtos/auth';
import apiClient from './axios';

export const authApi = {
  async login(data: LoginDTO) {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  async register(data: RegisterDTO) {
    await apiClient.post('/auth/register', data);
  },
};
