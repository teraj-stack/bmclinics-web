# BM Clinics

Aplikacja Next.js (App Router) dla kliniki: motywy kategorii usług, sklep z Przelewy24, rezerwacje z Google Calendar, panele admin/lekarz/pacjent, wdrożenie na Google Cloud Run.

## Szybki start

```bash
cp .env.example .env
docker compose up -d
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

Lokalna baza: `postgresql://bmclinics:bmclinics@localhost:5432/klinika` (kontener `bmclinics-postgres`).

## Struktura

- `app/(public)/` — strony publiczne (usługi, sklep, rezerwacja, blog, FAQ, o-nas, cennik, kontakt)
- `app/(panel)/` — panele admin / lekarz / pacjent
- `app/api/` — NextAuth, Google OAuth, booking, płatności P24
- `lib/` — Prisma, KMS, płatności, kalendarz, motywy, treści MDX/JSON
- `content/` — blog (MDX), FAQ (JSON), landings (JSON)
- `Dockerfile` — obraz `standalone` pod Cloud Run

## Wymagania produkcyjne

- Cloud SQL (PostgreSQL) w `europe-central2`
- Konto merchant Przelewy24
- Google OAuth (Calendar) + Cloud KMS do szyfrowania refresh tokenów lekarzy
- SMTP dla magic linków NextAuth
