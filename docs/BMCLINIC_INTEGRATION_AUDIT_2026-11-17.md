# BM Clinic — mapa konsolidacji (audyt źródeł 2026-11-17)

> STATUS: dokument roboczy na osobnej gałęzi. Nie zmienia działającej strony ani nie publikuje zmian.

## Źródła i ustalenia potwierdzone odczytem GitHub
- `teraj-stack/bmclinics-web` (main): 371 plików; Next.js 15, Prisma, CMS, panele pacjenta/lekarza/administracji, assets i samodzielny podgląd RUTA.
- `teraj-stack/bmclinic.co` (main): 38 plików; Next.js 15, cztery huby kliniczne (`src/app/[department]/page.tsx`), strona główna, 3D model kliniki, rezerwacja, SEO i API.
- `teraj-stack/med_seo_nextjs_data_engine`: silnik SEO z Next.js, Python i SQLite.
- `teraj-stack/bmclinic.costrona-kliniki-chirurgicznek`: wyłącznie `.gitattributes` w drzewie gałęzi main.

## RUTA — pierwszeństwo przy integracji
1. Zachowany samodzielny podgląd: `docs/ruta-preview.html` (20 483 znaki, obejmuje interakcje i cztery grupy tematyczne). Zachować plik w niezmienionej postaci jako punkt kontrolny.
2. Zachowana automatyzacja GitHub Pages: `.github/workflows/ruta-pages.yml`; nie zakładać, że publikacja jest obecnie aktywna bez testu URL.
3. Oryginalny wzorzec estetyczny objawów: `.cursor/rules/cml-objawy-glass-system.mdc`; implementacja referencyjna `public/cml/bmcml-a.html`; grafiki `public/cml/objaw-kafelek-glowa.webp`, `objaw-pytanie-pasek.webp` i pozostałe elementy `public/cml`.
4. Nie przerabiać przypadkowo istniejących kafli: dark translucent glass, czarne delikatne ramki, złoty akcent #C4A874 i serif; wyraźne stany aktywne/focus.
5. Docelowa architektura nawigacji: Sky Lobby → specjalizacja → objawy (RUTA) → kolejne pytania / przygotowanie do wizyty → bezpieczna rezerwacja. Zachować drogę awaryjną do standardowej nawigacji i dostępność klawiaturową.

## Lobby i strony
- `components/home/ZakresCareSection.tsx`: obecna strona startowa z trzema kaflami (proktologia, żylaki/naczynka, chirurgia); **brak medycyny estetycznej w tablicy SPECIALTIES**.
- `components/home/HeroClinicBackdrop.tsx`: nieaktywny placeholder; aktualne tło strony jest realizowane przez `ZakresCareSection`.
- Zachowane grafiki: `public/brand/hero-clinic-lobby.webp`, `public/brand/plate-proktologia-brushed-metal.webp`, `public/brand/plate-zylaki-vein-carpet.webp`, `public/brand/plate-chirurgia-bright-steel.webp`.
- `bmclinic.co/src/app/[department]/page.tsx`: odrębny model czterech specjalizacji; nie kopiować bez porównania z aktualnymi trasami `/uslugi/*`.

## Medycyna estetyczna — stan odtworzenia
- `bmclinics-web/refs/medycyna-estetyczna/BM_Clinic_Medycyna_Estetyczna_offline.html` ma 0 bajtów treści według odczytu `fetch_file`. Nie stanowi kopii podstrony.
- `bmclinic.co/src/lib/clinic-departments-data.ts` zawiera teksty i dane działu estetycznego oraz definicje procedur; to materiał do weryfikacji, nie dowód wiernego zachowania zaakceptowanego projektu graficznego.
- Wersja wizualna medycyny estetycznej jest zatem **niekompletna**; możliwe jest odzyskanie części struktury/treści, ale nie można rzetelnie podać procentu rekonstrukcji bez dalszych materiałów.

## Integracja techniczna — docelowy podział odpowiedzialności
- `bmclinics-web`: proponowana baza produkcyjna (istnieją CMS, konto użytkownika, Prisma, panele i assety). Potrzebuje audytu uwierzytelniania oraz migracji, zanim obsłuży prawdziwych pacjentów.
- `bmclinic.co`: źródło modułów eksperymentalnych (3D, cztery huby, FAQ/SEO, nawigacja); migrować selektywnie z testami, bez podmiany aktywnych tras.
- `med_seo_nextjs_data_engine`: odizolować od medycznych danych osobowych; telemetrię uruchamiać po walidacji prywatności, zgód i poprawności metryk.

## Blokery przed publikacją medyczną
- Dane `leadPhysician` oraz `pwzNumber` w `bmclinic.co/src/lib/clinic-departments-data.ts` nie zostały niezależnie zweryfikowane; nie publikować ich jako potwierdzonych.
- Opisy sugerujące diagnostyczną skuteczność 3D LiDAR, pomiary perfuzji/temperatury oraz gwarantowane wyniki zabiegów wymagają dowodów klinicznych i korekty treści. Sam interfejs nie dowodzi funkcjonalności pomiarowej.
- Ceny, telefony, lokalizacje i deklarowane funkcje płatności/rezerwacji należy sprawdzić z rzeczywistą konfiguracją przed publikacją.
- Formularze medyczne, polityka RODO i przetwarzanie danych wrażliwych wymagają osobnego audytu bezpieczeństwa.
- Nie uznawać aplikacji za gotową do produkcji tylko dlatego, że istnieją `package.json` i workflow Vercel; nie przeprowadzono kompilacji ani testów end-to-end.

## Następny bezpieczny etap wdrożenia
1. Stworzyć na gałęzi integracyjnej trasę podglądu RUTA w Next.js jako kopię zachowanego HTML, bez ingerencji w treść wzorcową.
2. Połączyć przejście z kafla proktologii i dodać ścieżkę powrotu do Lobby.
3. Uzupełnić brakujący kafel medycyny estetycznej dopiero po porównaniu jej materiałów referencyjnych.
4. Zrobić `npm ci`, `npm run build`, testy interakcji oraz testy mobilne w środowisku CI/preview.
5. Wystawić Vercel Preview, a nie automatycznie produkcję.
