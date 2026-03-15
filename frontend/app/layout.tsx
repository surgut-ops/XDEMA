// app/layout.tsx
import type { Metadata } from 'next';
import { Syne, DM_Sans, Space_Mono } from 'next/font/google';
import '../styles/globals.css';
import { Providers } from './providers';
import { MusicCursor } from '@/components/ui/MusicCursor';
import { NoiseOverlay } from '@/components/ui/NoiseOverlay';
import { SmartPopup } from '@/components/ui/SmartPopup';
import { PerformanceToggle } from '@/components/ui/PerformanceToggle';

const syne = Syne({ subsets: ['latin'], variable: '--font-syne', display: 'swap', weight: ['400','600','700','800'] });
const dm = DM_Sans({ subsets: ['latin'], variable: '--font-dm', display: 'swap', weight: ['300','400','500','600','700'] });
const mono = Space_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap', weight: ['400','700'] });

export const metadata: Metadata = {
  title: 'XDEMA — Electronic Experience Architect',
  description: 'DJ, обучение, Live QR. Профессиональный DJ в Москве и РФ.',
  keywords: ['DJ', 'обучение DJ', 'заказать DJ', 'Live QR', 'XDEMA'],
  openGraph: {
    title: 'XDEMA — Electronic Experience Architect',
    description: 'DJ · Mentor · Live Energy',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" data-theme="dark" suppressHydrationWarning>
      <body className={`${syne.variable} ${dm.variable} ${mono.variable}`}>
        <Providers>
          <NoiseOverlay />
          <MusicCursor />
          <PerformanceToggle />
          {children}
          <SmartPopup />
        </Providers>
      </body>
    </html>
  );
}
