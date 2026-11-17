import { Prisma, VisitStatus } from '@prisma/client';
import { prisma } from './prisma';
import { getOrCreatePatientByEmail } from './patients';

interface SavePendingVisitInput {
  doctorId: string;
  serviceId: string;
  patientEmail: string;
  start: string;
  end: string;
}

export async function savePendingVisit(input: SavePendingVisitInput) {
  const patient = await getOrCreatePatientByEmail(input.patientEmail);
  const startTime = new Date(input.start);
  const endTime = new Date(input.end);

  // Serializable transaction prevents two concurrent requests from both
  // reserving an overlapping interval in the local database.
  return prisma.$transaction(async (tx) => {
    const overlap = await tx.visit.findFirst({
      where: {
        doctorId: input.doctorId,
        status: { in: [VisitStatus.PROPOSED, VisitStatus.CONFIRMED] },
        startTime: { lt: endTime },
        endTime: { gt: startTime },
      },
      select: { id: true },
    });
    if (overlap) throw new Error('SLOT_TAKEN');
    return tx.visit.create({
      data: {
        patientId: patient.id,
        doctorId: input.doctorId,
        serviceId: input.serviceId,
        startTime,
        endTime,
        status: VisitStatus.PROPOSED,
      },
    });
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
}

export async function confirmVisit(visitId: string, googleEventId: string) {
  return prisma.visit.update({
    where: { id: visitId },
    data: { status: VisitStatus.CONFIRMED, googleEventId },
  });
}

export async function cancelPendingVisit(visitId: string) {
  return prisma.visit.update({
    where: { id: visitId },
    data: { status: VisitStatus.CANCELLED },
  });
}
