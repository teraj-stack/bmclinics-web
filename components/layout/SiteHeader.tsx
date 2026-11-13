'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CartIndicator from '@/components/cart/CartIndicator';
import { Phone, Calendar, Menu, X } from 'lucide-react';

function PatientZoneHeartIcon({ className }: { className?: string }) {
  return (
    <picture className={className}>
      <source srcSet="/brand/icon-strefa-serce.webp" type="image/webp" />
      <img
        src="/brand/icon-strefa-serce.png"
        alt=""
        width={56}
        height={51}
        decoding="async"
        className="h-full w-full object-contain drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)]"
        draggable={false}
        aria-hidden
      />
    </picture>
  );
}

const links = [
  { href: '/uslugi/proktologia', label: 'Proktologia', metal: 'bg-[var(--metal-gold)]' },
  { href: '/uslugi/zylaki-naczynka', label: 'Żylaki i naczynka', metal: 'led-dot-navy' },
  { href: '/uslugi/chirurgia-ogolna', label: 'Chirurgia Ogólna', metal: 'led-dot-lavender' },
  { href: '/cennik', label: 'Cennik' },
  { href: '/sklep', label: 'Sklep zabiegowy' },
  { href: '/o-nas', label: 'O nas' },
  { href: '/kontakt', label: 'Kontakt' },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (pathname?.startsWith('/cml')) return null;

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Black glass — image logo left; wallpaper reads through frost */}
      <div className="site-header-glass">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5">
          <Link href="/" className="shrink-0" aria-label="Bujok Medical — strona główna">
            <picture>
              <source srcSet="/brand/logo-bujok-medical-header.webp" type="image/webp" />
              <img
                src="/brand/logo-bujok-medical-header.png"
                alt="Bujok Medical"
                width={140}
                height={140}
                className="h-11 w-auto object-contain sm:h-12"
                decoding="async"
                draggable={false}
              />
            </picture>
          </Link>

          <nav className="hidden items-center gap-0.5 text-[13px] font-medium tracking-[-0.01em] lg:flex">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative rounded-lg px-3 py-2 transition-all ${
                    isActive
                      ? 'bg-white/10 text-[var(--metal-chrome)]'
                      : 'text-[var(--metal-steel)] hover:bg-white/5 hover:text-[var(--metal-chrome)]'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {link.metal && (
                      <span className={`h-1.5 w-1.5 rounded-full ${link.metal} opacity-80`} />
                    )}
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/logowanie"
              className="inline-flex items-center gap-1 text-[11px] font-medium tracking-[-0.01em] text-[var(--metal-steel)] transition hover:text-[var(--metal-chrome)] sm:gap-1.5 sm:text-[12px]"
              aria-label="Strefa Pacjenta"
            >
              <span className="h-4 w-4 shrink-0 sm:h-[18px] sm:w-[18px]" aria-hidden>
                <PatientZoneHeartIcon className="block h-full w-full" />
              </span>
              <span className="hidden sm:inline">Strefa Pacjenta</span>
            </Link>

            <CartIndicator />

            <Link
              href="/rezerwacja"
              className="btn-gold inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium sm:gap-1.5 sm:rounded-lg sm:px-2.5 sm:py-1 sm:text-[12px]"
            >
              <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span className="sm:hidden">Wizyta</span>
              <span className="hidden sm:inline">Umów wizytę</span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="metal-chrome-edge rounded-xl p-2 text-[var(--metal-chrome)] transition hover:bg-white/5 lg:hidden"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="space-y-3 border-t border-white/20 px-4 py-4 lg:hidden">
            <nav className="flex flex-col gap-1 text-[15px] font-medium">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 transition ${
                      isActive
                        ? 'bg-white/10 font-medium text-[var(--metal-gold)]'
                        : 'text-[var(--metal-steel)] hover:bg-white/5 hover:text-[var(--metal-chrome)]'
                    }`}
                  >
                    {link.metal && <span className={`h-2 w-2 rounded-full ${link.metal}`} />}
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <div className="flex flex-col gap-2 border-t border-white/10 pt-2">
              <Link
                href="/rezerwacja"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-gold flex items-center justify-center gap-1.5 rounded-lg py-2 text-center text-[13px] font-medium"
              >
                <Calendar className="h-3.5 w-3.5" />
                Zarezerwuj termin online
              </Link>
              <a
                href="tel:+48510432361"
                className="metal-gold-edge flex items-center justify-center gap-2 rounded-xl py-2.5 text-center text-sm font-medium text-[var(--metal-chrome)]"
              >
                <Phone className="h-4 w-4 text-[var(--metal-gold)]" />
                Zadzwoń: +48 510 432 361
              </a>
              <Link
                href="/logowanie"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-lg py-2 text-center text-[13px] font-medium text-[var(--metal-steel)] transition hover:bg-white/5"
              >
                <span className="h-5 w-5 shrink-0" aria-hidden>
                  <PatientZoneHeartIcon className="block h-full w-full" />
                </span>
                Strefa Pacjenta
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
