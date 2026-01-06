import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'SiloamXperience',
  description: 'Welcome to SiloamXperience',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
