/* eslint-disable @typescript-eslint/no-explicit-any */
import fetchApi from '../../api/api';

export interface Transaction {
  revenue: number;
  transactionStatus: string;
  content: string;
  gateway: string;
  referenceCode: number;
  membershipId: number;
  membershipName: string;
  accountId: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}

class TransactionService {
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
   * Get all transactions for the current user
   */
  async getTransactions(): Promise<ApiResponse<Transaction[]>> {
    try {
      const response = await fetchApi.get('transactions');
      return this.handleApiResponse<Transaction[]>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch transactions',
      };
    }
  }

}

// Export a singleton instance
const transactionService = new TransactionService();
export default transactionService;