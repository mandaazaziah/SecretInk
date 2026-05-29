'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export default function DirectResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !newPassword) {
      toast.error('Silakan isi email dan kata sandi baru Anda');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Kata sandi minimal harus 8 karakter');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Kata sandi berhasil diubah!');
        
        setTimeout(() => {
          router.push('/login');
        }, 2000); 

      } else {
        toast.error(data.error || 'Gagal mengubah kata sandi.');
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error('Terjadi kesalahan koneksi server.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <Navbar />

      <div className="animated-bg absolute inset-0 -z-10">
        <div className="floating-orb" />
        <div className="floating-orb" />
        <div className="floating-orb" />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center w-full px-4 pt-28 pb-16 sm:pt-32">
        <div className={cn('w-full max-w-md')}>
          <div className="glass-card rounded-2xl p-8 shadow-soft-lg">
            
            <div className="flex flex-col items-center text-center mb-8">
              <div
                className={cn(
                  'flex items-center justify-center',
                  'size-14 rounded-2xl mb-4 bg-accent'
                )}
              >
                <img src="/logo.png" alt="SecretInk Logo" className="size-10" />
              </div>
              
              <h1
                className={cn(
                  'text-2xl font-bold tracking-tight text-navy',
                  'font-[family-name:var(--font-poppins)]'
                )}
              >
                Reset Kata Sandi
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Masukkan email Anda dan ketikkan kata sandi yang baru.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Input Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-navy">
                  Alamat Email
                </Label>
                <div className="relative input-royal rounded-md">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Masukkan email akun Anda"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={cn(
                      'pl-10 h-10 bg-white/60 border-border/60',
                      'placeholder:text-muted-foreground'
                    )}
                  />
                </div>
              </div>

              {/* Input Password Baru */}
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-medium text-navy">
                  Kata Sandi Baru
                </Label>
                <div className="relative input-royal rounded-md">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Masukkan kata sandi baru"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className={cn(
                      'pl-10 pr-10 h-10 bg-white/60 border-border/60',
                      'placeholder:text-muted-foreground'
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-navy transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4 icon-pop" />
                    ) : (
                      <Eye className="size-4 icon-pop" />
                    )}
                  </button>
                </div>
              </div>

              {/* Tombol Submit */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  'w-full h-10 btn-royal rounded-md mt-4',
                  'font-[family-name:var(--font-poppins)] font-semibold text-sm transition-all duration-300 cursor-pointer',
                  'disabled:opacity-80 disabled:cursor-wait flex items-center justify-center',
                )}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-2" />
                    Menyimpan Sandi...
                  </>
                ) : (
                  'Ganti Kata Sandi'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="inline-flex items-center justify-center text-sm text-muted-foreground hover:text-royal font-medium transition-colors"
              >
                <ArrowLeft className="size-4 mr-2" />
                Kembali ke Halaman Login
              </Link>
            </div>
            
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}