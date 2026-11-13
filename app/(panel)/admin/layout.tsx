import Link from 'next/link';
import { requireRole } from '@/lib/authGuard';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole('ADMIN');

  return (
    <div className="flex min-h-screen flex-col sm:flex-row">
      <aside
        className="w-full shrink-0 border-b p-4 sm:w-56 sm:border-r sm:border-b-0"
        style={{ borderColor: 'var(--border-color)' }}
      >
        <nav className="flex flex-row gap-4 sm:flex-col sm:gap-2">
          <Link href="/admin">Pulpit</Link>
          <Link href="/admin/uslugi">Usługi</Link>
          <Link href="/admin/lekarze">Lekarze</Link>
          <Link href="/admin/zamowienia">Zamówienia</Link>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
