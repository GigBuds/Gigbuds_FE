import { useState } from 'react';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setUserWithMemberships, clearUserState, Membership } from '@/lib/redux/features/userSlice';
import { LoginResponse } from '@/types/loginService';
import { User } from '@/types/sidebar.types';
import { LoginApi } from '@/service/loginService/loginService';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

/**
 * Custom hook for authentication management
 * 
 * Features:
 * - Login with email/phone and password using LoginApi service
 * - JWT token management (access & refresh tokens)
 * - User state management with Redux
 * - Automatic token decoding and user data mapping
 * 
 * @returns {Object} Authentication methods and state
 * @property {Function} login - Handles user login
 * @property {Function} logout - Handles user logout
 * @property {boolean} isLoading - Loading state indicator
 * @property {string|null} error - Error message if any
 */

export interface UserData {
    role: string | string[];
    gender?: string | boolean;
    isMale?: boolean;
    memberships?: string;
    sub: string;
    name?: string;
    given_name?: string;
    family_name?: string;
    familyName?: string;
    phone_number?: string;
    phone?: string;
    email?: string;
    birthdate?: string | Date;
    birthDate?: string | Date;
    [key: string]: unknown; // Allow additional properties
}

export const useAuth = (): {
    login: (identifier: string, password: string) => Promise<LoginResponse | null>;
    logout: () => void;
    isLoading: boolean;
    error: string | null;
    clearError: () => void;
    isAuthenticated: () => Promise<boolean>;
} => {
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const login = async (identifier: string, password: string): Promise<LoginResponse | null> => {
        setIsLoading(true);
        setError(null);
        try {
            // Use the LoginApi service instead of direct fetch
            const data = await LoginApi.login(identifier, password);
            if (data && data.id_token) {
                const jwtDecoded = jwtDecode(data.id_token) as UserData;
                const userData = mapJWTToUser(jwtDecoded);
                
                if (data.access_token) {
                    Cookies.set('access_token', data.access_token, {
                        expires: 30, // 30 days
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict',
                        path: '/'
                    });
                }
                
                dispatch(setUserWithMemberships({ user: userData, memberships: userData.memberships }));
                console.log('User data stored in Redux:', userData);
            }
            
            return data;
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Login failed';
            setError(errorMessage);
            console.error('Login error:', err);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        // Clear cookies
        Cookies.remove('access_token', { path: '/' });
        
        // Clear Redux state
        dispatch(clearUserState());
        console.log('User logged out and Redux state cleared');
    };

    // Note: HTTP-only cookies cannot be accessed from client-side JavaScript
    // Authentication status should be checked via API calls
    const isAuthenticated = async (): Promise<boolean> => {
        try {
            const response = await fetch('/api/auth/verify', {
                method: 'GET',
                credentials: 'include',
            });
            return response.ok;
        } catch {
            return false;
        }
    };

    return {
        login,
        logout,
        isLoading,
        error,
        clearError: () => setError(null),
        isAuthenticated
    };
}; 

const mapJWTToUser = (userData: UserData): User => {
    // Parse roles from string to array
    const roles = typeof userData.role === 'string' 
        ? userData.role.split(',').map((role: string) => role.trim())
        : userData.role || [];

    // Parse birthdate - handle multiple possible field names
    let birthDate = new Date();
    if (userData.birthdate) {
        birthDate = new Date(userData.birthdate);
    } else if (userData.birthDate) {
        birthDate = new Date(userData.birthDate);
    }

    // Parse gender - handle multiple possible field names and values
    let isMale = false;
    if (typeof userData.isMale === 'boolean') {
        isMale = userData.isMale;
    } else if (typeof userData.gender === 'boolean') {
        isMale = userData.gender;
    } else if (typeof userData.gender === 'string') {
        isMale = userData.gender.toLowerCase() === 'male' || userData.gender.toLowerCase() === 'true';
    }

    // Parse memberships from JSON string or use as array
    let memberships: Membership[] = [];
    if (userData.memberships) {
        try {
            if (typeof userData.memberships === 'string') {
                memberships = JSON.parse(userData.memberships);
            } else {
                memberships = [userData.memberships as Membership];
            }
        } catch (error) {
            console.error('Error parsing memberships:', error);
            console.log('Memberships data:', userData.memberships);
            memberships = [];
        }
    }

    // Handle name fields - JWT might use different field names
    const firstName = userData.name || userData.given_name || '';
    const lastName = userData.family_name || userData.familyName || '';
    const phone = userData.phone_number || userData.phone || '';

    return {
        id: parseInt(userData.sub) || 0, // 'sub' is the user ID in JWT
        firstName,
        lastName,
        phone,
        birthDate,
        isMale,
        name: `${firstName} ${lastName}`.trim(),
        email: userData.email || '',
        roles,
        memberships
    };
};