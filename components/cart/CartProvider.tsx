'use client';

import { createContext, useContext, useSyncExternalStore, type ReactNode } from 'react';

export interface CartItem {
  serviceId: string;
  name: string;
  priceGrosze: number;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (serviceId: string) => void;
  updateQuantity: (serviceId: string, quantity: number) => void;
  clear: () => void;
  totalGrosze: number;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'klinika_cart';
const EMPTY: CartItem[] = [];

type Listener = () => void;
const listeners = new Set<Listener>();

let cachedRaw: string | null | undefined;
let cachedItems: CartItem[] = EMPTY;

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) {
      cachedRaw = undefined;
      listener();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

function getCartSnapshot(): CartItem[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedItems;

  cachedRaw = raw;
  if (!raw) {
    cachedItems = EMPTY;
    return cachedItems;
  }

  try {
    const parsed = JSON.parse(raw) as CartItem[];
    cachedItems = Array.isArray(parsed) ? parsed : EMPTY;
  } catch {
    cachedItems = EMPTY;
  }
  return cachedItems;
}

function getServerSnapshot(): CartItem[] {
  return EMPTY;
}

function setCart(items: CartItem[]) {
  const raw = JSON.stringify(items);
  localStorage.setItem(STORAGE_KEY, raw);
  cachedRaw = raw;
  cachedItems = items;
  emit();
}

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, getCartSnapshot, getServerSnapshot);

  function addItem(item: Omit<CartItem, 'quantity'>) {
    const prev = getCartSnapshot();
    const existing = prev.find((i) => i.serviceId === item.serviceId);
    if (existing) {
      setCart(
        prev.map((i) =>
          i.serviceId === item.serviceId ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
      return;
    }
    setCart([...prev, { ...item, quantity: 1 }]);
  }

  function removeItem(serviceId: string) {
    setCart(getCartSnapshot().filter((i) => i.serviceId !== serviceId));
  }

  function updateQuantity(serviceId: string, quantity: number) {
    setCart(
      getCartSnapshot().map((i) =>
        i.serviceId === serviceId ? { ...i, quantity: Math.max(1, quantity) } : i
      )
    );
  }

  function clear() {
    setCart([]);
  }

  const totalGrosze = items.reduce((sum, i) => sum + i.priceGrosze * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clear, totalGrosze }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart musi być używane wewnątrz CartProvider');
  return ctx;
}
