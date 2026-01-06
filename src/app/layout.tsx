import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'SiloamXperience',
  description: 'Welcome to SiloamXperience',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <div className="min-h-dvh flex flex-col">{children}</div>
      </body>
    </html>
  );
}

