'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';

type SpecialtyTone = 'proktologia' | 'zylaki' | 'chirurgia';

type Specialty = {
  href: string;
  title: string;
  blurb: string;
  price: string;
  tone: SpecialtyTone;
};

const SPECIALTIES: Specialty[] = [
  {
    href: '/uslugi/proktologia',
    title: 'Proktologia',
    blurb:
      'Diagnostyka i małoinwazyjne leczenie chorób odbytu i odbytnicy. Hemoroidy, szczeliny, anoskopia.',
    price: 'od 200 zł',
    tone: 'proktologia',
  },
  {
    href: '/uslugi/zylaki-naczynka',
    title: 'Żylaki i naczynka',
    blurb: 'Flebologia: USG Doppler, laserowe zamykanie naczynek oraz skleroterapia żylaków.',
    price: 'od 180 zł',
    tone: 'zylaki',
  },
  {
    href: '/uslugi/chirurgia-ogolna',
    title: 'Chirurgia ogólna',
    blurb: 'Znamiona, tłuszczaki, torbiele oraz wrastające paznokcie — z oceną histopatologiczną.',
    price: 'od 180 zł',
    tone: 'chirurgia',
  },
];

/** Bust browser cache when lobby hero assets are replaced. */
const LOBBY_HERO_V = '?v=20260809d';
/** Bust when Proktologia metal sheet is replaced. */
const PROKTOLOGIA_METAL_V = '?v=20260809metal1';
const PROKTOLOGIA_METAL_SRC = `/brand/plate-proktologia-brushed-metal.webp${PROKTOLOGIA_METAL_V}`;
/** Bust when Żylaki diagonal navy/steel sheet is replaced. */
const ZYLAKI_METAL_V = '?v=20260809zylaki3';
const ZYLAKI_METAL_SRC = `/brand/plate-zylaki-vein-carpet.webp${ZYLAKI_METAL_V}`;
/** Bust when Chirurgia bright-steel sheet is replaced. */
const CHIRURGIA_METAL_V = '?v=20260809chirurgia1';
const CHIRURGIA_METAL_SRC = `/brand/plate-chirurgia-bright-steel.webp${CHIRURGIA_METAL_V}`;

type MetalPlateFace = {
  src: string;
  backgroundColor: string;
};

function metalFaceForTone(tone: SpecialtyTone): MetalPlateFace | null {
  if (tone === 'proktologia') {
    return { src: PROKTOLOGIA_METAL_SRC, backgroundColor: '#0a1a14' };
  }
  if (tone === 'zylaki') {
    return { src: ZYLAKI_METAL_SRC, backgroundColor: '#0a1420' };
  }
  if (tone === 'chirurgia') {
    return { src: CHIRURGIA_METAL_SRC, backgroundColor: '#9aa3ad' };
  }
  return null;
}

function LobbyPicture({ className }: { className?: string }) {
  return (
    <picture className={className}>
      <source
        media="(max-width: 767px)"
        srcSet={`/brand/hero-clinic-lobby-sm.webp${LOBBY_HERO_V}`}
        type="image/webp"
      />
      <source srcSet={`/brand/hero-clinic-lobby.webp${LOBBY_HERO_V}`} type="image/webp" />
      <img
        src={`/brand/hero-clinic-lobby.jpg${LOBBY_HERO_V}`}
        alt=""
        decoding="async"
        className="h-full w-full object-cover object-center"
        draggable={false}
      />
    </picture>
  );
}

