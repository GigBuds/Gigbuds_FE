import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const response = NextResponse.json({ success: true, message: 'Logged out successfully' });

        // Clear all authentication cookies
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const, // Match the login cookie settings
            expires: new Date(0), // Set to past date to delete
            path: '/',
        };

        response.cookies.set('accessToken', '', cookieOptions);
        response.cookies.set('refreshToken', '', cookieOptions);
        response.cookies.set('idToken', '', cookieOptions);

        return response;

    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { success: false, message: 'Logout failed' },
            { status: 500 }
        );
    }
} 