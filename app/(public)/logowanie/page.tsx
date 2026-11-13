'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const [email, setEmail] = useState('mlasers0110@icloud.com');
  const [role, setRole] = useState<'ADMIN' | 'DOCTOR' | 'PATIENT'>('ADMIN');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleLogin(
    targetEmail: string,
    targetRole: 'ADMIN' | 'DOCTOR' | 'PATIENT',
    redirectTo?: string
  ) {
    setStatus('loading');
    setErrorMessage('');
    try {
      const result = await signIn('credentials', {
        email: targetEmail,
        role: targetRole,
        redirect: false,
      });

      if (result?.ok) {
        setStatus('success');
        router.refresh();
        if (redirectTo) {
          router.push(redirectTo);
        }
      } else {
        setStatus('error');
        setErrorMessage('Nie udało się zalogować. Spróbuj ponownie.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Wystąpił błąd połączenia podczas logowania.');
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const defaultRedirect =
      role === 'ADMIN' ? '/admin' : role === 'DOCTOR' ? '/lekarz' : '/pacjent';
    await handleLogin(email, role, defaultRedirect);
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
          Zaloguj się na konto właściciela (<strong>mlasers0110@icloud.com</strong>), aby zarządzać
          kliniką, cennikiem oraz edytować stronę na żywo w przeglądarce i przez CLI.
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
          {/* Quick 1-click access cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <button
              type="button"
              disabled={status === 'loading'}
              onClick={() => handleLogin('mlasers0110@icloud.com', 'ADMIN', '/admin')}
              className="metal-gold-edge flex flex-col items-start justify-between rounded-xl bg-[#181612] p-4 text-left text-white transition hover:bg-[#221f19]"
            >
              <Sparkles className="h-5 w-5 text-[#d4af37]" />
              <div className="mt-3">
                <p className="text-xs font-semibold text-[#f4e7c3]">Właściciel / Admin</p>
                <p className="mt-0.5 text-[11px] text-zinc-400">mlasers0110@icloud.com</p>
              </div>
            </button>

            <button
              type="button"
              disabled={status === 'loading'}
              onClick={() => handleLogin('mlasers0110@icloud.com', 'ADMIN', '/?edit=1')}
              className="metal-chrome-edge flex flex-col items-start justify-between rounded-xl bg-[#181612] p-4 text-left text-white transition hover:bg-[#221f19]"
            >
              <Edit3 className="h-5 w-5 text-[#d4af37]" />
              <div className="mt-3">
                <p className="text-xs font-semibold text-white">Edytor na żywo</p>
                <p className="mt-0.5 text-[11px] text-zinc-400">Edytuj teksty i cennik</p>
              </div>
            </button>

            <button
              type="button"
              disabled={status === 'loading'}
              onClick={() => handleLogin('jan.bujok@bmclinic.net', 'DOCTOR', '/lekarz')}
              className="metal-chrome-edge flex flex-col items-start justify-between rounded-xl bg-[#181612] p-4 text-left text-white transition hover:bg-[#221f19]"
            >
              <Stethoscope className="h-5 w-5 text-[#d4af37]" />
              <div className="mt-3">
                <p className="text-xs font-semibold text-white">Panel Lekarza</p>
                <p className="mt-0.5 text-[11px] text-zinc-400">dr Jan Bujok</p>
              </div>
            </button>
          </div>

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

            <div className="space-y-1.5">
              <label className="block text-xs font-medium opacity-80">Tryb dostępu</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'ADMIN' | 'DOCTOR' | 'PATIENT')}
                className="w-full rounded-xl border bg-transparent p-3 text-sm"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <option value="ADMIN">Administrator & Edytor CMS (Pełny dostęp)</option>
                <option value="DOCTOR">Lekarz (Kalendarz i Wizyty)</option>
                <option value="PATIENT">Pacjent (Moje wizyty i Profil)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-gold w-full rounded-xl px-4 py-3.5 text-sm font-semibold"
            >
              {status === 'loading' ? 'Logowanie...' : 'Zaloguj się i przejdź do panelu'}
            </button>

            {status === 'error' && <p className="text-sm text-red-500">{errorMessage}</p>}
          </form>
        </div>
      )}
    </main>
  );
}
