import React, { useEffect } from 'react';
import Navbar from '@/Components/Common/Navbar';
import Footer from '@/Components/Common/Footer';
import { useTranslation } from '@/hooks/useTranslation';

export default function MainLayout({ children }) {
  const { direction, locale } = useTranslation();

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = direction;
      document.documentElement.lang = locale;
      document.body.dir = direction;
    }
  }, [direction, locale]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900" dir={direction}>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
