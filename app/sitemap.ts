import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { getAllBlogSlugs } from '@/lib/content';
import { getAllCategorySlugs } from '@/lib/categoryThemes';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://bmclinic.net';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let services: { slug: string; categorySlug: string }[] = [];
  try {
    services = await prisma.service.findMany({ select: { slug: true, categorySlug: true } });
  } catch {
    services = [];
  }

  const blogSlugs = getAllBlogSlugs();
  const categories = getAllCategorySlugs();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/o-nas`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/cennik`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/kontakt`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/faq`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/polityka`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/regulamin`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/rezerwacja`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/sklep`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/blog`, changeFrequency: 'weekly', priority: 0.6 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((slug) => ({
    url: `${BASE_URL}/uslugi/${slug}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${BASE_URL}/uslugi/${s.categorySlug}/${s.slug}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [...staticRoutes, ...categoryRoutes, ...serviceRoutes, ...blogRoutes];
}
