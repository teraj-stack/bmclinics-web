import Link from 'next/link';
import { ShieldCheck, HeartPulse, Stethoscope, ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'O Nas — BM Clinics',
  description:
    'Poznaj klinikę BM Clinics — Jan Bujok, chirurg, specjalista chirurgii ogólnej, flebolog, proktolog. Wieloletnie doświadczenie i bezpieczeństwo zabiegów 1-Dnia.',
};

export default function ONasPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#0b1324] py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-16">
        {/* Hero Header */}
        <div className="rounded-3xl bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] p-8 sm:p-12 text-white shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-64 w-64 translate-x-16 -translate-y-16 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="relative z-10 max-w-3xl">
            <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">
              O Klinice Chirurgicznej BM Clinics
            </span>
            <h1 className="mt-2 font-[family-name:var(--font-fraunces)] text-3xl font-bold sm:text-4xl lg:text-5xl leading-tight">
              Precyzja chirurgiczna w komfortowych warunkach
            </h1>
            <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              BM Clinics powstało z myślą o pacjentach poszukujących natychmiastowej i bezbolesnej diagnostyki oraz zabiegów w formule 1-Dnia. Nasza praktyka koncentruje się wokół trzech zdefiniowanych obszarów klinicznych.
            </p>
          </div>
        </div>

        {/* 3 Pillars */}
        <div className="grid gap-8 sm:grid-cols-3">
          <div className="glass-card p-6 border-emerald-500/20">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
              <Stethoscope className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-[family-name:var(--font-fraunces)] text-xl font-bold text-slate-900 dark:text-white">
              Proktologia
            </h3>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Kompleksowe leczenie schorzeń odbytu z zachowaniem pełnej intymności i komfortu psychicznego pacjenta.
            </p>
          </div>

          <div className="glass-card p-6 border-sky-500/20">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold">
              <HeartPulse className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-[family-name:var(--font-fraunces)] text-xl font-bold text-slate-900 dark:text-white">
              Żylaki i Naczynka
            </h3>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Zabiegi naczyniowe pod kontrolą USG Doppler — skleroterapia oraz precyzyjna laseroterapia naczyniowa.
            </p>
          </div>

          <div className="glass-card p-6 border-purple-500/20">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-[family-name:var(--font-fraunces)] text-xl font-bold text-slate-900 dark:text-white">
              Chirurgia Ogólna
            </h3>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Drobna chirurgia skórna, usuwanie znamion i guzków ze stałą opieką pooperacyjną.
            </p>
          </div>
        </div>

        {/* Medical specialist */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold tracking-widest text-amber-600 uppercase dark:text-amber-400">
              Specjalista kliniki
            </span>
            <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-3xl font-bold text-slate-900 dark:text-white">
              Jan Bujok
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Chirurg z wieloletnim stażem szpitalnym i klinicznym.
            </p>
          </div>

          <div className="mx-auto max-w-md">
            <div className="glass-card p-6 space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-amber-400 font-bold text-xl shadow-md">
                JB
              </div>
              <div>
                <h4 className="font-bold text-lg text-slate-900 dark:text-white">Jan Bujok</h4>
                <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
                  chirurg, specjalista chirurgii ogólnej, flebolog, proktolog
                </p>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Autor licznych publikacji naukowych. Ekspert małoinwazyjnych metod leczenia choroby hemoroidalnej i chirurgii ambulatoryjnej.
              </p>
              <Link
                href="/rezerwacja"
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 dark:text-white hover:underline pt-2"
              >
                Umów wizytę u chirurga <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="rounded-3xl bg-slate-900 p-8 text-white text-center space-y-4">
          <h3 className="font-[family-name:var(--font-fraunces)] text-2xl font-bold">
            Zapraszamy na konsultację kwalifikacyjną
          </h3>
          <p className="text-slate-300 text-sm max-w-lg mx-auto">
            Zadbaj o swoje zdrowie w bezstresowej i nowoczesnej przestrzeni kliniki.
          </p>
          <div className="pt-2">
            <Link href="/rezerwacja" className="btn-gold inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold">
              Zarezerwuj termin konsultacji
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
