import { prisma } from './prisma';
import { getOrCreatePatientByEmail } from './patients';

interface SavePendingVisitInput {
  doctorId: string;
  serviceId: string;
  patientEmail: string;
  start: string;
  end: string;
  googleEventId?: string;
}

export async function savePendingVisit(input: SavePendingVisitInput) {
  const patient = await getOrCreatePatientByEmail(input.patientEmail);

  return prisma.visit.create({
    data: {
      patientId: patient.id,
      doctorId: input.doctorId,
      serviceId: input.serviceId,
      startTime: new Date(input.start),
      endTime: new Date(input.end),
      status: input.googleEventId ? 'CONFIRMED' : 'PROPOSED',
      googleEventId: input.googleEventId,
    },
  });
}
