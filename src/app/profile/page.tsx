"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User, Mail, Shield, Calendar, Save, Loader2,
  ArrowLeft, CheckCircle2, AlertCircle, Key, Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({ username: "", email: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [originalData, setOriginalData] = useState({ username: "", email: "" });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (!session?.user) return;
    const username = session.user.name || "";
    const email = session.user.email || "";
    setProfileData((prev) =>
      prev.username === username && prev.email === email ? prev : { username, email }
    );
    setOriginalData((prev) =>
      prev.username === username && prev.email === email ? prev : { username, email }
    );
  }, [session]);

  const validateProfile = () => {
    const newErrors: Record<string, string> = {};
    if (!profileData.username.trim()) {
      newErrors.username = "Nama pengguna wajib diisi";
    } else if (profileData.username.trim().length < 3) {
      newErrors.username = "Nama pengguna minimal 3 karakter";
    }
    if (!profileData.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = "Format email tidak valid";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors: Record<string, string> = {};
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Kata sandi saat ini wajib diisi";
    }
    if (!passwordData.newPassword) {
      newErrors.newPassword = "Kata sandi baru wajib diisi";
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = "Kata sandi minimal 8 karakter";
    } else if (
      !/[A-Z]/.test(passwordData.newPassword) ||
      !/[a-z]/.test(passwordData.newPassword) ||
      !/[0-9]/.test(passwordData.newPassword)
    ) {
      newErrors.newPassword = "Harus mengandung huruf besar, huruf kecil, dan angka";
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Kata sandi tidak cocok";
    }
    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileUpdate = async () => {
    if (!validateProfile()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Pembaruan gagal"); return; }
      setOriginalData(profileData);
      await update();
      toast.success("Profil berhasil diperbarui!");
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!validatePassword()) return;
    setPasswordLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordData),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Pengubahan kata sandi gagal"); return; }
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Kata sandi berhasil diubah!");
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      const res = await fetch("/api/auth/profile", { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { toast.error(data.error || "Gagal menghapus akun"); return; }
      toast.success("Akun berhasil dihapus");
      await signOut({ redirect: false });
      router.push("/login");
    } catch {
      toast.error("Terjadi kesalahan saat menghapus akun");
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  const hasProfileChanges =
    profileData.username !== originalData.username ||
    profileData.email !== originalData.email;

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ice">
        <div className="flex flex-col items-center gap-3">
          <div className="spinner-lg" />
          <p className="text-sm text-muted-foreground font-medium">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-border/50 shadow-sm">
        <div className="mx-auto max-w-2xl flex items-center justify-between px-4 sm:px-6 lg:px-8 h-14">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <img src="/logo.png" alt="SecretInk" className="h-7" />
            <span className="text-lg font-bold font-[family-name:var(--font-poppins)]">
              <span className="text-navy group-hover:text-royal transition-colors">Secret</span>
              <span className="text-royal group-hover:text-royal-light transition-colors">Ink</span>
            </span>
          </Link>
        </div>
      </header>

      <div className="animated-bg">
        <div className="floating-orb" />
        <div className="floating-orb" />
        <div className="floating-orb" />
      </div>

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">
          {/* Header */}
          <div className="flex items-start gap-4 mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="hover:bg-white/50 cursor-pointer shrink-0 mt-0.5 sm:mt-1" 
            >
              <ArrowLeft className="h-5 w-5 icon-pop" />
            </Button>
            <div className="flex flex-col min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-poppins)] truncate">
                Pengaturan Profil
              </h1>
              <p className="text-muted-foreground text-sm mt-0.5 truncate">
                Kelola informasi akun Anda
              </p>
            </div>
          </div>

          {/* Profile Info Card */}
          <Card className="glass-card shadow-soft-lg border-0 rounded-2xl overflow-hidden">
            <CardHeader className="pb-4 pt-5 px-5 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-14 h-14 shrink-0 rounded-full bg-gradient-to-br from-royal to-royal-dark flex items-center justify-center text-white font-bold text-xl">
                    {session.user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  
                  <div className="flex flex-col min-w-0">
                    <CardTitle style={{ fontFamily: "Poppins, sans-serif" }} className="text-xl font-semibold text-navy truncate">
                      {session.user?.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground truncate mt-0.5">
                      {session.user?.email}
                    </CardDescription>
                  </div>
                </div>

                <div className="flex w-fit">
                  <Badge className="shrink-0 bg-blue-500/10 text-blue-500 border border-blue-500/20 hover:bg-blue-500/20 px-3 py-1 font-medium text-xs rounded-full cursor-default">
                    <Shield className="h-3.5 w-3.5 mr-1.5 opacity-80" />
                    {(session.user as { role: string }).role || "user"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <hr className="border-t-2 border-slate-300 w-full" />
            <CardContent className="p-4 pt-2 sm:p-6 sm:pt-3 space-y-3">
              <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-royal icon-pop" />
                  Nama Pengguna
                </Label>
                <Input
                  id="username"
                  value={profileData.username}
                  onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                  className="input-royal rounded-xl h-11"
                  placeholder="Masukkan nama pengguna"
                />
                {errors.username && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.username}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-royal icon-pop" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="input-royal rounded-xl h-11"
                  placeholder="Masukkan email"
                />
                {errors.email && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 icon-pop" />
                Bergabung sejak{" "}
                {new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
              </div>

              <Button
                onClick={handleProfileUpdate}
                disabled={loading || !hasProfileChanges}
                className="btn-royal rounded-xl h-11 w-full sm:w-auto px-8 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2 icon-pop" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Change Password Card */}
          <Card className="glass-card shadow-soft-lg border-0 rounded-2xl overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ fontFamily: "Poppins, sans-serif" }}>
                <Key className="h-5 w-5 text-royal icon-pop" />
                Ubah Kata Sandi
              </CardTitle>
              <CardDescription>
                Perbarui kata sandi akun Anda untuk keamanan yang lebih baik
              </CardDescription>
            </CardHeader>
            <hr className="border-t-2 border-slate-300 w-full" />
            <CardContent className="pt-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Kata Sandi Saat Ini</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="input-royal rounded-xl h-11"
                  placeholder="Masukkan kata sandi saat ini"
                />
                {passwordErrors.currentPassword && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {passwordErrors.currentPassword}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Kata Sandi Baru</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="input-royal rounded-xl h-11"
                  placeholder="Masukkan kata sandi baru"
                />
                {passwordErrors.newPassword && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {passwordErrors.newPassword}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi Baru</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="input-royal rounded-xl h-11"
                  placeholder="Konfirmasi kata sandi baru"
                />
                {passwordErrors.confirmPassword && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {passwordErrors.confirmPassword}
                  </p>
                )}
              </div>

              <Button
                onClick={handlePasswordChange}
                disabled={passwordLoading}
                className="btn-royal rounded-xl h-11 w-full sm:w-auto px-8 cursor-pointer"
              >
                {passwordLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Mengubah Kata Sandi...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2 icon-pop" />
                    Ubah Kata Sandi
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Delete Account Card */}
          <Card className="glass-card shadow-soft-lg border-0 rounded-2xl overflow-hidden border border-red-100">
            <CardHeader>
              <CardTitle
                className="flex items-center gap-2"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                <Trash2 className="h-5 w-5 text-red-500 icon-pop" />
                Hapus Akun
              </CardTitle>
              <CardDescription>
                Tindakan ini permanen dan tidak dapat dibatalkan
              </CardDescription>
            </CardHeader>
            <hr className="border-t-2 border-slate-300 w-full" />
            <CardContent className="pt-1 space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Menghapus akun akan menghapus semua data Anda termasuk seluruh catatan
                terenkripsi secara permanen.
              </p>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteModal(true)}
                className="w-full rounded-xl h-11 cursor-pointer"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus Akun Saya
              </Button>
            </CardContent>
          </Card>

          {/* Security Info */}
          <Card className="glass-card shadow-soft-lg border-0 rounded-2xl overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3 p-4 bg-accent rounded-xl">
                <Shield className="h-5 w-5 text-royal mt-0.5 icon-pop" />
                <div>
                  <p className="font-medium text-navy">Pemberitahuan Keamanan</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Kata sandi Anda dilindungi dengan hashing bcrypt. SecretInk tidak
                    pernah menyimpan kunci enkripsi Anda. Mengubah kata sandi tidak
                    mempengaruhi catatan terenkripsi Anda — Anda tetap memerlukan kunci
                    enkripsi asli untuk mendekripsinya.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowDeleteModal(false);
          }}
        >
          <div className="bg-white rounded-2xl shadow-soft-lg w-full max-w-md p-6 animate-fade-in-up border border-red-100">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="flex size-16 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="size-8 text-red-500" />
              </div>
            </div>

            {/* Text */}
            <h2
              className="text-xl font-bold text-center text-navy mb-2"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Hapus Akun?
            </h2>
            <p className="text-sm text-center text-muted-foreground mb-4">
              Tindakan ini{" "}
              <span className="font-semibold text-red-500">tidak dapat dibatalkan</span>.
            </p>

            {/* Warning list */}
            <div className="rounded-xl bg-red-50 border border-red-100 p-3 mb-6 space-y-1.5">
              <p className="text-sm text-red-600 flex items-center gap-2">
                <AlertCircle className="size-3.5 shrink-0" />
                Semua catatan terenkripsi Anda akan dihapus
              </p>
              <p className="text-sm text-red-600 flex items-center gap-2">
                <AlertCircle className="size-3.5 shrink-0" />
                Data akun dihapus permanen
              </p>
              <p className="text-sm text-red-600 flex items-center gap-2">
                <AlertCircle className="size-3.5 shrink-0" />
                Akun tidak dapat dipulihkan kembali
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
             <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={deleteLoading}
              className="flex-1 rounded-xl h-11 border-border/60 text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-colors duration-200"
            >
              Batal
            </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="flex-1 rounded-xl h-11"
              >
                {deleteLoading ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Menghapus...
                  </>
                ) : (
                  <>
                    <Trash2 className="size-4 mr-2" />
                    Ya, Hapus Akun
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}