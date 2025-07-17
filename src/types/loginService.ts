import { Membership } from "./sidebar.types";

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  refresh_token: string;
  access_token?: string;
  id_token?: string;

}

export interface JWTPayload {
  sub: string;
  email: string;
  name?: string;
  familyName?: string;
  phone?: string;
  birthDate?: Date;
  isMale?: boolean;
  role?: string[];
  exp: number;
  memberships?: Membership;
  senderAvatar?: string;
}