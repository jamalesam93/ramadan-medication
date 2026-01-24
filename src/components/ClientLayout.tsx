'use client';

import { ReactNode } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Navigation } from './Navigation';

interface ClientLayoutProps {
  children: ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const { isRTL } = useLanguage();

  return (
    <div 
      className={`flex flex-col md:flex-row min-h-screen ${isRTL ? 'font-arabic' : 'font-sans'}`}
      style={{ fontFamily: isRTL ? 'var(--font-arabic), sans-serif' : 'var(--font-inter), sans-serif' }}
    >
      <Navigation />
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>
    </div>
  );
}
