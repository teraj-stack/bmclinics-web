import { getServerSession } from 'next-auth';
import { authOptions } from './authOptions';

type Role = 'ADMIN' | 'DOCTOR' | 'PATIENT';

export async function requireRole(roles: Role | Role[]) {
  const allowed = Array.isArray(roles) ? roles : [roles];
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (!session?.user || !role || !allowed.includes(role as Role)) {
    throw new Error('Brak uprawnień');
  }
  return session;
}
