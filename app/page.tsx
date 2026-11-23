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

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <h1 className="sr-only">BMClinic — klinika chirurgiczna</h1>

      <ZakresCareSection />

      {/* Standard + NAP — near-black titanium ground + chrome/gold metal plates */}
      <section className="relative border-y border-[var(--metal-aluminium-deep)]/25 bg-[#1d1b16] px-4 py-20 text-[var(--metal-chrome)] led-hairline-navy">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-5">
            <p className="text-brushed-gold text-[11px] font-medium uppercase tracking-[0.2em]">
              Standard BMClinic
            </p>
            <h2 className="text-graphite-polished font-[family-name:var(--font-fraunces)] text-3xl font-light leading-tight tracking-[-0.03em] sm:text-4xl">
              Zabiegi ambulatoryjne bez długiej hospitalizacji
            </h2>
            <p className="max-w-md text-sm font-light leading-relaxed text-[var(--metal-steel)]">
              Jan Bujok łączy doświadczenie kliniczne z wygodą rezerwacji online. Procedury w
              znieczuleniu miejscowym — powrót do domu tego samego dnia.
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
                Pełny cennik
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="metal-gold-edge led-ambient-navy rounded-2xl bg-gradient-to-br from-white/[0.06] to-transparent p-8 backdrop-blur-sm">
            <div className="led-icon-ring inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--metal-gold)]/15 text-[var(--metal-gold)]">
              <Award className="h-4 w-4" />
            </div>
            <h3 className="text-liquid-chrome mt-5 font-[family-name:var(--font-fraunces)] text-2xl font-light tracking-[-0.02em]">
              Konsultacja z chirurgiem
            </h3>
            <p className="mt-3 text-sm font-light leading-relaxed text-[var(--metal-steel)]">
              Jan Bujok odpowiada w sprawie kwalifikacji do zabiegów i przygotowania do badań.
            </p>

            <div className="metal-titanium-edge mt-7 space-y-3 rounded-xl bg-black/25 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="flex items-center gap-2 font-light text-[var(--metal-steel)]">
                  <PhoneCall className="h-4 w-4 text-[var(--metal-gold)]" />
                  Rejestracja
                </span>
                <a
                  href="tel:+48510432361"
                  className="text-brushed-gold font-medium transition hover:opacity-90"
                >
                  +48 510 432 361
                </a>
              </div>
              <div className="flex flex-wrap items-start justify-between gap-2 border-t border-white/8 pt-3 text-sm">
                <span className="flex items-center gap-2 font-light text-[var(--metal-steel)]">
                  <MapPin className="h-4 w-4 text-[var(--metal-gold)]" />
                  Adres
                </span>
                <span className="text-right font-light text-[var(--metal-aluminium)]">
                  Warszawa Wilanów
                  <br />
                  ul. Branickiego 10/U6
                </span>
              </div>
            </div>

            <Link
              href="/rezerwacja"
              className="btn-gold mt-7 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm"
            >
              <Calendar className="h-4 w-4" />
              Zarezerwuj konsultację
            </Link>
          </div>
        </div>
      </section>

      <section className="relative px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h3 className="text-graphite-polished font-[family-name:var(--font-fraunces)] text-3xl font-light tracking-[-0.03em]">
            Gotowy na wizytę?
          </h3>
          <p className="mt-3 text-sm font-light text-[var(--text-muted)]">
            Wybierz usługę, sprawdź terminy i umów wizytę w kilka minut.
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
