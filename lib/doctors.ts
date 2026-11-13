import { prisma } from './prisma';
import { encrypt, decrypt } from './kms';

export async function getDoctorCalendarCreds(doctorId: string) {
  const doctor = await prisma.doctor.findUniqueOrThrow({ where: { id: doctorId } });

  if (!doctor.googleRefreshTokenEnc || !doctor.googleCalendarId) {
    throw new Error('Lekarz nie połączył jeszcze konta Google Calendar');
  }

  return {
    refreshToken: await decrypt(doctor.googleRefreshTokenEnc),
    calendarId: doctor.googleCalendarId,
    workStartHour: doctor.workStartHour,
    workEndHour: doctor.workEndHour,
  };
}

export async function saveDoctorRefreshTokenEncrypted(
  doctorId: string,
  refreshToken: string,
  calendarId = 'primary'
) {
  const encrypted = await encrypt(refreshToken);

  await prisma.doctor.update({
    where: { id: doctorId },
    data: {
      googleRefreshTokenEnc: encrypted,
      googleCalendarId: calendarId,
    },
  });
}

export async function getDoctorByUserId(userId: string) {
  return prisma.doctor.findUniqueOrThrow({ where: { userId } });
}
