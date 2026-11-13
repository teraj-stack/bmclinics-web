'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  User,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

interface Service {
  id: string;
  name: string;
  durationMin: number;
}

interface Doctor {
  id: string;
  name: string;
  specialization?: string;
}

interface Slot {
  start: string;
  end: string;
}

export default function BookingForm({
  services,
  doctors,
}: {
  services: Service[];
  doctors: Doctor[];
}) {
  const searchParams = useSearchParams();
  const preselectedServiceId = searchParams.get('serviceId') || '';

  const [serviceId, setServiceId] = useState(preselectedServiceId);
  const [doctorId, setDoctorId] = useState(doctors[0]?.id || '');
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  // Load available slots whenever serviceId, doctorId, or date changes
  useEffect(() => {
    if (!serviceId || !doctorId || !date) return;
    let isCancelled = false;

    async function fetchSlots() {
      setStatus('loading');
      try {
        const res = await fetch(
          `/api/booking/availability?doctorId=${doctorId}&serviceId=${serviceId}&date=${date}`
        );
        const data = await res.json();
        if (!isCancelled) {
          setSlots(data.slots ?? []);
          setSelectedSlot(null);
          setStatus('idle');
        }
      } catch {
        if (!isCancelled) {
          setSlots([]);
          setStatus('idle');
        }
      }
    }

    fetchSlots();

    return () => {
      isCancelled = true;
    };
  }, [serviceId, doctorId, date]);

  async function submitBooking() {
    if (!selectedSlot || !email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId,
          serviceId,
          patientEmail: email,
          patientPhone: phone,
          patientName: name,
          start: selectedSlot.start,
          end: selectedSlot.end,
        }),
      });
      setStatus(res.ok ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  }

  const selectedServiceObj = services.find((s) => s.id === serviceId);
  const selectedDoctorObj = doctors.find((d) => d.id === doctorId);

  if (status === 'done') {
    return (
      <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-slate-950 font-bold">
          <CheckCircle2 className="h-10 w-10 text-white" />
        </div>
        <h2 className="font-[family-name:var(--font-fraunces)] text-3xl font-bold text-slate-900 dark:text-white">
          Wizyta Zarezerwowana!
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
          Potwierdzenie rezerwacji oraz szczegóły dojazdu wysłaliśmy na adres e-mail:{' '}
          <strong className="text-slate-900 dark:text-white">{email}</strong>.
        </p>

        <div className="mx-auto max-w-sm rounded-2xl bg-white p-5 text-left text-xs space-y-2 shadow-sm dark:bg-slate-900 dark:border dark:border-slate-800">
          <div className="flex justify-between border-b pb-2 dark:border-slate-800">
            <span className="text-slate-500">Usługa:</span>
            <span className="font-semibold text-slate-900 dark:text-white">{selectedServiceObj?.name}</span>
          </div>
          <div className="flex justify-between border-b pb-2 dark:border-slate-800">
            <span className="text-slate-500">Chirurg:</span>
            <span className="font-semibold text-slate-900 dark:text-white">{selectedDoctorObj?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Termin:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {selectedSlot &&
                new Date(selectedSlot.start).toLocaleString('pl-PL', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
            </span>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="button"
            onClick={() => setStatus('idle')}
            className="rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-slate-800"
          >
            Zarezerwuj kolejną wizytę
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-8">
      {/* STEP 1: Select Service */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs text-slate-950">
            1
          </span>
          Wybierz usługę lub zabieg
        </label>

        <select
          value={serviceId}
          onChange={(e) => setServiceId(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white p-3.5 text-sm font-medium text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
        >
          <option value="">-- Wybierz usługę z listy --</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.durationMin} min)
            </option>
          ))}
        </select>
      </div>

      {/* STEP 2: Select Doctor */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs text-slate-950">
            2
          </span>
          Specjalista
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          {doctors.map((d) => {
            const isSelected = doctorId === d.id;
            return (
              <button
                type="button"
                key={d.id}
                onClick={() => setDoctorId(d.id)}
                className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                  isSelected
                    ? 'border-amber-500 bg-amber-500/10 dark:bg-amber-500/15 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 font-bold dark:bg-slate-800 dark:text-slate-200">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{d.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {d.specialization ||
                      'chirurg, specjalista chirurgii ogólnej, flebolog, proktolog'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 3: Select Date & Time */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs text-slate-950">
            3
          </span>
          Wybierz datę i godzinę wizyty
        </label>

        <input
          type="date"
          value={date}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white p-3.5 text-sm font-medium text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
        />

        {status === 'loading' && (
          <p className="text-xs text-slate-500 animate-pulse">Sprawdzanie wolnych terminów...</p>
        )}

        {slots.length > 0 ? (
          <div className="grid grid-cols-3 gap-2.5 pt-2 sm:grid-cols-4">
            {slots.map((slot) => {
              const isSelected = selectedSlot?.start === slot.start;
              return (
                <button
                  type="button"
                  key={slot.start}
                  onClick={() => setSelectedSlot(slot)}
                  className={`rounded-xl border p-3 text-center text-xs font-semibold transition ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-600 text-white shadow-md'
                      : 'border-slate-200 bg-white text-slate-800 hover:border-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200'
                  }`}
                >
                  {new Date(slot.start).toLocaleTimeString('pl-PL', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </button>
              );
            })}
          </div>
        ) : (
          date &&
          status !== 'loading' && (
            <p className="text-xs text-slate-500 italic">
              Brak wolnych terminów w wybranym dniu. Wybierz inną datę.
            </p>
          )
        )}
      </div>

      {/* STEP 4: Patient Info & Confirmation */}
      {selectedSlot && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 space-y-4 dark:bg-amber-500/10">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-amber-500" />
            Dane pacjenta do potwierdzenia wizyty
          </h3>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Imię i nazwisko"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
            <input
              type="email"
              placeholder="Adres e-mail (potwierdzenie)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
            <input
              type="tel"
              placeholder="Numer telefonu (SMS z przypomnieniem)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
          </div>

          <button
            type="button"
            onClick={submitBooking}
            disabled={!email || status === 'loading'}
            className="btn-gold w-full py-3.5 rounded-xl text-sm shadow-md transition disabled:opacity-40"
          >
            {status === 'loading' ? 'Rezerwowanie...' : 'Potwierdzam Rezerwację Wizyty'}
          </button>
        </div>
      )}

      {status === 'error' && (
        <p className="text-xs font-semibold text-red-600">
          Wystąpił błąd podczas rejestracji. Spróbuj ponownie lub skontaktuj się z rejestracją.
        </p>
      )}
    </div>
  );
}
