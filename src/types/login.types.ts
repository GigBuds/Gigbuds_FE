import dayjs from "dayjs";

  export interface FormValues {
    email: string;
    password: string;
    remember?: boolean;
  }

  export interface DecodedToken {
  email?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  [key: string]: unknown;
}

export interface GoogleLoginButtonProps {
  clientId: string;
}

export interface OtpVerificationProps {
  phoneNumber?: string;
  onVerificationSuccess?: () => void;
  onBack?: () => void;
}

export interface RegisterFormValues {
  firstName?: string;
  lastName?: string;
  dob?: dayjs.Dayjs;
  phone?: string;
  socialSecurityNumber?: string;
  gender?: boolean;
  email?: string;
  businessEmail?: string;
  password?: string;
  confirm?: string;
}