'use client';

import { motion } from 'framer-motion';
import type { MotionStyle } from '@/lib/categoryThemes';
import type { PerformanceTier } from '@/lib/usePerformanceTier';

interface Props {
  motionStyle: MotionStyle;
  tier: PerformanceTier;
}

const speedFactor = (tier: PerformanceTier) => (tier === 'high' ? 1 : 1.8);

export default function CategoryBackgroundMotion({ motionStyle, tier }: Props) {
  const duration = 18 * speedFactor(tier);

  const blobVariants = {
    calm: { x: [0, 30, 0], y: [0, 20, 0] },
    flow: { x: [0, -40, 0], y: [0, 15, 0] },
    soft: { x: [0, 20, -20, 0], y: [0, -10, 10, 0] },
  }[motionStyle];

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ background: 'var(--cat-bg)' }}
    >
      <motion.div
        className="absolute -top-24 -left-24 h-96 w-96 rounded-full opacity-30 blur-3xl"
        style={{ background: 'var(--cat-accent)' }}
        animate={blobVariants}
        transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-0 bottom-0 h-80 w-80 rounded-full opacity-20 blur-3xl"
        style={{ background: 'var(--cat-accent-light, var(--cat-accent))' }}
        animate={blobVariants}
        transition={{ duration: duration * 1.3, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
