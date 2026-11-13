import { prisma } from './prisma';

export async function getOrCreatePatientByEmail(email: string, name?: string) {
  const existingUser = await prisma.user.findUnique({
    where: { email },
    include: { patient: true },
  });

  if (existingUser?.patient) return existingUser.patient;

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name, role: 'PATIENT' },
  });

  return prisma.patient.create({ data: { userId: user.id } });
}

export async function getPatientByUserId(userId: string) {
  return prisma.patient.findUniqueOrThrow({ where: { userId } });
}
