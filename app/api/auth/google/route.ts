import { NextRequest, NextResponse } from 'next/server';
import { getAuthUrl } from '@/lib/googleCalendar';

export async function GET(req: NextRequest) {
  const doctorId = req.nextUrl.searchParams.get('doctorId');
  if (!doctorId) return NextResponse.json({ error: 'Brak doctorId' }, { status: 400 });

  return NextResponse.redirect(getAuthUrl(doctorId));
}
