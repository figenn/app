import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const PUBLIC_PATH = ['/', '/auth/login'];
const PROTECTED_PATH = ['/dashboard', '/profile'];

export function middleware(request: NextRequest) {
    const intlResponse = intlMiddleware(request);
    if (intlResponse) {
        return intlResponse;
    }

    const token = request.cookies.get('token')?.value;
    const pathname = request.nextUrl.pathname;

    if (PROTECTED_PATH.some(path => pathname.startsWith(path)) && !token) {
        return NextResponse.redirect(new URL('/auth/login', request.nextUrl.origin));
    }

    if (token && PUBLIC_PATH.some(path => pathname === path)) {
        return NextResponse.redirect(new URL('/dashboard', request.nextUrl.origin));
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};
