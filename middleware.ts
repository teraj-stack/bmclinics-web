import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const AUTH_SECRET = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
  if (!AUTH_SECRET) return NextResponse.redirect(new URL('/logowanie', req.url));
  const token = await getToken({ req, secret: AUTH_SECRET });

  if (req.nextUrl.pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/logowanie', req.url));
  }
  if (
    req.nextUrl.pathname.startsWith('/lekarz') &&
    !['DOCTOR', 'ADMIN'].includes(token?.role as string)
  ) {
    return NextResponse.redirect(new URL('/logowanie', req.url));
  }
  if (req.nextUrl.pathname.startsWith('/pacjent') && !token) {
    return NextResponse.redirect(new URL('/logowanie', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/lekarz/:path*', '/pacjent/:path*'],
};
