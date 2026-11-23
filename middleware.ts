import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

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
