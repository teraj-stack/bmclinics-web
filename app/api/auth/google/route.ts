import { NextResponse } from 'next/server';

// Calendar OAuth must be re-enabled only after authenticated physician ownership,
// CSRF state binding and callback verification are implemented.
export async function GET() {
  return NextResponse.json({ error: 'Integracja kalendarza jest tymczasowo wyłączona' }, { status: 503 });
}
