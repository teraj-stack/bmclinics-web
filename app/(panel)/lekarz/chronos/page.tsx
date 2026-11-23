import { ChronosLiteHub } from '@/components/chronos/ChronosLiteHub';

export const dynamic = 'force-dynamic';

export default function LekarzChronosPage() {
  return <ChronosLiteHub initialTab="calendar" roleLabel="Panel Lekarza BM Clinics" />;
}
