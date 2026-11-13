import { Suspense } from 'react';
import { getServicesCatalog, getDoctorsCatalog } from '@/lib/servicesCatalog';
import BookingForm from '@/components/booking/BookingForm';
import { ShieldCheck, PhoneCall } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Rezerwacja wizyty online',
  description:
    'Zarezerwuj wizytę online — wybierz usługę i dogodny termin u chirurga Jana Bujoka. Dostępność aktualizowana w czasie rzeczywistym z kalendarza.',
};

export default async function RezerwacjaPage() {
  const [services, doctors] = await Promise.all([
    getServicesCatalog(),
    getDoctorsCatalog(),
  ]);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#0b1324] py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Banner Header */}
        <div className="rounded-3xl bg-gradient-to-r from-[#0f172a] to-[#1e293b] p-8 sm:p-10 text-white shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-64 w-64 translate-x-16 -translate-y-16 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="relative z-10">
            <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">
              System Rezerwacji Online 24/7
            </span>
            <h1 className="mt-2 font-[family-name:var(--font-fraunces)] text-3xl font-bold sm:text-4xl">
              Zarezerwuj Wizytę w BM Clinics
            </h1>
            <p className="mt-3 text-slate-300 text-sm max-w-xl leading-relaxed">
              Wybierz zabieg oraz odpowiadający Ci termin u Jana Bujoka. Wizyta zostanie od razu zarezerwowana w grafiku kliniki.
            </p>
          </div>
        </div>

        {/* Content Container */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Booking Form */}
          <div className="lg:col-span-2 glass-card p-6 sm:p-8">
            <Suspense fallback={<div className="p-8 text-center text-sm">Ładowanie formularza...</div>}>
              <BookingForm
                services={services.map((s) => ({ id: s.id, name: s.name, durationMin: s.durationMin }))}
                doctors={doctors.map((d) => ({
                  id: d.id,
                  name: d.name,
                  specialization: d.specialization,
                }))}
              />
            </Suspense>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="glass-card p-6 space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                Gwarancja Opieki
              </h3>
              <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  Brak konieczności zakładania konta przed rezerwacją.
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  Potwierdzenie e-mail oraz przypomnienie SMS.
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  Zabiegi 1-Dnia ze natychmiastowym powrotem do domu.
                </li>
              </ul>
            </div>

            <div className="glass-card p-6 space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <PhoneCall className="h-4 w-4 text-amber-500" />
                Wolisz rezerwację telefoniczną?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Rejestracja pomoże dobrać termin od poniedziałku do piątku w godzinach 8:00 - 20:00.
              </p>
              <a
                href="tel:+48510432361"
                className="block text-center rounded-xl bg-slate-900 py-3 text-xs font-bold text-amber-400 hover:bg-slate-800 transition dark:bg-slate-800"
              >
                Zadzwoń: +48 510 432 361
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
