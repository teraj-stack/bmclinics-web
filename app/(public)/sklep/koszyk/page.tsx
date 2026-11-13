'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/cart/CartProvider';
import { Trash2, Plus, Minus, ShieldCheck, CreditCard, ArrowLeft } from 'lucide-react';

export default function KoszykPage() {
  const { items, removeItem, updateQuantity, clear, totalGrosze } = useCart();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  async function checkout() {
    if (!email || items.length === 0) return;
    setStatus('loading');

    try {
      const res = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ serviceId: i.serviceId, quantity: i.quantity })),
          email,
        }),
      });

      if (!res.ok) {
        setStatus('error');
        return;
      }

      const data = await res.json();
      if (data.demo) {
        clear();
      }
      window.location.href = data.paymentUrl;
    } catch {
      setStatus('error');
    }
  }

  if (items.length === 0) {
    return (
      <main className="min-h-[calc(100vh-12rem)] bg-[#f4f2ee] dark:bg-[#0b0c0e] py-12 px-4 sm:px-6 flex items-center justify-center">
        <div className="koszyk-empty-plate relative mx-auto w-full max-w-3xl overflow-hidden rounded-3xl p-8 sm:p-14 text-center">
          <div className="koszyk-empty-plate__bg" aria-hidden="true">
            <picture>
              <source srcSet="/brand/wallpaper-koszyk-empty.webp" type="image/webp" />
              <img
                src="/brand/wallpaper-koszyk-empty.png"
                alt=""
                className="koszyk-empty-plate__texture"
                width={1024}
                height={559}
                decoding="async"
              />
            </picture>
          </div>

          <div className="relative z-10 mx-auto flex max-w-lg flex-col items-center">
            <div className="koszyk-empty-icon-shell mb-6 flex h-24 w-24 items-center justify-center rounded-2xl">
              <picture>
                <source srcSet="/brand/icon-koszyk-empty-health.webp" type="image/webp" />
                <img
                  src="/brand/icon-koszyk-empty-health.png"
                  alt="Pusty koszyk"
                  className="h-16 w-16 object-contain drop-shadow-md"
                  width={96}
                  height={96}
                />
              </picture>
            </div>

            <h1 className="text-graphite-polished font-[family-name:var(--font-fraunces)] text-2xl sm:text-3xl font-semibold tracking-tight">
              Twój Koszyk Jest Pusty
            </h1>

            <p className="mt-3 text-xs sm:text-sm text-[#4a4d52] dark:text-slate-300 leading-relaxed max-w-md">
              Nie dodałeś jeszcze żadnych zabiegów ani voucherów do zamówienia.
            </p>

            <div className="mt-7">
              <Link
                href="/sklep"
                className="btn-gold inline-flex items-center gap-2 rounded-xl px-6 py-3 text-xs sm:text-sm font-semibold"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Wróć do sklepu zabiegowego</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#0b1324] py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              Sklep Zabiegowy BM Clinics
            </span>
            <h1 className="mt-1 font-[family-name:var(--font-fraunces)] text-3xl font-bold text-slate-900 dark:text-white">
              Twój Koszyk ({items.reduce((sum, i) => sum + i.quantity, 0)})
            </h1>
          </div>
          <Link
            href="/sklep"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Kontynuuj zakupy
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.serviceId}
                className="glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5"
              >
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Cena jednostkowa: {(item.priceGrosze / 100).toFixed(2)} zł
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="flex items-center rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                    <button
                      type="button"
                      onClick={() =>
                        item.quantity > 1
                          ? updateQuantity(item.serviceId, item.quantity - 1)
                          : removeItem(item.serviceId)
                      }
                      className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                      aria-label="Zmniejsz ilość"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-900 dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.serviceId, item.quantity + 1)}
                      className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                      aria-label="Zwiększ ilość"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <span className="min-w-[90px] text-right font-bold text-sm text-slate-900 dark:text-white">
                    {((item.priceGrosze * item.quantity) / 100).toFixed(2)} zł
                  </span>

                  <button
                    type="button"
                    onClick={() => removeItem(item.serviceId)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-red-500/10 hover:text-red-600 transition"
                    aria-label="Usuń z koszyka"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-card p-6 space-y-5 h-fit">
            <h2 className="font-[family-name:var(--font-fraunces)] text-xl font-bold text-slate-900 dark:text-white">
              Podsumowanie
            </h2>

            <div className="space-y-2 border-b border-slate-200 pb-4 text-xs dark:border-slate-800">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Wartość zabiegów</span>
                <span>{(totalGrosze / 100).toFixed(2)} zł</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Ważność vouchera</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">12 miesięcy</span>
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Do zapłaty:</span>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {(totalGrosze / 100).toFixed(2)} zł
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Adres e-mail do wysyłki potwierdzenia i vouchera
                <input
                  type="email"
                  required
                  placeholder="twoj@email.pl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                />
              </label>

              <button
                type="button"
                onClick={checkout}
                disabled={status === 'loading' || !email}
                className="btn-gold w-full flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-xs sm:text-sm font-semibold disabled:opacity-40"
              >
                <CreditCard className="h-4 w-4" />
                <span>
                  {status === 'loading'
                    ? 'Przekierowywanie...'
                    : 'Przejdź do płatności (Przelewy24)'}
                </span>
              </button>

              {status === 'error' && (
                <p className="text-xs font-semibold text-red-600">
                  Nie udało się rozpocząć płatności. Sprawdź adres e-mail i spróbuj ponownie.
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-500 dark:text-slate-400">
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" />
              <span>Bezpieczna płatność szyfrowana SSL (BLIK, karta, szybki przelew)</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
