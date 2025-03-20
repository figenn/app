import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { auth } from './actions/auth';


const PUBLIC_PATH = ['/', '/auth/login', '/auth/register', '/auth/reset-password'];
const PROTECTED_PATH = ['/dashboard'];

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const pathname = request.nextUrl.pathname;

  const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}(?:-[A-Z]{2})?/, '');

  // Logique pour la racine "/"
  if (pathnameWithoutLocale === '/') {
    if (token) {
      const user = await auth();
      if (user) {
        const locale =
          request.nextUrl.locale || routing.defaultLocale;
        const dashboardUrl = new URL(`/${locale}/dashboard`, request.nextUrl.origin);
        return NextResponse.redirect(dashboardUrl);
      } else {
        const locale =
          request.nextUrl.locale || routing.defaultLocale;
        const loginUrl = new URL(`/${locale}/auth/login`, request.nextUrl.origin);
        return NextResponse.redirect(loginUrl);
      }
    } else {
      const locale =
        request.nextUrl.locale || routing.defaultLocale;
      const loginUrl = new URL(`/${locale}/auth/login`, request.nextUrl.origin);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Logique pour les routes protégées
  if (PROTECTED_PATH.some((path) => pathnameWithoutLocale.startsWith(path))) {
    if (!token) {
      const locale =
        request.nextUrl.locale || routing.defaultLocale;
      const loginUrl = new URL(`/${locale}/auth/login`, request.nextUrl.origin);
      return NextResponse.redirect(loginUrl);
    }

    const user = await auth();
    if (!user) {
      const locale =
        request.nextUrl.locale || routing.defaultLocale;
      const loginUrl = new URL(`/${locale}/auth/login`, request.nextUrl.origin);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Logique pour les routes publiques lorsque connecté
  if (PUBLIC_PATH.some((path) => pathnameWithoutLocale === path) && token) {
    const user = await auth();
    if (user) {
      const locale =
        request.nextUrl.locale || routing.defaultLocale;
      const dashboardUrl = new URL(`/${locale}/dashboard`, request.nextUrl.origin);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};