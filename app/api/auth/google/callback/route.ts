import { NextResponse } from 'next/server';

// Do not exchange OAuth codes or persist tokens without validating session
// ownership and a one-time cryptographic state bound to the initiating user.
export async function GET() {
  return NextResponse.json({ error: 'Integracja kalendarza jest tymczasowo wyłączona' }, { status: 503 });
}
