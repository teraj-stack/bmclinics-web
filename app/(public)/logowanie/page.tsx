'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function LogowaniePage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = await signIn('email', { email, redirect: false, callbackUrl: '/' });
    setStatus(result?.ok ? 'sent' : 'error');
  }

  return (
    <main className="mx-auto max-w-md space-y-6 px-4 py-16">
      <h1 className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold">Logowanie</h1>
      <p className="text-sm opacity-70">
        Wyślemy link magiczny na podany adres e-mail — bez hasła.
      </p>

      {status === 'sent' ? (
        <p className="text-green-700">Sprawdź skrzynkę — wysłaliśmy link do logowania.</p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Adres e-mail"
            className="w-full rounded border p-2"
            style={{ borderColor: 'var(--border-color)' }}
          />
          <button
            type="submit"
            className="w-full rounded bg-[var(--text-primary)] px-4 py-2 text-[var(--bg-primary)]"
          >
            Wyślij link
          </button>
          {status === 'error' && <p className="text-red-600">Nie udało się wysłać linku.</p>}
        </form>
      )}
    </main>
  );
}
