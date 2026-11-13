import { Montserrat } from 'next/font/google';
import type { ReactNode } from 'react';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-cab-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export default function CabBookingDemoLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${montserrat.variable} cab-booking-demo min-h-screen`}
      style={{ fontFamily: 'var(--font-cab-sans), system-ui, sans-serif' }}
    >
      {/* Isolate demo from site chrome (header/footer live in root layout). */}
      <style>{`
        body:has(.cab-booking-demo) header,
        body:has(.cab-booking-demo) footer {
          display: none !important;
        }
      `}</style>
      {children}
    </div>
  );
}
