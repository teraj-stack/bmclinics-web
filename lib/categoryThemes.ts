export type MotionStyle = 'calm' | 'flow' | 'soft';

export interface CategoryTheme {
  slug: string;
  label: string;
  accent: string;
  background: string;
  motionStyle: MotionStyle;
  seoSummary: string;
}

export const CATEGORY_THEMES: Record<string, CategoryTheme> = {
  proktologia: {
    slug: 'proktologia',
    label: 'Proktologia',
    accent: '#5c7a52',
    background: '#1f211d',
    motionStyle: 'calm',
    seoSummary:
      'Konsultacje i zabiegi proktologiczne prowadzone przez doświadczonych lekarzy – diagnostyka, leczenie i bezpieczne procedury w komfortowych warunkach kliniki.',
  },
  'zylaki-naczynka': {
    slug: 'zylaki-naczynka',
    label: 'Żylaki i naczynka',
    accent: '#2f6fb3',
    background: '#ffffff',
    motionStyle: 'flow',
    seoSummary:
      'Zamykanie naczynek i leczenie żylaków nowoczesnymi metodami małoinwazyjnymi – szybki powrót do codziennych aktywności i widoczne efekty po zabiegu.',
  },
  'chirurgia-ogolna': {
    slug: 'chirurgia-ogolna',
    label: 'Chirurgia ogólna',
    accent: '#7c6bab',
    background: '#f6f3fa',
    motionStyle: 'soft',
    seoSummary:
      'Zabiegi z zakresu chirurgii ogólnej wykonywane w bezpiecznym środowisku klinicznym, z pełną opieką przed- i pooperacyjną dostosowaną do potrzeb pacjenta.',
  },
};

export function getCategoryTheme(slug: string): CategoryTheme | undefined {
  return CATEGORY_THEMES[slug];
}

export function getAllCategorySlugs(): string[] {
  return Object.keys(CATEGORY_THEMES);
}
