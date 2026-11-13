import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { getDoctorByUserId } from '@/lib/doctors';
import { updateWorkHours } from '../actions';

export const dynamic = 'force-dynamic';

export default async function LekarzKalendarzPage() {
  const session = await getServerSession(authOptions);
  let doctor: {
    id: string;
    googleRefreshTokenEnc?: string | null;
    googleCalendarId?: string | null;
    workStartHour: number;
    workEndHour: number;
  } = {
    id: 'dr-jan-bujok',
    googleRefreshTokenEnc: null,
    googleCalendarId: 'primary',
    workStartHour: 9,
    workEndHour: 19,
  };

  if (session?.user?.id && process.env.DATABASE_URL) {
    try {
      doctor = await getDoctorByUserId(session.user.id);
    } catch {
      // Fallback to default doctor profile
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Kalendarz Google</h1>
        {doctor.googleRefreshTokenEnc ? (
          <p className="text-green-600">
            Twój kalendarz Google jest połączony ({doctor.googleCalendarId}).
          </p>
        ) : (
          <>
            <p className="opacity-70">
              Połącz swoje konto Google Calendar, aby system sprawdzał Twoją dostępność.
            </p>
            <a
              href={`/api/auth/google?doctorId=${doctor.id}`}
              className="mt-3 inline-block rounded bg-[var(--text-primary)] px-4 py-2 text-[var(--bg-primary)]"
            >
              Połącz konto Google
            </a>
          </>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold">Godziny przyjęć</h2>
        <form action={updateWorkHours} className="mt-2 flex items-end gap-3">
          <label className="text-sm">
            Od
            <input
              type="number"
              name="workStartHour"
              min={0}
              max={23}
              defaultValue={doctor.workStartHour}
              className="mt-1 block w-20 rounded border p-2"
              style={{ borderColor: 'var(--border-color)' }}
            />
          </label>
          <label className="text-sm">
            Do
            <input
              type="number"
              name="workEndHour"
              min={1}
              max={24}
              defaultValue={doctor.workEndHour}
              className="mt-1 block w-20 rounded border p-2"
              style={{ borderColor: 'var(--border-color)' }}
            />
          </label>
          <button type="submit" className="rounded bg-[var(--text-primary)] px-4 py-2 text-sm text-[var(--bg-primary)]">
            Zapisz
          </button>
        </form>
      </div>
    </div>
  );
}
