'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { getDoctorByUserId } from '@/lib/doctors';
import { revalidatePath } from 'next/cache';
import type { VisitStatus } from '@prisma/client';

export async function updateVisitStatus(visitId: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error('Brak uprawnień');

  const doctor = await getDoctorByUserId(session.user.id);
  const visit = await prisma.visit.findUniqueOrThrow({ where: { id: visitId } });
  if (visit.doctorId !== doctor.id) throw new Error('Brak dostępu do tej wizyty');

  await prisma.visit.update({
    where: { id: visitId },
    data: { status: formData.get('status') as VisitStatus },
  });

  revalidatePath('/lekarz');
}

export async function updateWorkHours(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error('Brak uprawnień');

  const doctor = await getDoctorByUserId(session.user.id);

  await prisma.doctor.update({
    where: { id: doctor.id },
    data: {
      workStartHour: Number(formData.get('workStartHour')),
      workEndHour: Number(formData.get('workEndHour')),
    },
  });

  revalidatePath('/lekarz/kalendarz');
}
