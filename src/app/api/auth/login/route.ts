// [HYP] Hypothesis: Setting cookies on a single NextResponse.json() object before returning will ensure cookies are set correctly. [VER] Verification: Empirical testing and Next.js documentation.
import { NextRequest, NextResponse } from 'next/server';
import { LoginApi } from '@/service/loginService/loginService';
import { jwtDecode } from 'jwt-decode';
import { JWTPayload } from '@/types/loginService';

export async function POST(request: NextRequest) {
    try {
        const { identifier, password } = await request.json();

        // Call your existing login service
        const response = await LoginApi.login(identifier, password);

        if (!response.access_token) {
            return NextResponse.json(
                { success: false, message: 'Login failed' },
                { status: 401 }
            );
        }

        // Prepare user data from id_token if available, else from response.user
        let user = response.user;
        let memberships: unknown[] = [];
        
        if (response.id_token) {
            const decoded = jwtDecode<JWTPayload>(response.id_token);
            user = {
                id: decoded.sub,
                email: decoded.email,
                name: decoded.name,
                ...(decoded.role ? { role: decoded.role } : {}),
            };
            
            // Extract memberships from ID token
            if (decoded.memberships) {
                try {
                    memberships = JSON.parse(decoded.memberships as string);
                } catch (e) {
                    console.error('Error parsing memberships from token:', e);
                }
            }
        }

        const result = NextResponse.json({
            success: true,
            user,
            memberships, // Include memberships in response
        });

        // Set access token cookie
        if (response.access_token) {
            const decoded = jwtDecode<JWTPayload>(response.access_token);
            const accessTokenExpiry = new Date(decoded.exp * 1000);
            result.cookies.set('accessToken', response.access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                expires: accessTokenExpiry,
                path: '/',
            });
        }

        // Set refresh token cookie
        if (response.refresh_token) {
            const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            result.cookies.set('refreshToken', response.refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                expires: refreshTokenExpiry,
                path: '/',
            });
        }

        // Set id token cookie
        if (response.id_token) {
            const decoded = jwtDecode<JWTPayload>(response.id_token);
            const idTokenExpiry = new Date(decoded.exp * 1000);
            result.cookies.set('idToken', response.id_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                expires: idTokenExpiry,
                path: '/',
            });
        }

        // [RES] Return the response with all cookies set
        return result;

    } catch (error) {
        console.error('Login API error:', error);
        return NextResponse.json(
            { 
                success: false, 
                message: error instanceof Error ? error.message : 'Login failed' 
            },
            { status: 500 }
        );
    }
} 