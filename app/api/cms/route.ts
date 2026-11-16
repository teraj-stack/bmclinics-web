import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  getCmsState,
  saveCmsState,
  getDefaultCmsState,
  updateCmsSiteConfig,
  updateCmsInlineOverrides,
  resetCmsInlineOverrides,
  upsertCmsService,
  removeCmsService,
  type CmsSiteConfig,
  type CmsState,
} from '@/lib/cmsStore';
import type { CatalogService } from '@/lib/servicesCatalog';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export const dynamic = 'force-dynamic';

export async function GET() {
  const state = getCmsState();
  return NextResponse.json(state, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Brak uprawnień administratora' }, { status: 403 });
  }
  try {
    const body = await req.json();
    const action = body?.action as string | undefined;

    let nextState: CmsState;

    switch (action) {
      case 'updateSiteConfig': {
        const patch = (body.siteConfig ?? {}) as Partial<CmsSiteConfig>;
        nextState = updateCmsSiteConfig(patch);
        break;
      }
      case 'updateInlineOverrides': {
        const overrides = (body.inlineOverrides ?? {}) as Record<string, string>;
        nextState = updateCmsInlineOverrides(overrides);
        break;
      }
      case 'resetInlineOverrides': {
        nextState = resetCmsInlineOverrides();
        break;
      }
      case 'upsertService': {
        const svc = body.service as CatalogService;
        if (!svc || !svc.name || !svc.slug) {
          return NextResponse.json(
            { error: 'Wymagane pola usługi: name, slug' },
            { status: 400 }
          );
        }
        nextState = upsertCmsService({
          id: svc.id || `srv-${svc.slug}`,
          slug: svc.slug,
          categorySlug: svc.categorySlug || 'proktologia',
          name: svc.name,
          priceGrosze: Number(svc.priceGrosze) || 25000,
          durationMin: Number(svc.durationMin) || 30,
          seoSummary: svc.seoSummary || svc.name,
          fullDescription: svc.fullDescription || svc.seoSummary || svc.name,
        });
        break;
      }
      case 'deleteService': {
        const id = String(body.id || '');
        nextState = removeCmsService(id);
        break;
      }
      case 'resetAll': {
        nextState = saveCmsState(getDefaultCmsState());
        break;
      }
      case 'importState': {
        const current = getCmsState();
        nextState = saveCmsState({
          ...current,
          ...(body.state ?? {}),
        });
        break;
      }
      default: {
        // Allow direct partial state update
        const current = getCmsState();
        nextState = saveCmsState({
          ...current,
          ...(body.siteConfig ? { siteConfig: { ...current.siteConfig, ...body.siteConfig } } : {}),
          ...(body.inlineOverrides
            ? { inlineOverrides: { ...current.inlineOverrides, ...body.inlineOverrides } }
            : {}),
          ...(Array.isArray(body.services) ? { services: body.services } : {}),
        });
      }
    }

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/cennik');
      revalidatePath('/sklep');
      revalidatePath('/admin');
      revalidatePath('/admin/uslugi');
    } catch {
      // ignore revalidate errors in edge contexts
    }

    return NextResponse.json({ ok: true, state: nextState });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Błąd zapisu CMS' },
      { status: 500 }
    );
  }
}
