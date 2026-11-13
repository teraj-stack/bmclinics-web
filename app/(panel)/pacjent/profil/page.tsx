import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { getPatientByUserId } from '@/lib/patients';
import { updateProfile } from '../actions';

export const dynamic = 'force-dynamic';

export default async function PacjentProfilPage() {
  const session = await getServerSession(authOptions);
  let name = session?.user?.name ?? '';
  let phone = '';

  if (session?.user?.id && process.env.DATABASE_URL) {
    try {
      const [patient, user] = await Promise.all([
        getPatientByUserId(session.user.id),
        prisma.user.findUniqueOrThrow({ where: { id: session.user.id } }),
      ]);
      name = user.name ?? '';
      phone = patient.phone ?? '';
    } catch {
      // Fallback when DB is unreachable
    }
  }

  return (
    <div className="max-w-md space-y-4">
      <h1 className="text-xl font-semibold">Twój profil</h1>
      <form action={updateProfile} className="space-y-3">
        <input
          name="name"
          defaultValue={name}
          placeholder="Imię i nazwisko"
          className="w-full rounded border p-2"
          style={{ borderColor: 'var(--border-color)' }}
        />
        <input
          name="phone"
          defaultValue={phone}
          placeholder="Telefon"
          className="w-full rounded border p-2"
          style={{ borderColor: 'var(--border-color)' }}
        />
        <button type="submit" className="rounded bg-[var(--text-primary)] px-4 py-2 text-[var(--bg-primary)]">
          Zapisz
        </button>
      </form>
    </div>
  );
}
