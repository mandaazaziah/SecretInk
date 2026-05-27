'use client';

import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import {
  Shield,
  Lock,
  KeyRound,
  ArrowRight,
  ShieldCheck,
  Code,
  Database,
  ScanLine,
  Timer,
  EyeOff,
  Check,
  Edit,
  Server,
  FileText,
  Hash,
  Cpu,
  Award,
  Zap,
} from 'lucide-react';

// ─── AES Key Specs ────────────────────────────────────────────────────────────
const aesKeySpecs = [
  { label: 'Ukuran Kunci', value: '256 bits', icon: KeyRound },
  { label: 'Ukuran Blok', value: '128 bits', icon: Cpu },
  { label: 'Putaran', value: '14', icon: Hash },
  { label: 'Standar', value: 'NIST FIPS 197', icon: Award },
];

// ─── Security Comparison ──────────────────────────────────────────────────────
const securityComparison = [
  { method: 'AES-256', strength: 100, label: 'Tingkat Militer' },
  { method: 'AES-128', strength: 70, label: 'Kuat' },
  { method: 'DES', strength: 15, label: 'Rusak' },
  { method: 'Teks Biasa', strength: 0, label: 'Tidak Ada' },
];

// ─── How SecretInk Works Steps ────────────────────────────────────────────────
const howItWorksSteps = [
  {
    number: 1,
    icon: Edit,
    title: 'Tulis Catatan',
    description: 'Buat catatan baru Anda di dalam editor SecretInk.',
    color: 'bg-royal',
  },
  {
    number: 2,
    icon: KeyRound,
    title: 'Berikan Kunci Enkripsi',
    description: 'Tentukan dan masukkan kata sandi atau kunci enkripsi pribadi Anda',
    color: 'bg-royal',
  },
  {
    number: 3,
    icon: Lock,
    title: 'AES-256-CBC Mengenkripsi',
    description: 'Sistem secara otomatis mengenkripsi catatan menggunakan algoritma AES-256-CBC berbasis kunci yang Anda berikan.',
    color: 'bg-royal',
  },
  {
    number: 4,
    icon: Database,
    title: 'Data Terenkripsi Disimpan',
    description: 'Hanya teks sandi terenkripsi yang disimpan di database',
    color: 'bg-mint',
  },
  {
    number: 5,
    icon: Shield,
    title: 'Kunci Diperlukan untuk Dekripsi',
    description: 'Proses pengembalian data menjadi teks biasa (dekripsi) dapat dibuka dan dibaca ulang secara utuh menggunakan kunci enkripsi milik Anda..',
    color: 'bg-mint',
  },
  {
    number: 6,
    icon: EyeOff,
    title: 'Server Tidak Pernah Melihat Kunci',
    description: 'Kami menerapkan sistem Zero-Knowledge: server tidak pernah memiliki akses ke kunci enkripsi atau data asli Anda, memastikan privasi dan keamanan maksimal.',
    color: 'bg-mint',
  },
];

// ─── Security Features ────────────────────────────────────────────────────────
const securityFeatures = [
  {
    icon: ShieldCheck,
    title: 'Proteksi CSRF',
    description: 'Token Cross-Site Request Forgery memastikan setiap permintaan autentik dan diotorisasi oleh Anda.',
  },
  {
    icon: Code,
    title: 'Pencegahan XSS',
    description: 'Semua input pengguna dibersihkan dan di-escape untuk mencegah serangan cross-site scripting.',
  },
  {
    icon: Database,
    title: 'Pencegahan SQL Injection',
    description: 'Query parameterized dan perlindungan ORM menghilangkan kerentanan SQL injection.',
  },
  {
    icon: ScanLine,
    title: 'Sanitasi Input',
    description: 'Setiap input pengguna divalidasi dan dibersihkan sebelum diproses atau disimpan.',
  },
  {
    icon: Zap,
    title: 'Header HTTP Aman',
    description: 'Header keamanan termasuk CSP, HSTS, dan X-Frame-Options melindungi dari berbagai serangan.',
  },
  {
    icon: Timer,
    title: 'Batas Waktu Sesi',
    description: 'Kedaluwarsa sesi otomatis memastikan akun Anda tetap terlindungi saat tidak aktif.',
  },
];

