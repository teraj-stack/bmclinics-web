import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { registerTransaction } from '@/lib/payments';
import { createPendingOrder } from '@/lib/orders';

export async function POST(req: NextRequest) {
  const { items, email } = await req.json();

  if (!Array.isArray(items) || items.length === 0 || !email) {
    return NextResponse.json({ error: 'Nieprawidłowe dane zamówienia' }, { status: 400 });
  }

  const sessionId = randomUUID();

  if (process.env.DATABASE_URL && process.env.P24_MERCHANT_ID && process.env.P24_API_KEY) {
    try {
      const order = await createPendingOrder({ sessionId, items, email });

      const { paymentUrl } = await registerTransaction({
        sessionId,
        amountGrosze: order.amountGrosze,
        description: `Zamówienie ${order.items.length} usług — BM Clinics`,
        email,
      });

      return NextResponse.json({ paymentUrl });
    } catch {
      return NextResponse.json({ error: 'Nie udało się utworzyć płatności' }, { status: 502 });
    }
  }

  // Local / preview fallback when Przelewy24 credentials are not configured
  return NextResponse.json({
    paymentUrl: `/sklep/podsumowanie?sessionId=${sessionId}&demo=1`,
    demo: true,
  });
}
