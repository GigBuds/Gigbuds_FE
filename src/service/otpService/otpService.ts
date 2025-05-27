import fetchApi from '../../api/api';

export interface OtpVerificationRequest {
  phoneNumber: string;
  verificationCode: string;
}

export interface OtpVerificationResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    phoneNumber: string;
    isVerified: boolean;
  };
}

export interface ResendOtpRequest {
  phoneNumber: string;
}

export interface ResendOtpResponse {
  success: boolean;
  message: string;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

class OtpService {
  async verifyOtp(otpData: OtpVerificationRequest): Promise<OtpVerificationResponse> {
    try {
      const response = await fetchApi.post('/verify-phone', otpData);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw {
          message: error.message || 'OTP verification failed',
          status: 500,
        } as ApiError;
      }
      throw error;
    }
  }

  async resendOtp(phoneData: ResendOtpRequest): Promise<ResendOtpResponse> {
    try {
      const response = await fetchApi.post('/send-verification-code', phoneData);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw {
          message: error.message || 'Failed to resend OTP',
          status: 500,
        } as ApiError;
      }
      throw error;
    }
  }

  validateOtpData(otpData: OtpVerificationRequest): string[] {
    const errors: string[] = [];

    if (!otpData.phoneNumber) {
      errors.push('Phone number is required');
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(otpData.phoneNumber)) {
      errors.push('Please enter a valid phone number');
    }

    if (!otpData.verificationCode) {
      errors.push('Verification code is required');
    } else if (otpData.verificationCode.length !== 6) {
      errors.push('Verification code must be 6 digits');
    } else if (!/^\d{6}$/.test(otpData.verificationCode)) {
      errors.push('Verification code must contain only numbers');
    }

    return errors;
  }

  formatPhoneNumber(phoneNumber: string): string {
    // Remove any non-digit characters except +
    let formatted = phoneNumber.replace(/[^\d+]/g, '');

    
    // If it doesn't start with +, add +84
    if (!formatted.startsWith('0')) {
      formatted = '0' + formatted;
    }
    
    return formatted;
  }
}

export const otpService = new OtpService();
export default otpService;