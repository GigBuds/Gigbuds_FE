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
            if (data && data.id_token) { // Use id_token instead of user
                
                const jwtDecoded = jwtDecode(data.id_token) as any;
                const userData = mapJWTToUser(jwtDecoded);
                
                if (data.access_token) {
                    Cookies.set('access_token', data.access_token, {
                        expires: 30, // 30 days
                        // secure: process.env.NODE_ENV === 'production',
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
        // Just clear Redux state, no API call needed
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
    }

    return {
        login,
        logout,
        isLoading,
        error,
        clearError: () => setError(null),
        isAuthenticated
    };
}; 

const mapJWTToUser = (userData: any): User => {
    // Parse roles from string to array
    const roles = typeof userData.role === 'string' 
        ? userData.role.split(',').map((role: string) => role.trim())
        : userData.role || [];

    // Parse birthdate
    const birthDate = userData.birthdate ? new Date(userData.birthdate) : new Date();

    // Parse gender (True/False string to boolean)
    const isMale = userData.gender === "True" || userData.gender === true;

    // Parse memberships from JSON string
    let memberships: Membership[] = [];
    if (userData.memberships) {
        try {
            memberships = JSON.parse(userData.memberships);
        } catch (error) {
            console.error('Error parsing memberships:', error);
            memberships = [];
        }
    }

    return {
        id: parseInt(userData.sub) || 0, // 'sub' is the user ID in JWT
        firstName: userData.name || '',
        lastName: userData.family_name || '',
        phone: userData.phone_number || '',
        birthDate: birthDate,
        isMale: isMale,
        name: `${userData.name || ''} ${userData.family_name || ''}`.trim(),
        email: userData.email || '',
        roles: roles,
        memberships: memberships // Add this line
    };
};