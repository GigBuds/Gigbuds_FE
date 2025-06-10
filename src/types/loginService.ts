export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  refresh_token: string;
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
  familyName?: string;
  phone?: string;
  birthDate?: Date;
  isMale?: boolean;
  roles?: string[];
  exp: number;
  [key: string]: unknown;
}