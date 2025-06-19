/* eslint-disable @typescript-eslint/no-explicit-any */
import fetchApi from '@/api/api';

export interface ProcessMobilePaymentRequest {
  orderCode: string;
  status: string;
}

export interface ProcessMobilePaymentResponse {
  success: boolean;
  message: string;
  orderCode: string;
  status: string;
}

export interface PaymentReturnRequest {
  orderCode: string;
  status: string;
}

export interface PaymentReturnResponse {
  success: boolean;
  message: string;
  orderCode?: string;
  amount?: number;
}

export interface RenewTokenRequest {
  userId: string | number;
}

export interface RenewTokenResponse {
  token: string;
  memberships?: any[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}

class PaymentService {
  private handleApiResponse<T>(response: any): ApiResponse<T> {
    try {
      if (response.success !== undefined) {
        return response;
      }
      
      // If response doesn't have success field, assume it's successful data
      return {
        success: true,
        data: response,
        message: 'Operation completed successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Process payment return from payment gateway
   * Called when user returns from payment gateway
   */
  async processPaymentReturn(request: PaymentReturnRequest): Promise<ApiResponse<PaymentReturnResponse>> {
    try {
      const { orderCode, status } = request;
      const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}payments/return?orderCode=${orderCode}&status=${status}`;
      
      console.log('Making payment return API call to:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('Payment return API response:', { status: response.status, data });
      
      if (response.ok) {
        return {
          success: true,
          data: {
            success: data.success,
            message: data.message,
            orderCode: orderCode,
          },
          message: 'Payment return processed successfully',
        };
      } else {
        return {
          success: false,
          data: {
            success: false,
            message: data.message || 'Payment processing failed',
            orderCode: orderCode,
          },
          error: data.message || 'Payment processing failed',
        };
      }
    } catch (error) {
      console.error('Payment return error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process payment return',
      };
    }
  }

  /**
   * Renew ID token after successful payment
   * Updates user token with new membership information
   */
  async renewIdToken(request: RenewTokenRequest): Promise<ApiResponse<RenewTokenResponse>> {
    try {
      console.log('🔄 Renewing ID token after successful payment...');
      
      const response = await fetchApi.post('Identities/renew-id-token', { userId: request.userId });
      console.log('🔄 Token renewal response:', response);
      
      if (response && typeof response === 'string') {
        // Decode the new ID token to extract memberships
        try {
          const base64Url = response.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          const decoded = JSON.parse(jsonPayload);
          console.log('🔍 Decoded renewed token:', decoded);
          
          const memberships = decoded.memberships ? JSON.parse(decoded.memberships) : undefined;
          
          return {
            success: true,
            data: {
              token: response,
              memberships: memberships,
            },
            message: 'ID token renewed successfully',
          };
        } catch (decodeError) {
          console.error('Error decoding renewed token:', decodeError);
          return {
            success: true,
            data: {
              token: response,
            },
            message: 'ID token renewed successfully but could not decode memberships',
          };
        }
      }
      
      return {
        success: false,
        error: 'Invalid token response format',
      };
    } catch (error) {
      console.error('❌ Error renewing ID token after payment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to renew ID token',
      };
    }
  }

  /**
   * Process mobile payment result
   * Called by frontend intermediate page to register membership and update transaction status
   */
  async processMobilePayment(request: ProcessMobilePaymentRequest): Promise<ApiResponse<ProcessMobilePaymentResponse>> {
    try {
      const response = await fetchApi.post('payments/process-mobile-payment', request);
      return this.handleApiResponse<ProcessMobilePaymentResponse>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process mobile payment',
      };
    }
  }

  /**
   * Get payment information by order code
   */
  async getPaymentInfo(orderCode: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetchApi.get(`payments/${orderCode}`);
      return this.handleApiResponse(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch payment info',
      };
    }
  }

  /**
   * Cancel payment by order code
   */
  async cancelPayment(orderCode: string, cancellationReason?: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetchApi.post(`payments/${orderCode}/cancel`, {
        cancellationReason: cancellationReason || 'User cancelled'
      });
      return this.handleApiResponse(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to cancel payment',
      };
    }
  }
}

// Export a singleton instance
const paymentService = new PaymentService();
export default paymentService; 