import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token');
    const { pathname } = request.nextUrl;

    // Routes cần authentication
    const protectedRoutes = ['/feed', '/profile', '/explore', '/notifications', '/post'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    // Admin routes
    const isAdminRoute = pathname.startsWith('/admin');

    // Auth routes
    const isAuthRoute = pathname === '/login' || pathname === '/register';

    // 1. Chưa login nhưng cố truy cập protected route → redirect login
    if (!token && (isProtectedRoute || isAdminRoute)) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 2. Đã login và đang ở trang chủ "/" → redirect feed
    if (token && pathname === '/') {
        return NextResponse.redirect(new URL('/feed', request.url));
    }

    // 3. Đã login và đang ở trang login/register → redirect feed
    if (token && isAuthRoute) {
        return NextResponse.redirect(new URL('/feed', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/login',
        '/register',
        '/feed/:path*',
        '/profile/:path*',
        '/explore/:path*',
        '/notifications/:path*',
        '/post/:path*',
        '/admin/:path*'
    ],
};
