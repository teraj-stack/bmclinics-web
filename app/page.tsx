import Link from 'next/link';
import {
  Calendar,
  ShieldCheck,
  Award,
  Clock,
  ChevronRight,
  PhoneCall,
  MapPin,
} from 'lucide-react';
import ZakresCareSection from '@/components/home/ZakresCareSection';
import { getCmsState } from '@/lib/cmsStore';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const { siteConfig } = getCmsState();

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <h1 className="sr-only" data-cms-field="clinicName">
        {siteConfig.clinicName}
      </h1>

      <ZakresCareSection initialConfig={siteConfig} />

      {/* Standard + NAP — near-black titanium ground + chrome/gold metal plates */}
      <section className="relative border-y border-[var(--metal-aluminium-deep)]/25 bg-[#1d1b16] px-4 py-20 text-[var(--metal-chrome)] led-hairline-navy">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-5">
            <p
              data-cms-field="standardEyebrow"
              className="text-brushed-gold text-[11px] font-medium uppercase tracking-[0.2em]"
            >
              {siteConfig.standardEyebrow}
            </p>
            <h2
              data-cms-field="standardTitle"
              className="text-graphite-polished font-[family-name:var(--font-fraunces)] text-3xl font-light leading-tight tracking-[-0.03em] sm:text-4xl"
            >
              {siteConfig.standardTitle}
            </h2>
            <p
              data-cms-field="standardBody"
              className="max-w-md text-sm font-light leading-relaxed text-[var(--metal-steel)]"
            >
              {siteConfig.standardBody}
            </p>

            <hr className="metal-divider max-w-md border-0" />

            <div className="grid gap-3 pt-2 sm:grid-cols-2">
              <div className="metal-chrome-edge rounded-xl bg-white/[0.03] p-4 led-ambient-navy">
                <div className="led-icon-ring inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--metal-gold)]/15 text-[var(--metal-gold)]">
                  <Clock className="h-4 w-4" />
                </div>
                <h4 className="mt-3 text-sm font-medium tracking-tight">Kalendarz na żywo</h4>
                <p className="mt-1 text-xs font-light text-[var(--metal-steel-cool)]">
                  Terminy z kalendarza chirurga.
                </p>
              </div>
              <div className="metal-titanium-edge rounded-xl bg-white/[0.03] p-4 led-ambient-lavender">
                <div className="led-icon-ring inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--metal-steel)]/15 text-[var(--metal-steel)]">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <h4 className="mt-3 text-sm font-medium tracking-tight">Przelewy24</h4>
                <p className="mt-1 text-xs font-light text-[var(--metal-steel-cool)]">
                  Zakup i opłata zabiegu online.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/cennik"
                className="metal-chrome-edge inline-flex items-center gap-2 rounded-xl bg-white/[0.04] px-6 py-3 text-sm font-medium text-[var(--metal-chrome)] transition hover:border-[var(--metal-gold)]/40"
              >
                <span>Pełny cennik</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="metal-gold-edge led-ambient-navy rounded-2xl bg-gradient-to-br from-white/[0.06] to-transparent p-8 backdrop-blur-sm">
            <div className="led-icon-ring inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--metal-gold)]/15 text-[var(--metal-gold)]">
              <Award className="h-4 w-4" />
            </div>
            <h3
              data-cms-field="consultTitle"
              className="text-liquid-chrome mt-5 font-[family-name:var(--font-fraunces)] text-2xl font-light tracking-[-0.02em]"
            >
              {siteConfig.consultTitle}
            </h3>
            <p
              data-cms-field="consultBody"
              className="mt-3 text-sm font-light leading-relaxed text-[var(--metal-steel)]"
            >
              {siteConfig.consultBody}
            </p>

            <div className="metal-titanium-edge mt-7 space-y-3 rounded-xl bg-black/25 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="flex items-center gap-2 font-light text-[var(--metal-steel)]">
                  <PhoneCall className="h-4 w-4 text-[var(--metal-gold)]" />
                  <span>Rejestracja</span>
                </span>
                <a
                  href={`tel:${siteConfig.phone.replace(/\s+/g, '')}`}
                  data-cms-field="phone"
                  className="text-brushed-gold font-medium transition hover:opacity-90"
                >
                  {siteConfig.phone}
                </a>
              </div>
              <div className="flex flex-wrap items-start justify-between gap-2 border-t border-white/8 pt-3 text-sm">
                <span className="flex items-center gap-2 font-light text-[var(--metal-steel)]">
                  <MapPin className="h-4 w-4 text-[var(--metal-gold)]" />
                  <span>Adres</span>
                </span>
                <span className="text-right font-light text-[var(--metal-aluminium)]">
                  <span data-cms-field="addressLine1">{siteConfig.addressLine1}</span>
                  <br />
                  <span data-cms-field="addressLine2">{siteConfig.addressLine2}</span>
                </span>
              </div>
            </div>

            <Link
              href="/rezerwacja"
              className="btn-gold mt-7 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm"
            >
              <Calendar className="h-4 w-4" />
              <span>Zarezerwuj konsultację</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="relative px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h3
            data-cms-field="ctaTitle"
            className="text-graphite-polished font-[family-name:var(--font-fraunces)] text-3xl font-light tracking-[-0.03em]"
          >
            {siteConfig.ctaTitle}
          </h3>
          <p
            data-cms-field="ctaSubtitle"
            className="mt-3 text-sm font-light text-[var(--text-muted)]"
          >
            {siteConfig.ctaSubtitle}
          </p>
          <hr className="metal-divider mx-auto mt-6 max-w-xs border-0" />
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/rezerwacja" className="btn-gold rounded-xl px-8 py-3.5 text-sm">
              Rezerwacja online
            </Link>
            <Link
              href="/kontakt"
              className="metal-chrome-edge rounded-xl bg-transparent px-6 py-3.5 text-sm font-medium text-[var(--text-primary)] transition hover:bg-black/[0.03] dark:hover:bg-white/5"
            >
              Napisz do nas
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
