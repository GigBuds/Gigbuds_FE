// filepath: n:\SEM8\Gigbuds_FE\src\service\Login-Register\LoginService.ts

import fetchApi from "@/api/api";
import { JWTPayload, LoginRequest, LoginResponse } from "@/types/loginService";
import { Membership } from "@/types/sidebar.types";
import { jwtDecode } from "jwt-decode";

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

  // Token Management Functions
  /**
   * Decodes a JWT token and returns the payload
   * @param token - The JWT token to decode
   * @returns The decoded token payload
   */
  static decodeToken(token: string): JWTPayload | null {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  /**
   * Gets the user ID from Redux store (this method is kept for compatibility)
   * Note: For web apps using Redux, it's better to use useAppSelector(selectUserId) directly
   * @returns The user ID or null if not found
   */
  static getUserIdFromToken(): number | null {
    // This method is deprecated for web - use Redux selectors instead
    console.warn('LoginApi.getUserIdFromToken() is deprecated for web. Use useAppSelector(selectUserId) instead.');
    return null;
  }

  /**
   * Extracts membership information from ID token
   * @param idToken - The ID token to extract membership from
   * @returns Array of membership objects
   */
  static extractMembershipsFromToken(idToken: string): Membership[] {
    try {
      const decoded = this.decodeToken(idToken) as { memberships?: string } | null;
      if (!decoded) return [];

      // Check if memberships claim exists
      if (decoded.memberships) {
        try {
          return decoded.memberships;
        } catch (e) {
          console.error('Error parsing memberships from token:', e);
          return [];
        }
      }

      return [];
    } catch (error) {
      console.error('Error extracting memberships from token:', error);
      return [];
    }
  }

  // Note: For web apps using Redux, user info and membership data are stored in Redux
  // The following methods are deprecated and kept for compatibility only

  /**
   * Renews the ID token for the current user
   * @param userId - The user ID to renew token for
   * @returns New ID token
   */
  static async renewIdToken(userId: number): Promise<string> {
    try {
      // The access token is already stored in HTTP-only cookies
      // fetchApi will automatically use it for authentication
      const response = await fetchApi.post('Identities/renew-id-token', { userId });

      console.log('🔄 Token renewed successfully');
      return response;
    } catch (error) {
      console.error('Error renewing ID token:', error);
      throw error;
    }
  }

  /**
   * Gets stored membership information (Deprecated for web - use Redux selectors)
   * @returns Object containing membership info
   */
  static getMembershipInfo(): { 
    membershipId: number | null; 
    membershipTitle: string | null; 
    memberships: Membership[] 
  } {
    console.warn('LoginApi.getMembershipInfo() is deprecated for web. Use useAppSelector(selectMembershipInfo) instead.');
    return {
      membershipId: null,
      membershipTitle: null,
      memberships: []
    };
  }
}
