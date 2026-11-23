import type { Metadata } from 'next';
import { Fraunces, Montserrat } from 'next/font/google';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import AuthProvider from '@/components/auth/AuthProvider';
import { CartProvider } from '@/components/cart/CartProvider';
import KillNextPortal from '@/components/dev/KillNextPortal';
import './globals.css';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? 'https://bmclinic.net'),
  title: {
    default: 'BM Clinics — Klinika Chirurgiczna',
    template: '%s | BM Clinics',
  },
  description:
    'Precyzyjna proktologia, leczenie żylaków i naczynek oraz chirurgia ogólna. Rezerwacja wizyt online i sklep z zabiegami.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl">
      <body
        className={`${montserrat.variable} ${fraunces.variable} flex min-h-screen flex-col antialiased`}
      >
        <KillNextPortal />
        <AuthProvider>
          <CartProvider>
            <SiteHeader />
            <div className="flex-1">{children}</div>
            <SiteFooter />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
