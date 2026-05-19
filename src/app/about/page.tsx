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
    description: 'Pengguna menulis catatan di editor SecretInk',
    color: 'bg-royal',
  },
  {
    number: 2,
    icon: KeyRound,
    title: 'Berikan Kunci Enkripsi',
    description: 'Pengguna memberikan kunci enkripsi pribadi mereka',
    color: 'bg-royal',
  },
  {
    number: 3,
    icon: Lock,
    title: 'AES-256-CBC Mengenkripsi',
    description: 'Catatan dienkripsi menggunakan AES-256-CBC dengan kunci tersebut',
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
    description: 'Hanya kunci pengguna yang dapat mendekripsi catatan kembali ke teks biasa',
    color: 'bg-mint',
  },
  {
    number: 6,
    icon: EyeOff,
    title: 'Server Tidak Pernah Melihat Kunci',
    description: 'Kunci enkripsi Anda TIDAK PERNAH dikirim ke server kami untuk disimpan',
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
            {/* Decorative shield */}
            <div className="animate-fade-in-up mb-6 flex justify-center">
              <div className="relative flex size-20 items-center justify-center rounded-2xl glass-card shadow-soft-lg sm:size-24 logo-zoom">
                <Lock className="size-9 text-royal sm:size-11 icon-pop" strokeWidth={1.8} />
                <div className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-mint text-white">
                  <Check className="size-3.5" strokeWidth={3} />
                </div>
              </div>
            </div>

            {/* Main heading */}
            <div className="animate-fade-in-up delay-100">
              <h1 className="font-heading text-4xl font-bold tracking-tight text-navy sm:text-5xl md:text-6xl">
                Tentang <span className="gradient-text-royal">SecretInk</span>
              </h1>
            </div>

            {/* Subtitle */}
            <div className="animate-fade-in-up delay-200 mx-auto mt-5 max-w-2xl">
              <p className="font-sans text-lg leading-relaxed text-navy/60 sm:text-xl">
                Memahami kriptografi di balik keamanan Anda
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════════ WHAT IS CRYPTOGRAPHY ═══════════════════ */}
        <section className="relative px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-6xl">
            {/* Section heading */}
            <div className="animate-fade-in-up mb-14 text-center sm:mb-16">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-royal/10">
                <Shield className="size-6 text-royal icon-pop" strokeWidth={2} />
              </div>
              <h2 className="font-heading text-3xl font-bold text-navy sm:text-4xl">
                Apa Itu <span className="gradient-text-royal">Kriptografi</span>?
              </h2>
              <p className="mx-auto mt-4 max-w-xl font-sans text-base text-navy/50">
                Ilmu menjaga keamanan informasi selama ribuan tahun.
              </p>
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
                      <strong className="text-navy">Kriptografi</strong> adalah praktik mengamankan komunikasi dan data
                      sehingga hanya pihak yang berwenang yang dapat mengaksesnya.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-royal/10">
                      <Check className="size-3.5 text-royal" strokeWidth={3} />
                    </div>
                    <p className="font-sans text-sm leading-relaxed text-navy/70 sm:text-base">
                      Ia mengubah data yang dapat dibaca (<strong className="text-navy">teks biasa</strong>) menjadi format
                      yang tidak terbaca (<strong className="text-navy">teks sandi</strong>) menggunakan algoritma matematika.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-royal/10">
                      <Check className="size-3.5 text-royal" strokeWidth={3} />
                    </div>
                    <p className="font-sans text-sm leading-relaxed text-navy/70 sm:text-base">
                      Hanya pihak yang berwenang dengan <strong className="text-navy">kunci</strong> yang benar dapat
                      mengakses data asli dengan membalikkan prosesnya.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-royal/10">
                      <Check className="size-3.5 text-royal" strokeWidth={3} />
                    </div>
                    <p className="font-sans text-sm leading-relaxed text-navy/70 sm:text-base">
                      Digunakan selama berabad-abad, dari <strong className="text-navy">sandi kuno</strong> hingga{' '}
                      <strong className="text-navy">algoritma modern</strong> yang melindungi internet saat ini.
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
                          <p className="font-sans text-[11px] text-navy/50">Data yang dapat dibaca</p>
                        </div>
                      </div>

                      <ArrowRight className="size-4 rotate-90 text-navy/30" />

                      {/* Key + Lock */}
                      <div className="flex w-full items-center gap-3 rounded-lg bg-royal/10 p-3">
                        <KeyRound className="size-5 shrink-0 text-royal icon-pop" />
                        <div>
                          <p className="font-heading text-xs font-semibold text-navy">Kunci Enkripsi</p>
                          <p className="font-sans text-[11px] text-navy/50">Mengubah data</p>
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
                          <p className="font-sans text-[11px] text-navy/50">Membalikkan proses</p>
                        </div>
                      </div>

                      <ArrowRight className="size-4 rotate-90 text-mint" />

                      {/* Original Plaintext */}
                      <div className="flex w-full items-center gap-3 rounded-lg bg-mint/5 p-3">
                        <Check className="size-5 shrink-0 text-mint icon-pop" />
                        <div>
                          <p className="font-heading text-xs font-semibold text-navy">Teks Asli</p>
                          <p className="font-sans text-[11px] text-navy/50">Data dipulihkan</p>
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
        <section className="relative px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
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
                Standar emas dalam enkripsi simetris, dipercaya di seluruh dunia.
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
                    <strong className="text-navy">Advanced Encryption Standard (AES)</strong> adalah algoritma enkripsi
                    simetris, artinya kunci yang sama digunakan untuk enkripsi dan dekripsi.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-royal/10">
                    <Check className="size-3.5 text-royal" strokeWidth={3} />
                  </div>
                  <p className="font-sans text-sm leading-relaxed text-navy/70 sm:text-base">
                    Diadopsi oleh <strong className="text-navy">pemerintah AS</strong> dan digunakan di seluruh dunia untuk
                    mengamankan segalanya mulai dari transaksi perbankan hingga komunikasi militer yang dirahasiakan.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-royal/10">
                    <Check className="size-3.5 text-royal" strokeWidth={3} />
                  </div>
                  <p className="font-sans text-sm leading-relaxed text-navy/70 sm:text-base">
                    Kunci <strong className="text-navy">256-bit</strong> menyediakan 2<sup>256</sup> kemungkinan kombinasi
                    — itu lebih banyak dari jumlah atom di alam semesta yang teramati.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-royal/10">
                    <Check className="size-3.5 text-royal" strokeWidth={3} />
                  </div>
                  <p className="font-sans text-sm leading-relaxed text-navy/70 sm:text-base">
                    Digunakan oleh <strong className="text-navy">NSA</strong> untuk melindungi informasi RAHASIA BESAR,
                    menjadikannya tingkat izin enkripsi tertinggi yang tersedia.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-mint/20">
                    <Shield className="size-3.5 text-mint icon-pop" strokeWidth={3} />
                  </div>
                  <p className="font-sans text-sm leading-relaxed text-navy/70 sm:text-base">
                    Serangan brute force pada AES-256 akan memakan waktu <strong className="text-mint">miliaran tahun</strong>{' '}
                    bahkan dengan superkomputer tercepat di dunia — secara komputasi tidak dapat dipecahkan.
                  </p>
                </div>
              </div>
            </div>

            {/* Key specs grid */}
            <div className="animate-fade-in-up delay-200 grid grid-cols-2 gap-4 sm:gap-6 mb-8 md:grid-cols-4">
              {aesKeySpecs.map((spec) => {
                const Icon = spec.icon;
                return (
                  <div
                    key={spec.label}
                    className="glass-card rounded-2xl p-5 text-center shadow-soft transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-1"
                  >
                    <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-xl bg-royal/10">
                      <Icon className="size-5 text-royal icon-pop" strokeWidth={2} />
                    </div>
                    <p className="font-heading text-xl font-bold text-navy sm:text-2xl">{spec.value}</p>
                    <p className="mt-1 font-sans text-xs text-navy/50 sm:text-sm">{spec.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Security comparison */}
            <div className="glass-card animate-fade-in-up delay-300 rounded-2xl p-6 shadow-soft-lg sm:p-8">
              <h3 className="font-heading mb-6 text-lg font-semibold text-navy sm:text-xl">
                Perbandingan Keamanan
              </h3>
              <div className="space-y-4">
                {securityComparison.map((item) => (
                  <div key={item.method} className="flex items-center gap-4">
                    <p className="w-24 shrink-0 font-heading text-sm font-medium text-navy sm:w-32 sm:text-base">
                      {item.method}
                    </p>
                    <div className="flex-1">
                      <div className="h-3 w-full overflow-hidden rounded-full bg-navy/5">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            item.strength === 100
                              ? 'bg-gradient-to-r from-royal to-mint'
                              : item.strength === 70
                                ? 'bg-royal/60'
                                : item.strength === 15
                                  ? 'bg-amber-400'
                                  : 'bg-red-400'
                          }`}
                          style={{ width: `${Math.max(item.strength, 3)}%` }}
                        />
                      </div>
                    </div>
                    <span
                      className={`shrink-0 font-sans text-xs font-semibold sm:text-sm ${
                        item.strength === 100
                          ? 'text-mint'
                          : item.strength === 70
                            ? 'text-royal'
                            : item.strength === 15
                              ? 'text-amber-500'
                              : 'text-red-500'
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
        <section className="relative px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
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
                Password Anda tidak pernah disimpan dalam teks biasa — tidak pernah.
              </p>
            </div>

            {/* Bcrypt explanation card */}
            <div className="glass-card animate-fade-in-up delay-100 rounded-2xl p-6 shadow-soft-lg sm:p-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-start">
                {/* Left: Explanation */}
                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-mint/15">
                      <Check className="size-3.5 text-mint" strokeWidth={3} />
                    </div>
                    <p className="font-sans text-sm leading-relaxed text-navy/70 sm:text-base">
                      Password <strong className="text-navy">tidak pernah disimpan dalam teks biasa</strong>. Sebaliknya, ia
                      diubah melalui fungsi hash satu arah yang tidak dapat dibalikkan.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-mint/15">
                      <Check className="size-3.5 text-mint" strokeWidth={3} />
                    </div>
                    <p className="font-sans text-sm leading-relaxed text-navy/70 sm:text-base">
                      Bcrypt secara otomatis menambahkan <strong className="text-navy">salt</strong> — data acak yang
                      ditambahkan sebelum hashing — untuk mencegah serangan rainbow table dan serangan kamus.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-mint/15">
                      <Check className="size-3.5 text-mint" strokeWidth={3} />
                    </div>
                    <p className="font-sans text-sm leading-relaxed text-navy/70 sm:text-base">
                      <strong className="text-navy">Faktor biaya adaptif</strong> membuat Bcrypt sengaja lebih lambat,
                      yang membuat serangan brute force menjadi tidak praktis secara komputasi.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-mint/15">
                      <Check className="size-3.5 text-mint" strokeWidth={3} />
                    </div>
                    <p className="font-sans text-sm leading-relaxed text-navy/70 sm:text-base">
                      Bcrypt adalah <strong className="text-navy">standar industri</strong> untuk keamanan password,
                      direkomendasikan oleh OWASP dan profesional keamanan di seluruh dunia.
                    </p>
                  </div>
                </div>

                {/* Right: Visual representation */}
                <div className="glass-card rounded-xl p-5 shadow-soft">
                  <p className="mb-4 text-center font-heading text-xs font-semibold uppercase tracking-wider text-navy/40">
                    Cara Kerja Bcrypt
                  </p>
                  <div className="flex flex-col items-center gap-3">
                    {/* Password input */}
                    <div className="w-full rounded-lg bg-navy/5 p-3">
                      <p className="font-mono text-xs text-navy/60">myPassword123</p>
                      <p className="mt-1 font-sans text-[11px] text-navy/40">Password teks biasa</p>
                    </div>

                    <ArrowRight className="size-4 rotate-90 text-navy/30" />

                    {/* Salt + Cost */}
                    <div className="w-full space-y-2">
                      <div className="flex items-center gap-2 rounded-lg bg-royal/5 p-3">
                        <Hash className="size-4 shrink-0 text-royal icon-pop" />
                        <div>
                          <p className="font-mono text-[11px] text-navy/60">$2b$12$randomsalt22chars</p>
                          <p className="font-sans text-[11px] text-navy/40">Salt + Faktor biaya (12 putaran)</p>
                        </div>
                      </div>
                    </div>

                    <ArrowRight className="size-4 rotate-90 text-mint" />

                    {/* Hash output */}
                    <div className="w-full rounded-lg bg-mint/5 p-3">
                      <p className="break-all font-mono text-[10px] text-navy/50">
                        $2b$12$randomsalt22charsOE9fWxJKv3gKXM8hHqP6uG5mZbNiKXW8eQvY2R
                      </p>
                      <p className="mt-1 font-sans text-[11px] text-navy/40">Hash bcrypt yang tidak dapat dibalikkan, disimpan di database</p>
                    </div>

                    {/* Callout */}
                    <div className="mt-2 flex items-center gap-2 rounded-lg bg-mint/10 px-4 py-2.5">
                      <Shield className="size-4 text-mint icon-pop" />
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
        <section className="relative px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
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
              {/* Vertical connecting line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-royal/20 via-royal/10 to-mint/20 md:left-1/2 md:-translate-x-px" />

              <div className="space-y-8">
                {howItWorksSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isLeft = index % 2 === 0;

                  return (
                    <div
                      key={step.number}
                      className={`animate-fade-in-up delay-${(index + 1) * 100} relative flex items-start gap-6 md:gap-0 ${
                        isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                      }`}
                    >
                      {/* Content card */}
                      <div className={`flex-1 pl-14 md:pl-0 ${isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}>
                        <div className="glass-card rounded-2xl p-5 shadow-soft transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-0.5 sm:p-6">
                          <div className={`flex items-center gap-3 ${isLeft ? 'md:justify-end' : 'md:justify-start'}`}>
                            <div className={`flex size-10 items-center justify-center rounded-xl ${step.color === 'bg-mint' ? 'bg-mint/10' : 'bg-royal/10'}`}>
                              <Icon className={`size-5 icon-pop ${step.color === 'bg-mint' ? 'text-mint' : 'text-royal'}`} strokeWidth={2} />
                            </div>
                            <h3 className="font-heading text-base font-semibold text-navy sm:text-lg">
                              {step.title}
                            </h3>
                          </div>
                          <p className="mt-3 font-sans text-sm leading-relaxed text-navy/50">
                            {step.description}
                          </p>
                        </div>
                      </div>

                      {/* Timeline node */}
                      <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 z-10 flex size-5 -translate-x-1/2 items-center justify-center">
                        <div className={`size-5 rounded-full ${step.color} flex items-center justify-center shadow-royal`}>
                          <span className="text-[10px] font-bold text-white">{step.number}</span>
                        </div>
                      </div>

                      {/* Empty space for the other side on desktop */}
                      <div className="hidden flex-1 md:block" />
                    </div>
                  );
                })}
              </div>

              {/* Emphasis callout */}
              <div className="animate-fade-in-up delay-700 mt-12">
                <div className="glass-card mx-auto max-w-2xl rounded-2xl p-5 shadow-soft-lg sm:p-6">
                  <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-mint/10">
                      <EyeOff className="size-6 text-mint icon-pop" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="font-heading text-base font-bold text-navy sm:text-lg">
                        Kunci enkripsi Anda <span className="text-mint">TIDAK PERNAH</span> dikirim ke server kami untuk disimpan
                      </p>
                      <p className="mt-1 font-sans text-sm text-navy/50">
                        Kami tidak dapat mendekripsi catatan Anda — bahkan jika kami mau. Hanya Anda yang memegang kunci.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════ SECURITY FEATURES ═══════════════════ */}
        <section className="relative px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
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
                Berbagai lapisan perlindungan memastikan data Anda tetap aman di setiap level.
              </p>
            </div>

            {/* Features grid */}
            <div className="animate-fade-in-up delay-100 grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {securityFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className={`glass-card rounded-2xl p-6 shadow-soft transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-1 sm:p-6 animate-fade-in-up delay-${(index + 1) * 100}`}
                  >
                    <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-royal/10">
                      <Icon className="size-5 text-royal icon-pop" strokeWidth={2} />
                    </div>
                    <h3 className="font-heading text-base font-semibold text-navy sm:text-lg">
                      {feature.title}
                    </h3>
                    <p className="mt-2 font-sans text-sm leading-relaxed text-navy/50">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════ ZERO KNOWLEDGE ARCHITECTURE ═══════════════════ */}
        <section className="relative px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
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
                Privasi sejati melalui matematika, bukan sekadar janji.
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
                      Kami tidak pernah bisa membaca catatan terenkripsi Anda
                    </h4>
                    <p className="mt-1 font-sans text-sm leading-relaxed text-navy/50">
                      Catatan Anda dienkripsi di sisi klien sebelum mencapai server kami. Kami hanya pernah melihat
                      teks sandi — karakter yang tampak acak yang secara matematika tidak mungkin didekodekan tanpa
                      kunci Anda.
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
                      Kunci enkripsi Anda tetap bersama Anda
                    </h4>
                    <p className="mt-1 font-sans text-sm leading-relaxed text-navy/50">
                      Kunci enkripsi Anda tidak pernah ditransmisikan ke server kami, tidak pernah disimpan di database kami,
                      dan tidak pernah dicatat di mana pun. Kunci itu hanya ada di sesi browser dan ingatan Anda.
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
                      Bahkan jika database kami dikompromikan, catatan Anda tetap terenkripsi
                    </h4>
                    <p className="mt-1 font-sans text-sm leading-relaxed text-navy/50">
                      Jika terjadi pelanggaran data, penyerang hanya akan menemukan teks sandi terenkripsi AES-256. Tanpa
                      kunci enkripsi pribadi Anda, data tersebut sama sekali tidak berguna — dilindungi oleh matematika yang
                      akan memakan miliaran tahun untuk dipecahkan.
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
                      Privasi sejati melalui matematika, bukan sekadar janji
                    </h4>
                    <p className="mt-1 font-sans text-sm leading-relaxed text-navy/50">
                      Kami tidak meminta Anda untuk mempercayai kami — kami meminta Anda mempercayai matematika. Algoritma
                      AES-256 bersifat terbuka, telah ditinjau sejawat, dan terbukti. Privasi Anda dijamin oleh hukum
                      kompleksitas komputasi, bukan oleh kebijakan perusahaan.
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
                      Zero knowledge berarti tanpa kompromi. Kami membangun SecretInk sehingga bahkan kami tidak dapat mengakses rahasia Anda.
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
