import type { Metadata } from 'next';
import './globals.css';
import { Theme } from '../constants/ThemeConstants';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'backyardultra.app',
  description: 'An application for backyard ultras',
};

function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" data-theme={Theme.LIGHT} className="select-none">
      <body>{children}</body>
    </html>
  );
}

export default RootLayout;
