'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { getPatientByUserId } from '@/lib/patients';
import { revalidatePath } from 'next/cache';

export async function cancelVisit(visitId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error('Brak uprawnień');

  const patient = await getPatientByUserId(session.user.id);
  const visit = await prisma.visit.findUniqueOrThrow({ where: { id: visitId } });
  if (visit.patientId !== patient.id) throw new Error('Brak dostępu do tej wizyty');

  await prisma.visit.update({ where: { id: visitId }, data: { status: 'CANCELLED' } });

  revalidatePath('/pacjent');
}

export async function updateProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error('Brak uprawnień');

  const patient = await getPatientByUserId(session.user.id);

  await prisma.patient.update({
    where: { id: patient.id },
    data: { phone: String(formData.get('phone') ?? '') },
  });

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: String(formData.get('name') ?? '') },
  });

  revalidatePath('/pacjent/profil');
}
