import { getFaqItems } from '@/lib/content';
import { HelpCircle, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Najczęściej Zadawane Pytania (FAQ)',
  description:
    'Odpowiedzi na najczęściej zadawane pytania pacjentów BM Clinics dotyczące przygotowania do zabiegów, rekonwalescencji, płatności i rezerwacji.',
};

export default function FaqPage() {
  const items = getFaqItems();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#0b1324] py-12 px-4 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-4xl space-y-10">
        {/* Banner Header */}
        <div className="rounded-3xl bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] p-8 sm:p-12 text-white shadow-xl border border-slate-800 relative overflow-hidden text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 mb-4">
            <HelpCircle className="h-7 w-7" />
          </div>
          <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">
            Centrum Pomocy & Informacji
          </span>
          <h1 className="mt-2 font-[family-name:var(--font-fraunces)] text-3xl font-bold sm:text-4xl lg:text-5xl">
            Najczęściej Zadawane Pytania (FAQ)
          </h1>
          <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Znajdź szybkie odpowiedzi dotyczące zabiegów, przygotowania do wizyty, znieczulenia oraz rezerwacji online.
          </p>
        </div>

        {/* FAQ Accordion Cards */}
        <div className="space-y-4">
          {items.map((item, idx) => (
            <details
              key={idx}
              className="group glass-card p-6 transition duration-200 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-bold text-base text-slate-900 dark:text-white select-none">
                <span>{item.question}</span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition group-open:rotate-180 group-open:bg-amber-500/20 group-open:text-amber-600 dark:bg-slate-800 dark:text-slate-400">
                  <ChevronDown className="h-4 w-4" />
                </span>
              </summary>
              <p className="mt-4 border-t border-slate-100 pt-4 text-sm leading-relaxed text-slate-600 dark:border-slate-800 dark:text-slate-300">
                {item.answer}
              </p>
            </details>
          ))}
        </div>

        {/* Still have questions card */}
        <div className="rounded-3xl border border-amber-500/30 bg-amber-500/5 p-8 text-center sm:flex sm:items-center sm:justify-between dark:bg-amber-500/10">
          <div className="text-left space-y-1">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Nie znalazłeś odpowiedzi na swoje pytanie?</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Nasi konsultanci medyczni chętnie udzielą szczegółowych informacji.
            </p>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:mt-0">
            <Link
              href="/kontakt"
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition dark:bg-slate-800"
            >
              Napisz do nas
            </Link>
            <Link
              href="/rezerwacja"
              className="btn-gold px-5 py-2.5 rounded-xl text-xs shadow-md"
            >
              Umów wizytę
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
