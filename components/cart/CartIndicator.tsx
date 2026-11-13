'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from './CartProvider';

export default function CartIndicator() {
  const { items } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const count = mounted ? items.reduce((sum, i) => sum + i.quantity, 0) : 0;

  return (
    <Link
      href="/sklep/koszyk"
      className="relative flex items-center gap-2 rounded-xl border border-white/25 bg-black/35 px-3 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-md transition hover:border-amber-400/60 hover:bg-black/50"
    >
      <picture className="shrink-0">
        <source srcSet="/brand/icon-koszyk-health.webp" type="image/webp" />
        <img
          src="/brand/icon-koszyk-health.png"
          alt=""
          className="h-5 w-5 object-contain"
          width={20}
          height={20}
        />
      </picture>
      <span className="hidden sm:inline">Koszyk</span>
      {count > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1 text-[11px] font-bold text-slate-950">
          {count}
        </span>
      )}
    </Link>
  );
}
