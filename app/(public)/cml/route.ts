import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

const OFFLINE_DOWNLOAD_SNIPPET = `
<a href="/cml/offline/" id="bmcml-offline-dl"
  title="Pobierz CML do użycia offline"
  style="position:fixed;right:12px;bottom:12px;z-index:99999;display:inline-flex;align-items:center;gap:8px;padding:10px 14px;font:500 12px/1.2 system-ui,sans-serif;letter-spacing:.02em;text-decoration:none;color:#fff;background:radial-gradient(ellipse at center, rgba(20,20,20,.55) 0%, rgba(0,0,0,.72) 100%);backdrop-filter:blur(10px) saturate(160%);-webkit-backdrop-filter:blur(10px) saturate(160%);border:1px solid rgba(196,168,116,.45);box-shadow:inset 0 0 0 1px rgba(255,255,255,.10);border-radius:2px;">
  Pobierz offline
</a>
`;

/**
 * Serve the full BMCMLa offline app as the /cml document.
 * Source: refs/bmcml/BMCMLa-offline.html → public/cml/bmcml-a.html
 * Offline pack for download: public/cml/offline/
 */
export async function GET() {
  const file = path.join(process.cwd(), 'public/cml/bmcml-a.html');
  let html = await readFile(file, 'utf8');
  if (!html.includes('id="bmcml-offline-dl"')) {
    html = html.includes('</body>')
      ? html.replace('</body>', `${OFFLINE_DOWNLOAD_SNIPPET}</body>`)
      : html + OFFLINE_DOWNLOAD_SNIPPET;
  }
  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
