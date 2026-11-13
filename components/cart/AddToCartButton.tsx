'use client';

import { useState } from 'react';
import { useCart } from './CartProvider';
import { ShoppingBag, Check } from 'lucide-react';

interface Props {
  service: { serviceId: string; name: string; priceGrosze: number };
}

export default function AddToCartButton({ service }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem(service);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
        added
          ? 'bg-emerald-600 text-white'
          : 'btn-gold shadow-sm'
      }`}
    >
      {added ? (
        <>
          <Check className="h-3.5 w-3.5" />
          <span>Dodano do koszyka</span>
        </>
      ) : (
        <>
          <ShoppingBag className="h-3.5 w-3.5" />
          <span>Kup online</span>
        </>
      )}
    </button>
  );
}
