import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, ShieldCheck, HeartPulse, ChevronRight } from 'lucide-react';

export default function SiteFooter() {
  return (
    <footer className="site-footer border-t border-[var(--metal-aluminium-deep)]/30 bg-[#0a0908] text-[var(--metal-steel)] led-hairline-navy">
      <div className="border-b border-white/6 bg-[#050504] py-8">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:grid-cols-3">
          <div className="metal-gold-edge led-ambient-navy flex items-center gap-4 rounded-xl bg-white/[0.03] p-4 backdrop-blur-sm">
            <div className="led-icon-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--metal-gold)]/12 text-[var(--metal-gold)]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-medium tracking-tight text-[var(--metal-chrome)]">
                Zabiegi 1-Dnia
              </h4>
              <p className="mt-0.5 text-xs font-light text-[var(--metal-steel-cool)]">
                Szybki powrót do domu po procedurach ambulatoryjnych
              </p>
            </div>
          </div>

          <div
            className="site-footer-chip site-footer-chip--jan metal-chrome-edge flex items-center gap-4 rounded-xl p-4 backdrop-blur-sm"
            tabIndex={0}
          >
            <div className="led-icon-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--metal-steel)]/15 text-[var(--metal-steel)]">
              <HeartPulse className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-medium tracking-tight text-[var(--metal-chrome)]">
                Jan Bujok
              </h4>
              <p className="mt-0.5 text-xs font-light text-[var(--metal-steel-cool)]">
                chirurg, flebolog, proktolog
              </p>
            </div>
          </div>

          <div className="metal-titanium-edge flex items-center gap-4 rounded-xl bg-white/[0.03] p-4 backdrop-blur-sm">
            <div className="led-icon-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--metal-champagne)]/12 text-[var(--metal-champagne)]">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-medium tracking-tight text-[var(--metal-chrome)]">
                Rezerwacja 24/7
              </h4>
              <p className="mt-0.5 text-xs font-light text-[var(--metal-steel-cool)]">
                Terminy online synchronizowane z kalendarzem
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Four footer blocks on brushed metal plate — plate hugs content band */}
      <div className="site-footer-metal-wrap mx-auto max-w-6xl px-4 py-5 sm:py-6">
        <div className="site-footer-metal">
          <div className="site-footer-metal__plate" aria-hidden="true">
            <picture>
              <source srcSet="/brand/footer-metal-plate.webp" type="image/webp" />
              <img
                src="/brand/footer-metal-plate.jpg"
                alt=""
                className="site-footer-metal__texture"
                width={900}
                height={352}
                decoding="async"
                loading="eager"
                fetchPriority="low"
              />
            </picture>
          </div>

          <div className="site-footer-metal__content px-3 py-4 sm:px-4 sm:py-5 lg:px-5 lg:py-5">
            <div className="site-footer-grid">
              <div className="site-footer-cell space-y-4">
                <span className="site-footer-brand font-[family-name:var(--font-fraunces)] text-2xl font-normal tracking-[-0.03em]">
                  BMClinic
                </span>
                <p className="site-footer-desc text-sm font-light leading-relaxed">
                  Specjalistyczna klinika chirurgii precyzyjnej. Proktologia, żylaki i naczynka oraz
                  chirurgia ogólna — Jan Bujok.
                </p>
                <div className="pt-1">
                  <Link
                    href="/rezerwacja"
                    className="btn-gold inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm"
                  >
                    Umów wizytę online
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="site-footer-cell space-y-4">
                <h3 className="text-brushed-gold text-[11px] font-medium uppercase tracking-[0.18em]">
                  Specjalizacje
                </h3>
                <ul className="space-y-2.5 text-sm font-light">
                  <li>
                    <Link
                      href="/uslugi/proktologia"
                      className="site-footer-link flex items-center gap-2 transition"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--metal-gold)]" />
                      Proktologia
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/uslugi/zylaki-naczynka"
                      className="site-footer-link flex items-center gap-2 transition"
                    >
                      <span className="led-dot-navy h-1.5 w-1.5 rounded-full" />
                      Żylaki i naczynka
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/uslugi/chirurgia-ogolna"
                      className="site-footer-link flex items-center gap-2 transition"
                    >
                      <span className="led-dot-lavender h-1.5 w-1.5 rounded-full" />
                      Chirurgia Ogólna
                    </Link>
                  </li>
                  <li>
                    <Link href="/cennik" className="site-footer-link transition">
                      Pełny cennik zabiegów
                    </Link>
                  </li>
                  <li>
                    <Link href="/sklep" className="site-footer-link transition">
                      Sklep zabiegowy online
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="site-footer-cell space-y-4">
                <h3 className="text-brushed-gold text-[11px] font-medium uppercase tracking-[0.18em]">
                  Klinika
                </h3>
                <ul className="space-y-2.5 text-sm font-light">
                  <li>
                    <Link href="/o-nas" className="site-footer-link transition">
                      O nas
                    </Link>
                  </li>
                  <li>
                    <Link href="/kontakt" className="site-footer-link transition">
                      Kontakt i dojazd
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" className="site-footer-link transition">
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className="site-footer-link transition">
                      Blog medyczny
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/logowanie"
                      className="site-footer-link site-footer-link--quiet transition"
                    >
                      Strefa Pacjenta
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="site-footer-cell space-y-4">
                <h3 className="text-brushed-gold text-[11px] font-medium uppercase tracking-[0.18em]">
                  Kontakt & godziny
                </h3>
                <div className="space-y-2.5 text-sm font-light">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 shrink-0 text-[var(--metal-gold)]" />
                    <span className="site-footer-link">
                      ul. Branickiego 10/U6
                      <br />
                      Warszawa Wilanów
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 shrink-0 text-[var(--metal-gold)]" />
                    <a
                      href="tel:+48510432361"
                      className="site-footer-link font-medium transition hover:text-[var(--metal-gold)]"
                    >
                      +48 510 432 361
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4 shrink-0 text-[var(--metal-gold)]" />
                    <a
                      href="mailto:kontakt@bujokmedical.pl"
                      className="site-footer-link transition"
                    >
                      kontakt@bujokmedical.pl
                    </a>
                  </div>
                  <div className="site-footer-hours pt-1 text-xs">
                    <p className="font-medium text-[#f0f2f5]">Godziny przyjęć</p>
                    <p>Poniedziałek – Piątek: 08:00 – 20:00</p>
                    <p>Sobota: Zamknięte</p>
                  </div>
                </div>
              </div>
            </div>

            <hr className="metal-divider mt-6 border-0" />
            <div className="site-footer-legal mt-4 flex flex-col items-center justify-between gap-3 text-xs font-light sm:flex-row">
              <p>© {new Date().getFullYear()} BM Clinics. Wszelkie prawa zastrzeżone.</p>
              <div className="flex flex-wrap justify-center gap-5">
                <Link href="/polityka" className="site-footer-legal__link transition">
                  Prywatność & RODO
                </Link>
                <Link href="/regulamin" className="site-footer-legal__link transition">
                  Regulamin
                </Link>
                <Link href="/lekarz" className="site-footer-legal__link transition">
                  Panel Lekarza
                </Link>
                <Link href="/admin" className="site-footer-legal__link transition">
                  Panel Admina
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
