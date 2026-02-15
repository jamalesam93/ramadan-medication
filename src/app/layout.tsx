import type { Metadata } from "next";
import { Inter, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ClientLayout } from "@/components/ClientLayout";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: '--font-arabic',
});

export const metadata: Metadata = {
  title: "Ramadan Medication - أدوية رمضان",
  description: "A tool to help Muslims manage their medication schedules during Ramadan. أداة لمساعدة المسلمين على إدارة جداول أدويتهم خلال رمضان.",
  keywords: ["Ramadan", "medication", "fasting", "Islamic", "health", "reminder", "رمضان", "أدوية", "صيام", "إسلامي", "صحة"],
  icons: {
    icon: '/icon.svg',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${notoSansArabic.variable} bg-gray-50`}>
        <ServiceWorkerRegister />
        <LanguageProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </LanguageProvider>
      </body>
    </html>
  );
}
