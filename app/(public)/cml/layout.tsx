import type { Metadata } from 'next';
import { Cormorant_Garamond } from 'next/font/google';

const display = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500'],
  variable: '--font-cml-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Spokojna wizyta proktologiczna',
  description:
    'Landing Jana Bujoka — chirurg, specjalista chirurgii ogólnej, flebolog, proktolog. Od objawu do planu leczenia. Spokojna rozmowa, krótkie badanie w pozycji bocznej, indywidualne metody laserowe.',
};

export default function CmlLayout({ children }: { children: React.ReactNode }) {
  return <div className={display.variable}>{children}</div>;
}
