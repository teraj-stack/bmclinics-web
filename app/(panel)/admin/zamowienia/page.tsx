import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  let orders: {
    id: string;
    createdAt: Date;
    customerEmail: string;
    amountGrosze: number;
    status: string;
    items: { quantity: number; service: { name: string } }[];
  }[] = [];

  if (process.env.DATABASE_URL) {
    try {
      orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: { items: { include: { service: true } } },
        take: 100,
      });
    } catch {
      orders = [];
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Zamówienia ({orders.length})</h1>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b" style={{ borderColor: 'var(--border-color)' }}>
            <th className="py-2">Data</th>
            <th>Usługi</th>
            <th>Klient</th>
            <th>Kwota</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b" style={{ borderColor: 'var(--border-color)' }}>
              <td className="py-2">{o.createdAt.toLocaleDateString('pl-PL')}</td>
              <td>{o.items.map((i) => `${i.service.name} ×${i.quantity}`).join(', ')}</td>
              <td>{o.customerEmail}</td>
              <td>{(o.amountGrosze / 100).toFixed(2)} zł</td>
              <td>{statusLabel(o.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function statusLabel(status: string) {
  switch (status) {
    case 'PAID':
      return 'Opłacone';
    case 'PENDING':
      return 'Oczekuje';
    case 'FAILED':
      return 'Nieudane';
    default:
      return status;
  }
}
