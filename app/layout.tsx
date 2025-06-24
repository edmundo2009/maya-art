import './globals.css';
import type { Metadata } from 'next';
import { inter, playfairDisplay } from '@/lib/fonts';

export const metadata: Metadata = {
  title: 'Maya Lama - Contemporary Art Gallery',
  description: 'Explore the contemporary art collections of Maya Lama featuring Artist Monologues, Quest for Infinity, Bubble Moon, and Weather Report series.',
  keywords: 'Maya Lama, contemporary art, gallery, artist monologues, quest for infinity, bubble moon, weather report',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfairDisplay.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}