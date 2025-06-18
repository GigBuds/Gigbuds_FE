export interface Membership {
  id?: number;
  title: string;
  membershipType: 'JobSeeker' | 'Employer';
  duration: number;
  price: number;
  description: string;
}

export interface UserMembership {
  membershipId: number;
  accountId: number;
  startDate: string;
  endDate: string;
  status: string;
  membershipType: string;
  title: string;
}

export interface MembershipResponse {
  success: boolean;
  data?: Membership[];
  message?: string;
}

export interface RegisterMemberShip {
  membershipId: number;
  userId?: number;
  isMobile?: boolean;
}

export interface PaymentResponse {
  success: boolean;
  message?: string;
  data?: {
    checkoutUrl?: string;
    paymentUrl?: string;
    transactionId?: string;
    [key: string]: unknown;
  };
}