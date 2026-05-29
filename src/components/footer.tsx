'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, Lock, Check, Heart } from 'lucide-react';

const quickLinks = [
  { label: 'Beranda', href: '/' },
  { label: 'Tentang', href: '/about' },
  { label: 'Apa itu AES?', href: '/about#what-is-aes' },
  { label: 'Cara Kerja', href: '/about#how-it-works' },
] as const;

const securityFeatures = [
  'Enkripsi AES-256 bit',
  'Hashing Password Bcrypt',
  'Proteksi Sesi',
] as const;

export default function Footer() {
  const [lockHovered, setLockHovered] = useState(false);

  return (
    <footer
      className="w-full"
      style={{ backgroundColor: '#0F172A' }}
    >
      {/* Main footer content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Column 1: Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="SecretInk Logo" className="h-8 w-8" />
              <span
                className="text-xl font-semibold tracking-tight"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                <span className="text-white">Secret</span><span className="text-royal-light">Ink</span>
              </span>
            </div>
            <p
              className="text-sm font-medium text-white/90"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Rahasia Anda, terenkripsi dan aman.
            </p>
            <p className="max-w-xs text-sm leading-relaxed text-gray-400">
              SecretInk menyediakan enkripsi standar militer untuk catatan paling
              sensitif Anda. Tulis dengan bebas, simpan dengan aman, dan akses
              rahasia Anda hanya saat dibutuhkan.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-4">
            <h3
              className="text-sm font-semibold uppercase tracking-wider text-white/80"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Tautan Cepat
            </h3>
            <nav className="flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex w-fit items-center gap-1.5 text-sm text-gray-400 transition-colors duration-200 hover:text-[#2563EB]"
                >
                  <span className="inline-block h-px w-0 bg-[#2563EB] transition-all duration-200 group-hover:w-3" />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Security Info */}
          <div className="flex flex-col gap-4">
            <h3
              className="text-sm font-semibold uppercase tracking-wider text-white/80"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Keamanan
            </h3>
            <ul className="flex flex-col gap-3">
              {securityFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-2.5 text-sm text-gray-400">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#10B981]/15">
                    <Check className="h-3 w-3" style={{ color: '#10B981' }} strokeWidth={3} />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="border-t border-white/10"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-xs text-gray-500">
            &copy; 2025 SecretInk. Hak cipta dilindungi.
          </p>
          <button
            type="button"
            className="group flex items-center gap-1.5 text-xs text-gray-500 transition-colors duration-200 hover:text-gray-300"
            onMouseEnter={() => setLockHovered(true)}
            onMouseLeave={() => setLockHovered(false)}
            aria-label="Status keamanan: Dilindungi dengan AES-256"
          >
            <Lock
              className={`h-3.5 w-3.5 transition-transform duration-300 ${
                lockHovered ? '-translate-y-0.5 rotate-[-12deg] scale-110' : ''
              }`}
              style={{ color: lockHovered ? '#10B981' : undefined }}
            />
            <span>
              Dilindungi dengan <Heart className="inline h-3 w-3 text-red-400" /> dan AES-256
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
