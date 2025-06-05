// filepath: n:\SEM8\Gigbuds_FE\src\service\Login-Register\LoginService.ts

import fetchApi from "@/api/api";
import { JWTPayload, LoginRequest, LoginResponse } from "@/types/loginService";
import { jwtDecode } from 'jwt-decode';


class LoginApi {
  async login(identifier: string, password: string): Promise<LoginResponse> {
    try {
      const data: LoginRequest = { identifier, password };
      const response = await fetchApi.post('identities/login', data);
      console.log('Login API response:', response);
      if (response.success && response.access_token) {
        this.setCookie('refreshToken', response.access_token, 1);
        
        if (response.id_token) {
          // Decode JWT id_token
          const decodedToken = this.decodeJWT(response.id_token);
          
          if (decodedToken) {
            this.setCookie('authToken', response.id_token, 7);
            localStorage.setItem('userId', decodedToken.sub);
            this.setCookie('userEmail', decodedToken.email, 7);
            this.setCookie('roles', JSON.stringify(decodedToken.roles || []), 7);
            if (decodedToken.name) {
              this.setCookie('userName', decodedToken.name, 7);
            }
          }
        }
      }
      
      return response;
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  }

  // Method to decode JWT token
  private decodeJWT(token: string): JWTPayload | null {
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      
      // Check if token is expired
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        console.warn('JWT token is expired');
        return null;
      }
      
      return decoded;
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  }

  // Method to get decoded token data
  getDecodedToken(): JWTPayload | null {
    const token = this.getCookie('authToken');
    if (!token) return null;
    
    return this.decodeJWT(token);
  }

  // Helper method to set cookies
  private setCookie(name: string, value: string, days: number = 7) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure;samesite=strict`;
  }

  // Method to logout and clear cookies
  // Method to logout and clear cookies
  logout() {
    this.deleteCookie('authToken');
    this.deleteCookie('userId');
    this.deleteCookie('userEmail');
    this.deleteCookie('userName');
    console.log('Authentication cookies cleared');
  }
  // Helper method to delete cookies
  private deleteCookie(name: string) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }

  // Method to check if user is authenticated
  isAuthenticated(): boolean {
    return this.getCookie('authToken') !== null;
  }

  // Helper method to get cookies
  private getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  // Method to get current user data from cookies
  getCurrentUser() {
    return {
      token: this.getCookie('authToken'),
      id: this.getCookie('userId'),
      email: this.getCookie('userEmail'),
      name: this.getCookie('userName'),
    };
  }
}

export const loginApi = new LoginApi();