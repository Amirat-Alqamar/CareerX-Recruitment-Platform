import React from 'react';
import Navbar from '@/Components/Common/Navbar';
import Footer from '@/Components/Common/Footer';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer/>
    </div>
  );
}
