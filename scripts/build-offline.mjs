#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OFFLINE_DISK_DIR = '/Users/krzysztofjarzyna/.gemini/antigravity/scratch/bmclinics-offline';
const DOCS_DIR = path.join(ROOT, 'docs');

const SERVICES = [
  { id: 'srv-konsultacja-proktologiczna', slug: 'konsultacja-proktologiczna', categorySlug: 'proktologia', categoryName: 'Proktologia', name: 'Konsultacja proktologiczna', priceZl: 250, durationMin: 30, summary: 'Konsultacja proktologiczna z badaniem i omówieniem planu leczenia – szybka diagnostyka dolegliwości odbytu i odbytnicy w komfortowych warunkach kliniki.' },
  { id: 'srv-anoskopia', slug: 'anoskopia', categorySlug: 'proktologia', categoryName: 'Proktologia', name: 'Anoskopia', priceZl: 350, durationMin: 20, summary: 'Anoskopia to badanie końcowego odcinka kanału odbytu umożliwiające ocenę hemoroidów, szczelin i zmian zapalnych – wykonywane ambulatoryjnie.' },
  { id: 'srv-rektoskopia', slug: 'rektoskopia', categorySlug: 'proktologia', categoryName: 'Proktologia', name: 'Rektoskopia', priceZl: 450, durationMin: 30, summary: 'Rektoskopia pozwala ocenić odbytnicę i dolną część esicy – diagnostyka krwawień, polipów i zmian zapalnych w warunkach ambulatoryjnych kliniki.' },
  { id: 'srv-leczenie-hemoroidow-ambulatoryjne', slug: 'leczenie-hemoroidow-ambulatoryjne', categorySlug: 'proktologia', categoryName: 'Proktologia', name: 'Leczenie hemoroidów (metody ambulatoryjne)', priceZl: 800, durationMin: 45, summary: 'Ambulatoryjne leczenie hemoroidów metodami małoinwazyjnymi – skrócony czas rekonwalescencji i indywidualny dobór techniki.' },
  { id: 'srv-leczenie-szczeliny-odbytu', slug: 'leczenie-szczeliny-odbytu', categorySlug: 'proktologia', categoryName: 'Proktologia', name: 'Leczenie szczeliny odbytu', priceZl: 700, durationMin: 40, summary: 'Leczenie szczeliny odbytu – od terapii zachowawczej po zabiegi ambulatoryjne – z naciskiem na złagodzenie bólu i bezpieczne gojenie.' },
  { id: 'srv-usuwanie-brodawek-okolicy-odbytu', slug: 'usuwanie-brodawek-okolicy-odbytu', categorySlug: 'proktologia', categoryName: 'Proktologia', name: 'Usuwanie brodawek okolicy odbytu', priceZl: 600, durationMin: 40, summary: 'Usuwanie brodawek okolicy odbytu w znieczuleniu miejscowym – precyzyjna procedura ambulatoryjna z instrukcją pielęgnacji po zabiegu.' },
  { id: 'srv-kontrola-po-zabiegu-proktologicznym', slug: 'kontrola-po-zabiegu-proktologicznym', categorySlug: 'proktologia', categoryName: 'Proktologia', name: 'Kontrola po zabiegu proktologicznym', priceZl: 200, durationMin: 20, summary: 'Wizyta kontrolna po zabiegu proktologicznym – ocena gojenia, omówienie dolegliwości i dalszych zaleceń.' },
  { id: 'srv-konsultacja-flebologiczna', slug: 'konsultacja-fleboologiczna', categorySlug: 'zylaki-naczynka', categoryName: 'Żylaki i naczynka', name: 'Konsultacja flebologiczna', priceZl: 280, durationMin: 30, summary: 'Konsultacja flebologiczna z oceną żylaków i teleangiektazji – omówienie diagnostyki USG oraz planu leczenia małoinwazyjnego.' },
  { id: 'srv-usg-doppler-zyl-konczyn', slug: 'usg-doppler-zyl-konczyn', categorySlug: 'zylaki-naczynka', categoryName: 'Żylaki i naczynka', name: 'USG Doppler żył kończyn dolnych', priceZl: 350, durationMin: 40, summary: 'USG Doppler żył kończyn dolnych ocenia drożność i wydolność zastawek – kluczowe badanie przed leczeniem żylaków.' },
  { id: 'srv-zamykanie-naczynek-nog', slug: 'zamykanie-naczynek-nog', categorySlug: 'zylaki-naczynka', categoryName: 'Żylaki i naczynka', name: 'Zamykanie naczynek na nogach', priceZl: 250, durationMin: 30, summary: 'Zamykanie pękniętych naczynek na nogach laserem lub skleroterapią – zabieg ambulatoryjny, widoczna poprawa już po sesji.' },
  { id: 'srv-zamykanie-naczynek-twarz', slug: 'zamykanie-naczynek-twarz', categorySlug: 'zylaki-naczynka', categoryName: 'Żylaki i naczynka', name: 'Zamykanie naczynek na twarzy', priceZl: 300, durationMin: 30, summary: 'Laserowe zamykanie naczynek na twarzy – redukcja rumienia i teleangiektazji z krótkim czasem rekonwalescencji.' },
  { id: 'srv-skleroterapia-zylakow', slug: 'skleroterapia-zylakow', categorySlug: 'zylaki-naczynka', categoryName: 'Żylaki i naczynka', name: 'Skleroterapia żylaków', priceZl: 450, durationMin: 45, summary: 'Skleroterapia żylaków to małoinwazyjne zamykanie niewydolnych żył iniekcją – ambulatoryjnie, z szybkim powrotem do aktywności.' },
  { id: 'srv-laseroterapia-naczyniowa', slug: 'laseroterapia-naczyniowa', categorySlug: 'zylaki-naczynka', categoryName: 'Żylaki i naczynka', name: 'Laseroterapia naczyniowa', priceZl: 400, durationMin: 40, summary: 'Laseroterapia naczyniowa zamyka drobne naczynka i poprawia wygląd skóry – zabieg ambulatoryjny z doborem energii.' },
  { id: 'srv-kontrola-po-zabiegu-naczyniowym', slug: 'kontrola-po-zabiegu-naczyniowym', categorySlug: 'zylaki-naczynka', categoryName: 'Żylaki i naczynka', name: 'Kontrola po zabiegu naczyniowym', priceZl: 180, durationMin: 20, summary: 'Kontrola po skleroterapii lub laseroterapii naczyniowej – ocena efektów, gojenia i decyzji o kolejnej sesji.' },
  { id: 'srv-konsultacja-chirurgiczna', slug: 'konsultacja-chirurgiczna', categorySlug: 'chirurgia-ogolna', categoryName: 'Chirurgia ogólna', name: 'Konsultacja chirurgiczna', priceZl: 270, durationMin: 30, summary: 'Konsultacja z chirurgiem ogólnym – ocena wskazań do zabiegu, omówienie ryzyka i przygotowania oraz planu opieki.' },
  { id: 'srv-usuwanie-znamion-chirurgiczne', slug: 'usuwanie-znamion-chirurgiczne', categorySlug: 'chirurgia-ogolna', categoryName: 'Chirurgia ogólna', name: 'Chirurgiczne usuwanie znamion', priceZl: 500, durationMin: 40, summary: 'Chirurgiczne usunięcie znamienia w znieczuleniu miejscowym – bezpieczna procedura z możliwością badania histopatologicznego.' },
  { id: 'srv-usuwanie-tluszczaka', slug: 'usuwanie-tluszczaka', categorySlug: 'chirurgia-ogolna', categoryName: 'Chirurgia ogólna', name: 'Usuwanie tłuszczaka', priceZl: 700, durationMin: 45, summary: 'Usuwanie tłuszczaka w znieczuleniu miejscowym – ambulatoryjna procedura chirurgiczna z krótką rekonwalescencją.' },
  { id: 'srv-usuwanie-torbieli', slug: 'usuwanie-torbieli', categorySlug: 'chirurgia-ogolna', categoryName: 'Chirurgia ogólna', name: 'Usuwanie torbieli skórnych', priceZl: 650, durationMin: 45, summary: 'Chirurgiczne usunięcie torbieli skórnych w warunkach ambulatoryjnych – znieczulenie miejscowe i kontrola gojenia.' },
  { id: 'srv-leczenie-wrastajacego-paznokcia', slug: 'leczenie-wrastajacego-paznokcia', categorySlug: 'chirurgia-ogolna', categoryName: 'Chirurgia ogólna', name: 'Leczenie wrastającego paznokcia', priceZl: 450, durationMin: 35, summary: 'Leczenie wrastającego paznokcia metodą chirurgiczną ambulatoryjną – ulga w bólu i zmniejszenie stanu zapalnego.' },
  { id: 'srv-drobne-zabiegi-chirurgiczne', slug: 'drobne-zabiegi-chirurgiczne', categorySlug: 'chirurgia-ogolna', categoryName: 'Chirurgia ogólna', name: 'Drobne zabiegi chirurgiczne ambulatoryjne', priceZl: 550, durationMin: 40, summary: 'Drobne zabiegi chirurgii ogólnej wykonywane ambulatoryjnie – indywidualna wycena po konsultacji.' },
  { id: 'srv-kontrola-po-zabiegu-chirurgicznym', slug: 'kontrola-po-zabiegu-chirurgicznym', categorySlug: 'chirurgia-ogolna', categoryName: 'Chirurgia ogólna', name: 'Kontrola po zabiegu chirurgicznym', priceZl: 180, durationMin: 20, summary: 'Wizyta kontrolna po drobnym zabiegu chirurgicznym – ocena gojenia rany i zdjęcie szwów.' },
];

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.name === '.DS_Store') continue;
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

