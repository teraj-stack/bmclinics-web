import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { getDoctorByUserId } from '@/lib/doctors';
import { getCmsState } from '@/lib/cmsStore';
import { updateVisitStatus } from './actions';

export const dynamic = 'force-dynamic';

function todayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

export default async function LekarzDzisPage() {
  const session = await getServerSession(authOptions);
  const cms = getCmsState();

  let visits: {
    id: string;
    startTime: Date;
    status: string;
    patient: { user: { name?: string | null; email: string } };
    service: { name: string };
  }[] = cms.visits.map((v) => ({
    id: v.id,
    startTime: new Date(v.startTime),
    status: v.status,
    patient: { user: { name: v.patientName, email: v.patientEmail } },
    service: { name: v.serviceName },
  }));

  if (session?.user?.id && process.env.DATABASE_URL) {
    try {
      const doctor = await getDoctorByUserId(session.user.id);
      const { start, end } = todayRange();
      const dbVisits = await prisma.visit.findMany({
        where: { doctorId: doctor.id, startTime: { gte: start, lt: end } },
        include: { patient: { include: { user: true } }, service: true },
        orderBy: { startTime: 'asc' },
      });
      if (dbVisits.length > 0) {
        visits = dbVisits;
      }
    } catch {
      // Fallback to CMS visits
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Wizyty dzisiaj</h1>

      {visits.length === 0 && <p className="opacity-70">Brak zaplanowanych wizyt na dziś.</p>}

      <ul className="space-y-3">
        {visits.map((v) => (
          <li
            key={v.id}
            className="glass-card flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium">
                {v.startTime.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })} —{' '}
                {v.patient.user.name ?? v.patient.user.email}
              </p>
              <p className="text-sm opacity-70">{v.service.name}</p>
            </div>

            <form action={updateVisitStatus.bind(null, v.id)} className="flex gap-2">
              <select
                name="status"
                defaultValue={v.status}
                className="rounded border p-1 text-sm"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <option value="CONFIRMED">Potwierdzona</option>
                <option value="COMPLETED">Odbyta</option>
                <option value="CANCELLED">Anulowana</option>
              </select>
              <button
                type="submit"
                className="rounded bg-[var(--text-primary)] px-3 py-1 text-sm text-[var(--bg-primary)]"
              >
                Zapisz
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
