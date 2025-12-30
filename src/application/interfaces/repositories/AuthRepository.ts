import type { LoginDTO, LoginResult, RegisterDTO } from '../../dtos/auth';

export interface AuthRepository {
  login(data: LoginDTO): Promise<LoginResult>;
  register(data: RegisterDTO): Promise<void>;
}
