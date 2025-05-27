import fetchApi from '../../api/api';

export interface RegisterRequest {
  dob: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  socialSecurityNumber: string;
  phoneNumber: string;
  isMale: boolean;
  businessEmail: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  token?: string;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

class RegisterService {
  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await fetchApi.post('/register-employer', userData);
      return response as RegisterResponse;
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error instanceof TypeError) {
        throw {
          message: 'Network error. Please check your connection and try again.',
          status: 0,
        } as ApiError;
      }
      
      // Extract error message from the thrown error
      const errorMessage = error instanceof Error ? error.message : 'Registration failed. Please try again.';
      
      throw {
        message: errorMessage,
        status: 500,
      } as ApiError;
    }
  }

  validateRegistrationData(userData: RegisterRequest): string[] {
    const errors: string[] = [];

    if (!userData.firstName) {
      errors.push('First name is required');
    }

    if (!userData.lastName) {
      errors.push('Last name is required');
    }

    if (!userData.email) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      errors.push('Please enter a valid email address');
    }

    if (!userData.password) {
      errors.push('Password is required');
    } else if (userData.password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!userData.socialSecurityNumber) {
      errors.push('Social Security Number is required');
    }

    if (!userData.phoneNumber) {
      errors.push('Phone number is required');
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(userData.phoneNumber)) {
      errors.push('Please enter a valid phone number');
    }

    if (!userData.dob) {
      errors.push('Date of birth is required');
    } else {
      const dobDate = new Date(userData.dob);
      const today = new Date();
      const age = today.getFullYear() - dobDate.getFullYear();
      if (age < 18) {
        errors.push('You must be at least 18 years old');
      }
    }

    if (!userData.businessEmail) {
      errors.push('Business email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.businessEmail)) {
      errors.push('Please enter a valid business email address');
    }

    if (userData.isMale === undefined || userData.isMale === null) {
      errors.push('Gender selection is required');
    }

    return errors;
  }

  formatRegistrationData(userData: Partial<RegisterRequest>): RegisterRequest {
    return {
      dob: userData.dob || new Date().toISOString(),
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      email: userData.email || '',
      password: userData.password || '',
      socialSecurityNumber: userData.socialSecurityNumber || '',
      phoneNumber: userData.phoneNumber || '',
      isMale: userData.isMale ?? true,
      businessEmail: userData.businessEmail || '',
    };
  }
}

export const registerService = new RegisterService();
export default registerService;