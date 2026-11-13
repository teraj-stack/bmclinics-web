'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { getDoctorByUserId } from '@/lib/doctors';
import { getCmsState, saveCmsState } from '@/lib/cmsStore';
import { revalidatePath } from 'next/cache';
import type { VisitStatus } from '@prisma/client';

export async function updateVisitStatus(visitId: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error('Brak uprawnień');

  const nextStatus = (formData.get('status') as 'CONFIRMED' | 'COMPLETED' | 'CANCELLED') || 'CONFIRMED';

  // Update in CMS runtime store
  const cms = getCmsState();
  saveCmsState({
    ...cms,
    visits: cms.visits.map((v) => (v.id === visitId ? { ...v, status: nextStatus } : v)),
  });

  if (process.env.DATABASE_URL) {
    try {
      const doctor = await getDoctorByUserId(session.user.id);
      const visit = await prisma.visit.findUniqueOrThrow({ where: { id: visitId } });
      if (visit.doctorId === doctor.id) {
        await prisma.visit.update({
          where: { id: visitId },
          data: { status: nextStatus as VisitStatus },
        });
      }
    } catch {
      // CMS store already updated
    }
  }

  revalidatePath('/lekarz');
}

export async function updateWorkHours(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error('Brak uprawnień');

  const workStartHour = Number(formData.get('workStartHour'));
  const workEndHour = Number(formData.get('workEndHour'));

  const cms = getCmsState();
  saveCmsState({
    ...cms,
    doctors: cms.doctors.map((d, idx) =>
      idx === 0 ? { ...d, workStartHour, workEndHour } : d
    ),
  });

  if (process.env.DATABASE_URL) {
    try {
      const doctor = await getDoctorByUserId(session.user.id);
      await prisma.doctor.update({
        where: { id: doctor.id },
        data: { workStartHour, workEndHour },
      });
    } catch {
      // CMS store already updated
    }
  }

  revalidatePath('/lekarz/kalendarz');
}