function renderShell({ title, pageId, prefix = '.', bodyHtml }) {
  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} | BM Clinics — Klinika Chirurgiczna</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    :root {
      --bg-primary: #151411;
      --text-primary: #f4f1ea;
      --text-muted: #a39e93;
      --metal-gold: #d4af37;
      --metal-chrome: #eef2f6;
      --metal-steel: #b0b8c1;
      --border-color: rgba(255,255,255,0.14);
      --font-fraunces: 'Fraunces', Georgia, serif;
      --font-montserrat: 'Montserrat', system-ui, sans-serif;
    }
    body {
      background-color: var(--bg-primary);
      color: var(--text-primary);
      font-family: var(--font-montserrat);
      margin: 0;
    }
    .font-serif-display { font-family: var(--font-fraunces); }
    .site-header-glass {
      background: rgba(18, 17, 14, 0.86);
      backdrop-filter: blur(18px);
      border-bottom: 1px solid rgba(255,255,255,0.12);
    }
    .btn-gold {
      background: linear-gradient(135deg, #e5c453 0%, #c59b27 50%, #9f7916 100%);
      color: #12110e;
      font-weight: 600;
      box-shadow: 0 4px 20px rgba(212, 175, 55, 0.28);
      transition: all 0.2s ease;
    }
    .btn-gold:hover { filter: brightness(1.08); transform: translateY(-1px); }
    .metal-gold-edge {
      border: 1px solid rgba(212, 175, 55, 0.38);
      box-shadow: inset 0 1px 0 rgba(255, 235, 160, 0.18), 0 12px 32px rgba(0,0,0,0.45);
    }
    .metal-chrome-edge {
      border: 1px solid rgba(255, 255, 255, 0.16);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 10px 28px rgba(0,0,0,0.4);
    }
    .glass-card {
      background: rgba(255, 255, 255, 0.035);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 1rem;
      backdrop-filter: blur(12px);
    }
    .text-brushed-gold { color: #d4af37; }
    [contenteditable="true"] {
      outline: 2px dashed #d4af37 !important;
      outline-offset: 3px;
      border-radius: 4px;
      cursor: text !important;
    }
  </style>
</head>
<body class="flex min-h-screen flex-col antialiased" data-page-id="${pageId}">
  <!-- Header -->
  <header class="sticky top-0 z-50 w-full site-header-glass" data-cms-ignore="true">
    <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
      <a href="${prefix}/index.html" class="flex items-center gap-3">
        <img src="${prefix}/brand/logo-bujok-medical-header.png" alt="Bujok Medical" class="h-11 w-auto object-contain" />
      </a>
      <nav class="hidden items-center gap-1 text-[13px] font-medium lg:flex">
        <a href="${prefix}/uslugi-proktologia.html" class="rounded-lg px-3 py-2 text-zinc-300 hover:bg-white/5 hover:text-white flex items-center gap-1.5"><span class="h-1.5 w-1.5 rounded-full bg-[#d4af37]"></span>Proktologia</a>
        <a href="${prefix}/uslugi-zylaki.html" class="rounded-lg px-3 py-2 text-zinc-300 hover:bg-white/5 hover:text-white flex items-center gap-1.5"><span class="h-1.5 w-1.5 rounded-full bg-sky-400"></span>Żylaki i naczynka</a>
        <a href="${prefix}/uslugi-chirurgia.html" class="rounded-lg px-3 py-2 text-zinc-300 hover:bg-white/5 hover:text-white flex items-center gap-1.5"><span class="h-1.5 w-1.5 rounded-full bg-indigo-300"></span>Chirurgia Ogólna</a>
        <a href="${prefix}/cennik.html" class="rounded-lg px-3 py-2 text-zinc-300 hover:bg-white/5 hover:text-white">Cennik</a>
        <a href="${prefix}/sklep.html" class="rounded-lg px-3 py-2 text-zinc-300 hover:bg-white/5 hover:text-white">Sklep zabiegowy</a>
        <a href="${prefix}/o-nas.html" class="rounded-lg px-3 py-2 text-zinc-300 hover:bg-white/5 hover:text-white">O nas</a>
        <a href="${prefix}/kontakt.html" class="rounded-lg px-3 py-2 text-zinc-300 hover:bg-white/5 hover:text-white">Kontakt</a>
      </nav>
      <div class="flex items-center gap-3">
        <a href="${prefix}/logowanie.html" class="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-300 hover:text-white">
          <img src="${prefix}/brand/icon-strefa-serce.png" alt="" class="h-4 w-4 object-contain" />
          <span>Strefa Pacjenta / Logowanie</span>
        </a>
        <a href="${prefix}/rezerwacja.html" class="btn-gold rounded-lg px-3 py-1.5 text-xs">Umów wizytę</a>
      </div>
    </div>
  </header>

  <main class="flex-1">
    ${bodyHtml}
  </main>

  <!-- Footer -->
  <footer class="border-t border-white/10 bg-[#100f0c] px-4 py-12 text-xs text-zinc-400">
    <div class="mx-auto flex max-w-6xl flex-col justify-between gap-6 sm:flex-row sm:items-center">
      <div>
        <p class="font-serif-display text-base text-white">BM Clinics — dr Jan Bujok</p>
        <p class="mt-1">Warszawa Wilanów, ul. Branickiego 10/U6 • Tel. <span data-cms-field="phone">+48 510 432 361</span></p>
      </div>
      <div class="flex flex-wrap gap-4">
        <a href="${prefix}/index.html" class="hover:text-white">Strona główna</a>
        <a href="${prefix}/cennik.html" class="hover:text-white">Cennik</a>
        <a href="${prefix}/sklep.html" class="hover:text-white">Sklep</a>
        <a href="${prefix}/logowanie.html" class="hover:text-white">Logowanie</a>
        <a href="${prefix}/admin.html" class="hover:text-[#d4af37]">Panel Admina & CMS</a>
      </div>
    </div>
  </footer>

  <!-- Built-in Live Visual Editor & Offline/Online CMS Engine -->
  <div id="bm-live-studio" data-cms-ignore="true" class="fixed right-4 bottom-4 z-50 flex flex-wrap items-center gap-2 rounded-2xl border border-white/15 bg-[#12110e]/95 p-2 text-xs text-white shadow-2xl backdrop-blur-xl">
    <button id="btn-toggle-inline" type="button" class="flex items-center gap-1.5 rounded-xl bg-white/10 px-3.5 py-2 font-medium text-white hover:bg-white/15 transition">
      <span class="h-2 w-2 rounded-full bg-[#d4af37]"></span>
      <span id="lbl-toggle-inline">Edytuj tekst na żywo</span>
    </button>
    <button id="btn-open-cms" type="button" class="rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-medium text-zinc-200 hover:bg-white/10">
      Panel CMS & Cennik
    </button>
    <button id="btn-download-html" type="button" class="rounded-xl border border-[#d4af37]/40 bg-[#d4af37]/15 px-3 py-2 font-medium text-[#f4e7c3] hover:bg-[#d4af37]/25">
      Zapisz kopię HTML (Offline)
    </button>
    <a href="${prefix}/logowanie.html" class="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-zinc-300 hover:bg-white/10">Logowanie</a>
  </div>

  <!-- CMS Drawer Modal -->
  <div id="bm-cms-drawer" data-cms-ignore="true" class="fixed inset-0 z-50 hidden justify-end bg-black/65 backdrop-blur-xs">
    <div class="flex h-full w-full max-w-lg flex-col border-l border-white/15 bg-[#141310] p-6 text-xs text-zinc-100 shadow-2xl overflow-y-auto">
      <div class="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <p class="text-[10px] font-semibold uppercase tracking-widest text-[#d4af37]">BM Clinics Studio (Online + Offline)</p>
          <h3 class="text-base font-semibold text-white">Edytor Treści, Cennika i CLI</h3>
        </div>
        <button id="btn-close-cms" type="button" class="rounded-lg bg-white/10 px-3 py-1.5 text-white">Zamknij</button>
      </div>
      <div class="mt-4 space-y-4">
        <div class="rounded-xl border border-[#d4af37]/30 bg-[#d4af37]/10 p-3 text-[#f4e7c3]">
          Wszystkie zmiany są automatycznie zapisywane w pamięci przeglądarki (LocalStorage) oraz mogą zostać wyeksportowane jako gotowy plik HTML na dysk lokalny.
        </div>
        <label class="block space-y-1">
          <span class="text-zinc-400">Telefon rejestracji</span>
          <input id="cms-input-phone" value="+48 510 432 361" class="w-full rounded-lg border border-white/15 bg-black/50 p-2.5 text-white" />
        </label>
        <label class="block space-y-1">
          <span class="text-zinc-400">Nagłówek sekcji Standard</span>
          <input id="cms-input-title" value="Zabiegi ambulatoryjne bez długiej hospitalizacji" class="w-full rounded-lg border border-white/15 bg-black/50 p-2.5 text-white" />
        </label>
        <div class="flex gap-2 pt-2">
          <button id="btn-save-cms-cfg" type="button" class="btn-gold flex-1 rounded-xl py-2.5 font-semibold text-black">Zapisz zmiany</button>
          <button id="btn-reset-cms-cfg" type="button" class="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-red-300">Resetuj</button>
        </div>
        <div class="border-t border-white/10 pt-4">
          <p class="font-semibold text-[#d4af37]">Komendy projektu CLI (Terminal):</p>
          <pre class="mt-2 rounded-lg bg-black p-3 font-mono text-[11px] text-emerald-300 overflow-x-auto">npm run cli -- status
npm run cli -- services
npm run cli -- set-price konsultacja-proktologiczna 280
npm run cli -- set-config phone "+48 510 432 361"</pre>
        </div>
      </div>
    </div>
  </div>

  <script>
    (function() {
      const STORAGE_KEY = 'bmclinics_inline_edits_' + (document.body.dataset.pageId || 'default');
      const GLOBAL_CFG_KEY = 'bmclinics_global_cfg_v1';
      let inlineActive = new URLSearchParams(window.location.search).get('edit') === '1';

      function getEditableNodes() {
        const main = document.querySelector('main');
        if (!main) return [];
        return Array.from(main.querySelectorAll('h1, h2, h3, h4, p, span, a, td, th')).filter(el => {
          if (el.closest('[data-cms-ignore]')) return false;
          return !Array.from(el.children).some(c => ['DIV','SECTION','TABLE','FORM','IMG','SVG','INPUT','SELECT'].includes(c.tagName));
        });
      }

      function applySavedEdits() {
        try {
          const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
          getEditableNodes().forEach((el, idx) => {
            const key = el.dataset.cmsKey || ('node_' + idx);
            el.dataset.cmsKey = key;
            if (saved[key] !== undefined) el.textContent = saved[key];
          });
          const cfg = JSON.parse(localStorage.getItem(GLOBAL_CFG_KEY) || '{}');
          if (cfg.phone) {
            document.querySelectorAll('[data-cms-field="phone"]').forEach(el => el.textContent = cfg.phone);
            const inp = document.getElementById('cms-input-phone');
            if (inp) inp.value = cfg.phone;
          }
          if (cfg.standardTitle) {
            document.querySelectorAll('[data-cms-field="standardTitle"]').forEach(el => el.textContent = cfg.standardTitle);
            const inp = document.getElementById('cms-input-title');
            if (inp) inp.value = cfg.standardTitle;
          }
        } catch (e) {}
      }

      function setInlineMode(active) {
        inlineActive = active;
        const btn = document.getElementById('btn-toggle-inline');
        const lbl = document.getElementById('lbl-toggle-inline');
        if (btn && lbl) {
          btn.className = active
            ? 'flex items-center gap-1.5 rounded-xl bg-[#d4af37] px-3.5 py-2 font-semibold text-black shadow-lg transition'
            : 'flex items-center gap-1.5 rounded-xl bg-white/10 px-3.5 py-2 font-medium text-white hover:bg-white/15 transition';
          lbl.textContent = active ? 'Zakończ i zapisz edycję' : 'Edytuj tekst na żywo';
        }
        getEditableNodes().forEach((el, idx) => {
          const key = el.dataset.cmsKey || ('node_' + idx);
          el.dataset.cmsKey = key;
          if (active) {
            el.setAttribute('contenteditable', 'true');
            el.onclick = function(e) { e.preventDefault(); e.stopPropagation(); el.focus(); };
            el.onblur = function() {
              const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
              saved[key] = el.textContent.trim();
              localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
            };
          } else {
            el.removeAttribute('contenteditable');
            el.onclick = null;
          }
        });
      }

      applySavedEdits();
      if (inlineActive) setInlineMode(true);

      document.getElementById('btn-toggle-inline')?.addEventListener('click', () => setInlineMode(!inlineActive));
      document.getElementById('btn-open-cms')?.addEventListener('click', () => {
        document.getElementById('bm-cms-drawer')?.classList.remove('hidden');
        document.getElementById('bm-cms-drawer')?.classList.add('flex');
      });
      document.getElementById('btn-close-cms')?.addEventListener('click', () => {
        document.getElementById('bm-cms-drawer')?.classList.add('hidden');
        document.getElementById('bm-cms-drawer')?.classList.remove('flex');
      });
      document.getElementById('btn-save-cms-cfg')?.addEventListener('click', () => {
        const phone = document.getElementById('cms-input-phone')?.value || '+48 510 432 361';
        const standardTitle = document.getElementById('cms-input-title')?.value || '';
        localStorage.setItem(GLOBAL_CFG_KEY, JSON.stringify({ phone, standardTitle }));
        applySavedEdits();
        document.getElementById('bm-cms-drawer')?.classList.add('hidden');
      });
      document.getElementById('btn-reset-cms-cfg')?.addEventListener('click', () => {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(GLOBAL_CFG_KEY);
        window.location.reload();
      });
      document.getElementById('btn-download-html')?.addEventListener('click', () => {
        const wasActive = inlineActive;
        if (wasActive) setInlineMode(false);
        const htmlContent = '<!DOCTYPE html>\\n' + document.documentElement.outerHTML;
        const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = (document.body.dataset.pageId || 'bmclinics') + '-offline.html';
        a.click();
        if (wasActive) setInlineMode(true);
      });
    })();
  </script>
</body>
</html>`;
}

const HOME_BODY = `
  <!-- Hero -->
  <section class="relative h-[78vh] min-h-[520px] w-full overflow-hidden">
    <img src="./brand/hero-clinic-lobby.jpg" alt="Gabinet BM Clinics" class="h-full w-full object-cover object-center" />
    <div class="absolute inset-0 bg-gradient-to-t from-[#151411] via-black/35 to-transparent"></div>
    <div class="absolute inset-x-0 bottom-12 mx-auto max-w-6xl px-4">
      <p class="text-brushed-gold text-xs font-semibold uppercase tracking-[0.22em]">BM Clinics — Warszawa Wilanów</p>
      <h1 class="font-serif-display mt-2 text-4xl font-light text-white sm:text-5xl">Precyzyjna chirurgia, proktologia i flebologia</h1>
      <p class="mt-3 max-w-xl text-sm text-zinc-200">Małoinwazyjne zabiegi ambulatoryjne dr. Jana Bujoka z rezerwacją online i pełnym wsparciem pozabiegowym.</p>
    </div>
  </section>

  <!-- Trzy ścieżki kliniczne -->
  <section class="bg-[#1d1b16] px-4 py-16 text-white">
    <div class="mx-auto max-w-6xl">
      <p class="text-brushed-gold text-[11px] font-medium uppercase tracking-[0.2em]">Zakres opieki</p>
      <h2 class="font-serif-display mt-1 text-3xl font-light">Trzy ścieżki kliniczne</h2>

      <div class="mt-10 grid gap-8 md:grid-cols-3">
        <div class="metal-gold-edge relative overflow-hidden rounded-2xl bg-[#0e1f18] p-7">
          <img src="./brand/plate-proktologia-brushed-metal.webp" alt="" class="absolute inset-0 h-full w-full object-cover opacity-45" />
          <div class="relative z-10 flex h-full flex-col justify-between space-y-6">
            <div>
              <img src="./brand/icon-zakres-mark.svg" alt="" class="h-8 w-8" />
              <h3 class="font-serif-display mt-4 text-2xl font-light">Proktologia</h3>
              <p class="mt-2 text-sm text-zinc-200">Diagnostyka i małoinwazyjne leczenie chorób odbytu i odbytnicy. Hemoroidy, szczeliny, anoskopia.</p>
            </div>
            <div class="flex items-center justify-between border-t border-white/15 pt-4 text-xs">
              <span class="font-semibold text-[#f4e7c3]">od 200 zł</span>
              <a href="./uslugi-proktologia.html" class="font-semibold text-white hover:text-[#d4af37]">Zabiegi →</a>
            </div>
          </div>
        </div>

        <div class="metal-chrome-edge relative overflow-hidden rounded-2xl bg-[#0a1420] p-7">
          <img src="./brand/plate-zylaki-vein-carpet.webp" alt="" class="absolute inset-0 h-full w-full object-cover opacity-45" />
          <div class="relative z-10 flex h-full flex-col justify-between space-y-6">
            <div>
              <img src="./brand/icon-zakres-mark.svg" alt="" class="h-8 w-8" />
              <h3 class="font-serif-display mt-4 text-2xl font-light">Żylaki i naczynka</h3>
              <p class="mt-2 text-sm text-zinc-200">Flebologia: USG Doppler, laserowe zamykanie naczynek oraz skleroterapia żylaków.</p>
            </div>
            <div class="flex items-center justify-between border-t border-white/15 pt-4 text-xs">
              <span class="font-semibold text-[#f4e7c3]">od 180 zł</span>
              <a href="./uslugi-zylaki.html" class="font-semibold text-white hover:text-[#d4af37]">Zabiegi →</a>
            </div>
          </div>
        </div>

        <div class="metal-chrome-edge relative overflow-hidden rounded-2xl bg-[#25292e] p-7">
          <img src="./brand/plate-chirurgia-bright-steel.webp" alt="" class="absolute inset-0 h-full w-full object-cover opacity-35" />
          <div class="relative z-10 flex h-full flex-col justify-between space-y-6">
            <div>
              <img src="./brand/icon-zakres-mark.svg" alt="" class="h-8 w-8" />
              <h3 class="font-serif-display mt-4 text-2xl font-light">Chirurgia ogólna</h3>
              <p class="mt-2 text-sm text-zinc-200">Znamiona, tłuszczaki, torbiele oraz wrastające paznokcie — z oceną histopatologiczną.</p>
            </div>
            <div class="flex items-center justify-between border-t border-white/15 pt-4 text-xs">
              <span class="font-semibold text-[#f4e7c3]">od 180 zł</span>
              <a href="./uslugi-chirurgia.html" class="font-semibold text-white hover:text-[#d4af37]">Zabiegi →</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Standard BMClinic -->
  <section class="border-y border-white/10 bg-[#181612] px-4 py-20">
    <div class="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
      <div class="space-y-5">
        <p class="text-brushed-gold text-[11px] font-medium uppercase tracking-[0.2em]">Standard BMClinic</p>
        <h2 data-cms-field="standardTitle" class="font-serif-display text-3xl font-light sm:text-4xl">Zabiegi ambulatoryjne bez długiej hospitalizacji</h2>
        <p class="text-sm leading-relaxed text-zinc-300">Jan Bujok łączy doświadczenie kliniczne z wygodą rezerwacji online. Procedury w znieczuleniu miejscowym — powrót do domu tego samego dnia.</p>
        <div class="pt-2">
          <a href="./cennik.html" class="metal-chrome-edge inline-flex items-center gap-2 rounded-xl bg-white/5 px-6 py-3 text-sm font-medium">Pełny cennik (21 usług) →</a>
        </div>
      </div>
      <div class="metal-gold-edge rounded-2xl bg-white/[0.03] p-8">
        <h3 class="font-serif-display text-2xl font-light">Konsultacja z chirurgiem</h3>
        <p class="mt-2 text-sm text-zinc-300">Jan Bujok odpowiada w sprawie kwalifikacji do zabiegów i przygotowania do badań.</p>
        <div class="mt-6 space-y-3 rounded-xl bg-black/30 p-5 text-sm">
          <div class="flex justify-between">
            <span class="text-zinc-400">Rejestracja</span>
            <a href="tel:+48510432361" data-cms-field="phone" class="font-semibold text-[#d4af37]">+48 510 432 361</a>
          </div>
          <div class="flex justify-between border-t border-white/10 pt-3">
            <span class="text-zinc-400">Adres</span>
            <span class="text-right">Warszawa Wilanów, ul. Branickiego 10/U6</span>
          </div>
        </div>
        <a href="./rezerwacja.html" class="btn-gold mt-6 flex w-full items-center justify-center rounded-xl py-3.5 text-sm">Zarezerwuj konsultację</a>
      </div>
    </div>
  </section>
`;

const LOGOWANIE_BODY = `
  <section class="mx-auto max-w-xl space-y-8 px-4 py-14">
    <div class="space-y-2">
      <p class="text-brushed-gold text-[11px] font-medium uppercase tracking-[0.2em]">Strefa Autoryzacji & CMS Online / Offline</p>
      <h1 class="font-serif-display text-3xl font-light">Logowanie do systemu BM Clinics</h1>
      <p class="text-sm text-zinc-300">Zaloguj się na konto właściciela (<strong>mlasers0110@icloud.com</strong>), aby zarządzać kliniką, cennikiem oraz edytować stronę na żywo w przeglądarce i przez CLI.</p>
    </div>

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <a href="./admin.html" class="metal-gold-edge flex flex-col justify-between rounded-xl bg-[#181612] p-4 hover:bg-[#221f19] transition">
        <span class="text-xs font-semibold text-[#d4af37]">★ Właściciel / Admin</span>
        <div class="mt-3">
          <p class="text-xs font-semibold text-white">Panel Admina</p>
          <p class="text-[11px] text-zinc-400">mlasers0110@icloud.com</p>
        </div>
      </a>
      <a href="./index.html?edit=1" class="metal-chrome-edge flex flex-col justify-between rounded-xl bg-[#181612] p-4 hover:bg-[#221f19] transition">
        <span class="text-xs font-semibold text-emerald-400">✎ Live Studio</span>
        <div class="mt-3">
          <p class="text-xs font-semibold text-white">Edytor na żywo</p>
          <p class="text-[11px] text-zinc-400">Kliknij i edytuj tekst</p>
        </div>
      </a>
      <a href="./cennik.html?edit=1" class="metal-chrome-edge flex flex-col justify-between rounded-xl bg-[#181612] p-4 hover:bg-[#221f19] transition">
        <span class="text-xs font-semibold text-sky-400">zł Cennik</span>
        <div class="mt-3">
          <p class="text-xs font-semibold text-white">Edytuj Cennik</p>
          <p class="text-[11px] text-zinc-400">21 procedur klinicznych</p>
        </div>
      </a>
    </div>

    <form onsubmit="event.preventDefault(); localStorage.setItem('bmclinics_auth_user', document.getElementById('login-email').value); window.location.href='./admin.html';" class="glass-card space-y-4 p-6">
      <div class="space-y-1.5">
        <label class="block text-xs font-medium text-zinc-300">Adres e-mail</label>
        <input id="login-email" type="email" required value="mlasers0110@icloud.com" class="w-full rounded-xl border border-white/15 bg-black/40 p-3 text-sm text-white" />
      </div>
      <div class="space-y-1.5">
        <label class="block text-xs font-medium text-zinc-300">Tryb dostępu</label>
        <select class="w-full rounded-xl border border-white/15 bg-black/40 p-3 text-sm text-white">
          <option value="ADMIN">Administrator & Edytor CMS (Pełny dostęp)</option>
          <option value="DOCTOR">Lekarz (dr Jan Bujok — Kalendarz i Wizyty)</option>
          <option value="PATIENT">Pacjent (Moje wizyty i Profil)</option>
        </select>
      </div>
      <button type="submit" class="btn-gold w-full rounded-xl py-3.5 text-sm font-semibold">Zaloguj się i przejdź do panelu</button>
    </form>
  </section>
`;

function renderServicesTable(filterCat = null, title = 'Cennik usług i zabiegów') {
  const list = filterCat ? SERVICES.filter((s) => s.categorySlug === filterCat) : SERVICES;
  const rows = list
    .map(
      (s) => `
      <tr class="border-b border-white/10 hover:bg-white/[0.02]">
        <td class="py-3.5 pr-4">
          <p class="font-medium text-white">${s.name}</p>
          <p class="mt-0.5 text-xs text-zinc-400">${s.summary}</p>
        </td>
        <td class="px-3 py-3.5 text-xs text-zinc-300">${s.categoryName}</td>
        <td class="px-3 py-3.5 text-xs text-zinc-300">${s.durationMin} min</td>
        <td class="px-3 py-3.5 text-right font-semibold text-[#f4e7c3] whitespace-nowrap">${s.priceZl} zł</td>
        <td class="pl-3 py-3.5 text-right">
          <a href="./rezerwacja.html?service=${s.slug}" class="rounded-lg border border-[#d4af37]/40 bg-[#d4af37]/10 px-3 py-1.5 text-xs font-medium text-[#f4e7c3] hover:bg-[#d4af37]/20">Umów</a>
        </td>
      </tr>`
    )
    .join('\n');

  return `
    <section class="mx-auto max-w-6xl space-y-6 px-4 py-12">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-brushed-gold text-[11px] font-medium uppercase tracking-[0.2em]">BM Clinics — Katalog procedur</p>
          <h1 class="font-serif-display mt-1 text-3xl font-light">${title} (${list.length})</h1>
        </div>
        <div class="flex gap-2 text-xs">
          <a href="./cennik.html" class="rounded-lg border border-white/15 px-3 py-1.5 hover:bg-white/10">Wszystkie</a>
          <a href="./uslugi-proktologia.html" class="rounded-lg border border-white/15 px-3 py-1.5 hover:bg-white/10">Proktologia</a>
          <a href="./uslugi-zylaki.html" class="rounded-lg border border-white/15 px-3 py-1.5 hover:bg-white/10">Żylaki i naczynka</a>
          <a href="./uslugi-chirurgia.html" class="rounded-lg border border-white/15 px-3 py-1.5 hover:bg-white/10">Chirurgia ogólna</a>
        </div>
      </div>
      <div class="glass-card overflow-x-auto p-6">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="border-b border-white/15 text-xs uppercase text-zinc-400">
              <th class="pb-3">Usługa / Zabieg</th>
              <th class="px-3 pb-3">Specjalizacja</th>
              <th class="px-3 pb-3">Czas</th>
              <th class="px-3 pb-3 text-right">Cena</th>
              <th class="pl-3 pb-3 text-right">Rezerwacja</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

const ADMIN_BODY = `
  <section class="mx-auto max-w-6xl space-y-8 px-4 py-12">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <span class="rounded-full bg-[#d4af37]/20 px-3 py-1 text-xs font-medium text-[#f4e7c3]">Zalogowano: mlasers0110@icloud.com (ADMIN)</span>
        <h1 class="font-serif-display mt-2 text-3xl font-light">Panel Administratora, CMS i Narzędzie CLI</h1>
      </div>
      <div class="flex gap-3">
        <a href="./index.html?edit=1" class="btn-gold rounded-xl px-4 py-2.5 text-xs">Edytuj stronę główną na żywo</a>
        <a href="./cennik.html?edit=1" class="metal-chrome-edge rounded-xl bg-white/5 px-4 py-2.5 text-xs">Edytuj ceny w tabeli na żywo</a>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div class="glass-card p-5"><p class="text-xs text-zinc-400">Wizyty w tym tygodniu</p><p class="mt-2 text-2xl font-semibold">3</p></div>
      <div class="glass-card p-5"><p class="text-xs text-zinc-400">Przychód (opłacone)</p><p class="mt-2 text-2xl font-semibold">600.00 zł</p></div>
      <div class="glass-card p-5"><p class="text-xs text-zinc-400">Liczba usług w katalogu</p><p class="mt-2 text-2xl font-semibold">21</p></div>
      <div class="glass-card p-5"><p class="text-xs text-zinc-400">Oczekujące płatności</p><p class="mt-2 text-2xl font-semibold">1</p></div>
    </div>

    <div class="glass-card p-6 space-y-3">
      <h2 class="text-lg font-semibold text-[#f4e7c3]">Zarządzanie przez CLI (Terminal)</h2>
      <p class="text-xs text-zinc-300">W katalogu projektu możesz używać narzędzia CLI do edycji usług, cen i konfiguracji strony:</p>
      <pre class="rounded-xl bg-black/80 p-4 font-mono text-xs text-emerald-300 overflow-x-auto">npm run cli -- status
npm run cli -- services
npm run cli -- set-price konsultacja-proktologiczna 280
npm run cli -- set-config phone "+48 510 432 361"</pre>
    </div>
  </section>
  ${renderServicesTable(null, 'Zarządzanie katalogiem usług')}
`;

const REZERWACJA_BODY = `
  <section class="mx-auto max-w-xl space-y-6 px-4 py-14">
    <p class="text-brushed-gold text-[11px] font-medium uppercase tracking-[0.2em]">Kalendarz dr. Jana Bujoka</p>
    <h1 class="font-serif-display text-3xl font-light">Rezerwacja wizyty online</h1>
    <form onsubmit="event.preventDefault(); document.getElementById('rez-ok').classList.remove('hidden');" class="glass-card space-y-4 p-6">
      <label class="block space-y-1 text-xs">
        <span class="text-zinc-300">Wybierz zabieg / konsultację</span>
        <select class="w-full rounded-xl border border-white/15 bg-black/50 p-3 text-sm text-white">
          ${SERVICES.map((s) => `<option value="${s.slug}">${s.name} — ${s.priceZl} zł (${s.durationMin} min)</option>`).join('')}
        </select>
      </label>
      <div class="grid grid-cols-2 gap-3">
        <label class="block space-y-1 text-xs">
          <span class="text-zinc-300">Preferowana data</span>
          <input type="date" required class="w-full rounded-xl border border-white/15 bg-black/50 p-3 text-sm text-white" />
        </label>
        <label class="block space-y-1 text-xs">
          <span class="text-zinc-300">Godzina</span>
          <select class="w-full rounded-xl border border-white/15 bg-black/50 p-3 text-sm text-white">
            <option>10:00</option><option>11:00</option><option>12:30</option><option>15:00</option><option>16:30</option><option>18:00</option>
          </select>
        </label>
      </div>
      <label class="block space-y-1 text-xs">
        <span class="text-zinc-300">Imię i nazwisko pacjenta</span>
        <input required placeholder="Jan Kowalski" class="w-full rounded-xl border border-white/15 bg-black/50 p-3 text-sm text-white" />
      </label>
      <div class="grid grid-cols-2 gap-3">
        <label class="block space-y-1 text-xs">
          <span class="text-zinc-300">Telefon</span>
          <input required placeholder="+48 500 000 000" class="w-full rounded-xl border border-white/15 bg-black/50 p-3 text-sm text-white" />
        </label>
        <label class="block space-y-1 text-xs">
          <span class="text-zinc-300">E-mail</span>
          <input type="email" required placeholder="pacjent@example.com" class="w-full rounded-xl border border-white/15 bg-black/50 p-3 text-sm text-white" />
        </label>
      </div>
      <button type="submit" class="btn-gold w-full rounded-xl py-3.5 text-sm font-semibold">Potwierdź rezerwację terminu</button>
      <p id="rez-ok" class="hidden rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-center text-xs text-emerald-300">
        Termin został wstępnie zarezerwowany! Potwierdzenie zostało zapisane w systemie.
      </p>
    </form>
  </section>
`;

const ONAS_BODY = `
  <section class="mx-auto max-w-4xl space-y-6 px-4 py-14">
    <p class="text-brushed-gold text-[11px] font-medium uppercase tracking-[0.2em]">O klinice BM Clinics</p>
    <h1 class="font-serif-display text-3xl font-light sm:text-4xl">dr Jan Bujok — Chirurgia Ogólna, Proktologia i Flebologia</h1>
    <div class="glass-card space-y-4 p-8 text-sm leading-relaxed text-zinc-200">
      <p>BM Clinics w Warszawie (Wilanów, ul. Branickiego 10/U6) specjalizuje się w małoinwazyjnych procedurach ambulatoryjnych, które pozwalają pacjentowi wrócić do domu i codziennej aktywności tego samego dnia.</p>
      <p>Łączymy diagnostykę obrazową (USG Doppler, anoskopia, rektoskopia) z precyzyjnymi zabiegami w znieczuleniu miejscowym oraz laseroterapią naczyniową.</p>
    </div>
  </section>
`;

const KONTAKT_BODY = `
  <section class="mx-auto max-w-4xl space-y-6 px-4 py-14">
    <p class="text-brushed-gold text-[11px] font-medium uppercase tracking-[0.2em]">Kontakt i dojazd</p>
    <h1 class="font-serif-display text-3xl font-light">Skontaktuj się z rejestracją BM Clinics</h1>
    <div class="grid gap-6 md:grid-cols-2">
      <div class="glass-card space-y-4 p-6 text-sm">
        <p class="font-semibold text-white">BM Clinics — Bujok Medical</p>
        <p class="text-zinc-300">ul. Branickiego 10/U6<br/>02-972 Warszawa (Wilanów)</p>
        <p class="text-zinc-300">Telefon: <a href="tel:+48510432361" data-cms-field="phone" class="font-semibold text-[#d4af37]">+48 510 432 361</a></p>
        <p class="text-zinc-300">E-mail: kontakt@bujokmedical.pl</p>
      </div>
      <form onsubmit="event.preventDefault(); alert('Wiadomość została zapisana!');" class="glass-card space-y-3 p-6 text-xs">
        <input required placeholder="Twój e-mail" class="w-full rounded-lg border border-white/15 bg-black/40 p-3 text-white" />
        <textarea rows="4" required placeholder="Treść wiadomości..." class="w-full rounded-lg border border-white/15 bg-black/40 p-3 text-white"></textarea>
        <button type="submit" class="btn-gold w-full rounded-lg py-3 font-semibold">Wyślij wiadomość</button>
      </form>
    </div>
  </section>
`;

const PAGES = [
  { file: 'index.html', subdir: null, title: 'Strona główna', pageId: 'home', body: HOME_BODY },
  { file: 'logowanie.html', subdir: 'logowanie', title: 'Logowanie i Strefa CMS', pageId: 'logowanie', body: LOGOWANIE_BODY },
  { file: 'admin.html', subdir: 'admin', title: 'Panel Administratora & CMS', pageId: 'admin', body: ADMIN_BODY },
  { file: 'cennik.html', subdir: 'cennik', title: 'Cennik usług', pageId: 'cennik', body: renderServicesTable(null, 'Pełny cennik usług BM Clinics') },
  { file: 'sklep.html', subdir: 'sklep', title: 'Sklep zabiegowy online', pageId: 'sklep', body: renderServicesTable(null, 'Sklep zabiegowy — kup voucher / zabieg online') },
  { file: 'rezerwacja.html', subdir: 'rezerwacja', title: 'Rezerwacja wizyty', pageId: 'rezerwacja', body: REZERWACJA_BODY },
  { file: 'o-nas.html', subdir: 'o-nas', title: 'O nas', pageId: 'o-nas', body: ONAS_BODY },
  { file: 'kontakt.html', subdir: 'kontakt', title: 'Kontakt', pageId: 'kontakt', body: KONTAKT_BODY },
  { file: 'uslugi-proktologia.html', subdir: 'uslugi/proktologia', title: 'Proktologia', pageId: 'proktologia', body: renderServicesTable('proktologia', 'Proktologia — diagnostyka i zabiegi') },
  { file: 'uslugi-zylaki.html', subdir: 'uslugi/zylaki-naczynka', title: 'Żylaki i naczynka', pageId: 'zylaki', body: renderServicesTable('zylaki-naczynka', 'Żylaki i naczynka — flebologia i laseroterapia') },
  { file: 'uslugi-chirurgia.html', subdir: 'uslugi/chirurgia-ogolna', title: 'Chirurgia ogólna', pageId: 'chirurgia', body: renderServicesTable('chirurgia-ogolna', 'Chirurgia ogólna — zabiegi ambulatoryjne') },
];

function buildIntoTarget(targetDir) {
  fs.mkdirSync(targetDir, { recursive: true });
  copyDirRecursive(path.join(ROOT, 'public', 'brand'), path.join(targetDir, 'brand'));
  fs.writeFileSync(path.join(targetDir, '.nojekyll'), '', 'utf8');

  for (const p of PAGES) {
    const htmlRoot = renderShell({ title: p.title, pageId: p.pageId, prefix: '.', bodyHtml: p.body });
    fs.writeFileSync(path.join(targetDir, p.file), htmlRoot, 'utf8');

    if (p.subdir) {
      const subPath = path.join(targetDir, p.subdir);
      fs.mkdirSync(subPath, { recursive: true });
      const depth = p.subdir.split('/').length;
      const prefix = Array(depth).fill('..').join('/');
      const bodyAdjusted = p.body.replaceAll('./', `${prefix}/`);
      const htmlSub = renderShell({ title: p.title, pageId: p.pageId, prefix, bodyHtml: bodyAdjusted });
      fs.writeFileSync(path.join(subPath, 'index.html'), htmlSub, 'utf8');
    }
  }
}

buildIntoTarget(DOCS_DIR);
buildIntoTarget(OFFLINE_DISK_DIR);

// Create a convenient 1-click macOS launcher in OFFLINE_DISK_DIR
const launcherPath = path.join(OFFLINE_DISK_DIR, 'Otworz-BMClinics-Offline.command');
fs.writeFileSync(
  launcherPath,
  `#!/usr/bin/env zsh
DIR="$(cd "$(dirname "$0")" && pwd)"
open "$DIR/index.html"
open "$DIR/logowanie.html"
`,
  { mode: 0o755 }
);

console.log('Offline & Static Live-Editable bundles generated in:');
console.log(' -', DOCS_DIR);
console.log(' -', OFFLINE_DISK_DIR);
