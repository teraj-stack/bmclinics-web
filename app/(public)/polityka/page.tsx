import Link from 'next/link';

export const metadata = {
  title: 'Polityka prywatności',
  description: 'Polityka prywatności i informacje RODO — BM Clinics / Bujok Medical.',
};

export default function PolitykaPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 dark:bg-[#0b1324] sm:px-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="font-[family-name:var(--font-fraunces)] text-3xl font-bold text-slate-900 dark:text-white">
          Polityka prywatności
        </h1>
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Treść w przygotowaniu. Pełna polityka prywatności i informacje RODO pojawią się wkrótce.
        </p>
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          W sprawach ochrony danych prosimy o kontakt:{' '}
          <a href="mailto:kontakt@bujokmedical.pl" className="font-medium text-amber-600 hover:underline dark:text-amber-400">
            kontakt@bujokmedical.pl
          </a>
          {' '}lub telefonicznie{' '}
          <a href="tel:+48510432361" className="font-medium text-amber-600 hover:underline dark:text-amber-400">
            +48 510 432 361
          </a>
          .
        </p>
        <Link href="/kontakt" className="inline-block text-sm font-medium text-amber-600 hover:underline dark:text-amber-400">
          Przejdź do kontaktu →
        </Link>
      </div>
    </main>
  );
}
