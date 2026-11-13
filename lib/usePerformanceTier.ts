'use client';

import { useEffect, useState } from 'react';

export type PerformanceTier = 'low' | 'medium' | 'high';

export function usePerformanceTier(): PerformanceTier {
  const [tier, setTier] = useState<PerformanceTier>('low');

  useEffect(() => {
    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { effectiveType?: string; saveData?: boolean };
    };

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setTier('low');
      return;
    }

    const cores = nav.hardwareConcurrency ?? 4;
    const memory = nav.deviceMemory ?? 4;
    const slowConnection =
      nav.connection?.saveData ||
      ['slow-2g', '2g', '3g'].includes(nav.connection?.effectiveType ?? '');

    if (slowConnection || memory <= 2 || cores <= 2) {
      setTier('low');
    } else if (memory <= 4 || cores <= 4) {
      setTier('medium');
    } else {
      setTier('high');
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-motion', tier);
  }, [tier]);

  return tier;
}
