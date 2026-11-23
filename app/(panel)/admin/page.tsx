import { prisma } from '@/lib/prisma';

function startOfWeek() {
  const now = new Date();
  const day = now.getDay() === 0 ? 7 : now.getDay();
  now.setHours(0, 0, 0, 0);
  now.setDate(now.getDate() - day + 1);
  return now;
}

export default async function AdminDashboard() {
  const [visitsThisWeek, revenue, patientsCount, pendingOrders] = await Promise.all([
    prisma.visit.count({
      where: { startTime: { gte: startOfWeek() }, status: { in: ['CONFIRMED', 'COMPLETED'] } },
    }),
    prisma.order.aggregate({ where: { status: 'PAID' }, _sum: { amountGrosze: true } }),
    prisma.patient.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
  ]);

  const revenueZl = ((revenue._sum.amountGrosze ?? 0) / 100).toFixed(2);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Wizyty w tym tygodniu" value={visitsThisWeek} />
      <StatCard label="Przychód (opłacone)" value={`${revenueZl} zł`} />
      <StatCard label="Liczba pacjentów" value={patientsCount} />
      <StatCard label="Oczekujące płatności" value={pendingOrders} />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="glass-card p-5">
      <p className="text-sm opacity-70">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}
