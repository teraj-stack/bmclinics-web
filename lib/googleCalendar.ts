import { google } from 'googleapis';

const OAUTH_SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.freebusy',
];

export function createOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google/callback`
  );
}

export function getAuthUrl(doctorId: string) {
  const client = createOAuthClient();
  return client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: OAUTH_SCOPES,
    state: doctorId,
  });
}

export async function exchangeCodeForTokens(code: string) {
  const client = createOAuthClient();
  const { tokens } = await client.getToken(code);
  return tokens;
}

function getAuthorizedClient(refreshToken: string) {
  const client = createOAuthClient();
  client.setCredentials({ refresh_token: refreshToken });
  return client;
}

export async function checkAvailability(
  refreshToken: string,
  calendarId: string,
  from: string,
  to: string
) {
  const auth = getAuthorizedClient(refreshToken);
  const calendar = google.calendar({ version: 'v3', auth });

  const res = await calendar.freebusy.query({
    requestBody: {
      timeMin: from,
      timeMax: to,
      items: [{ id: calendarId }],
    },
  });

  const calendarResult = res.data.calendars?.[calendarId];
  if (!calendarResult || (calendarResult.errors && calendarResult.errors.length > 0)) {
    throw new Error('Nie udało się odczytać zajętości kalendarza');
  }
  return calendarResult.busy ?? [];
}

export async function createCalendarEvent(
  refreshToken: string,
  calendarId: string,
  event: {
    summary: string;
    description?: string;
    start: string;
    end: string;
    attendeeEmail: string;
  }
) {
  const auth = getAuthorizedClient(refreshToken);
  const calendar = google.calendar({ version: 'v3', auth });

  const res = await calendar.events.insert({
    calendarId,
    requestBody: {
      summary: event.summary,
      description: event.description,
      start: { dateTime: event.start, timeZone: 'Europe/Warsaw' },
      end: { dateTime: event.end, timeZone: 'Europe/Warsaw' },
      attendees: [{ email: event.attendeeEmail }],
    },
  });

  return res.data;
}

export async function deleteCalendarEvent(refreshToken: string, calendarId: string, eventId: string) {
  const auth = getAuthorizedClient(refreshToken);
  const calendar = google.calendar({ version: 'v3', auth });
  await calendar.events.delete({ calendarId, eventId, sendUpdates: 'none' });
}
