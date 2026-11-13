import fs from 'fs';
import path from 'path';
import {
  FALLBACK_SERVICES,
  FALLBACK_DOCTORS,
  type CatalogService,
  type CatalogDoctor,
} from './servicesCatalog';

export interface CmsSpecialtyCard {
  tone: 'proktologia' | 'zylaki' | 'chirurgia';
  href: string;
  title: string;
  blurb: string;
  price: string;
}

export interface CmsSiteConfig {
  clinicName: string;
  doctorName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  heroEyebrow: string;
  heroTitle: string;
  standardEyebrow: string;
  standardTitle: string;
  standardBody: string;
  consultTitle: string;
  consultBody: string;
  ctaTitle: string;
  ctaSubtitle: string;
  specialties: CmsSpecialtyCard[];
}

export interface CmsVisit {
  id: string;
  doctorId: string;
  doctorName: string;
  patientName: string;
  patientEmail: string;
  serviceId: string;
  serviceName: string;
  startTime: string;
  status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
}

export interface CmsOrder {
  id: string;
  createdAt: string;
  customerEmail: string;
  amountGrosze: number;
  status: 'PAID' | 'PENDING' | 'FAILED';
  items: { quantity: number; serviceName: string }[];
}

export interface CmsState {
  updatedAt: string;
  siteConfig: CmsSiteConfig;
  services: CatalogService[];
  doctors: CatalogDoctor[];
  visits: CmsVisit[];
  orders: CmsOrder[];
  inlineOverrides: Record<string, string>;
}

export const DEFAULT_SITE_CONFIG: CmsSiteConfig = {
  clinicName: 'BM Clinics — Klinika Chirurgiczna',
  doctorName: 'Jan Bujok',
  phone: '+48 510 432 361',
  email: 'kontakt@bujokmedical.pl',
  addressLine1: 'Warszawa Wilanów',
  addressLine2: 'ul. Branickiego 10/U6',
  heroEyebrow: 'Zakres opieki',
  heroTitle: 'Trzy ścieżki kliniczne',
  standardEyebrow: 'Standard BMClinic',
  standardTitle: 'Zabiegi ambulatoryjne bez długiej hospitalizacji',
  standardBody:
    'Jan Bujok łączy doświadczenie kliniczne z wygodą rezerwacji online. Procedury w znieczuleniu miejscowym — powrót do domu tego samego dnia.',
  consultTitle: 'Konsultacja z chirurgiem',
  consultBody:
    'Jan Bujok odpowiada w sprawie kwalifikacji do zabiegów i przygotowania do badań.',
  ctaTitle: 'Gotowy na wizytę?',
  ctaSubtitle: 'Wybierz usługę, sprawdź terminy i umów wizytę w kilka minut.',
  specialties: [
    {
      href: '/uslugi/proktologia',
      title: 'Proktologia',
      blurb:
        'Diagnostyka i małoinwazyjne leczenie chorób odbytu i odbytnicy. Hemoroidy, szczeliny, anoskopia.',
      price: 'od 200 zł',
      tone: 'proktologia',
    },
    {
      href: '/uslugi/zylaki-naczynka',
      title: 'Żylaki i naczynka',
      blurb: 'Flebologia: USG Doppler, laserowe zamykanie naczynek oraz skleroterapia żylaków.',
      price: 'od 180 zł',
      tone: 'zylaki',
    },
    {
      href: '/uslugi/chirurgia-ogolna',
      title: 'Chirurgia ogólna',
      blurb: 'Znamiona, tłuszczaki, torbiele oraz wrastające paznokcie — z oceną histopatologiczną.',
      price: 'od 180 zł',
      tone: 'chirurgia',
    },
  ],
};

function createDefaultVisits(): CmsVisit[] {
  const today10 = new Date();
  today10.setHours(10, 30, 0, 0);
  const today13 = new Date();
  today13.setHours(13, 0, 0, 0);
  const tomorrow11 = new Date();
  tomorrow11.setDate(tomorrow11.getDate() + 1);
  tomorrow11.setHours(11, 0, 0, 0);

  return [
    {
      id: 'vis-1',
      doctorId: 'dr-jan-bujok',
      doctorName: 'Jan Bujok',
      patientName: 'Anna Kowalska',
      patientEmail: 'anna.kowalska@example.com',
      serviceId: 'srv-konsultacja-proktologiczna',
      serviceName: 'Konsultacja proktologiczna',
      startTime: today10.toISOString(),
      status: 'CONFIRMED',
    },
    {
      id: 'vis-2',
      doctorId: 'dr-jan-bujok',
      doctorName: 'Jan Bujok',
      patientName: 'Piotr Nowak',
      patientEmail: 'piotr.nowak@example.com',
      serviceId: 'srv-usg-doppler-zyl-konczyn',
      serviceName: 'USG Doppler żył kończyn dolnych',
      startTime: today13.toISOString(),
      status: 'CONFIRMED',
    },
    {
      id: 'vis-3',
      doctorId: 'dr-jan-bujok',
      doctorName: 'Jan Bujok',
      patientName: 'Katarzyna Wiśniewska',
      patientEmail: 'k.wisniewska@example.com',
      serviceId: 'srv-usuwanie-znamion-chirurgiczne',
      serviceName: 'Chirurgiczne usuwanie znamion',
      startTime: tomorrow11.toISOString(),
      status: 'CONFIRMED',
    },
  ];
}

