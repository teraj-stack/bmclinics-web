import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForTokens } from '@/lib/googleCalendar';
import { saveDoctorRefreshTokenEncrypted } from '@/lib/doctors';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const doctorId = req.nextUrl.searchParams.get('state');
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin;

  if (!code || !doctorId) {
    return NextResponse.redirect(`${baseUrl}/lekarz/kalendarz?error=1`);
  }

  const tokens = await exchangeCodeForTokens(code);
  if (tokens.refresh_token) {
    await saveDoctorRefreshTokenEncrypted(doctorId, tokens.refresh_token);
  }

  return NextResponse.redirect(`${baseUrl}/lekarz/kalendarz?connected=1`);
}
