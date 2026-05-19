'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  const rememberValue = watch('remember');

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Email atau kata sandi tidak valid');
        return;
      }

      if (result?.ok) {
        toast.success('Selamat datang kembali!');
        router.replace('/dashboard');
      }
    } catch {
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Animated Background */}
      <div className="animated-bg">
        <div className="floating-orb" />
        <div className="floating-orb" />
        <div className="floating-orb" />
      </div>

      <main className="flex-1 flex items-center justify-center pt-24 px-4 sm:pt-28">
        <div
          className={cn(
            'w-full max-w-md animate-fade-in-up'
          )}
        >
          {/* Login Card */}
          <div className="glass-card rounded-2xl p-8 shadow-soft-lg">
            {/* Header */}
            <div className="flex flex-col items-center mb-8">
              <div
                className={cn(
                  'flex items-center justify-center',
                  'size-14 rounded-2xl mb-4',
                  'bg-accent'
                )}
              >
                <img src="/logo.svg" alt="SecretInk Logo" className="size-7 logo-zoom" />
              </div>
              <h1
                className={cn(
                  'text-2xl font-bold tracking-tight text-navy',
                  'font-[family-name:var(--font-poppins)]'
                )}
              >
                Selamat Datang Kembali
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Masuk untuk mengakses brankas aman Anda
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-navy"
                >
                  Email
                </Label>
                <div className="relative input-royal rounded-md">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Masukkan email Anda"
                    className={cn(
                      'pl-10 h-10 bg-white/60 border-border/60',
                      'placeholder:text-muted-foreground',
                      errors.email && 'border-destructive focus-visible:border-destructive'
                    )}
                    {...register('email', {
                      required: 'Email wajib diisi',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Masukkan alamat email yang valid',
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive font-medium">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-navy"
                >
                  Kata Sandi
                </Label>
                <div className="relative input-royal rounded-md">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Masukkan kata sandi Anda"
                    className={cn(
                      'pl-10 pr-10 h-10 bg-white/60 border-border/60',
                      'placeholder:text-muted-foreground',
                      errors.password && 'border-destructive focus-visible:border-destructive'
                    )}
                    {...register('password', {
                      required: 'Kata sandi wajib diisi',
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-navy transition-colors"
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4 icon-pop" />
                    ) : (
                      <Eye className="size-4 icon-pop" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive font-medium">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberValue}
                    onCheckedChange={(checked) =>
                      setValue('remember', checked === true)
                    }
                    className="data-[state=checked]:bg-royal data-[state=checked]:border-royal"
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm text-muted-foreground cursor-pointer font-normal"
                  >
                    Ingat saya
                  </Label>
                </div>
                <Link
                  href="#"
                  className="text-xs text-royal hover:text-royal-dark transition-colors font-medium"
                >
                  Lupa kata sandi?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  'w-full h-10 btn-royal rounded-md',
                  'font-[family-name:var(--font-poppins)] font-semibold text-sm',
                  'disabled:opacity-70 disabled:cursor-not-allowed'
                )}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Sedang masuk...
                  </>
                ) : (
                  'Masuk'
                )}
              </Button>
            </form>

            {/* Register Link */}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Belum punya akun?{' '}
              <Link
                href="/register"
                className="text-royal hover:text-royal-dark font-semibold transition-colors"
              >
                Daftar
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
