'use client';

import { ReactNode } from 'react';
import { CoverLetterProvider } from '@/contexts/CoverLetterContext';

export default function CoverLetterLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <CoverLetterProvider>
      <div className="min-h-screen bg-background">
        <main className="flex-1">
          {children}
        </main>
      </div>
    </CoverLetterProvider>
  );
}
