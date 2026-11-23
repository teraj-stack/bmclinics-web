import { ChronosLiteHub } from '@/components/chronos/ChronosLiteHub';

export const dynamic = 'force-dynamic';

export default function AdminChronosPage() {
  return <ChronosLiteHub initialTab="calendar" roleLabel="Panel Administratora BM Clinics" />;
}
