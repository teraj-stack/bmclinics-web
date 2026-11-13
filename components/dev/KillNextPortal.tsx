'use client';

import { useEffect } from 'react';

/**
 * Next.js keeps <nextjs-portal> in the DOM even with devIndicators: false
 * (error overlay host). CSS hide is not enough for Cursor element picker —
 * remove the node whenever it appears (dev only).
 */
export default function KillNextPortal() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const purge = () => {
      document.querySelectorAll('nextjs-portal').forEach((el) => el.remove());
    };

    purge();

    const observer = new MutationObserver(() => purge());
    observer.observe(document.documentElement, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
}
