"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { LockKeyhole, ArrowLeft, Loader2 } from "lucide-react";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("Token reset tidak valid atau telah kedaluwarsa.");
      router.replace("/forgot-password");
    }
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Token reset tidak ditemukan.");
      return;
    }

    if (!password || !confirmPassword) {
      toast.error("Password dan konfirmasi wajib diisi.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Password dan konfirmasi tidak sama.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password minimal harus 8 karakter.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/reset-pw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          data.message ?? "Password berhasil direset. Mengalihkan ke login..."
        );
        setTimeout(() => {
          router.replace("/login");
        }, 2000);
      } else {
        toast.error(
          data.error ?? "Gagal mereset password. Token mungkin tidak valid."
        );
      }
    } catch (err) {
      toast.error("Terjadi kesalahan koneksi server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="size-8 animate-spin text-royal" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <Navbar />

      <div className="animated-bg absolute inset-0 -z-10">
        <div className="floating-orb" />
        <div className="floating-orb" />
        <div className="floating-orb" />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center w-full px-4 pt-28 pb-16 sm:pt-32">
        <div className={cn("w-full max-w-md animate-fade-in-up")}>
          <div className="glass-card rounded-2xl p-8 shadow-soft-lg">
            <div className="flex flex-col items-center text-center mb-8">
              <div
                className={cn(
                  "flex items-center justify-center",
                  "size-14 rounded-2xl mb-4",
                  "bg-accent/50 text-royal"
                )}
              >
                <LockKeyhole className="size-7" />
              </div>
              <h1
                className={cn(
                  "text-2xl font-bold tracking-tight text-navy",
                  "font-[family-name:var(--font-poppins)]"
                )}
              >
                Buat Password Baru
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Password baru Anda harus berbeda dari password sebelumnya.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-navy"
                >
                  Password Baru
                </Label>
                <div className="relative input-royal rounded-md">
                  <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Masukkan password baru (min. 8 karakter)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={cn(
                      "pl-10 h-10 bg-white/60 border-border/60",
                      "placeholder:text-muted-foreground"
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-navy"
                >
                  Konfirmasi Password Baru
                </Label>
                <div className="relative input-royal rounded-md">
                  <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Konfirmasi password baru Anda"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={cn(
                      "pl-10 h-10 bg-white/60 border-border/60",
                      "placeholder:text-muted-foreground"
                    )}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "w-full h-10 btn-royal rounded-md mt-2",
                  "font-[family-name:var(--font-poppins)] font-semibold text-sm transition-all",
                  "disabled:opacity-70 disabled:cursor-wait"
                )}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <Loader2 className="size-4 animate-spin mr-2" />
                    Menyimpan...
                  </span>
                ) : (
                  "Simpan Password Baru"
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Loader2 className="size-8 animate-spin text-royal" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
