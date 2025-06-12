import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

const publicPaths = ['/login', '/api/auth/login', '/favicon.ico'];
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log('pathname', pathname);

  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = request.cookies.get('accessToken')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!);

    return NextResponse.next();
  } catch (err) {
    console.error('JWT verification error:', err);

    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('accessToken');
    return response;
  }
}

// Configure middleware to run on all routes except static files and API routes
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};