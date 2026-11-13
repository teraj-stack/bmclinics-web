'use client';

import { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/kontakt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.get('name'),
          email: form.get('email'),
          message: form.get('message'),
        }),
      });
      setStatus(res.ok ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center space-y-3">
        <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
        <h3 className="font-bold text-lg text-slate-900 dark:text-white">Wiadomość Wysłana!</h3>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          Dziękujemy za kontakt. Nasz zespół odpowie na Twój e-mail najszybciej jak to możliwe.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
          Imię i nazwisko
        </label>
        <input
          name="name"
          required
          placeholder="np. Jan Kowalski"
          className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 focus:border-amber-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
          Adres e-mail
        </label>
        <input
          name="email"
          type="email"
          required
          placeholder="np. jan.kowalski@email.pl"
          className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 focus:border-amber-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
          Treść pytania lub zapytania
        </label>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Opisz krótko sprawę lub zapytanie dotyczące zabiegu..."
          className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 focus:border-amber-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn-gold flex w-full items-center justify-center gap-2 py-3.5 rounded-xl text-sm shadow-md transition disabled:opacity-40"
      >
        <Send className="h-4 w-4" />
        <span>{status === 'loading' ? 'Wysyłanie...' : 'Wyślij wiadomość'}</span>
      </button>

      {status === 'error' && (
        <p className="text-xs font-semibold text-red-600 text-center">
          Wystąpił błąd podczas wysyłania. Spróbuj ponownie.
        </p>
      )}
    </form>
  );
}
