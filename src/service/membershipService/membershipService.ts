import fetchApi from "@/api/api";
import { MembershipResponse, RegisterMemberShip, PaymentResponse, UserMembership } from "@/types/membership.types";

export interface EditMembershipData {
  title: string;
  description: string;
  price: number;
  duration: number;
}

export interface EditMembershipResponse {
  success: boolean;
  message?: string;
  data?: EditMembershipData;
}

export class MembershipService {
  static async getMemberships(): Promise<MembershipResponse> {
    try {
      const response = await fetchApi.get('member-ships/all');
      return response;
    } catch (error) {
      console.error('Memberships API error:', error);
      throw error;
    }
  }

  static async paymentMembership(membership: RegisterMemberShip): Promise<PaymentResponse> {
    try {
      const response = await fetchApi.post('payments/memberships', membership);
      return response;
    } catch (error) {
      console.error('Payment Membership API error:', error);
      throw error;
    }
  }

  static async checkMembershipByUserId(userId: number): Promise<UserMembership> {
    try {
      const response = await fetchApi.get(`member-ships/all/${userId}`);
      return response;
    } catch (error) {
      console.error('Check Membership by User ID API error:', error);
      throw error;
    }
  }

  static async revokeMembership(userId: number, membershipId: number): Promise<void> {
    try {
     const response = await fetchApi.delete(`member-ships/revoke/${userId}/${membershipId}`);
      return response;
    } catch (error) {
      console.error('Revoke Membership API error:', error);
      throw error;
    }
  }  static async editMembership(membershipId: number, membership: EditMembershipData): Promise<EditMembershipResponse> {
    try {
      const response = await fetchApi.put(`member-ships/update/${membershipId}`, membership);
      
      // If fetchApi.put returns a Response object, we need to handle it properly
      if (response instanceof Response) {
        const responseText = await response.text();
        if (responseText) {
          try {
            return JSON.parse(responseText);
          } catch {
            return { success: true, message: 'Membership updated successfully' };
          }
        } else {
          return { success: true, message: 'Membership updated successfully' };
        }
      }
      
      // If it's already a parsed object, return it
      return response;
    } catch (error) {
      console.error('Edit Membership API error:', error);
      throw error;
    }
  }
}