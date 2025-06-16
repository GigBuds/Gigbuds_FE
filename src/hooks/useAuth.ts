import { useState } from 'react';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setUserWithMemberships, clearUserState } from '@/lib/redux/features/userSlice';
import { LoginResponse } from '@/types/loginService';
import { User } from '@/types/sidebar.types';
import { LoginApi } from '@/service/loginService/loginService';

/**
 * Custom hook for authentication management
 * 
 * Features:
 * - Login with email/phone and password
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
    logout: () => Promise<void>;
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
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ identifier, password }),
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            if (data.success && data.user) {
                // Map the user data and get memberships
                const userData = mapJWTToUser(data.user);
                const memberships = data.memberships || [];
                
                // Dispatch both user and membership data to Redux
                dispatch(setUserWithMemberships({ user: userData, memberships }));
                console.log('User data and memberships stored in Redux:', userData, memberships);
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

    const logout = async () => {
        try {
            // Call the logout API route to clear HTTP-only cookies
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });

            // Clear Redux state (includes user and membership data)
            dispatch(clearUserState());
            console.log('User logged out and Redux state cleared');
        } catch (err) {
            console.error('Logout error:', err);
        }
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
const mapJWTToUser = (userData: { id: string; name?: string; email: string; roles?: string[] }): User => {
    return {
        id: parseInt(userData.id) || 0,
        firstName: userData.name?.split(' ')[0] || '',
        lastName: userData.name?.split(' ').slice(1).join(' ') || '',
        phone: '', // Set default empty, can be updated later
        birthDate: new Date(), // Set default, can be updated later
        isMale: false, // Set default, can be updated later
        name: userData.name || userData.email,
        email: userData.email,
        roles: userData.roles || []
    };
}; 