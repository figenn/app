import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const PUBLIC_PATH = ['/', '/auth/login' , '/auth/register', '/auth/reset-password'];
const PROTECTED_PATH = ['/dashboard'];

const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const pathname = request.nextUrl.pathname;
  
  const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}(?:-[A-Z]{2})?/, '');
  
  if (PROTECTED_PATH.some(path => pathnameWithoutLocale.startsWith(path)) && !token) {
    const locale = pathname.match(/^\/([a-z]{2}(?:-[A-Z]{2})?)/)?.at(1) || routing.defaultLocale;
    const loginUrl = new URL(`/${locale}/auth/login`, request.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }
  
  if (PUBLIC_PATH.some(path => pathnameWithoutLocale === path) && token) {
    const locale = pathname.match(/^\/([a-z]{2}(?:-[A-Z]{2})?)/)?.at(1) || routing.defaultLocale;
    const dashboardUrl = new URL(`/${locale}/dashboard`, request.nextUrl.origin);
    return NextResponse.redirect(dashboardUrl);
  }
  
  return intlMiddleware(request);
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};