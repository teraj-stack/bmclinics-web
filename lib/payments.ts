import crypto from 'crypto';

const P24_BASE_URL =
  process.env.P24_SANDBOX === 'true'
    ? 'https://sandbox.przelewy24.pl'
    : 'https://secure.przelewy24.pl';

const MERCHANT_ID = process.env.P24_MERCHANT_ID!;
const POS_ID = process.env.P24_POS_ID!;
const API_KEY = process.env.P24_API_KEY!;
const CRC = process.env.P24_CRC!;

function authHeader() {
  return 'Basic ' + Buffer.from(`${POS_ID}:${API_KEY}`).toString('base64');
}

function signRegister(sessionId: string, amount: number, currency: string) {
  const payload = JSON.stringify({
    sessionId,
    merchantId: Number(MERCHANT_ID),
    amount,
    currency,
    crc: CRC,
  });
  return crypto.createHash('sha384').update(payload).digest('hex');
}

export interface RegisterTransactionInput {
  sessionId: string;
  amountGrosze: number;
  description: string;
  email: string;
}

export async function registerTransaction(input: RegisterTransactionInput) {
  const sign = signRegister(input.sessionId, input.amountGrosze, 'PLN');

  const res = await fetch(`${P24_BASE_URL}/api/v1/transaction/register`, {
    method: 'POST',
    headers: { Authorization: authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      merchantId: Number(MERCHANT_ID),
      posId: Number(POS_ID),
      sessionId: input.sessionId,
      amount: input.amountGrosze,
      currency: 'PLN',
      description: input.description,
      email: input.email,
      country: 'PL',
      language: 'pl',
      urlReturn: `${process.env.NEXT_PUBLIC_BASE_URL}/sklep/podsumowanie?sessionId=${input.sessionId}`,
      urlStatus: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/webhook`,
      sign,
    }),
  });

  if (!res.ok) throw new Error(`Rejestracja transakcji P24 nieudana: ${res.status}`);
  const data = await res.json();
  return {
    token: data.data.token as string,
    paymentUrl: `${P24_BASE_URL}/trnRequest/${data.data.token}`,
  };
}

export interface WebhookPayload {
  merchantId: number;
  posId: number;
  sessionId: string;
  amount: number;
  originAmount: number;
  currency: string;
  orderId: number;
  methodId: number;
  statement: string;
  sign: string;
}

export function verifyWebhookSign(payload: WebhookPayload): boolean {
  const expected = crypto
    .createHash('sha384')
    .update(
      JSON.stringify({
        merchantId: payload.merchantId,
        posId: payload.posId,
        sessionId: payload.sessionId,
        amount: payload.amount,
        originAmount: payload.originAmount,
        currency: payload.currency,
        orderId: payload.orderId,
        methodId: payload.methodId,
        statement: payload.statement,
        crc: CRC,
      })
    )
    .digest('hex');
  return expected === payload.sign;
}

export async function verifyTransaction(sessionId: string, amountGrosze: number, orderId: number) {
  const sign = crypto
    .createHash('sha384')
    .update(JSON.stringify({ sessionId, orderId, amount: amountGrosze, currency: 'PLN', crc: CRC }))
    .digest('hex');

  const res = await fetch(`${P24_BASE_URL}/api/v1/transaction/verify`, {
    method: 'PUT',
    headers: { Authorization: authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      merchantId: Number(MERCHANT_ID),
      posId: Number(POS_ID),
      sessionId,
      amount: amountGrosze,
      currency: 'PLN',
      orderId,
      sign,
    }),
  });

  if (!res.ok) throw new Error(`Weryfikacja transakcji P24 nieudana: ${res.status}`);
  return res.json();
}
