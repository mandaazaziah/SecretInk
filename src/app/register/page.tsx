"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { User, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function getPasswordStrength(password: string): {
  label: string;
  color: string;
  width: string;
} {
  if (!password) return { label: "", color: "", width: "0%" };

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);
  const isLongEnough = password.length >= 8;

  const variety = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

  if (!isLongEnough || variety <= 1) {
    return { label: "Lemah", color: "bg-red-500", width: "33%" };
  }
  if (isLongEnough && (variety === 2 || variety === 3)) {
    return { label: "Sedang", color: "bg-yellow-500", width: "66%" };
  }
  if (isLongEnough && hasUpper && hasLower && hasNumber && hasSpecial) {
    return { label: "Kuat", color: "bg-emerald-500", width: "100%" };
  }
  return { label: "Sedang", color: "bg-yellow-500", width: "66%" };
}

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    mode: "onBlur",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password");
  const strength = useMemo(() => getPasswordStrength(passwordValue), [passwordValue]);

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "Pendaftaran gagal. Silakan coba lagi.");
        return;
      }

      toast.success("Akun berhasil dibuat! Silakan masuk.");
      router.push("/login");
    } catch {
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Animated Background */}
      <div className="animated-bg absolute inset-0 -z-10">
        <div className="floating-orb" />
        <div className="floating-orb" />
        <div className="floating-orb" />
      </div>

      {/* Penyesuaian jarak atas ke navbar (pt-28/sm:pt-32) dan bawah ke footer (pb-16) */}
      <main className="flex-1 flex flex-col items-center justify-center w-full px-4 pt-28 pb-16 sm:pt-32">
        <div className="glass-card rounded-2xl p-8 w-full max-w-md shadow-soft-lg">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-accent mb-4">
              <img src="/logo.png" alt="SecretInk Logo" className="size-10" />
            </div>
            <h1 className="text-2xl font-bold text-navy" style={{ fontFamily: "var(--font-poppins)" }}>
              Buat Akun Anda
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Mulai amankan catatan Anda hari ini
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            {/* Username */}
            <div>
              <div className="input-royal relative flex items-center rounded-md border border-input bg-transparent transition-[color,box-shadow] focus-within:border-royal focus-within:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]">
                <span className="pl-3 text-muted-foreground">
                  <User className="w-4 h-4 icon-pop" />
                </span>
                <input
                  type="text"
                  placeholder="Pilih nama pengguna"
                  className="flex h-9 w-full rounded-md bg-transparent px-3 py-1 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  {...register("username", {
                    required: "Nama pengguna wajib diisi",
                    minLength: {
                      value: 3,
                      message: "Nama pengguna harus minimal 3 karakter",
                    },
                  })}
                />
              </div>
              {errors.username && (
                <p className="text-xs text-destructive mt-1 ml-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <div className="input-royal relative flex items-center rounded-md border border-input bg-transparent transition-[color,box-shadow] focus-within:border-royal focus-within:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]">
                <span className="pl-3 text-muted-foreground">
                  <Mail className="w-4 h-4 icon-pop" />
                </span>
                <input
                  type="email"
                  placeholder="Masukkan email Anda"
                  className="flex h-9 w-full rounded-md bg-transparent px-3 py-1 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  {...register("email", {
                    required: "Email wajib diisi",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Masukkan alamat email yang valid",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive mt-1 ml-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="input-royal relative flex items-center rounded-md border border-input bg-transparent transition-[color,box-shadow] focus-within:border-royal focus-within:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]">
                <span className="pl-3 text-muted-foreground">
                  <Lock className="w-4 h-4 icon-pop" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Buat kata sandi"
                  className="flex h-9 w-full rounded-md bg-transparent px-3 py-1 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  {...register("password", {
                    required: "Kata sandi wajib diisi",
                    minLength: {
                      value: 8,
                      message: "Kata sandi harus minimal 8 karakter",
                    },
                    validate: {
                      hasUppercase: (v) =>
                        /[A-Z]/.test(v) || "Harus mengandung setidaknya 1 huruf besar",
                      hasLowercase: (v) =>
                        /[a-z]/.test(v) || "Harus mengandung setidaknya 1 huruf kecil",
                      hasNumber: (v) =>
                        /[0-9]/.test(v) || "Harus mengandung setidaknya 1 angka",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="pr-3 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  {/* Logika Icon Password Kembali Ke Kode Awal */}
                  {showPassword ? <EyeOff className="w-4 h-4 icon-pop" /> : <Eye className="w-4 h-4 icon-pop" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive mt-1 ml-1">
                  {errors.password.message}
                </p>
              )}

              {/* Password Strength Indicator */}
              {passwordValue && (
                <div className="mt-2 ml-1">
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                      style={{ width: strength.width }}
                    />
                  </div>
                  <p className="text-xs mt-1 text-muted-foreground">
                    Kekuatan kata sandi:{" "}
                    <span
                      className={
                        strength.label === "Lemah"
                          ? "text-red-500 font-medium"
                          : strength.label === "Sedang"
                            ? "text-yellow-500 font-medium"
                            : "text-emerald-500 font-medium"
                      }
                    >
                      {strength.label}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <div className="input-royal relative flex items-center rounded-md border border-input bg-transparent transition-[color,box-shadow] focus-within:border-royal focus-within:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]">
                <span className="pl-3 text-muted-foreground">
                  <Lock className="w-4 h-4 icon-pop" />
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Konfirmasi kata sandi"
                  className="flex h-9 w-full rounded-md bg-transparent px-3 py-1 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  {...register("confirmPassword", {
                    required: "Silakan konfirmasi kata sandi Anda",
                    validate: (v) =>
                      v === watch("password") || "Kata sandi tidak cocok",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="pr-3 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showConfirmPassword ? "Sembunyikan konfirmasi kata sandi" : "Tampilkan konfirmasi kata sandi"}
                >
                  {/* Logika Icon Confirm Password Kembali Ke Kode Awal */}
                  {showConfirmPassword ? <EyeOff className="w-4 h-4 icon-pop" /> : <Eye className="w-4 h-4 icon-pop" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive mt-1 ml-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-royal w-full h-10 rounded-md text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Membuat akun...
                </>
              ) : (
                "Daftar"
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="text-royal font-medium hover:underline transition-all"
            >
              Masuk
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}