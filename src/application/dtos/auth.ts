export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  role: 'student' | 'tutor';
}

export interface LoginResult {
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: 'student' | 'tutor';
  };
}
