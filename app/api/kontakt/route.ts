import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim();
  const message = String(body.message ?? '').trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Brak wymaganych pól' }, { status: 400 });
  }

  // W produkcji: wyślij e-mail przez SMTP (EMAIL_SERVER) lub kolejkę.
  console.info('[kontakt]', { name, email, messageLength: message.length });

  return NextResponse.json({ ok: true });
}
