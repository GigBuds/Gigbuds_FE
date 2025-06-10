// filepath: n:\SEM8\Gigbuds_FE\src\service\Login-Register\LoginService.ts

import fetchApi from "@/api/api";
import { LoginRequest, LoginResponse } from "@/types/loginService";


export class LoginApi {
  static async login(identifier: string, password: string): Promise<LoginResponse> {
    try {
      const data: LoginRequest = { identifier, password };
      const response = await fetchApi.post('identities/login', data);
      return response;
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  }
}