function ZakresWindowCard({
  specialty,
  expanded,
  onToggle,
  panelId,
}: {
  specialty: Specialty;
  expanded: boolean;
  onToggle: () => void;
  panelId: string;
}) {
  const metalFace = metalFaceForTone(specialty.tone);

  return (
    <div
      id={panelId}
      className={`zakres-glass zakres-glass--${specialty.tone} group${expanded ? ' is-expanded' : ''}`}
      style={
        metalFace
          ? {
              backgroundColor: metalFace.backgroundColor,
              backgroundImage: `url('${metalFace.src}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }
          : undefined
      }
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      aria-label={`${specialty.title}: ${expanded ? 'zwiń kafelek' : 'unieś i powiększ kafelek'}`}
      onClick={onToggle}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onToggle();
        }
      }}
    >
      {metalFace ? (
        /* Explicit metal face — not lobby photo; stays under chrome/scrim */
        <div className="zakres-metal-face" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={metalFace.src}
            alt=""
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-center"
            draggable={false}
          />
        </div>
      ) : (
        /* Static lobby texture — no scroll parallax */
        <div className="zakres-window-screen" aria-hidden>
          <div className="zakres-window-photo">
            <LobbyPicture className="absolute inset-0 block h-full w-full" />
          </div>
        </div>
      )}
      {/* Metal plates: light bottom scrim only so texture stays visible */}
      <div
        className={
          metalFace ? 'zakres-window-frost zakres-window-frost--metal' : 'zakres-window-frost'
        }
        aria-hidden
      />

      <div className="zakres-window-chrome">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/icon-zakres-mark.svg"
            alt=""
            width={40}
            height={40}
            className="h-7 w-7 sm:h-9 sm:w-9"
            draggable={false}
          />
          <h3 className="zakres-plate-title font-[family-name:var(--font-fraunces)] font-light tracking-[-0.02em]">
            {specialty.title}
          </h3>
          <p className="zakres-plate-body font-light leading-snug">{specialty.blurb}</p>
        </div>
        <div className="zakres-window-foot flex items-center justify-between border-t border-black/25">
          <span className="zakres-plate-meta text-[0.65rem] font-medium sm:text-xs">{specialty.price}</span>
          <Link
            href={specialty.href}
            className="zakres-plate-meta inline-flex items-center gap-1.5 text-xs font-medium sm:gap-2 sm:text-sm"
            onClick={(event) => event.stopPropagation()}
          >
            Zabiegi
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/icon-zakres-go.svg"
              alt=""
              width={22}
              height={22}
              className="h-3.5 w-3.5 opacity-95 transition group-hover:translate-x-0.5 sm:h-[1.15rem] sm:w-[1.15rem]"
              draggable={false}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Stack: (1) full-bleed lobby hero — photo only, one viewport;
 * (2) one shared black kafelek (`.zakres-segment`) with heading + three
 *     specialty plates — tinted glass fills, no window parallax.
 * Plates: Figma 3D UI Perspective floating-plate lift on select.
 */
export default function ZakresCareSection() {
  const [expandedTone, setExpandedTone] = useState<SpecialtyTone | null>(null);
  const platesRef = useRef<HTMLDivElement>(null);
  const baseId = useId();

  useEffect(() => {
    if (expandedTone === null) return;

    const onPointerDown = (event: PointerEvent) => {
      const root = platesRef.current;
      if (!root) return;
      if (event.target instanceof Node && !root.contains(event.target)) {
        setExpandedTone(null);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setExpandedTone(null);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [expandedTone]);

  return (
    <>
      {/* Screen 1 — full-bleed lobby wallpaper only; no frame/inset card */}
      <section
        className="relative h-[100dvh] min-h-[100dvh] w-full overflow-hidden"
        data-home-hero
        aria-label="Gabinet BMClinic"
      >
        <div className="home-hero-media">
          <LobbyPicture className="block h-full w-full" />
        </div>
      </section>

      {/* Screen 2 — solid black band in document flow; no section-level lobby layer */}
      <section
        className={`relative overflow-visible bg-[#1d1b16] px-4 py-16 text-white sm:py-20${
          expandedTone ? ' has-expanded-plate' : ''
        }`}
        data-zakres-band
      >
        <div className="mx-auto w-full max-w-6xl overflow-visible">
          <div className="zakres-segment">
            <div className="zakres-segment-head max-w-xl">
              <p className="text-brushed-gold text-[10px] font-medium uppercase tracking-[0.2em] sm:text-[11px]">
                Zakres opieki
              </p>
              <h2 className="text-graphite-polished mt-1 font-[family-name:var(--font-fraunces)] text-2xl font-light tracking-[-0.03em] sm:text-3xl">
                Trzy ścieżki kliniczne
              </h2>
            </div>

            <div
              ref={platesRef}
              className="zakres-plates mt-8 grid gap-8 sm:mt-10 sm:gap-10 lg:gap-12"
            >
              {SPECIALTIES.map((s) => (
                <ZakresWindowCard
                  key={s.href}
                  specialty={s}
                  expanded={expandedTone === s.tone}
                  panelId={`${baseId}-${s.tone}`}
                  onToggle={() =>
                    setExpandedTone((current) => (current === s.tone ? null : s.tone))
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
