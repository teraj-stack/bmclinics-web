import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { getPatientByUserId } from '@/lib/patients';
import { cancelVisit } from './actions';

export default async function PacjentDashboard() {
  const session = await getServerSession(authOptions);
  const patient = await getPatientByUserId(session!.user.id);

  const visits = await prisma.visit.findMany({
    where: { patientId: patient.id },
    include: { doctor: { include: { user: true } }, service: true },
    orderBy: { startTime: 'asc' },
  });

  const now = new Date();
  const upcoming = visits.filter((v) => v.startTime >= now && v.status !== 'CANCELLED');
  const past = visits.filter((v) => v.startTime < now || v.status === 'CANCELLED');

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-xl font-semibold">Nadchodzące wizyty</h1>
        {upcoming.length === 0 && <p className="opacity-70">Brak zaplanowanych wizyt.</p>}
        <ul className="mt-3 space-y-3">
          {upcoming.map((v) => (
            <li
              key={v.id}
              className="glass-card flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">
                  {v.startTime.toLocaleString('pl-PL', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
                <p className="text-sm opacity-70">
                  {v.service.name} — dr {v.doctor.user.name ?? v.doctor.user.email}
                </p>
              </div>
              {v.status !== 'CANCELLED' && (
                <form action={cancelVisit.bind(null, v.id)}>
                  <button type="submit" className="text-sm text-red-600">
                    Odwołaj wizytę
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Historia wizyt</h2>
        <ul className="mt-3 space-y-2 text-sm opacity-80">
          {past.map((v) => (
            <li key={v.id}>
              {v.startTime.toLocaleDateString('pl-PL')} — {v.service.name} (
              {v.status === 'COMPLETED' ? 'Odbyta' : 'Anulowana'})
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
