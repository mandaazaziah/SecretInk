'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import {
  Lock,
  EyeOff,
  Fingerprint,
  Edit,
  Unlock,
  Check,
  ShieldCheck,
  Code,
  Database,
  ScanLine,
  Timer,
  KeyRound,
} from 'lucide-react';

// ─── Typing Effect Phrases ───────────────────────────────────────────────────
const TYPING_PHRASES = [
  'AES-256 Encrypted',
  'Protokol Zero Knowledge',
  'Aman End-to-End',
  'Dilindungi Bcrypt',
];

const TYPING_SPEED = 80;       // ms per character
const DELETE_SPEED = 50;       // ms per character when deleting
const PAUSE_DURATION = 2000;   // ms pause between phrases

// ─── Feature Card Data ───────────────────────────────────────────────────────
const features = [
  {
    icon: Lock,
    title: 'Enkripsi AES-256',
    description: 'Catatan Anda dienkripsi dengan standar emas enkripsi, yang digunakan oleh pemerintah dan perusahaan di seluruh dunia.',
  },
  {
    icon: EyeOff,
    title: 'Hashing Kata Sandi Bcrypt',
    description: 'Kata sandi di-hash menggunakan bcrypt, tidak pernah disimpan dalam teks biasa. Kredensial Anda tetap terlindungi setiap saat.',
  },
  {
    icon: Fingerprint,
    title: 'Zero Knowledge',
    description: 'Kami tidak pernah melihat kunci enkripsi atau konten terdekripsi Anda. Hanya Anda yang dapat mengakses rahasia Anda.',
  },
  {
    icon: ShieldCheck,
    title: 'Proteksi Sesi',
    description: 'Manajemen sesi yang aman dengan batas waktu otomatis memastikan akun Anda tetap terlindungi bahkan saat Anda meninggalkannya.',
  },
];

// ─── How It Works Steps ──────────────────────────────────────────────────────
const steps = [
  {
    number: 1,
    icon: Edit,
    title: 'Tulis Catatan Anda',
    description: 'Buat catatan rahasia Anda dengan judul dan konten',
  },
  {
    number: 2,
    icon: Lock,
    title: 'Enkripsi & Simpan',
    description: 'Enkripsi dengan kunci Anda menggunakan AES-256 dan simpan dengan aman',
  },
  {
    number: 3,
    icon: Unlock,
    title: 'Dekripsi Saat Dibutuhkan',
    description: 'Ambil dan dekripsi hanya dengan kunci enkripsi Anda',
  },
];

// ─── Security Badges ─────────────────────────────────────────────────────────
const securityBadges = [
  { icon: ShieldCheck, label: 'Proteksi CSRF' },
  { icon: Code, label: 'Pencegahan XSS' },
  { icon: Database, label: 'Proteksi SQL Injection' },
  { icon: ScanLine, label: 'Sanitasi Input' },
  { icon: KeyRound, label: 'Header Aman' },
  { icon: Timer, label: 'Batas Waktu Sesi' },
];

