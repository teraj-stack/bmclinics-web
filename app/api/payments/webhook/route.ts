import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSign, verifyTransaction, type WebhookPayload } from '@/lib/payments';
import { markOrderAsPaid } from '@/lib/orders';

export async function POST(req: NextRequest) {
  const payload = (await req.json()) as WebhookPayload;

  if (!verifyWebhookSign(payload)) {
    return NextResponse.json({ error: 'Nieprawidłowy podpis' }, { status: 400 });
  }

  try {
    await verifyTransaction(payload.sessionId, payload.amount, payload.orderId);
    await markOrderAsPaid(payload.sessionId);
    return new NextResponse(null, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Weryfikacja nieudana' }, { status: 502 });
  }
}
