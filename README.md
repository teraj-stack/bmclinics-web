# BM Clinics — Platforma Web, Live Visual CMS, Projekt CLI & Wersja Offline

Pełny system strony internetowej, sklepu zabiegowego, rezerwacji i zarządzania treścią (CMS + CLI) dla **BM Clinics (dr Jan Bujok)**, zarejestrowany na koncie GitHub powiązanym z `mlasers0110@icloud.com` (`teraj-stack`).

## Dostęp Online (100% w przeglądarce)

- **Strona główna (Live + Edytor):** [https://teraj-stack.github.io/bmclinics-web/](https://teraj-stack.github.io/bmclinics-web/)
- **Logowanie (`mlasers0110@icloud.com`):** [https://teraj-stack.github.io/bmclinics-web/logowanie.html](https://teraj-stack.github.io/bmclinics-web/logowanie.html)
- **Panel Administratora & CMS:** [https://teraj-stack.github.io/bmclinics-web/admin.html](https://teraj-stack.github.io/bmclinics-web/admin.html)
- **Cennik (21 usług):** [https://teraj-stack.github.io/bmclinics-web/cennik.html](https://teraj-stack.github.io/bmclinics-web/cennik.html)
- **Tryb bezpośredniej edycji tekstu na żywo:** [https://teraj-stack.github.io/bmclinics-web/?edit=1](https://teraj-stack.github.io/bmclinics-web/?edit=1)

## Wersja Offline na dysku lokalnym

Samodzielna wersja offline (działająca bezpośrednio z dysku bez serwera oraz z możliwością edycji i zapisu kopii HTML) znajduje się w:
- `/Users/krzysztofjarzyna/.gemini/antigravity/scratch/bmclinics-offline/index.html`
- `/Users/krzysztofjarzyna/.gemini/antigravity/scratch/bmclinics-offline/logowanie.html`
- `/Users/krzysztofjarzyna/.gemini/antigravity/scratch/bmclinics-offline/Otworz-BMClinics-Offline.command`

Aby wygenerować ponownie paczkę offline z poziomu projektu:
```bash
npm run build:offline
```

## Narzędzie CLI (`bmclinics-cli`)

Projekt zawiera dedykowane narzędzie wiersza poleceń (`scripts/bmclinics-cli.mjs`) do zdalnej i lokalnej edycji treści oraz cennika przez API `/api/cms`:

```bash
# Status systemu i konfiguracji
npm run cli -- status

# Lista wszystkich 21 usług i cen
npm run cli -- services

# Zmiana numeru telefonu lub nagłówków z poziomu terminala
npm run cli -- set-config phone "+48 510 432 361"
npm run cli -- set-config standardTitle "Zabiegi ambulatoryjne bez długiej hospitalizacji"

# Zmiana ceny usługi w zł
npm run cli -- set-price konsultacja-proktologiczna 280

# Dodanie nowej usługi
npm run cli -- add-service konsultacja-kontrolna proktologia 220 20 "Konsultacja kontrolna"
```

## Uruchomienie pełnego serwera Next.js (App Router)

```bash
npm install
npm run dev
```
Lokalny serwer deweloperski działa pod adresem `http://localhost:3000` (w tym `http://localhost:3000/logowanie` oraz `http://localhost:3000/admin`).
