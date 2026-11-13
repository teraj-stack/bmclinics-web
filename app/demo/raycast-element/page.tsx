import type { Metadata } from 'next';
import RaycastPlayground from '@/components/demo/RaycastPlayground';

export const metadata: Metadata = {
  title: 'Demo — Raycast Playground element',
  robots: { index: false, follow: false },
};

export default function RaycastElementDemoPage() {
  return (
    <main className="py-12">
      <RaycastPlayground />
    </main>
  );
}
