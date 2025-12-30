import type { LoginDTO, RegisterDTO } from '../../dtos/auth';

export interface AuthRepository {
  login(data: LoginDTO): Promise<void>;
  register(data: RegisterDTO): Promise<void>;
}
