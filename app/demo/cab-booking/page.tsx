import type { Metadata } from 'next';
import CabBookingCover from '@/components/demo/CabBookingCover';

export const metadata: Metadata = {
  title: 'Demo — Cab Booking Cover',
  robots: { index: false, follow: false },
};

export default function CabBookingDemoPage() {
  return (
    <main className="min-h-screen overflow-x-auto">
      <CabBookingCover />
    </main>
  );
}
