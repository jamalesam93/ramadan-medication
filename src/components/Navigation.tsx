'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/contexts/LanguageContext';
import { Home, Pill, Calendar, Settings } from 'lucide-react';

export function Navigation() {
  const pathname = usePathname();
  const { t, isRTL } = useTranslation();

  const navItems = [
    { href: '/', label: t.nav.home, icon: Home },
    { href: '/medications', label: t.nav.medications, icon: Pill },
    { href: '/calendar', label: t.nav.calendar, icon: Calendar },
    { href: '/settings', label: t.nav.settings, icon: Settings },
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50 md:static md:border-t-0 ${isRTL ? 'md:border-l' : 'md:border-r'} md:w-64 md:h-screen md:py-6`}>
      {/* Desktop Logo */}
      <div className="hidden md:block mb-8 px-4">
        <h1 className="text-xl font-bold text-emerald-700">🌙 {t.common.appName}</h1>
        <p className="text-sm text-gray-500">{t.home.subtitle}</p>
      </div>

      <ul className="flex justify-around md:flex-col md:gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'text-emerald-600 bg-emerald-50 md:bg-emerald-100'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs md:text-sm font-medium">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