// ─── About Page Component ─────────────────────────────────────────────────────
export default function AboutPage() {
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
        <section className="relative flex min-h-[60vh] items-center justify-center px-4 pt-28 pb-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            {/* Main heading */}
            <div className="animate-fade-in-up delay-100">
              <h1 className="font-heading text-3xl font-bold tracking-tight text-navy sm:text-4xl md:text-5xl">
                Mengenal <span className="gradient-text-royal">SecretInk</span>
              </h1>
            </div>

         {/* Subtitle */}
          <div className="animate-fade-in-up delay-200 mx-auto mt-5 max-w-2xl">
            <p className="font-sans text-base sm:text-lg leading-relaxed text-navy/60">
              Memahami teknologi enkripsi yang melindungi informasi Anda dari akses tidak sah, dengan sistem kriptografi yang dirancang untuk menjaga keamanan, integritas, dan kerahasiaan data digital.
            </p>
          </div>
          </div>
        </section>

        {/* ═══════════════════ WHAT IS CRYPTOGRAPHY ═══════════════════ */}
        <section className="relative px-4 py-2 sm:px-6 sm:py-4 lg:px-8">
          <div className="mx-auto max-w-6xl">
            {/* Section heading */}
            <div className="animate-fade-in-up mb-14 text-center sm:mb-16">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-royal/10">
                <Shield className="size-6 text-royal icon-pop" strokeWidth={2} />
              </div>
              <h2 className="font-heading text-3xl font-bold text-navy sm:text-4xl">
                Apa Itu <span className="gradient-text-royal">Kriptografi ?</span>
              </h2>
            </div>

            {/* Explanation card */}
            <div className="glass-card animate-fade-in-up delay-200 rounded-2xl p-6 shadow-soft-lg sm:p-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
                {/* Left: Explanation text */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-royal/10">
                      <Check className="size-3.5 text-royal" strokeWidth={3} />
                    </div>
                    <p className="font-sans text-sm leading-relaxed text-navy/70 sm:text-base">
                      <strong className="text-navy">Kriptografi</strong> adalah ilmu untuk menjaga kerahasiaan data dalam proses komunikasi digital agar tidak dapat dibaca oleh pihak lain tanpa izin.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-royal/10">
                      <Check className="size-3.5 text-royal" strokeWidth={3} />
                    </div>
                    <p className="font-sans text-sm leading-relaxed text-navy/70 sm:text-base">
                      <strong className="text-navy">Kriptografi</strong> mengubah data yang dapat dibaca (<strong className="text-navy">teks biasa</strong>) menjadi format
                      yang tidak terbaca (<strong className="text-navy">teks sandi</strong>) menggunakan algoritma matematika.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-royal/10">
                      <Check className="size-3.5 text-royal" strokeWidth={3} />
                    </div>
                    <p className="font-sans text-sm leading-relaxed text-navy/70 sm:text-base">
                     Akses ke data asli hanya dapat dilakukan dengan <strong className="text-navy">Kunci Dekripsi</strong> yang sesuai, memastikan bahwa hanya pihak yang berwenang yang dapat membaca informasi sensitif.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-royal/10">
                      <Check className="size-3.5 text-royal" strokeWidth={3} />
                    </div>
                    <p className="font-sans text-sm leading-relaxed text-navy/70 sm:text-base">
                      Digunakan sejak zaman kuno hingga era digital dengan 
                      <strong className="text-navy"> algoritma modern</strong> yang melindungi data dan informasi pada internet saat ini.
                    </p>
                  </div>
                </div>

                {/* Right: Visual diagram */}
                <div className="flex flex-col items-center gap-3">
                  <div className="glass-card rounded-xl p-5 shadow-soft w-full max-w-sm">
                    <p className="mb-3 text-center font-heading text-xs font-semibold uppercase tracking-wider text-navy/40">
                      Alur Enkripsi
                    </p>
                    {/* Diagram: Plaintext → Key → Ciphertext → Key → Plaintext */}
                    <div className="flex flex-col items-center gap-3">
                      {/* Plaintext */}
                      <div className="flex w-full items-center gap-3 rounded-lg bg-royal/5 p-3">
                        <FileText className="size-5 shrink-0 text-royal icon-pop" />
                        <div>
                          <p className="font-heading text-xs font-semibold text-navy">Teks Biasa</p>
                          <p className="font-sans text-[11px] text-navy/50">Data asli yang dapat dibaca</p>
                        </div>
                      </div>

                      <ArrowRight className="size-4 rotate-90 text-navy/30" />

                      {/* Key + Lock */}
                      <div className="flex w-full items-center gap-3 rounded-lg bg-royal/10 p-3">
                        <KeyRound className="size-5 shrink-0 text-royal icon-pop" />
                        <div>
                          <p className="font-heading text-xs font-semibold text-navy">Kunci Enkripsi</p>
                          <p className="font-sans text-[11px] text-navy/50">Mengubah data melalui proses enkripsi</p>
                        </div>
                      </div>

                      <ArrowRight className="size-4 rotate-90 text-navy/30" />

                      {/* Ciphertext */}
                      <div className="flex w-full items-center gap-3 rounded-lg bg-navy/5 p-3">
                        <Lock className="size-5 shrink-0 text-navy/60 icon-pop" />
                        <div>
                          <p className="font-heading text-xs font-semibold text-navy">Teks Sandi</p>
                          <p className="font-sans text-[11px] text-navy/50">Terenkripsi &amp; tidak terbaca</p>
                        </div>
                      </div>

                      <ArrowRight className="size-4 rotate-90 text-mint" />

                      {/* Decryption Key */}
                      <div className="flex w-full items-center gap-3 rounded-lg bg-mint/10 p-3">
                        <KeyRound className="size-5 shrink-0 text-mint icon-pop" />
                        <div>
                          <p className="font-heading text-xs font-semibold text-navy">Kunci Dekripsi</p>
                          <p className="font-sans text-[11px] text-navy/50">Membalikkan proses dan memulihkan data asli</p>
                        </div>
                      </div>

                      <ArrowRight className="size-4 rotate-90 text-mint" />

                      {/* Original Plaintext */}
                      <div className="flex w-full items-center gap-3 rounded-lg bg-mint/5 p-3">
                        <Check className="size-5 shrink-0 text-mint icon-pop" />
                        <div>
                          <p className="font-heading text-xs font-semibold text-navy">Teks Asli</p>
                          <p className="font-sans text-[11px] text-navy/50">Data dipulihkan & dapat dibaca kembali</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════ AES-256 ENCRYPTION ═══════════════════ */}
        <section className="relative px-4 py-16 sm:px-6 sm:py-18 lg:px-8">
          <div className="mx-auto max-w-6xl">
            {/* Section heading */}
            <div className="animate-fade-in-up mb-14 text-center sm:mb-16">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-royal/10">
                <Lock className="size-6 text-royal icon-pop" strokeWidth={2} />
              </div>
              <h2 className="font-heading text-3xl font-bold text-navy sm:text-4xl">
                Enkripsi <span className="gradient-text-royal">AES-256</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl font-sans text-base text-navy/50">
                Standar enkripsi simetris yang digunakan secara global untuk melindungi data sensitif.
              </p>
            </div>

            {/* Main explanation card */}
            <div className="glass-card animate-fade-in-up delay-100 rounded-2xl p-6 shadow-soft-lg sm:p-8 mb-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-royal/10">
                    <Check className="size-3.5 text-royal" strokeWidth={3} />
                  </div>
                  <p className="font-sans text-sm leading-relaxed text-navy/70 sm:text-base">
                    <strong className="text-navy">Advanced Encryption Standard (AES)</strong> adalah jenis algoritma enkripsi simetris, di mana kunci yang sama digunakan untuk proses enkripsi dan dekripsi.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-royal/10">
                    <Check className="size-3.5 text-royal" strokeWidth={3} />
                  </div>
                  <p className="font-sans text-sm leading-relaxed text-navy/70 sm:text-base">
                    Diadopsi secara <strong className="text-navy">global</strong>  untuk mengamankan data sensitif, mulai dari transaksi perbankan hingga komunikasi tingkat tinggi.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-royal/10">
                    <Check className="size-3.5 text-royal" strokeWidth={3} />
                  </div>
                  <p className="font-sans text-sm leading-relaxed text-navy/70 sm:text-base">
                    Kunci <strong className="text-navy">256-bit</strong> menyediakan 2<sup>256</sup> kemungkinan kombinasi, jumlah yang secara praktis tidak mungkin dipecahkan dengan brute force.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-royal/10">
                    <Check className="size-3.5 text-royal" strokeWidth={3} />
                  </div>
                  <p className="font-sans text-sm leading-relaxed text-navy/70 sm:text-base">
                    Digunakan oleh <strong className="text-navy">NSA</strong> untuk melindungi informasi rahasia, AES-256 telah diakui sebagai standar enkripsi tingkat tinggi yang 
                    menjadikannya tingkat izin enkripsi tertinggi yang tersedia.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-mint/20">
                    <Shield className="size-3.5 text-mint icon-pop" strokeWidth={3} />
                  </div>
                  <p className="font-sans text-sm leading-relaxed text-navy/70 sm:text-base">
                    Serangan brute force pada AES-256 akan memakan waktu <strong className="text-mint">miliaran tahun</strong>{' '}
                    membutuhkan waktu yang secara komputasi tidak realistis, bahkan dengan superkomputer modern.
                  </p>
                </div>
              </div>
            </div>

          {/* Key specs grid */}
          <div className="animate-fade-in-up grid grid-cols-2 gap-4 sm:gap-6 mb-8 md:grid-cols-4 [animation-delay:200ms]">
            {aesKeySpecs.map((spec, index) => {
              const Icon = spec.icon;

              return (
                <div
                  key={spec.label}
                  className="glass-card group rounded-2xl p-5 text-center shadow-soft transform transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] border-2 border-transparent hover:border-royal/40 hover:-translate-y-2 hover:shadow-soft-lg hover:bg-white/60"
                  style={{ animationDelay: `${(index + 2) * 100}ms`, animationFillMode: 'both' }}
                >
                  {/* Icon */}
                  <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-xl bg-royal/10 transition-all duration-500 ease-out group-hover:bg-royal group-hover:scale-110">
                    <Icon
                      className="size-5 text-royal transition-colors duration-500 group-hover:text-white"
                      strokeWidth={2}
                    />
                  </div>

                  {/* Value */}
                  <p className="font-heading text-xl font-bold text-navy sm:text-2xl transition-colors duration-300 group-hover:text-royal">
                    {spec.value}
                  </p>

                  {/* Label */}
                  <p className="mt-1 font-sans text-xs text-navy/50 sm:text-sm transition-colors duration-300 group-hover:text-navy/70">
                    {spec.label}
                  </p>
                </div>
              );
            })}
          </div>

         {/* Security comparison */}
          <div className="glass-card animate-fade-in-up delay-300 rounded-2xl p-6 shadow-soft-lg sm:p-8">
            <h3 className="font-heading mb-6 text-lg font-semibold text-navy sm:text-xl">
              Perbandingan Keamanan
            </h3>

            <div className="space-y-5">
              {securityComparison.map((item) => (
                <div
                  key={item.method}
                  className="group flex items-center gap-4 rounded-xl px-2 py-2 transition-all duration-300 hover:bg-navy/5"
                >
                  {/* Method */}
                  <p className="w-24 shrink-0 font-heading text-sm font-medium text-navy sm:w-32 sm:text-base transition-all duration-300 group-hover:text-royal">
                    {item.method}
                  </p>

                  {/* Bar */}
                  <div className="flex-1">
                    <div className="h-3 w-full overflow-hidden rounded-full bg-navy/5">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${
                          item.strength === 100
                            ? 'bg-gradient-to-r from-royal to-mint shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                            : item.strength === 70
                              ? 'bg-royal/70 shadow-[0_0_8px_rgba(59,130,246,0.25)]'
                              : item.strength === 15
                                ? 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.25)]'
                                : 'bg-red-400 shadow-[0_0_6px_rgba(239,68,68,0.25)]'
                        }`}
                        style={{ width: `${Math.max(item.strength, 4)}%` }}
                      />
                    </div>
                  </div>

                  {/* Label */}
                  <span
                    className={`shrink-0 font-sans text-xs font-semibold sm:text-sm transition-all duration-300 ${
                      item.strength === 100
                        ? 'text-mint group-hover:scale-105'
                        : item.strength === 70
                          ? 'text-royal group-hover:scale-105'
                          : item.strength === 15
                            ? 'text-amber-500 group-hover:scale-105'
                            : 'text-red-500 group-hover:scale-105'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
          </div>
        </section>

        {/* ═══════════════════ BCRYPT PASSWORD HASHING ═══════════════════ */}
        <section className="relative px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="mx-auto max-w-6xl">
            {/* Section heading */}
            <div className="animate-fade-in-up mb-14 text-center sm:mb-16">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-mint/10">
                <Shield className="size-6 text-mint icon-pop" strokeWidth={2} />
              </div>
              <h2 className="font-heading text-3xl font-bold text-navy sm:text-4xl">
                Proteksi Password <span className="gradient-text-royal">Bcrypt</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl font-sans text-base text-navy/50">
                Password Anda telah di-hash menggunakan Bcrypt sebelum disimpan dalam database.
              </p>
            </div>

           {/* Bcrypt explanation card */}
            <div className="glass-card animate-fade-in-up delay-100 rounded-2xl p-6 shadow-soft-lg sm:p-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-stretch">
                {/* Left: Explanation */}
                <div className="flex flex-col justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-mint/15">
                      <Check className="size-3.5 text-mint" strokeWidth={3} />
                    </div>
                    <p className="font-sans text-sm leading-relaxed text-navy/70 sm:text-base">
                      Password <strong className="text-navy">tidak pernah disimpan dalam bentuk teks biasa</strong>.
                      Sebaliknya, password diubah menjadi hash satu arah yang tidak dapat dikembalikan ke bentuk asli.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-mint/15">
                      <Check className="size-3.5 text-mint" strokeWidth={3} />
                    </div>
                    <p className="font-sans text-sm leading-relaxed text-navy/70 sm:text-base">
                      Bcrypt secara otomatis menambahkan <strong className="text-navy">salt</strong> (data acak)
                      sebelum hashing untuk mencegah serangan rainbow table dan kamus.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-mint/15">
                      <Check className="size-3.5 text-mint" strokeWidth={3} />
                    </div>
                    <p className="font-sans text-sm leading-relaxed text-navy/70 sm:text-base">
                      <strong className="text-navy">Cost Factor</strong> membuat proses hashing
                      lebih lambat secara sengaja, sehingga serangan brute force menjadi tidak efisien.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-mint/15">
                      <Check className="size-3.5 text-mint" strokeWidth={3} />
                    </div>
                    <p className="font-sans text-sm leading-relaxed text-navy/70 sm:text-base">
                      Bcrypt adalah <strong className="text-navy">standar industri</strong> untuk penyimpanan password,
                      direkomendasikan oleh OWASP dan praktisi keamanan.
                    </p>
                  </div>
                </div>

                {/* Right: Visual representation */}
                <div className="glass-card flex flex-col justify-between rounded-xl p-4 shadow-soft">
                  <p className="mb-3 text-center font-heading text-xs font-semibold uppercase tracking-wider text-navy/40">
                    Cara Kerja Bcrypt
                  </p>
                  <div className="flex flex-1 flex-col items-center justify-between gap-2">
                    {/* Password input */}
                    <div className="w-full rounded-lg bg-navy/5 p-2.5">
                      <p className="font-mono text-xs text-navy/60">myPassword123</p>
                      <p className="mt-0.5 font-sans text-[11px] text-navy/40">Password teks biasa</p>
                    </div>

                    <ArrowRight className="size-4 rotate-90 text-navy/30" />

                    {/* Salt + Cost */}
                    <div className="w-full">
                      <div className="flex items-center gap-2 rounded-lg bg-royal/5 p-2.5">
                        <Hash className="size-4 shrink-0 text-royal icon-pop" />
                        <div>
                          <p className="font-mono text-[11px] text-navy/60">$2b$12$randomsalt22chars</p>
                          <p className="font-sans text-[11px] text-navy/40">Salt + Faktor biaya (12 putaran)</p>
                        </div>
                      </div>
                    </div>

                    <ArrowRight className="size-4 rotate-90 text-mint" />

                    {/* Hash output */}
                    <div className="w-full rounded-lg bg-mint/5 p-2.5">
                      <p className="break-all font-mono text-[10px] text-navy/50">
                        $2b$12$randomsalt22charsOE9fWxJKv3gKXM8hHqP6uG5mZbNiKXW8eQvY2R
                      </p>
                      <p className="mt-0.5 font-sans text-[11px] text-navy/40">Hash bcrypt yang tidak dapat dibalikkan, disimpan di database</p>
                    </div>

                    {/* Callout */}
                    <div className="flex w-full items-center gap-2 rounded-lg bg-mint/10 px-3 py-2">
                      <Shield className="size-4 shrink-0 text-mint icon-pop" />
                      <p className="font-sans text-xs font-medium text-navy/70">
                        Tidak mungkin dikembalikan ke password asli
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════ HOW SECRETINK WORKS ═══════════════════ */}
        <section className="relative px-4 py-16 sm:px-6 sm:py-18 lg:px-8">
          <div className="mx-auto max-w-6xl">
            {/* Section heading */}
            <div className="animate-fade-in-up mb-14 text-center sm:mb-16">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-royal/10">
                <Shield className="size-6 text-royal icon-pop" strokeWidth={2} />
              </div>
              <h2 className="font-heading text-3xl font-bold text-navy sm:text-4xl">
                Bagaimana <span className="gradient-text-royal">SecretInk</span> Melindungi Data Anda
              </h2>
              <p className="mx-auto mt-4 max-w-xl font-sans text-base text-navy/50">
                Tahap demi tahap perjalanan data Anda melalui jalur enkripsi kami.
              </p>
            </div>

           {/* Timeline */}
            <div className="relative">
              <div className="absolute bottom-0 left-6 top-0 w-px bg-gradient-to-b from-royal/20 via-royal/10 to-mint/20 md:left-1/2 md:-translate-x-px" />

              <div className="space-y-6">
                {howItWorksSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isLeft = index % 2 === 0;
                  const isMint = index % 2 !== 0;
                  const colorBg    = isMint ? 'bg-mint'   : 'bg-royal';
                  const colorText  = isMint ? 'text-mint'  : 'text-royal';
                  const colorIcon  = isMint ? 'bg-mint/10' : 'bg-royal/10';
                  
                  const colorHover = isMint
                    ? 'hover:shadow-[0_12px_30px_-4px_rgba(52,211,153,0.15)] hover:border-mint/40 group-hover:border-mint/40'
                    : 'hover:shadow-[0_12px_30px_-4px_rgba(107,127,215,0.15)] hover:border-royal/40 group-hover:border-royal/40';

                  return (
                    <div
                      key={step.number}
                      className="animate-fade-in-up relative flex items-start md:grid md:grid-cols-[1fr_32px_1fr] md:items-start md:gap-0 group"
                      style={{ animationDelay: `${(index + 1) * 150}ms`, animationFillMode: 'both' }}
                    >
                      {/* Left slot */}
                      <div className={`${isLeft ? 'pl-10 md:pl-0 md:pr-6' : 'hidden md:block'}`}>
                        {isLeft && (
                          <div className={`glass-card rounded-xl p-4 shadow-soft border border-navy/5 transform transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1.5 ${colorHover}`}>
                            <div className="mb-2 flex items-center justify-end gap-2.5">
                              <h3 className="font-heading text-sm font-semibold text-navy transition-colors duration-300 group-hover:text-royal">{step.title}</h3>
                              <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${colorIcon} transition-all duration-500 ease-out group-hover:bg-royal group-hover:scale-110`}>
                                <Icon className={`size-4 ${colorText} transition-colors duration-500 group-hover:text-white`} strokeWidth={2} />
                              </div>
                            </div>
                            <p className="text-right font-sans text-xs leading-relaxed text-navy/50 transition-colors duration-300 group-hover:text-navy/70">{step.description}</p>
                          </div>
                        )}
                      </div>

                      <div className="relative flex justify-center">
                        <div className="absolute left-6 top-4 md:static md:left-auto md:top-auto md:mt-3.5">
                          <div className={`flex size-6 items-center justify-center rounded-full shadow-[0_0_0_4px_white] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-125 ${colorBg}`}>
                            <span className="font-heading text-xs font-bold leading-none text-white">
                              {step.number}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right slot */}
                      <div className={`${!isLeft ? 'pl-10 md:pl-6 md:pr-0' : 'hidden md:block'}`}>
                        {!isLeft && (
                          <div className={`glass-card rounded-xl p-4 shadow-soft border border-navy/5 transform transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1.5 ${colorHover}`}>
                            <div className="mb-2 flex items-center gap-2.5">
                              <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${colorIcon} transition-all duration-500 ease-out group-hover:bg-mint group-hover:scale-110`}>
                                <Icon className={`size-4 ${colorText} transition-colors duration-500 group-hover:text-white`} strokeWidth={2} />
                              </div>
                              <h3 className="font-heading text-sm font-semibold text-navy transition-colors duration-300 group-hover:text-mint">{step.title}</h3>
                            </div>
                            <p className="font-sans text-xs leading-relaxed text-navy/50 transition-colors duration-300 group-hover:text-navy/70">{step.description}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Emphasis callout */}
              <div className="animate-fade-in-up mt-10" style={{ animationDelay: '700ms', animationFillMode: 'both' }}>
                <div className="glass-card group mx-auto max-w-xl rounded-xl border border-navy/5 border-l-2 border-l-mint/40 p-4 shadow-soft-lg transform transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 hover:border-l-mint/70 hover:border-mint/20 hover:shadow-[0_12px_30px_-4px_rgba(52,211,153,0.12)]">
                  <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-mint/10 transition-all duration-500 ease-out group-hover:bg-mint group-hover:scale-110">
                      <EyeOff className="size-4 text-mint transition-colors duration-500 group-hover:text-white" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="font-heading text-sm font-bold text-navy">
                        Sistem kami menerapkan <span className="text-mint">ZERO-KNOWLEDGE</span>, kunci tidak pernah dikirim ke server
                      </p>
                      <p className="mt-0.5 font-sans text-xs text-navy/50 transition-colors duration-300 group-hover:text-navy/70">
                        Secara sistem, kami tidak memiliki kemampuan untuk memulihkan atau membaca catatan Anda. Kendali penuh ada di tangan Anda.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════ SECURITY FEATURES ═══════════════════ */}
        <section className="relative px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
          <div className="mx-auto max-w-6xl">
            {/* Section heading */}
            <div className="animate-fade-in-up mb-14 text-center sm:mb-16">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-royal/10">
                <ShieldCheck className="size-6 text-royal icon-pop" strokeWidth={2} />
              </div>
              <h2 className="font-heading text-3xl font-bold text-navy sm:text-4xl">
                Langkah Keamanan <span className="gradient-text-royal">Kami</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl font-sans text-base text-navy/50">
                Berbagai lapisan perlindungan memastikan data Anda tetap aman.
              </p>
            </div>

            {/* Features grid */}
            <div className="animate-fade-in-up grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 [animation-delay:100ms]">
              {securityFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="group glass-card rounded-2xl p-6 shadow-soft border border-navy/5 transform transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:shadow-soft-lg hover:-translate-y-2 hover:bg-white/80 hover:ring-1 hover:ring-royal/20 sm:p-6 animate-fade-in-up"
                    style={{ animationDelay: `${(index + 1) * 150}ms`, animationFillMode: 'both' }}
                  >
                    <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-royal/10 transition-all duration-500 ease-out group-hover:bg-royal group-hover:scale-110 group-hover:rotate-3">
                      <Icon className="size-5 text-royal transition-all duration-500 ease-out group-hover:text-white" strokeWidth={2} />
                    </div>
                    
                    <h3 className="font-heading text-base font-semibold text-navy transition-colors duration-300 group-hover:text-royal sm:text-lg">
                      {feature.title}
                    </h3>
                    
                    <p className="mt-2 font-sans text-sm leading-relaxed text-navy/50 transition-colors duration-300 group-hover:text-navy/70">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
              </div>
          </div>
        </section>

        {/* ═══════════════════ ZERO KNOWLEDGE ARCHITECTURE ═══════════════════ */}
        <section className="relative px-4 py-16 sm:px-6 sm:py-18 lg:px-8">
          <div className="mx-auto max-w-4xl">
            {/* Section heading */}
            <div className="animate-fade-in-up mb-14 text-center sm:mb-16">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-mint/10">
                <EyeOff className="size-6 text-mint icon-pop" strokeWidth={2} />
              </div>
              <h2 className="font-heading text-3xl font-bold text-navy sm:text-4xl">
                Filosofi <span className="gradient-text-royal">Zero Knowledge</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl font-sans text-base text-navy/50">
                Privasi berbasis enkripsi, bukan kepercayaan.
              </p>
            </div>

            {/* Zero knowledge explanation card */}
            <div className="glass-card animate-fade-in-up delay-100 rounded-2xl p-6 shadow-soft-lg sm:p-8">
              <div className="space-y-6">

                <div className="flex items-start gap-4">
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-mint/15">
                    <EyeOff className="size-4 text-mint icon-pop" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="font-heading text-base font-semibold text-navy sm:text-lg">
                      Catatan terenkripsi sebelum meninggalkan perangkat Anda
                    </h4>
                    <p className="mt-1 font-sans text-sm leading-relaxed text-navy/50">
                      Enkripsi terjadi di sisi klien, di browser Anda, sebelum data dikirim ke server.
                      Yang kami terima dan simpan hanya ciphertext — data yang tidak dapat dibaca
                      tanpa kunci enkripsi Anda.
                    </p>
                  </div>
                </div>

                <div className="h-px bg-border/50" />

                <div className="flex items-start gap-4">
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-royal/10">
                    <KeyRound className="size-4 text-royal icon-pop" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="font-heading text-base font-semibold text-navy sm:text-lg">
                      Kunci enkripsi tidak pernah dikirim ke server kami
                    </h4>
                    <p className="mt-1 font-sans text-sm leading-relaxed text-navy/50">
                      Kunci enkripsi Anda hanya ada di sesi browser Anda. Kami tidak menyimpan,
                      mencatat, atau mentransmisikannya ke mana pun — sehingga kami tidak memiliki
                      akses untuk mendekripsi catatan Anda.
                    </p>
                  </div>
                </div>

                <div className="h-px bg-border/50" />

                <div className="flex items-start gap-4">
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-royal/10">
                    <Server className="size-4 text-royal icon-pop" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="font-heading text-base font-semibold text-navy sm:text-lg">
                      Kebocoran database tidak mengekspos isi catatan Anda
                    </h4>
                    <p className="mt-1 font-sans text-sm leading-relaxed text-navy/50">
                      Jika database kami diakses pihak tidak berwenang, yang mereka dapatkan hanya
                      ciphertext AES-256. Tanpa kunci Anda, data tersebut tidak dapat didekripsi
                      dengan teknologi komputasi yang ada saat ini.
                    </p>
                  </div>
                </div>

                <div className="h-px bg-border/50" />

                <div className="flex items-start gap-4">
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-mint/15">
                    <Shield className="size-4 text-mint icon-pop" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="font-heading text-base font-semibold text-navy sm:text-lg">
                      Keamanan berbasis algoritma yang dapat diverifikasi
                    </h4>
                    <p className="mt-1 font-sans text-sm leading-relaxed text-navy/50">
                      AES-256 adalah standar enkripsi terbuka yang telah diaudit secara luas dan
                      digunakan oleh institusi keuangan serta pemerintahan. Privasi Anda bergantung
                      pada properti matematis algoritma ini, bukan pada kebijakan layanan kami.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom emphasis banner */}
              <div className="mt-8 rounded-xl bg-gradient-to-r from-royal/5 via-mint/5 to-royal/5 p-5">
                <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-mint/15">
                    <Lock className="size-6 text-mint icon-pop" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="font-heading text-base font-bold text-navy sm:text-lg">
                      Data Anda. Kunci Anda. Kendali Anda.
                    </p>
                    <p className="mt-1 font-sans text-sm text-navy/50">
                      Arsitektur zero knowledge memastikan bahwa akses ke catatan Anda
                      hanya dapat dilakukan oleh pemegang kunci enkripsi — yaitu Anda.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
