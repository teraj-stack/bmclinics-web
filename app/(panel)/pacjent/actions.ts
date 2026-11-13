'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { getPatientByUserId } from '@/lib/patients';
import { getCmsState, saveCmsState } from '@/lib/cmsStore';
import { revalidatePath } from 'next/cache';

export async function cancelVisit(visitId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error('Brak uprawnień');

  const cms = getCmsState();
  saveCmsState({
    ...cms,
    visits: cms.visits.map((v) => (v.id === visitId ? { ...v, status: 'CANCELLED' } : v)),
  });

  if (process.env.DATABASE_URL) {
    try {
      const patient = await getPatientByUserId(session.user.id);
      const visit = await prisma.visit.findUniqueOrThrow({ where: { id: visitId } });
      if (visit.patientId === patient.id) {
        await prisma.visit.update({ where: { id: visitId }, data: { status: 'CANCELLED' } });
      }
    } catch {
      // CMS store already updated
    }
  }

  revalidatePath('/pacjent');
}

export async function updateProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error('Brak uprawnień');

  if (process.env.DATABASE_URL) {
    try {
      const patient = await getPatientByUserId(session.user.id);
      await prisma.patient.update({
        where: { id: patient.id },
        data: { phone: String(formData.get('phone') ?? '') },
      });
      await prisma.user.update({
        where: { id: session.user.id },
        data: { name: String(formData.get('name') ?? '') },
      });
    } catch {
      // Stateless fallback
    }
  }

  revalidatePath('/pacjent/profil');
}
