import { LoginDTO, RegisterDTO } from '@application/dtos/auth';

export interface AuthRepository {
  login(data: LoginDTO): Promise<void>;
  register(data: RegisterDTO): Promise<void>;
}
