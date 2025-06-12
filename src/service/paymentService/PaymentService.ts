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