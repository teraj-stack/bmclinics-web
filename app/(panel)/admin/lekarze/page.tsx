import { prisma } from '@/lib/prisma';
import { getDoctorsCatalog } from '@/lib/servicesCatalog';

export const dynamic = 'force-dynamic';

export default async function AdminDoctorsPage() {
  let doctors: {
    id: string;
    name: string;
    specialization: string;
    googleRefreshTokenEnc?: string | null;
  }[] = [];

  if (process.env.DATABASE_URL) {
    try {
      const dbDoctors = await prisma.doctor.findMany({ include: { user: true } });
      doctors = dbDoctors.map((d) => ({
        id: d.id,
        name: d.user.name ?? d.user.email ?? 'Jan Bujok',
        specialization: d.specialization,
        googleRefreshTokenEnc: d.googleRefreshTokenEnc,
      }));
    } catch {
      doctors = [];
    }
  }

  if (doctors.length === 0) {
    const fallback = await getDoctorsCatalog();
    doctors = fallback.map((d) => ({
      id: d.id,
      name: d.name,
      specialization: d.specialization,
      googleRefreshTokenEnc: null,
    }));
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Lekarze</h1>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b" style={{ borderColor: 'var(--border-color)' }}>
            <th className="py-2">Imię i nazwisko</th>
            <th>Specjalizacja</th>
            <th>Kalendarz Google</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((d) => (
            <tr key={d.id} className="border-b" style={{ borderColor: 'var(--border-color)' }}>
              <td className="py-2">{d.name}</td>
              <td>{d.specialization}</td>
              <td>
                {d.googleRefreshTokenEnc ? (
                  <span className="text-green-600">Połączony</span>
                ) : (
                  <a className="text-blue-600 underline" href={`/api/auth/google?doctorId=${d.id}`}>
                    Połącz konto
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
