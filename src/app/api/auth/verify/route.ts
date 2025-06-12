import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';
import { JWTPayload } from '@/types/loginService';

export async function GET(request: NextRequest) {
    try {
        // Get the access token from HTTP-only cookie
        const accessToken = request.cookies.get('accessToken')?.value;

        if (!accessToken) {
            return NextResponse.json(
                { authenticated: false, message: 'No token found' },
                { status: 401 }
            );
        }

        // Verify the token
        const decoded = jwtDecode<JWTPayload>(accessToken);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
            return NextResponse.json(
                { authenticated: false, message: 'Token expired' },
                { status: 401 }
            );
        }

        // Token is valid
        return NextResponse.json({
            authenticated: true,
            user: {
                id: decoded.sub,
                email: decoded.email,
                name: decoded.name,
                roles: decoded.roles,
            }
        });

    } catch (error) {
        console.error('Token verification error:', error);
        return NextResponse.json(
            { authenticated: false, message: 'Invalid token' },
            { status: 401 }
        );
    }
} 