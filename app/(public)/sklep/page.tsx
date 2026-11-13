import { getServicesCatalog } from '@/lib/servicesCatalog';
import AddToCartButton from '@/components/cart/AddToCartButton';
import Link from 'next/link';
import { ShieldCheck, CreditCard, Sparkles, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Sklep Zabiegowy Online',
  description:
    'Wykup vouchery i zabiegi chirurgiczne online z bezpieczną płatnością Przelewy24. Natychmiastowa rezerwacja i elastyczne terminy.',
};

export default async function SklepPage() {
  const services = await getServicesCatalog();

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#0b1324] py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-10">
        {/* Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] p-8 sm:p-12 text-white shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-64 w-64 translate-x-16 -translate-y-16 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">
              Vouchery & Zabiegi Online Przelewy24
            </span>
            <h1 className="mt-2 font-[family-name:var(--font-fraunces)] text-3xl font-bold sm:text-4xl lg:text-5xl">
              Sklep Zabiegowy BM Clinics
            </h1>
            <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              Kup zabieg lub pakiet konsultacyjny online dla siebie lub bliskiej osoby. Po opłaceniu zamówienia otrzymasz kod potwierdzający, który zrealizujesz podczas rezerwacji terminu.
            </p>
          </div>
        </div>

        {/* Benefits bar */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <CreditCard className="h-6 w-6 text-amber-500 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Płatności Przelewy24</h4>
              <p className="text-[11px] text-slate-500">BLIK, karty, szybki przelew online</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <ShieldCheck className="h-6 w-6 text-emerald-500 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Ważność przez 12 miesięcy</h4>
              <p className="text-[11px] text-slate-500">Zrealizuj zabieg w dogodnym czasie</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <Sparkles className="h-6 w-6 text-sky-500 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Forma Prezentowa</h4>
              <p className="text-[11px] text-slate-500">E-Voucher PDF wysyłany na e-mail</p>
            </div>
          </div>
        </div>

        {/* Catalog */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-[family-name:var(--font-fraunces)] text-2xl font-bold text-slate-900 dark:text-white">
              Katalog Zabiegów
            </h2>
            <Link
              href="/sklep/koszyk"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
            >
              Przejdź do koszyka
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {services.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-800">
              Katalog usług jest pusty. Uzupełnij pozycje w panelu administratora.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <div
                  key={s.id}
                  className="glass-card flex flex-col justify-between p-6 transition hover:border-amber-500/40"
                >
                  <div>
                    <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold tracking-wider uppercase text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {s.categorySlug}
                    </span>
                    <h3 className="mt-3 font-bold text-lg text-slate-900 dark:text-white leading-snug">
                      {s.name}
                    </h3>
                    <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {s.seoSummary}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] uppercase text-slate-400 font-semibold">Cena:</span>
                      <span className="text-base font-extrabold text-slate-900 dark:text-white">
                        {(s.priceGrosze / 100).toFixed(2)} zł
                      </span>
                    </div>

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
        </div>
      </div>
    </main>
  );
}
