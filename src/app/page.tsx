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
    description: 'Catatan Anda dilindungi dengan enkripsi AES-256, standar keamanan tingkat tinggi yang digunakan secara global.',
  },
  {
    icon: EyeOff,
    title: 'Hashing Kata Sandi Bcrypt',
    description: 'Kata sandi Anda diamankan dengan bcrypt dan tidak pernah disimpan dalam bentuk teks asli.',
  },
  {
    icon: Fingerprint,
    title: 'Zero Knowledge',
    description: 'Hanya Anda yang memiliki akses ke catatan Anda—tidak ada pihak lain yang dapat membacanya.',
  },
  {
    icon: ShieldCheck,
    title: 'Proteksi Sesi',
    description: 'Manajemen sesi yang aman dengan batas waktu otomatis memastikan akun Anda tetap terlindungi dari akses tidak sah.',
  },
];

// ─── How It Works Steps ──────────────────────────────────────────────────────
const steps = [
  {
    number: 1,
    icon: Edit,
    title: 'Tulis Catatan Anda',
    description: 'Buat catatan rahasia dengan judul dan isi sesuai dengan kebutuhan Anda',
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
    title: 'Dekripsi Catatan',
    description: 'Ambil dan dekripsi catatan saat dibutuhkan hanya dengan kunci enkripsi Anda',
  },
];

