import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { CheckCircle2, Clock, ArrowRight, Calendar } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function PodsumowaniePage({
  searchParams,
}: {
  searchParams: Promise<{ sessionId?: string; demo?: string }>;
}) {
  const { sessionId, demo } = await searchParams;

  let order: { status: string; amountGrosze?: number; customerEmail?: string } | null = null;

  if (sessionId && process.env.DATABASE_URL) {
    try {
      order = await prisma.order.findUnique({ where: { sessionId } });
    } catch {
      order = null;
    }
  }

  if (!order && sessionId && demo === '1') {
    order = { status: 'PAID' };
  }

  if (!order) {
    return (
      <main className="min-h-[65vh] bg-slate-50 dark:bg-[#0b1324] py-16 px-4 flex items-center justify-center">
        <div className="glass-card max-w-md w-full p-8 text-center space-y-4">
          <h1 className="font-[family-name:var(--font-fraunces)] text-2xl font-bold text-slate-900 dark:text-white">
            Nie znaleziono zamówienia
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Sprawdź link w wiadomości e-mail lub przejdź do sklepu zabiegowego.
          </p>
          <Link
            href="/sklep"
            className="btn-gold inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold"
          >
            Wróć do sklepu
          </Link>
        </div>
      </main>
    );
  }

  const isPaid = order.status === 'PAID';

  return (
    <main className="min-h-[70vh] bg-slate-50 dark:bg-[#0b1324] py-16 px-4 flex items-center justify-center">
      <div className="glass-card max-w-lg w-full p-8 sm:p-10 text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-500">
          {isPaid ? <CheckCircle2 className="h-9 w-9" /> : <Clock className="h-9 w-9 text-amber-500" />}
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
            Potwierdzenie zamówienia #{sessionId?.slice(0, 8)}
          </span>
          <h1 className="font-[family-name:var(--font-fraunces)] text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {isPaid ? 'Zamówienie zostało przyjęte!' : 'Oczekujemy na potwierdzenie płatności'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {isPaid
              ? 'Dziękujemy za zakup w sklepie zabiegowym BM Clinics. Potwierdzenie oraz kod vouchera zostały przypisane do Twojego zamówienia.'
              : 'Potwierdzenie z systemu Przelewy24 może potrwać kilka chwil. Odśwież stronę za moment lub sprawdź skrzynkę e-mail.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/rezerwacja"
            className="btn-gold w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-semibold"
          >
            <Calendar className="h-4 w-4" />
            <span>Umów termin zabiegu</span>
          </Link>
          <Link
            href="/sklep"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 px-5 py-3 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <span>Wróć do sklepu</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
