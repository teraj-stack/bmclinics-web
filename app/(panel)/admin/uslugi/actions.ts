'use server';

import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/authGuard';
import { upsertCmsService, removeCmsService } from '@/lib/cmsStore';
import { revalidatePath } from 'next/cache';

export async function createService(formData: FormData) {
  await requireRole('ADMIN');

  const slug = String(formData.get('slug'));
  const serviceData = {
    id: `srv-${slug}`,
    slug,
    categorySlug: String(formData.get('categorySlug')),
    name: String(formData.get('name')),
    priceGrosze: Number(formData.get('priceGrosze')),
    durationMin: Number(formData.get('durationMin')),
    seoSummary: String(formData.get('seoSummary')),
    fullDescription: String(formData.get('fullDescription')),
  };

  upsertCmsService(serviceData);

  if (process.env.DATABASE_URL) {
    try {
      await prisma.service.create({
        data: {
          slug: serviceData.slug,
          categorySlug: serviceData.categorySlug,
          name: serviceData.name,
          priceGrosze: serviceData.priceGrosze,
          durationMin: serviceData.durationMin,
          seoSummary: serviceData.seoSummary,
          fullDescription: serviceData.fullDescription,
        },
      });
    } catch {
      // CMS store already updated
    }
  }

  revalidatePath('/admin/uslugi');
  revalidatePath('/cennik');
  revalidatePath('/sklep');
}

export async function deleteService(id: string) {
  await requireRole('ADMIN');
  removeCmsService(id);

  if (process.env.DATABASE_URL) {
    try {
      await prisma.service.delete({ where: { id } });
    } catch {
      // CMS store already updated
    }
  }

  revalidatePath('/admin/uslugi');
  revalidatePath('/cennik');
  revalidatePath('/sklep');
}
