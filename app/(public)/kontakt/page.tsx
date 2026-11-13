import ContactForm from '@/components/contact/ContactForm';
import { Phone, Mail, MapPin, Clock, Car } from 'lucide-react';

export const metadata = {
  title: 'Kontakt i Lokalizacja Kliniki',
  description:
    'Skontaktuj się z BM Clinics — pytania o zabiegi, rezerwacje i płatności. Adres kliniki, godziny przyjęć oraz bezpłatny parking dla pacjentów.',
};

export default function KontaktPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#0b1324] py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-10">
        {/* Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] p-8 sm:p-12 text-white shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-64 w-64 translate-x-16 -translate-y-16 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">
              Rejestracja & Informacja Dla Pacjentów
            </span>
            <h1 className="mt-2 font-[family-name:var(--font-fraunces)] text-3xl font-bold sm:text-4xl lg:text-5xl">
              Skontaktuj się z Nami
            </h1>
            <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              Jesteśmy do Twojej dyspozycji w sprawach rezerwacji wizyt, wyceny zabiegów oraz informacji pozabiegowych.
            </p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Contact Details & Info */}
          <div className="space-y-6">
            <div className="glass-card p-6 space-y-6">
              <h2 className="font-[family-name:var(--font-fraunces)] text-2xl font-bold text-slate-900 dark:text-white">
                Dane Kontaktowe Kliniki
              </h2>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-4 p-3 rounded-xl bg-slate-100 dark:bg-slate-900/60">
                  <Phone className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs text-slate-500 font-semibold">Telefon rejestracji:</span>
                    <a href="tel:+48510432361" className="font-bold text-slate-900 dark:text-white hover:text-amber-500">
                      +48 510 432 361
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-xl bg-slate-100 dark:bg-slate-900/60">
                  <Mail className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs text-slate-500 font-semibold">Adres e-mail:</span>
                    <a href="mailto:kontakt@bujokmedical.pl" className="font-bold text-slate-900 dark:text-white hover:text-amber-500">
                      kontakt@bujokmedical.pl
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-xl bg-slate-100 dark:bg-slate-900/60">
                  <MapPin className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs text-slate-500 font-semibold">Lokalizacja:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      ul. Branickiego 10/U6, Warszawa Wilanów
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hours & Parking */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="glass-card p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <Clock className="h-4 w-4 text-amber-500" />
                  Godziny Przyjęć
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  <p>Pon - Pt: 08:00 - 20:00</p>
                  <p>Sobota: Zamknięte</p>
                  <p>Niedziela: Zamknięte</p>
                </div>
              </div>

              <div className="glass-card p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <Car className="h-4 w-4 text-emerald-500" />
                  Prywatny Parking
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Bezpłatne miejsca postojowe tuż pod wejściem do kliniki dla wszystkich pacjentów.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="glass-card p-6 sm:p-8 space-y-6">
            <h2 className="font-[family-name:var(--font-fraunces)] text-2xl font-bold text-slate-900 dark:text-white">
              Napisz do nas
            </h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </main>
  );
}
