
export interface AuthLogin {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: AuthUser;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}