// ─── Security Badges ─────────────────────────────────────────────────────────
const securityBadges = [
  { icon: ShieldCheck, label: 'Proteksi CSRF' },
  { icon: Code, label: 'Perlindungan XSS' },
  { icon: Database, label: 'Proteksi SQL Injection' },
  { icon: ScanLine, label: 'Sanitasi Input' },
  { icon: KeyRound, label: 'Secure HTTP Headers' },
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
             <h1 className="font-heading text-2xl font-bold tracking-tight text-navy sm:text-3xl md:text-4xl lg:text-5xl leading-tight">
              Lindungi Rahasia Anda dengan
              <br />
              <span className="gradient-text-royal">
                Enkripsi Tingkat Tinggi
              </span>
            </h1>
            </div>

            {/* Typing effect line */}
            <div className="delay-200 mt-6 flex items-center justify-center gap-2 sm:mt-8">
              <img src="/logo.png" alt="SecretInk Logo" className="size-8 sm:size-6" />
              <span className="font-heading text-lg font-semibold text-navy/80 sm:text-xl md:text-2xl">
                <span className="typing-cursor text-royal">{displayedText}</span>
              </span>
            </div>

            {/* Subtitle */}
            <div className="animate-fade-in-up delay-300 mx-auto mt-6 max-w-2xl sm:mt-8">
              <p className="font-sans text-base leading-relaxed text-navy/60 sm:text-lg">
                SecretInk adalah brankas tepercaya untuk catatan terenkripsi Anda. Tulis dengan bebas dan simpan dengan aman dengan
                arsitektur zero knowledge
                yang memastikan tidak ada orang lain yang dapat membaca data Anda.
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

              {/* Item 1 */}
              <div className="group flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-300 hover:bg-white/60 hover:shadow-royal-lg hover:-translate-y-1">
                <div className="flex size-10 items-center justify-center rounded-full bg-royal/10 transition-all duration-300 group-hover:bg-royal/20 group-hover:scale-110">
                  <Lock className="size-5 text-royal transition-transform duration-300 group-hover:scale-125" />
                </div>

                <div className="text-left">
                  <p className="font-heading text-lg font-bold text-navy transition-colors duration-300 group-hover:text-royal">
                    Privasi Terjamin
                  </p>
                  <p className="font-sans text-xs text-navy/50">
                    Catatan Aman
                  </p>
                </div>
              </div>

              <div className="hidden h-8 w-px bg-border sm:block" />

              {/* Item 2 */}
              <div className="group flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-300 hover:bg-white/60 hover:-translate-y-1">
                <div className="flex size-10 items-center justify-center rounded-full bg-mint/10 transition-all duration-300 group-hover:bg-mint/20 group-hover:scale-110">
                  <Lock className="size-5 text-mint transition-transform duration-300 group-hover:scale-125" />
                </div>

                <div className="text-left">
                  <p className="font-heading text-lg font-bold text-navy transition-colors duration-300 group-hover:text-mint">
                    256-bit
                  </p>
                  <p className="font-sans text-xs text-navy/50">
                    Enkripsi
                  </p>
                </div>
              </div>

              <div className="hidden h-8 w-px bg-border sm:block" />

              {/* Item 3 */}
              <div className="group flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-300 hover:bg-white/60 hover:shadow-royal hover:-translate-y-1">
                <div className="flex size-10 items-center justify-center rounded-full bg-royal/10 transition-all duration-300 group-hover:bg-royal/20 group-hover:scale-110">
                  <EyeOff className="size-5 text-royal transition-transform duration-300 group-hover:scale-125" />
                </div>

                <div className="text-left">
                  <p className="font-heading text-lg font-bold text-navy transition-colors duration-300 group-hover:text-royal">
                    Zero Knowledge
                  </p>
                  <p className="font-sans text-xs text-navy/50">
                    Arsitektur
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════ FEATURES SECTION ═══════════════════ */}
        <section className="relative px-4 py-23 sm:px-6 sm:py-25 lg:px-8">
          <div className="mx-auto max-w-6xl">
            {/* Section heading */}
            <div className="animate-fade-in-up mb-14 text-center sm:mb-16">
              <h2 className="font-heading text-3xl font-bold text-navy sm:text-4xl">
                Mengapa Memilih{' '}
                <span className="gradient-text-royal inline-block transition-all duration-500 group-hover:opacity-80 group-hover:scale-[1.03] group-hover:[filter:drop-shadow(0_0_20px_rgba(107,127,215,0.4))]">
                  SecretInk
                </span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl font-sans text-base text-navy/50">
                 Privasi Anda adalah prioritas utama — setiap catatan diamankan dengan enkripsi tingkat tinggi dengan perlindungan menyeluruh.
              </p>
            </div>

            {/* Feature cards grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className={`group relative overflow-hidden glass-card animate-fade-in-up rounded-xl p-4 sm:p-5
                    transition-all duration-500 ease-out
                    hover:-translate-y-1.5
                    hover:shadow-[0_15px_40px_rgba(0,0,0,0.06),0_0_35px_rgba(37,99,235,0.18)]
                    hover:ring-1 hover:ring-blue-400/15
                    delay-${(index + 1) * 100}

                    before:content-['']
                    before:absolute before:inset-0 before:rounded-xl
                    before:opacity-0 before:transition-opacity before:duration-500
                    hover:before:opacity-100
                    before:bg-gradient-to-br before:from-blue-400/10 before:via-transparent before:to-transparent`}
                  >
                    {/* Liquid shine layer */}
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <div className="absolute -top-1/2 left-[-60%] h-[200%] w-[60%] rotate-12 bg-gradient-to-r from-transparent via-white/40 to-transparent blur-xl animate-shine" />
                    </div>

                    {/* CONTENT */}
                    <div className="relative z-10">
                      
                      {/* ICON */}
                      <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-white/30 backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:bg-white/50 group-hover:shadow-[0_0_20px_rgba(37,99,235,0.2)]">
                        <Icon
                          className="size-5 text-royal transition-all duration-500 group-hover:scale-125 group-hover:drop-shadow-[0_0_10px_rgba(37,99,235,0.4)]"
                          strokeWidth={2}
                        />
                      </div>

                      {/* TITLE */}
                      <h3 className="font-heading text-base sm:text-lg font-semibold text-navy transition-colors duration-300 group-hover:text-royal">
                        {feature.title}
                      </h3>

                      {/* DESCRIPTION */}
                      <p className="mt-1 font-sans text-xs sm:text-sm leading-relaxed text-navy/50 transition-colors duration-300 group-hover:text-navy/70">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════ HOW IT WORKS SECTION ═══════════════════ */}
        <section className="relative px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="mx-auto max-w-5xl">
            {/* Section heading */}
            <div className="animate-fade-in-up mb-14 text-center sm:mb-16">
              <h2 className="font-heading text-3xl font-bold text-navy sm:text-4xl">
                Cara Kerja{' '}
                <span className="gradient-text-royal inline-block transition-all duration-500 group-hover:opacity-80 group-hover:scale-[1.03] group-hover:[filter:drop-shadow(0_0_20px_rgba(107,127,215,0.4))]">
                  SecretInk
                </span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl font-sans text-base text-navy/50">
               Tiga langkah sederhana untuk menjaga keamanan catatan Anda.
              </p>
            </div>

            {/* Steps timeline */}
          <div className="relative max-w-5xl mx-auto">

            {/* CONNECTING LINE (CENTERED ON BADGES) */}
            <div className="absolute top-5 left-0 right-0 hidden md:block">
              <div className="mx-auto w-[70%] border-t-2 border-dashed border-royal/25" />
            </div>

            <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
              {steps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <div
                    key={step.number}
                    className={`group animate-fade-in-up delay-${(index + 1) * 200} relative flex flex-col items-center text-center`}
                  >

                    {/* NUMBER BADGE */}
                    <div className="z-10 mb-5 flex size-10 items-center justify-center rounded-full bg-royal text-sm font-bold text-white shadow-royal transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(37,99,235,0.5)]">
                      {step.number}
                    </div>

                    {/* ICON CARD */}
                    <div className="mb-4 flex size-12 items-center justify-center rounded-xl glass-card shadow-soft transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_0_25px_rgba(37,99,235,0.2)]">
                      <Icon
                        className="size-5 text-royal transition-all duration-300 group-hover:scale-125 group-hover:drop-shadow-[0_0_8px_rgba(37,99,235,0.4)]"
                        strokeWidth={2}
                      />
                    </div>

                    {/* TITLE */}
                    <h3 className="font-heading text-lg font-semibold text-navy transition-colors duration-300 group-hover:text-royal">
                      {step.title}
                    </h3>

                    {/* DESCRIPTION */}
                    <p className="mt-2 max-w-xs font-sans text-sm leading-relaxed text-navy/50 transition-colors duration-300 group-hover:text-navy/70">
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
        <section className="relative px-4 py-16 sm:px-6 sm:py-18 lg:px-8">
          <div className="mx-auto max-w-4xl">
            {/* Section heading */}
            <div className="animate-fade-in-up mb-12 text-center sm:mb-14">
              <h2 className="font-heading text-3xl font-bold text-navy sm:text-4xl">
                Keamanan Tingkat <span className="gradient-text-royal">Enterprise</span> untuk perlindungan data Anda
              </h2>
              <p className="mx-auto mt-4 max-w-lg font-sans text-base text-navy/50">
                Setiap lapisan keamanan dirancang untuk menjaga data Anda tetap terlindungi secara menyeluruh.
              </p>
            </div>

           {/* Badges grid */}
            <div className="animate-fade-in-up delay-200 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {securityBadges.map((badge) => {
                const Icon = badge.icon;

                return (
                  <div
                    key={badge.label}
                    className="group glass-card flex items-center gap-2 rounded-full px-4 py-2.5
                    text-sm font-medium text-navy/70
                    transition-all duration-300 ease-out

                    hover:-translate-y-0.5
                    hover:text-royal

                    hover:shadow-[0_10px_30px_rgba(37,99,235,0.15),0_0_28px_rgba(37,99,235,0.12)]
                    hover:ring-1 hover:ring-blue-400/20

                    sm:px-5 sm:py-3 sm:text-base"
                  >
                    {/* ICON */}
                    <Icon
                      className="size-4 text-royal transition-all duration-300
                      group-hover:scale-125
                      group-hover:drop-shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                      strokeWidth={2}
                    />

                    {/* LABEL */}
                    <span className="transition-colors duration-300 group-hover:text-royal">
                      {badge.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════ CTA SECTION ═══════════════════ */}
        <section className="relative px-4 py-16 sm:px-6 sm:py-18 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="glass-card animate-fade-in-up rounded-3xl p-8 text-center shadow-soft-lg sm:p-12">
              {/* Decorative icon */}
              <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl bg-royal/10">
                <img src="/logo.png" alt="SecretInk Logo" className="size-10 logo-zoom" />
              </div>

              <h2 className="font-heading text-2xl font-bold text-navy sm:text-3xl md:text-4xl">
                Lindungi catatan Anda dengan keamanan maksimal!
              </h2>
              <p className="mx-auto mt-3 max-w-md font-sans text-base text-navy/50">
                Digunakan oleh banyak pengguna untuk mengamankan informasi sensitif dengan perlindungan tingkat tinggi.
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
                Gratis · Aman · Terenkripsi end-to-end
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
