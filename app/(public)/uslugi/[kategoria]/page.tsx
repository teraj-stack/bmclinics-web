import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCategoryTheme } from '@/lib/categoryThemes';
import { getServicesByCategory } from '@/lib/servicesCatalog';
import AddToCartButton from '@/components/cart/AddToCartButton';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

interface Props {
  params: Promise<{ kategoria: string }>;
}

export default async function KategoriaPage({ params }: Props) {
  const { kategoria } = await params;
  const theme = getCategoryTheme(kategoria);
  if (!theme) notFound();

  const services = await getServicesByCategory(kategoria);

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div className="glass-card p-6 sm:p-8 space-y-3" style={{ background: 'var(--cat-card-bg)' }}>
        <span
          className="inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest"
          style={{ background: 'rgba(196, 168, 116, 0.16)', color: 'var(--cat-accent)' }}
        >
          Specjalizacja Kliniczna BM Clinics
        </span>
        <h1
          className="font-[family-name:var(--font-fraunces)] text-3xl sm:text-4xl font-semibold"
          style={{ color: 'var(--cat-text)' }}
        >
          {theme.label}
        </h1>
        <p className="text-sm sm:text-base leading-relaxed opacity-85" style={{ color: 'var(--cat-text)' }}>
          {theme.seoSummary}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {services.map((s) => (
          <div
            key={s.id}
            className="glass-card flex flex-col justify-between p-6 transition hover:border-amber-500/40"
            style={{ background: 'var(--cat-card-bg)', color: 'var(--cat-text)' }}
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <Link
                  href={`/uslugi/${kategoria}/${s.slug}`}
                  className="font-semibold text-lg hover:underline"
                >
                  {s.name}
                </Link>
                <span
                  className="shrink-0 rounded-full px-3 py-1 text-xs font-bold"
                  style={{ background: 'rgba(196, 168, 116, 0.18)', color: 'var(--cat-accent)' }}
                >
                  od {(s.priceGrosze / 100).toFixed(2)} zł
                </span>
              </div>

              <p className="mt-2 text-xs opacity-80 leading-relaxed line-clamp-3">
                {s.seoSummary}
              </p>

              <div className="mt-4 flex items-center gap-4 text-xs opacity-75">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {s.durationMin} min
                </span>
                <Link
                  href={`/uslugi/${kategoria}/${s.slug}`}
                  className="inline-flex items-center gap-1 font-medium hover:underline ml-auto"
                >
                  Opis zabiegu
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-2">
              <Link
                href={`/rezerwacja?serviceId=${s.id}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
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
    </div>
  );
}
