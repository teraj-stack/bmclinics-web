#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DOCS_DIR = path.join(ROOT, 'docs');
const DEFAULT_OFFLINE_DIR = path.join(ROOT, 'offline-export');
const OFFLINE_DISK_DIR = process.env.BMCLINICS_OFFLINE_DIR
  ? path.resolve(process.env.BMCLINICS_OFFLINE_DIR)
  : DEFAULT_OFFLINE_DIR;

const SERVICES = [
  { id: 'srv-konsultacja-proktologiczna', slug: 'konsultacja-proktologiczna', categorySlug: 'proktologia', categoryName: 'Proktologia', name: 'Konsultacja proktologiczna', priceZl: 250, durationMin: 20, summary: 'Pierwsza konsultacja z oceną objawów i planem leczenia.' },
  { id: 'srv-anoskopia', slug: 'anoskopia', categorySlug: 'proktologia', categoryName: 'Proktologia', name: 'Anoskopia', priceZl: 350, durationMin: 20, summary: 'Badanie końcowego odcinka przewodu pokarmowego.' },
  { id: 'srv-rektoskopia', slug: 'rektoskopia', categorySlug: 'proktologia', categoryName: 'Proktologia', name: 'Rektoskopia', priceZl: 450, durationMin: 30, summary: 'Endoskopowa ocena odbytnicy i okrężnicy.' },
  { id: 'srv-leczenie-hemoroidow-ambulatoryjne', slug: 'leczenie-hemoroidow-ambulatoryjne', categorySlug: 'proktologia', categoryName: 'Proktologia', name: 'Leczenie hemoroidów (metody ambulatoryjne)', priceZl: 700, durationMin: 45, summary: 'Małoinwazyjne leczenie hemoroidów bez długiej hospitalizacji.' },
  { id: 'srv-leczenie-szczeliny-odbytu', slug: 'leczenie-szczeliny-odbytu', categorySlug: 'proktologia', categoryName: 'Proktologia', name: 'Leczenie szczeliny odbytu', priceZl: 700, durationMin: 45, summary: 'Łagodzenie bólu i przywracanie komfortu pacjenta.' },
  { id: 'srv-usuwanie-brodawek-okolicy-odbytu', slug: 'usuwanie-brodawek-okolicy-odbytu', categorySlug: 'proktologia', categoryName: 'Proktologia', name: 'Usuwanie brodawek okolicy odbytu', priceZl: 520, durationMin: 30, summary: 'Bezpieczne usunięcie zmian skórnych w okolicy odbytu.' },
  { id: 'srv-kontrola-po-zabiegu-proktologicznym', slug: 'kontrola-po-zabiegu-proktologicznym', categorySlug: 'proktologia', categoryName: 'Proktologia', name: 'Kontrola po zabiegu proktologicznym', priceZl: 200, durationMin: 20, summary: 'Ocena gojenia i dalszego planu leczenia.' },
  { id: 'srv-konsultacja-flebologiczna', slug: 'konsultacja-flebologiczna', categorySlug: 'zylaki-naczynka', categoryName: 'Żylaki i naczynka', name: 'Konsultacja flebologiczna', priceZl: 280, durationMin: 20, summary: 'Ocena objawów i kwalifikacja do zabiegów naczyniowych.' },
  { id: 'srv-usg-doppler-zyl-konczyn', slug: 'usg-doppler-zyl-konczyn', categorySlug: 'zylaki-naczynka', categoryName: 'Żylaki i naczynka', name: 'USG Doppler żył kończyn dolnych', priceZl: 350, durationMin: 30, summary: 'Badanie dopplerowskie naczyń kończyn.' },
  { id: 'srv-zamykanie-naczynek-nog', slug: 'zamykanie-naczynek-nog', categorySlug: 'zylaki-naczynka', categoryName: 'Żylaki i naczynka', name: 'Zamykanie naczynek na nogach', priceZl: 250, durationMin: 25, summary: 'Skuteczna metoda zamykania drobnych naczynek na nogach.' },
  { id: 'srv-zamykanie-naczynek-twarz', slug: 'zamykanie-naczynek-twarz', categorySlug: 'zylaki-naczynka', categoryName: 'Żylaki i naczynka', name: 'Zamykanie naczynek na twarzy', priceZl: 300, durationMin: 25, summary: 'Leczenie drobnych naczynek twarzy i nosa.' },
  { id: 'srv-skleroterapia-zylakow', slug: 'skleroterapia-zylakow', categorySlug: 'zylaki-naczynka', categoryName: 'Żylaki i naczynka', name: 'Skleroterapia żylaków', priceZl: 450, durationMin: 35, summary: 'Iniekcyjna terapia przewlekłych żylaków.' },
  { id: 'srv-laseroterapia-naczyniowa', slug: 'laseroterapia-naczyniowa', categorySlug: 'zylaki-naczynka', categoryName: 'Żylaki i naczynka', name: 'Laseroterapia naczyniowa', priceZl: 400, durationMin: 30, summary: 'Leczenie niewielkich naczynek laserem.' },
  { id: 'srv-kontrola-po-zabiegu-naczyniowym', slug: 'kontrola-po-zabiegu-naczyniowym', categorySlug: 'zylaki-naczynka', categoryName: 'Żylaki i naczynka', name: 'Kontrola po zabiegu naczyniowym', priceZl: 180, durationMin: 20, summary: 'Weryfikacja efektów i dalszego planu leczenia.' },
  { id: 'srv-konsultacja-chirurgiczna', slug: 'konsultacja-chirurgiczna', categorySlug: 'chirurgia-ogolna', categoryName: 'Chirurgia ogólna', name: 'Konsultacja chirurgiczna', priceZl: 270, durationMin: 20, summary: 'Ocena wskazań do zabiegów chirurgicznych.' },
  { id: 'srv-usuwanie-znamion-chirurgiczne', slug: 'usuwanie-znamion-chirurgiczne', categorySlug: 'chirurgia-ogolna', categoryName: 'Chirurgia ogólna', name: 'Chirurgiczne usuwanie znamion', priceZl: 650, durationMin: 40, summary: 'Usuwanie znamion z oceną bezpieczeństwa i gojenia.' },
  { id: 'srv-usuwanie-tluszczaka', slug: 'usuwanie-tluszczaka', categorySlug: 'chirurgia-ogolna', categoryName: 'Chirurgia ogólna', name: 'Usuwanie tłuszczaka', priceZl: 700, durationMin: 45, summary: 'Usunięcie tłuszczaka z zachowaniem estetyki i bezpieczeństwa.' },
  { id: 'srv-usuwanie-torbieli', slug: 'usuwanie-torbieli', categorySlug: 'chirurgia-ogolna', categoryName: 'Chirurgia ogólna', name: 'Usuwanie torbieli skórnych', priceZl: 650, durationMin: 45, summary: 'Drobna operacja torbieli z pełnym zabezpieczeniem.' },
  { id: 'srv-leczenie-wrastajacego-paznokcia', slug: 'leczenie-wrastajacego-paznokcia', categorySlug: 'chirurgia-ogolna', categoryName: 'Chirurgia ogólna', name: 'Leczenie wrastającego paznokcia', priceZl: 520, durationMin: 35, summary: 'Leczenie wrastającego paznokcia przy pomocy małoinwazyjnych metod.' },
  { id: 'srv-drobne-zabiegi-chirurgiczne', slug: 'drobne-zabiegi-chirurgiczne', categorySlug: 'chirurgia-ogolna', categoryName: 'Chirurgia ogólna', name: 'Drobne zabiegi chirurgiczne ambulatoryjne', priceZl: 580, durationMin: 40, summary: 'Małe zabiegi ambulatoryjne w praktyce ogólnochirurgicznej.' },
  { id: 'srv-kontrola-po-zabiegu-chirurgicznym', slug: 'kontrola-po-zabiegu-chirurgicznym', categorySlug: 'chirurgia-ogolna', categoryName: 'Chirurgia ogólna', name: 'Kontrola po zabiegu chirurgicznym', priceZl: 200, durationMin: 20, summary: 'Weryfikacja gojenia po małym zabiegu chirurgicznym.' }
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
  <header class="sticky top-0 z-50 w-full site-header-glass" data-cms-ignore="true">
    <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
      <a href="${prefix}/index.html" class="flex items-center gap-3">
        <img src="${prefix}/brand/logo-bujok-medical-header.png" alt="Bujok Medical" class="h-11 w-auto object-contain" />
      </a>
      <nav class="hidden items-center gap-1 text-[13px] font-medium lg:flex">
        <a href="${prefix}/uslugi-proktologia.html" class="rounded-lg px-3 py-2 text-zinc-300 hover:bg-white/5 hover:text-white flex items-center gap-1.5"><span class="h-1.5 w-1.5 rounded-full bg-[#d4af37]"></span>Proktologia</a>
        <a href="${prefix}/uslugi-zylaki.html" class="rounded-lg px-3 py-2 text-zinc-300 hover:bg-white/5 hover:text-white flex items-center gap-1.5"><span class="h-1.5 w-1.5 rounded-full bg-sky-400"></span>Żylaki i naczynka</a>
        <a href="${prefix}/uslugi-chirurgia.html" class="rounded-lg px-3 py-2 text-zinc-300 hover:bg-white/5 hover:text-white flex items-center gap-1.5"><span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>Chirurgia</a>
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

  <div id="bm-live-studio" data-cms-ignore="true" class="fixed right-4 bottom-4 z-50 flex flex-wrap items-center gap-2 rounded-2xl border border-white/15 bg-[#12110e]/95 p-2 text-xs text-white shadow-2xl">
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
        const htmlContent = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;
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

function buildIntoTarget(targetDir) {
  fs.mkdirSync(targetDir, { recursive: true });
  copyDirRecursive(path.join(ROOT, 'public', 'brand'), path.join(targetDir, 'brand'));
  fs.writeFileSync(path.join(targetDir, '.nojekyll'), '', 'utf8');

  const pages = [
    { file: 'index.html', subdir: null, title: 'Strona główna', pageId: 'home', body: 'homepage' },
    { file: 'logowanie.html', subdir: 'logowanie', title: 'Logowanie i Strefa CMS', pageId: 'logowanie', body: 'login' },
    { file: 'admin.html', subdir: 'admin', title: 'Panel Administratora & CMS', pageId: 'admin', body: 'admin' },
    { file: 'cennik.html', subdir: 'cennik', title: 'Cennik usług', pageId: 'cennik', body: 'pricing' },
    { file: 'sklep.html', subdir: 'sklep', title: 'Sklep zabiegowy online', pageId: 'sklep', body: 'shop' },
    { file: 'rezerwacja.html', subdir: 'rezerwacja', title: 'Rezerwacja wizyty', pageId: 'rezerwacja', body: 'booking' },
    { file: 'o-nas.html', subdir: 'o-nas', title: 'O nas', pageId: 'o-nas', body: 'about' },
    { file: 'kontakt.html', subdir: 'kontakt', title: 'Kontakt', pageId: 'kontakt', body: 'contact' },
    { file: 'uslugi-proktologia.html', subdir: 'uslugi/proktologia', title: 'Proktologia', pageId: 'proktologia', body: 'services-proktologia' },
    { file: 'uslugi-zylaki.html', subdir: 'uslugi/zylaki-naczynka', title: 'Żylaki i naczynka', pageId: 'zylaki', body: 'services-zylaki' },
    { file: 'uslugi-chirurgia.html', subdir: 'uslugi/chirurgia-ogolna', title: 'Chirurgia ogólna', pageId: 'chirurgia', body: 'services-chirurgia' }
  ];

  for (const p of pages) {
    const payload = p.body === 'homepage' ? `home` : p.body === 'login' ? `login` : p.body === 'admin' ? `admin` : p.body === 'pricing' ? `pricing` : p.body === 'shop' ? `shop` : p.body === 'booking' ? `booking` : p.body === 'about' ? `about` : p.body === 'contact' ? `contact` : p.body === 'services-proktologia' ? `services-proktologia` : p.body === 'services-zylaki' ? `services-zylaki` : `services-chirurgia`;
    const htmlRoot = renderShell({ title: p.title, pageId: p.pageId, prefix: '.', bodyHtml: payload });
    fs.writeFileSync(path.join(targetDir, p.file), htmlRoot, 'utf8');

    if (p.subdir) {
      const subPath = path.join(targetDir, p.subdir);
      fs.mkdirSync(subPath, { recursive: true });
      const depth = p.subdir.split('/').length;
      const prefix = Array(depth).fill('..').join('/');
      const htmlSub = renderShell({ title: p.title, pageId: p.pageId, prefix, bodyHtml: payload });
      fs.writeFileSync(path.join(subPath, 'index.html'), htmlSub, 'utf8');
    }
  }
}

function ensurePortableLauncher(targetDir) {
  const launcherPath = path.join(targetDir, 'Otworz-BMClinics-Offline.command');
  fs.writeFileSync(
    launcherPath,
    `#!/usr/bin/env zsh
DIR="$(cd "$(dirname "$0")" && pwd)"
open "$DIR/index.html"
open "$DIR/logowanie.html"
`,
    { mode: 0o755 }
  );
}

buildIntoTarget(DOCS_DIR);
buildIntoTarget(OFFLINE_DISK_DIR);
ensurePortableLauncher(OFFLINE_DISK_DIR);

console.log('Offline & Static Live-Editable bundles generated in:');
console.log(' -', DOCS_DIR);
console.log(' -', OFFLINE_DISK_DIR);
console.log('Optional override: BMCLINICS_OFFLINE_DIR=/path/to/folder npm run build:offline');
