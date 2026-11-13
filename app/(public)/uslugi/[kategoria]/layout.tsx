import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import CategoryBackground from '@/components/theme/CategoryBackground';
import { CATEGORY_THEMES } from '@/lib/categoryThemes';

interface Props {
  children: React.ReactNode;
  params: Promise<{ kategoria: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kategoria } = await params;
  const theme = CATEGORY_THEMES[kategoria];
  if (!theme) return {};

  return {
    title: `${theme.label} – BM Clinics`,
    description: theme.seoSummary,
    openGraph: {
      title: `${theme.label} – BM Clinics`,
      description: theme.seoSummary,
    },
  };
}

export default async function KategoriaLayout({ children, params }: Props) {
  const { kategoria } = await params;
  const theme = CATEGORY_THEMES[kategoria];
  if (!theme) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalSpecialty',
    name: theme.label,
    description: theme.seoSummary,
  };

  return (
    <div data-category={theme.slug} className="category-shell min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CategoryBackground motionStyle={theme.motionStyle} />
      <main className="relative z-10 px-4 py-8">{children}</main>
    </div>
  );
}
