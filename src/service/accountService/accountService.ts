import fetchApi from "@/api/api";

// Define the employer profile interface
export interface EmployerProfile {
  companyEmail: string;
  companyName: string;
  companyAddress: string;
  taxNumber: string;
  businessLicense: string;
  companyLogo: string;
}

// Define the account interface based on the API response
export interface Account {
  id?: number;
  dob: string;
  firstName: string;
  lastName: string;
  password?: string; // Usually not returned in responses for security
  socialSecurityNumber: string | null;
  isMale: boolean;
  availableJobApplication: number;
  isEnabled: boolean;
  refreshToken: string | null;
  currentLocation: string;
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
  roles: string[];
  employerProfileResponseDto: EmployerProfile | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}

class AccountService {
    
  async getAllAccounts(): Promise<ApiResponse<Account[]>> {
    try {
      const response = await fetchApi.get('accounts');
      return {
        success: true,
        data: Array.isArray(response) ? response : response.data || [],
        message: 'Accounts retrieved successfully'
      };
    } catch (error) {
      console.error('Get all accounts API error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get accounts',
        data: []
      };
    }
  }
}

// Export singleton instance
const accountService = new AccountService();
export default accountService;