export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  refresh_token: unknown;
  success: boolean;
  access_token?: string;
  id_token?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
  message?: string;
}

export interface JWTPayload {
  sub: string;
  email: string;
  name?: string;
  roles?: string[];
  exp: number;
  [key: string]: unknown;
}