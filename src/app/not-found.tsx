'use client';

import { useTranslation } from '@/contexts/LanguageContext';
import Link from 'next/link';
import { Home, AlertCircle } from 'lucide-react';

export default function NotFound() {
  const { t, isRTL } = useTranslation();

  return (
    <div
      className={`min-h-[60vh] flex flex-col items-center justify-center p-6 ${isRTL ? 'text-right' : ''}`}
    >
      <div className="max-w-md w-full text-center">
        <div
          className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-600 mb-6 ${isRTL ? 'ml-auto' : 'mx-auto'}`}
        >
          <AlertCircle className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-bold text-gray-800">{t.notFound.title}</h1>
        <p className="text-gray-500 mt-2">{t.notFound.description}</p>

        <Link
          href="/"
          className={`mt-6 inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <Home className="w-5 h-5" />
          {t.notFound.goHome}
        </Link>
      </div>
    </div>
  );
}
