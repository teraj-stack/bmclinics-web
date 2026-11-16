import { NextRequest, NextResponse } from 'next/server';
import { createCalendarEvent } from '@/lib/googleCalendar';
import { getDoctorCalendarCreds } from '@/lib/doctors';
import { savePendingVisit } from '@/lib/visits';
import { getServiceById } from '@/lib/servicesCatalog';

export async function POST(req: NextRequest) {
  try {
    const { doctorId, serviceId, patientEmail, start, end } = await req.json();

    if (!doctorId || !serviceId || !patientEmail || !start || !end) {
      return NextResponse.json({ error: 'Brak wymaganych danych rezerwacji' }, { status: 400 });
    }

    const service = await getServiceById(serviceId);
    if (!service) {
      return NextResponse.json({ error: 'Nie znaleziono wybranej usługi' }, { status: 404 });
    }

    if (!process.env.DATABASE_URL || !process.env.GOOGLE_CLIENT_ID) {
      return NextResponse.json({ error: 'System rezerwacji jest chwilowo niedostępny' }, { status: 503 });
    }

    if (process.env.DATABASE_URL && process.env.GOOGLE_CLIENT_ID) {
      try {
        const { refreshToken, calendarId } = await getDoctorCalendarCreds(doctorId);

        const event = await createCalendarEvent(refreshToken, calendarId, {
          summary: service.name,
          start,
          end,
          attendeeEmail: patientEmail,
        });

        const visit = await savePendingVisit({
          doctorId,
          serviceId,
          patientEmail,
          start,
          end,
          googleEventId: event.id ?? undefined,
        });

        return NextResponse.json({ status: 'ok', visitId: visit.id });
      } catch {
        return NextResponse.json({ error: 'Nie udało się potwierdzić wizyty w kalendarzu' }, { status: 502 });
      }
    }

    return NextResponse.json({ error: 'Rezerwacja nie została zapisana' }, { status: 503 });
  } catch {
    return NextResponse.json({ error: 'Nie udało się utworzyć rezerwacji' }, { status: 502 });
  }
}
