import Link from 'next/link';
import CartIndicator from '@/components/cart/CartIndicator';

export const metadata = {
  title: 'Sklep — zabiegi i usługi',
  description:
    'Kup wybrane zabiegi i usługi medyczne online, opłać wygodnie przez Przelewy24 i umów termin bez wychodzenia z domu.',
};

export default function SklepLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/sklep" className="text-lg font-semibold">
          Sklep
        </Link>
        <CartIndicator />
      </div>
      {children}
    </div>
  );
}
