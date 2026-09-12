import React from 'react';
import { Link } from '@inertiajs/react';
import { Briefcase } from 'lucide-react';
import { navLinks } from '@/Data/navigation';

export default function Navbar() {
  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
        <img
            src="/images/careerX-logo.webp"
            alt="CareerX logo"
            className="h-30 w-auto object-contain mix-blend-multiply"
        />
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-gray-600 hover:text-teal-800 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Register
          </Link>
          <Link
            href="/jobs/create"
            className="px-4 py-2 text-sm font-semibold text-white bg-primary-accent rounded-lg hover:bg-primary-hover transition-colors shadow-sm"
          >
            Post a Job
          </Link>
        </div>

      </div>
    </header>
  );
}
