import { Inter, JetBrains_Mono } from 'next/font/google';
import type { ReactNode } from 'react';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-raycast-sans',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-raycast-mono',
  display: 'swap',
});

export default function RaycastDemoLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${inter.variable} ${jetbrains.variable} min-h-screen bg-[#0a0a0a] text-white`}>
      {children}
    </div>
  );
}