// ─── Home Page Component ─────────────────────────────────────────────────────
export default function Home() {
  // Typing effect state
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = TYPING_PHRASES[currentPhraseIndex];

    if (!isDeleting) {
      // Typing forward
      if (displayedText.length < currentPhrase.length) {
        const timer = setTimeout(() => {
          setDisplayedText(currentPhrase.slice(0, displayedText.length + 1));
        }, TYPING_SPEED);
        return () => clearTimeout(timer);
      } else {
        // Finished typing, pause before deleting
        const timer = setTimeout(() => {
          setIsDeleting(true);
        }, PAUSE_DURATION);
        return () => clearTimeout(timer);
      }
    } else {
      // Deleting
      if (displayedText.length > 0) {
        const timer = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1));
        }, DELETE_SPEED);
        return () => clearTimeout(timer);
      } else {
        // Finished deleting, move to next phrase — use a micro-delay
        // to avoid synchronous setState inside the effect body
        const timer = setTimeout(() => {
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % TYPING_PHRASES.length);
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, [displayedText, isDeleting, currentPhraseIndex]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="floating-orb" />
        <div className="floating-orb" />
        <div className="floating-orb" />
      </div>

      <Navbar />

      <main className="flex-1">
        {/* ═══════════════════ HERO SECTION ═══════════════════ */}
        <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 pt-24 sm:pt-28 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            {/* Main heading */}
            <div className="animate-fade-in-up">
              <h1
                className="font-heading text-4xl font-bold tracking-tight text-navy sm:text-5xl md:text-6xl lg:text-7xl"
              >
                Rahasia Anda, Diamankan dengan
                <br />
                <span className="gradient-text-royal">Enkripsi</span>{' '}
                <span className="gradient-text-royal">Standar Militer</span>
              </h1>
            </div>

            {/* Typing effect line */}
            <div className="animate-fade-in-up delay-200 mt-6 flex items-center justify-center gap-2 sm:mt-8">
              <img src="/logo.svg" alt="SecretInk Logo" className="size-5 sm:size-6 logo-zoom" />
              <span className="font-heading text-lg font-semibold text-navy/80 sm:text-xl md:text-2xl">
                <span className="typing-cursor text-royal">{displayedText}</span>
              </span>
            </div>

            {/* Subtitle */}
            <div className="animate-fade-in-up delay-300 mx-auto mt-6 max-w-2xl sm:mt-8">
              <p className="font-sans text-base leading-relaxed text-navy/60 sm:text-lg">
                SecretInk adalah brankas tepercaya untuk catatan terenkripsi Anda. Tulis dengan bebas, simpan dengan aman,
                dan akses rahasia Anda hanya saat dibutuhkan — dengan arsitektur zero knowledge
                yang memastikan tidak ada orang lain selain Anda yang dapat membaca data Anda.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="animate-fade-in-up delay-400 mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:mt-10">
              <Button size="lg" asChild className="btn-royal px-8 py-6 text-base font-semibold shadow-royal">
                <Link href="/register">Mulai Sekarang</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="px-8 py-6 text-base font-semibold">
                <Link href="/about">Pelajari Lebih Lanjut</Link>
              </Button>
            </div>

            {/* Stats Row */}
            <div className="animate-fade-in-up delay-500 mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-10 md:gap-16">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-royal/10">
                  <Lock className="size-5 text-royal icon-pop" />
                </div>
                <div className="text-left">
                  <p className="font-heading text-lg font-bold text-navy">10,000+</p>
                  <p className="font-sans text-xs text-navy/50">Catatan Aman</p>
                </div>
              </div>

              <div className="hidden h-8 w-px bg-border sm:block" />

              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-mint/10">
                  <Lock className="size-5 text-mint icon-pop" />
                </div>
                <div className="text-left">
                  <p className="font-heading text-lg font-bold text-navy">256-bit</p>
                  <p className="font-sans text-xs text-navy/50">Enkripsi</p>
                </div>
              </div>

              <div className="hidden h-8 w-px bg-border sm:block" />

              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-royal/10">
                  <EyeOff className="size-5 text-royal icon-pop" />
                </div>
                <div className="text-left">
                  <p className="font-heading text-lg font-bold text-navy">Zero Knowledge</p>
                  <p className="font-sans text-xs text-navy/50">Arsitektur</p>
                </div>
              </div>
            </div>

            {/* Decorative Logo Icon */}
            <div className="animate-fade-in-up delay-600 mt-12 flex justify-center sm:mt-16">
              <div className="relative flex size-20 items-center justify-center rounded-2xl glass-card shadow-soft-lg sm:size-24 logo-zoom">
                <img src="/logo.svg" alt="SecretInk Logo" className="size-9 sm:size-11" />
                <div className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-mint text-white">
                  <Check className="size-3.5 icon-pop" strokeWidth={3} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════ FEATURES SECTION ═══════════════════ */}
        <section className="relative px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-6xl">
            {/* Section heading */}
            <div className="animate-fade-in-up mb-14 text-center sm:mb-16">
              <h2 className="font-heading text-3xl font-bold text-navy sm:text-4xl">
                Mengapa Memilih <span className="gradient-text-royal">SecretInk</span>?
              </h2>
              <p className="mx-auto mt-4 max-w-xl font-sans text-base text-navy/50">
                Dibangun dari dasar dengan keamanan sebagai fondasi, bukan sekadar tambahan.
              </p>
            </div>

            {/* Feature cards grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className={`glass-card animate-fade-in-up rounded-2xl p-6 transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-1 sm:p-8 delay-${(index + 1) * 100}`}
                  >
                    <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-royal/10">
                      <Icon className="size-6 text-royal icon-pop" strokeWidth={2} />
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-navy sm:text-xl">
                      {feature.title}
                    </h3>
                    <p className="mt-2 font-sans text-sm leading-relaxed text-navy/50 sm:text-base">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════ HOW IT WORKS SECTION ═══════════════════ */}
        <section className="relative px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-5xl">
            {/* Section heading */}
            <div className="animate-fade-in-up mb-14 text-center sm:mb-16">
              <h2 className="font-heading text-3xl font-bold text-navy sm:text-4xl">
                Cara Kerja <span className="gradient-text-royal">SecretInk</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl font-sans text-base text-navy/50">
                Tiga langkah sederhana untuk menjaga rahasia Anda tetap aman.
              </p>
            </div>

            {/* Steps timeline */}
            <div className="relative">
              {/* Dotted connecting line (desktop only) */}
              <div className="absolute left-0 right-0 top-16 hidden h-0 border-t-2 border-dashed border-royal/20 md:block" style={{ margin: '0 15%' }} />

              <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.number}
                      className={`animate-fade-in-up delay-${(index + 1) * 200} relative flex flex-col items-center text-center`}
                    >
                      {/* Number badge */}
                      <div className="z-10 mb-5 flex size-10 items-center justify-center rounded-full bg-royal text-sm font-bold text-white shadow-royal">
                        {step.number}
                      </div>

                      {/* Icon circle */}
                      <div className="mb-5 flex size-16 items-center justify-center rounded-2xl glass-card shadow-soft">
                        <Icon className="size-7 text-royal icon-pop" strokeWidth={2} />
                      </div>

                      <h3 className="font-heading text-lg font-semibold text-navy">
                        {step.title}
                      </h3>
                      <p className="mt-2 max-w-xs font-sans text-sm leading-relaxed text-navy/50">
                        {step.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════ SECURITY BADGES SECTION ═══════════════════ */}
        <section className="relative px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-4xl">
            {/* Section heading */}
            <div className="animate-fade-in-up mb-12 text-center sm:mb-14">
              <h2 className="font-heading text-3xl font-bold text-navy sm:text-4xl">
                Keamanan Tingkat <span className="gradient-text-royal">Enterprise</span>
              </h2>
              <p className="mx-auto mt-4 max-w-lg font-sans text-base text-navy/50">
                Berbagai lapisan perlindungan memastikan data Anda tetap aman di setiap level.
              </p>
            </div>

            {/* Badges grid */}
            <div className="animate-fade-in-up delay-200 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {securityBadges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={badge.label}
                    className="glass-card flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-navy/70 transition-all duration-200 hover:shadow-soft hover:-translate-y-0.5 sm:px-5 sm:py-3 sm:text-base"
                  >
                    <Icon className="size-4 text-royal icon-pop" strokeWidth={2} />
                    {badge.label}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════ CTA SECTION ═══════════════════ */}
        <section className="relative px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="glass-card animate-fade-in-up rounded-3xl p-8 text-center shadow-soft-lg sm:p-12">
              {/* Decorative icon */}
              <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl bg-royal/10">
                <img src="/logo.svg" alt="SecretInk Logo" className="size-7 logo-zoom" />
              </div>

              <h2 className="font-heading text-2xl font-bold text-navy sm:text-3xl md:text-4xl">
                Siap Mengamankan Catatan Anda?
              </h2>
              <p className="mx-auto mt-3 max-w-md font-sans text-base text-navy/50">
                Bergabung dengan ribuan pengguna yang mempercayai SecretInk untuk menjaga informasi paling sensitif mereka tetap aman.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" asChild className="btn-royal px-8 py-6 text-base font-semibold shadow-royal">
                  <Link href="/register">Buat Akun</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="px-8 py-6 text-base font-semibold">
                  <Link href="/login">Masuk</Link>
                </Button>
              </div>

              <p className="mt-6 font-sans text-xs text-navy/40">
                Gratis · Tanpa kartu kredit · Terenkripsi end-to-end
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
