'use client';

import dynamic from 'next/dynamic';
import { usePerformanceTier } from '@/lib/usePerformanceTier';
import type { MotionStyle } from '@/lib/categoryThemes';

const CategoryBackgroundMotion = dynamic(() => import('./CategoryBackgroundMotion'), {
  ssr: false,
  loading: () => null,
});

interface Props {
  motionStyle: MotionStyle;
}

export default function CategoryBackground({ motionStyle }: Props) {
  const tier = usePerformanceTier();

  if (tier === 'low') {
    return (
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{ background: 'var(--cat-bg)' }}
      />
    );
  }

  return <CategoryBackgroundMotion motionStyle={motionStyle} tier={tier} />;
}
