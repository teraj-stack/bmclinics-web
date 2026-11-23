import Link from 'next/link';

export const metadata = {
  title: 'RUTA — podgląd interaktywnej mapy objawów | BM Clinics',
  robots: { index: false, follow: false },
};

export default function RutaPreviewPage() {
  return (
    <main className="min-h-screen bg-[#061820] text-white">
      <nav aria-label="Nawigacja podglądu RUTA" className="flex flex-wrap items-center justify-between gap-3 border-b border-white/15 px-4 py-3">
        <span className="text-sm font-medium tracking-widest">BM CLINIC / RUTA — PODGLĄD</span>
        <Link href="/" className="rounded-lg border border-white/30 px-4 py-2 text-sm hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">Wróć do strony głównej</Link>
      </nav>
      <iframe
        title="RUTA — interaktywna mapa objawów (zachowany podgląd)"
        src="/ruta-preview.html"
        className="block h-[calc(100dvh-69px)] min-h-[680px] w-full border-0"
      />
    </main>
  );
}
