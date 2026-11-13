#!/usr/bin/env node
/**
 * BM Clinics CLI — Zarządzanie treścią i cennikiem lokalnie oraz online (przez /api/cms)
 *
 * Przykłady użycia:
 *   npm run cli -- status
 *   npm run cli -- services
 *   npm run cli -- set-config phone "+48 510 432 361"
 *   npm run cli -- set-price konsultacja-proktologiczna 280
 *   npm run cli -- add-service badanie-usg zylaki-naczynka 320 30 "Badanie USG żył"
 *   npm run cli -- --url https://bmclinics-web.vercel.app status
 */

const args = process.argv.slice(2);
let baseUrl =
  process.env.BMCLINICS_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  'http://localhost:3000';

const filteredArgs = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--url' && args[i + 1]) {
    baseUrl = args[i + 1].replace(/\/+$/, '');
    i += 1;
  } else if (args[i].startsWith('--url=')) {
    baseUrl = args[i].split('=')[1].replace(/\/+$/, '');
  } else {
    filteredArgs.push(args[i]);
  }
}

const [command = 'help', ...rest] = filteredArgs;
const apiEndpoint = `${baseUrl}/api/cms`;

async function requestCms(method = 'GET', body = undefined) {
  const res = await fetch(apiEndpoint, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
}

async function main() {
  switch (command) {
    case 'status': {
      const state = await requestCms('GET');
      console.log('=== BM Clinics CMS Status ===');
      console.log(`Endpoint : ${apiEndpoint}`);
      console.log(`Updated  : ${state.updatedAt}`);
      console.log(`Klinika  : ${state.siteConfig.clinicName}`);
      console.log(`Telefon  : ${state.siteConfig.phone}`);
      console.log(`Adres    : ${state.siteConfig.addressLine1}, ${state.siteConfig.addressLine2}`);
      console.log(`Usługi   : ${state.services.length}`);
      console.log(`Wizyty   : ${state.visits.length}`);
      console.log(`Zamówienia: ${state.orders.length}`);
      break;
    }

    case 'services': {
      const state = await requestCms('GET');
      console.log(`=== Katalog usług (${state.services.length}) @ ${baseUrl} ===`);
      for (const s of state.services) {
        const zl = (s.priceGrosze / 100).toFixed(0).padStart(4, ' ');
        console.log(
          `- [${s.categorySlug.padEnd(16)}] ${s.slug.padEnd(38)} | ${zl} zł | ${s.durationMin} min | ${s.name}`
        );
      }
      break;
    }

    case 'set-config': {
      const [key, ...valParts] = rest;
      const value = valParts.join(' ');
      if (!key || !value) {
        console.error('Użycie: npm run cli -- set-config <klucz> <wartość>');
        process.exit(1);
      }
      const res = await requestCms('POST', {
        action: 'updateSiteConfig',
        siteConfig: { [key]: value },
      });
      console.log(`Zaktualizowano siteConfig.${key} = "${ res.state.siteConfig[key] }"`);
      break;
    }

    case 'set-price': {
      const [slug, priceStr] = rest;
      const priceZl = Number(priceStr);
      if (!slug || Number.isNaN(priceZl)) {
        console.error('Użycie: npm run cli -- set-price <slug-uslugi> <cena-w-zl>');
        process.exit(1);
      }
      const current = await requestCms('GET');
      const target = current.services.find((s) => s.slug === slug || s.id === slug);
      if (!target) {
        console.error(`Nie znaleziono usługi o slugu: ${slug}`);
        process.exit(1);
      }
      await requestCms('POST', {
        action: 'upsertService',
        service: { ...target, priceGrosze: Math.round(priceZl * 100) },
      });
      console.log(`Zmieniono cenę usługi "${target.name}" (${slug}) na ${priceZl} zł.`);
      break;
    }

    case 'add-service': {
      const [slug, categorySlug, priceStr, durationStr, name, seoSummary] = rest;
      if (!slug || !categorySlug || !priceStr || !durationStr || !name) {
        console.error(
          'Użycie: npm run cli -- add-service <slug> <kategoria> <cenaZl> <czasMin> "<Nazwa>" ["<Opis>"]'
        );
        process.exit(1);
      }
      await requestCms('POST', {
        action: 'upsertService',
        service: {
          id: `srv-${slug}`,
          slug,
          categorySlug,
          name,
          priceGrosze: Math.round(Number(priceStr) * 100),
          durationMin: Number(durationStr),
          seoSummary: seoSummary || name,
          fullDescription: seoSummary || name,
        },
      });
      console.log(`Dodano / zaktualizowano usługę: ${name} (${slug}) — ${priceStr} zł.`);
      break;
    }

    case 'delete-service': {
      const [idOrSlug] = rest;
      if (!idOrSlug) {
        console.error('Użycie: npm run cli -- delete-service <slug-lub-id>');
        process.exit(1);
      }
      await requestCms('POST', { action: 'deleteService', id: idOrSlug });
      console.log(`Usunięto usługę: ${idOrSlug}`);
      break;
    }

    case 'reset': {
      await requestCms('POST', { action: 'resetAll' });
      console.log('Zresetowano stan CMS do wartości domyślnych.');
      break;
    }

    default: {
      console.log(`BM Clinics CLI — Narzędzie edycji online i lokalnej
Adres docelowy: ${baseUrl} (zmień flagą --url https://...)

Dostępne komendy:
  npm run cli -- status
  npm run cli -- services
  npm run cli -- set-config <pole> "<wartość>"
  npm run cli -- set-price <slug> <cena_w_zl>
  npm run cli -- add-service <slug> <kategoria> <cena_zl> <czas_min> "<Nazwa>" ["<Opis>"]
  npm run cli -- delete-service <slug>
  npm run cli -- reset`);
    }
  }
}

main().catch((err) => {
  console.error('Błąd CLI:', err.message);
  process.exit(1);
});
