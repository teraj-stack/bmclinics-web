import { NextRequest, NextResponse } from 'next/server';
import { checkAvailability, createCalendarEvent, deleteCalendarEvent } from '@/lib/googleCalendar';
import { getDoctorCalendarCreds } from '@/lib/doctors';
import { savePendingVisit, confirmVisit, cancelPendingVisit } from '@/lib/visits';
import { getServiceById } from '@/lib/servicesCatalog';

export async function POST(req: NextRequest) {
  let visitId: string | undefined;
  let eventId: string | undefined;
  let calendar: { refreshToken: string; calendarId: string } | undefined;

  try {
    const { doctorId, serviceId, patientEmail, start, end } = await req.json();
    const startDate = new Date(start);
    const endDate = new Date(end);
    const emailValid = typeof patientEmail === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patientEmail);
    if (typeof doctorId !== 'string' || !doctorId ||
        typeof serviceId !== 'string' || !serviceId ||
        !emailValid || !Number.isFinite(startDate.getTime()) ||
        !Number.isFinite(endDate.getTime()) ||
        startDate <= new Date() || endDate <= startDate ||
        endDate.getTime() - startDate.getTime() > 4 * 60 * 60 * 1000) {
      return NextResponse.json({ error: 'Nieprawidłowe dane lub termin rezerwacji' }, { status: 400 });
    }

    if (!process.env.DATABASE_URL || !process.env.GOOGLE_CLIENT_ID ||
        !process.env.GOOGLE_CLIENT_SECRET) {
      return NextResponse.json({ error: 'System rezerwacji jest niedostępny' }, { status: 503 });
    }

    const service = await getServiceById(serviceId);
    if (!service) return NextResponse.json({ error: 'Nie znaleziono usługi' }, { status: 404 });

    const durationMs = service.durationMin * 60_000;
    if (endDate.getTime() - startDate.getTime() !== durationMs) {
      return NextResponse.json({ error: 'Nieprawidłowy czas trwania wizyty' }, { status: 400 });
    }

    calendar = await getDoctorCalendarCreds(doctorId);
    const busy = await checkAvailability(calendar.refreshToken, calendar.calendarId, start, end);
    if (busy.some((b) => b.start && b.end &&
        new Date(b.start) < endDate && new Date(b.end) > startDate)) {
      return NextResponse.json({ error: 'Wybrany termin jest już zajęty' }, { status: 409 });
    }

    // Reserve in DB before creating the external calendar event.
    const visit = await savePendingVisit({ doctorId, serviceId, patientEmail, start, end });
    visitId = visit.id;

    const event = await createCalendarEvent(calendar.refreshToken, calendar.calendarId, {
      summary: service.name, start, end, attendeeEmail: patientEmail,
    });
    if (!event.id) throw new Error('CALENDAR_EVENT_ID_MISSING');
    eventId = event.id;

    await confirmVisit(visitId, eventId);
    return NextResponse.json({ status: 'ok', visitId });
  } catch (error) {
    // Best-effort compensation: an external event and a DB transaction cannot
    // be made atomically. Never send a success response after either fails.
    let reconciliationRequired = false;
    if (eventId && calendar) {
      try {
        await deleteCalendarEvent(calendar.refreshToken, calendar.calendarId, eventId);
      } catch {
        reconciliationRequired = true;
      }
    }
    if (visitId) {
      try {
        await cancelPendingVisit(visitId);
      } catch {
        reconciliationRequired = true;
      }
    }
    if (reconciliationRequired) {
      console.error('Booking reconciliation required', { visitId, eventId });
    }
    if (error instanceof Error && error.message === 'SLOT_TAKEN') {
      return NextResponse.json({ error: 'Wybrany termin jest już zajęty' }, { status: 409 });
    }
    return NextResponse.json(
      { error: 'Nie udało się potwierdzić rezerwacji. Skontaktuj się z recepcją.' },
      { status: 502 }
    );
  }
}
