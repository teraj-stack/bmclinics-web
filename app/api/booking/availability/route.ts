import { NextRequest, NextResponse } from 'next/server';
import { checkAvailability } from '@/lib/googleCalendar';
import { getDoctorCalendarCreds } from '@/lib/doctors';
import { getServiceById } from '@/lib/servicesCatalog';

export async function GET(req: NextRequest) {
  const doctorId = req.nextUrl.searchParams.get('doctorId');
  const serviceId = req.nextUrl.searchParams.get('serviceId');
  const date = req.nextUrl.searchParams.get('date');

  if (!doctorId || !serviceId || !date) {
    return NextResponse.json({ error: 'Brak wymaganych parametrów' }, { status: 400 });
  }

  const service = await getServiceById(serviceId);
  const durationMin = service?.durationMin ?? 30;

  let workStartHour = 9;
  let workEndHour = 19;
  let busy: { start?: string | null; end?: string | null }[] = [];

  if (process.env.DATABASE_URL && process.env.GOOGLE_CLIENT_ID) {
    try {
      const creds = await getDoctorCalendarCreds(doctorId);
      workStartHour = creds.workStartHour;
      workEndHour = creds.workEndHour;

      const dayStart = new Date(`${date}T00:00:00`);
      const workStart = new Date(dayStart);
      workStart.setHours(workStartHour, 0, 0, 0);
      const workEnd = new Date(dayStart);
      workEnd.setHours(workEndHour, 0, 0, 0);

      busy = await checkAvailability(
        creds.refreshToken,
        creds.calendarId,
        workStart.toISOString(),
        workEnd.toISOString()
      );
    } catch {
      busy = [];
    }
  }

  const dayStart = new Date(`${date}T00:00:00`);
  const workStart = new Date(dayStart);
  workStart.setHours(workStartHour, 0, 0, 0);
  const workEnd = new Date(dayStart);
  workEnd.setHours(workEndHour, 0, 0, 0);

  const slots: { start: string; end: string }[] = [];
  const slotMs = durationMin * 60 * 1000;
  const now = new Date();

  for (let t = workStart.getTime(); t + slotMs <= workEnd.getTime(); t += slotMs) {
    const slotStart = new Date(t);
    const slotEnd = new Date(t + slotMs);

    const overlaps = busy.some((b) => {
      if (!b.start || !b.end) return false;
      const busyStart = new Date(b.start).getTime();
      const busyEnd = new Date(b.end).getTime();
      return slotStart.getTime() < busyEnd && slotEnd.getTime() > busyStart;
    });

    if (!overlaps && slotStart > now) {
      slots.push({ start: slotStart.toISOString(), end: slotEnd.toISOString() });
    }
  }

  return NextResponse.json({ slots });
}
