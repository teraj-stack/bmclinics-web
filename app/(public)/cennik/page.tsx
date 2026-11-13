import Link from 'next/link';
import { getServicesCatalog } from '@/lib/servicesCatalog';
import { CATEGORY_THEMES } from '@/lib/categoryThemes';
import AddToCartButton from '@/components/cart/AddToCartButton';
import { Calendar, Clock, Shield, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Cennik Zabiegów i Konsultacji',
  description:
    'Aktualny cennik zabiegów BM Clinics — proktologia, żylaki i naczynka, chirurgia ogólna. Sprawdź ceny, czas trwania i umów wizytę online lub opłać zabieg z góry.',
};

export default async function CennikPage() {
  const services = await getServicesCatalog();

  const categories = Object.keys(CATEGORY_THEMES).map((slug) => ({
    theme: CATEGORY_THEMES[slug],
    items: services.filter((s) => s.categorySlug === slug),
  }));

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#0b1324] py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-10">
        {/* Header Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-[#0f172a] to-[#1e293b] p-8 sm:p-12 text-white shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-64 w-64 translate-x-16 -translate-y-16 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">
              Przejrzysta Oferta & Bez Ukrytych Kosztów
            </span>
            <h1 className="mt-2 font-[family-name:var(--font-fraunces)] text-3xl font-bold sm:text-4xl lg:text-5xl">
              Cennik Zabiegów i Konsultacji
            </h1>
            <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              Podane kwoty stanowią ceny orientacyjne. Wybierz zabieg, aby natychmiast zarezerwować termin u specjalisty lub kupić zabieg online w naszym sklepie.
            </p>
          </div>
        </div>

        {/* Categories Sections */}
        <div className="space-y-12">
          {categories.map(({ theme, items }) => (
            <section key={theme.slug} className="space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-3 dark:border-slate-800">
                <span
                  className="h-3.5 w-3.5 rounded-full shadow-sm"
                  style={{ backgroundColor: theme.accent }}
                />
                <h2
                  className="font-[family-name:var(--font-fraunces)] text-2xl font-bold"
                  style={{ color: theme.accent }}
                >
                  {theme.label}
                </h2>
                <span className="text-xs text-slate-500 font-medium ml-auto">
                  {items.length} {items.length === 1 ? 'zabieg' : 'zabiegów'}
                </span>
              </div>

              {items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-800">
                  Brak dostępnych usług w tej kategorii.
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {items.map((s) => (
                    <div
                      key={s.id}
                      className="glass-card flex flex-col justify-between p-6 transition hover:border-amber-500/40"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <Link
                            href={`/uslugi/${s.categorySlug}/${s.slug}`}
                            className="font-bold text-lg text-slate-900 dark:text-white hover:text-amber-600 transition"
                          >
                            {s.name}
                          </Link>
                          <span className="shrink-0 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-400">
                            od {(s.priceGrosze / 100).toFixed(2)} zł
                          </span>
                        </div>

                        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {s.seoSummary}
                        </p>

                        <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                            {s.durationMin} min
                          </span>
                          <span className="flex items-center gap-1">
                            <Shield className="h-3.5 w-3.5 text-slate-400" />
                            Zabieg 1-Dnia
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                        <Link
                          href={`/rezerwacja?serviceId=${s.id}`}
                          className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition dark:bg-slate-800 dark:hover:bg-slate-700"
                        >
                          <Calendar className="h-3.5 w-3.5 text-amber-400" />
                          <span>Rezerwuj</span>
                        </Link>

                        <AddToCartButton
                          service={{
                            serviceId: s.id,
                            name: s.name,
                            priceGrosze: s.priceGrosze,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Bottom Booking Guarantee Pill */}
        <div className="rounded-2xl bg-amber-500/10 p-6 border border-amber-500/20 text-center sm:flex sm:items-center sm:justify-between">
          <div className="text-left">
            <h4 className="font-semibold text-slate-900 dark:text-white">Masz pytania co do wyceny zabiegu?</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Podczas pierwszej konsultacji lekarz określi dokładny zakres leczenia.
            </p>
          </div>
          <Link
            href="/kontakt"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white sm:mt-0 transition hover:bg-slate-800"
          >
            Skontaktuj się z rejestracją
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
