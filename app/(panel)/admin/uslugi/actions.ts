'use server';

import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/authGuard';
import { revalidatePath } from 'next/cache';

export async function createService(formData: FormData) {
  await requireRole('ADMIN');

  await prisma.service.create({
    data: {
      slug: String(formData.get('slug')),
      categorySlug: String(formData.get('categorySlug')),
      name: String(formData.get('name')),
      priceGrosze: Number(formData.get('priceGrosze')),
      durationMin: Number(formData.get('durationMin')),
      seoSummary: String(formData.get('seoSummary')),
      fullDescription: String(formData.get('fullDescription')),
    },
  });

  revalidatePath('/admin/uslugi');
  revalidatePath('/cennik');
  revalidatePath('/sklep');
}

export async function deleteService(id: string) {
  await requireRole('ADMIN');
  await prisma.service.delete({ where: { id } });
  revalidatePath('/admin/uslugi');
  revalidatePath('/cennik');
  revalidatePath('/sklep');
}