function createDefaultOrders(): CmsOrder[] {
  return [
    {
      id: 'ord-1',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      customerEmail: 'anna.kowalska@example.com',
      amountGrosze: 25000,
      status: 'PAID',
      items: [{ quantity: 1, serviceName: 'Konsultacja proktologiczna' }],
    },
    {
      id: 'ord-2',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      customerEmail: 'piotr.nowak@example.com',
      amountGrosze: 35000,
      status: 'PAID',
      items: [{ quantity: 1, serviceName: 'USG Doppler żył kończyn dolnych' }],
    },
    {
      id: 'ord-3',
      createdAt: new Date().toISOString(),
      customerEmail: 'marek.zielinski@example.com',
      amountGrosze: 45000,
      status: 'PENDING',
      items: [{ quantity: 1, serviceName: 'Skleroterapia żylaków' }],
    },
  ];
}

const REPO_CMS_PATH = path.join(process.cwd(), 'content', 'cms-state.json');
const TMP_CMS_PATH = '/tmp/bmclinics-cms-state.json';

const globalForCms = globalThis as unknown as { cmsState?: CmsState };

export function getDefaultCmsState(): CmsState {
  return {
    updatedAt: new Date().toISOString(),
    siteConfig: structuredClone(DEFAULT_SITE_CONFIG),
    services: structuredClone(FALLBACK_SERVICES),
    doctors: structuredClone(FALLBACK_DOCTORS),
    visits: createDefaultVisits(),
    orders: createDefaultOrders(),
    inlineOverrides: {},
  };
}

export function getCmsState(): CmsState {
  // 1. Check /tmp runtime store first (works on Vercel Serverless & local)
  try {
    if (fs.existsSync(TMP_CMS_PATH)) {
      const raw = fs.readFileSync(TMP_CMS_PATH, 'utf8');
      const parsed = JSON.parse(raw) as Partial<CmsState>;
      const def = getDefaultCmsState();
      return {
        updatedAt: parsed.updatedAt ?? def.updatedAt,
        siteConfig: { ...def.siteConfig, ...(parsed.siteConfig ?? {}) },
        services: parsed.services?.length ? parsed.services : def.services,
        doctors: parsed.doctors?.length ? parsed.doctors : def.doctors,
        visits: parsed.visits ?? def.visits,
        orders: parsed.orders ?? def.orders,
        inlineOverrides: parsed.inlineOverrides ?? {},
      };
    }
  } catch {
    // ignore read error
  }

  // 2. Check repo content/cms-state.json
  try {
    if (fs.existsSync(REPO_CMS_PATH)) {
      const raw = fs.readFileSync(REPO_CMS_PATH, 'utf8');
      const parsed = JSON.parse(raw) as Partial<CmsState>;
      const def = getDefaultCmsState();
      return {
        updatedAt: parsed.updatedAt ?? def.updatedAt,
        siteConfig: { ...def.siteConfig, ...(parsed.siteConfig ?? {}) },
        services: parsed.services?.length ? parsed.services : def.services,
        doctors: parsed.doctors?.length ? parsed.doctors : def.doctors,
        visits: parsed.visits ?? def.visits,
        orders: parsed.orders ?? def.orders,
        inlineOverrides: parsed.inlineOverrides ?? {},
      };
    }
  } catch {
    // ignore read error
  }

  // 3. Fallback to in-memory or default
  if (!globalForCms.cmsState) {
    globalForCms.cmsState = getDefaultCmsState();
  }
  return globalForCms.cmsState;
}

export function saveCmsState(nextState: CmsState): CmsState {
  const stamped: CmsState = {
    ...nextState,
    updatedAt: new Date().toISOString(),
  };
  globalForCms.cmsState = stamped;

  try {
    fs.writeFileSync(TMP_CMS_PATH, JSON.stringify(stamped, null, 2), 'utf8');
  } catch {
    // ignore if /tmp unavailable
  }

  try {
    const dir = path.dirname(REPO_CMS_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(REPO_CMS_PATH, JSON.stringify(stamped, null, 2), 'utf8');
  } catch {
    // On Vercel serverless, repo dir is read-only; /tmp + memory handles it
  }

  return stamped;
}

export function updateCmsSiteConfig(patch: Partial<CmsSiteConfig>): CmsState {
  const current = getCmsState();
  return saveCmsState({
    ...current,
    siteConfig: {
      ...current.siteConfig,
      ...patch,
    },
  });
}

export function updateCmsInlineOverrides(overrides: Record<string, string>): CmsState {
  const current = getCmsState();
  return saveCmsState({
    ...current,
    inlineOverrides: {
      ...current.inlineOverrides,
      ...overrides,
    },
  });
}

export function resetCmsInlineOverrides(): CmsState {
  const current = getCmsState();
  return saveCmsState({
    ...current,
    inlineOverrides: {},
  });
}

export function upsertCmsService(service: CatalogService): CmsState {
  const current = getCmsState();
  const idx = current.services.findIndex((s) => s.id === service.id || s.slug === service.slug);
  const nextServices = [...current.services];
  if (idx >= 0) {
    nextServices[idx] = { ...nextServices[idx], ...service };
  } else {
    nextServices.push(service);
  }
  return saveCmsState({
    ...current,
    services: nextServices,
  });
}

export function removeCmsService(id: string): CmsState {
  const current = getCmsState();
  return saveCmsState({
    ...current,
    services: current.services.filter((s) => s.id !== id && s.slug !== id),
  });
}
