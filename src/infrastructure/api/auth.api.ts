import apiClient from './axios';
import { LoginDTO, RegisterDTO } from '@application/dtos/auth';

export const authApi = {
  login(data: LoginDTO) {
    return apiClient.post('/auth/login', data);
  },
  register(data: RegisterDTO) {
    return apiClient.post('/auth/register', data);
  },
};
