import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Processing Payment - GigBuds',
  description: 'Processing your payment and redirecting to mobile app',
};

export default function MobileIntermediateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* Minimal layout - no navigation, no header, no footer */}
      {children}
    </div>
  );
} 