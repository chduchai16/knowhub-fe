import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
    const token = request.cookies.get('token')?.value
    const { pathname } = request.nextUrl

    const protectedRoutes = ['/feed', '/profile', '/explore', '/notifications', '/post']
    const isProtectedRoute = protectedRoutes.some(route =>
        pathname.startsWith(route)
    )

    const isAdminRoute = pathname.startsWith('/admin')
    const isAuthRoute = pathname === '/login' || pathname === '/register'

    if (!token && (isProtectedRoute || isAdminRoute)) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (token && pathname === '/') {
        return NextResponse.redirect(new URL('/feed', request.url))
    }

    if (token && isAuthRoute) {
        return NextResponse.redirect(new URL('/feed', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|assets).*)',
    ],
}
