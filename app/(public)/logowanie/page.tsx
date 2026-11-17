'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Edit3,
  LayoutDashboard,
  Stethoscope,
  UserCheck,
  LogOut,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function LogowaniePage() {
  const { data: session, status: sessionStatus } = useSession();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');
    try {
      const result = await signIn('email', { email, redirect: false, callbackUrl: '/pacjent' });
      if (result?.ok) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage('Logowanie e-mail jest niedostępne. Skontaktuj się z administratorem.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Nie udało się wysłać linku logowania.');
    }
  }

  return (
    <main className="mx-auto max-w-xl space-y-8 px-4 py-14">
      <div className="space-y-2">
        <p className="text-brushed-gold text-[11px] font-medium tracking-[0.2em] uppercase">
          Strefa Autoryzacji & CMS Online
        </p>
        <h1 className="font-[family-name:var(--font-fraunces)] text-3xl font-light tracking-[-0.02em]">
          Logowanie do systemu BM Clinics
        </h1>
        <p className="text-sm opacity-75">
          Podaj adres e-mail przypisany do konta. System wyśle link logowania, jeżeli obsługa e-mail została skonfigurowana.
        </p>
      </div>

      {sessionStatus === 'authenticated' && session?.user ? (
        <div className="metal-gold-edge space-y-5 rounded-2xl bg-[#181612] p-6 text-white shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#d4af37]/20 px-3 py-1 text-xs font-medium text-[#f4e7c3]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#d4af37]" />
                Zalogowano ({session.user.role})
              </span>
              <p className="mt-2 text-lg font-medium">{session.user.email}</p>
            </div>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/logowanie' })}
              className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-zinc-300 transition hover:bg-white/10"
            >
              <LogOut className="h-3.5 w-3.5" />
              Wyloguj
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link
              href="/?edit=1"
              className="btn-gold flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-semibold text-black"
            >
              <span className="flex items-center gap-2">
                <Edit3 className="h-4 w-4" />
                Edytuj stronę na żywo
              </span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/admin"
              className="metal-chrome-edge flex items-center justify-between rounded-xl bg-white/5 px-4 py-3.5 text-sm font-medium text-white transition hover:bg-white/10"
            >
              <span className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4 text-[#d4af37]" />
                Panel Admina i Usług
              </span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/lekarz"
              className="metal-chrome-edge flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 text-sm font-medium text-zinc-200 transition hover:bg-white/10"
            >
              <span className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-[#d4af37]" />
                Panel Lekarza
              </span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/pacjent"
              className="metal-chrome-edge flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 text-sm font-medium text-zinc-200 transition hover:bg-white/10"
            >
              <span className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-[#d4af37]" />
                Strefa Pacjenta
              </span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Standard form */}
          <form
            onSubmit={onSubmit}
            className="glass-card space-y-4 rounded-2xl border p-6"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <div className="space-y-1.5">
              <label className="block text-xs font-medium opacity-80">Adres e-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Adres e-mail"
                className="w-full rounded-xl border bg-transparent p-3 text-sm"
                style={{ borderColor: 'var(--border-color)' }}
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-gold w-full rounded-xl px-4 py-3.5 text-sm font-semibold"
            >
              {status === 'loading' ? 'Logowanie...' : 'Wyślij bezpieczny link logowania'}
            </button>

            {status === 'success' && <p className="text-sm text-green-500">Sprawdź skrzynkę pocztową, aby dokończyć logowanie.</p>}
            {status === 'error' && <p className="text-sm text-red-500">{errorMessage}</p>}
          </form>
        </div>
      )}
    </main>
  );
}
