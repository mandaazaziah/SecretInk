'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import {
  FileText,
  Lock,
  Key,
  Unlock,
  Save,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  Check,
  ArrowLeft,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type StatusState = 'Siap' | 'Terenkripsi' | 'Terdekripsi' | 'Tersimpan';

export default function NotesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Edit mode
  const editId = searchParams.get('edit');
  const isEditMode = !!editId;
  const [editLoading, setEditLoading] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [encryptionKey, setEncryptionKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  // Result
  const [result, setResult] = useState('');
  const [statusState, setStatusState] = useState<StatusState>('Siap');

  // Loading states
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // ─── Load note data if edit mode ────────────────────────────────────────────
  useEffect(() => {
    if (!editId || status !== 'authenticated') return;

    const fetchNoteForEdit = async () => {
      setEditLoading(true);
      try {
        const res = await fetch(`/api/notes/${editId}`);
        if (res.ok) {
          const data = await res.json();
          const note = data.note;
          setTitle(note.title);
          setResult(note.encryptedNote);
          setStatusState('Tersimpan');
        } else {
          toast.error('Gagal memuat catatan untuk diedit');
        }
      } catch {
        toast.error('Kesalahan jaringan. Silakan coba lagi.');
      } finally {
        setEditLoading(false);
      }
    };

    fetchNoteForEdit();
  }, [editId, status]);

  // Validation
  const validate = (action: 'encrypt' | 'decrypt' | 'save'): boolean => {
    const newErrors: Record<string, string> = {};

    if (action === 'encrypt' || action === 'save') {
      if (!title.trim()) {
        newErrors.title = 'Judul catatan wajib diisi';
      }
    }

    if (action === 'encrypt') {
      if (!noteContent.trim()) {
        newErrors.noteContent = 'Konten catatan wajib diisi untuk enkripsi';
      }
    }

    if (action === 'encrypt' || action === 'decrypt') {
      if (!encryptionKey.trim()) {
        newErrors.encryptionKey = 'Kunci enkripsi wajib diisi';
      } else if (encryptionKey.trim().length < 6) {
        newErrors.encryptionKey = 'Kunci enkripsi minimal 6 karakter';
      }
    }

    if (action === 'save') {
      if (statusState !== 'Terenkripsi' && statusState !== 'Tersimpan') {
        newErrors.save = 'Anda harus mengenkripsi catatan sebelum menyimpan';
      }
      if (!result.trim()) {
        newErrors.save = 'Tidak ada hasil enkripsi untuk disimpan';
      }
    }

    if (action === 'decrypt') {
      if (!result.trim()) {
        newErrors.decrypt = 'Tidak ada hasil terenkripsi untuk didekripsi. Enkripsi catatan terlebih dahulu.';
      }
      if (statusState !== 'Terenkripsi' && statusState !== 'Tersimpan') {
        newErrors.decrypt = 'Anda harus mengenkripsi catatan sebelum mendekripsi';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Encrypt handler
  const handleEncrypt = async () => {
    if (!validate('encrypt')) return;

    setIsEncrypting(true);
    try {
      const response = await fetch('/api/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plaintext: noteContent,
          encryptionKey: encryptionKey,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Enkripsi gagal');
        return;
      }

      setResult(data.encrypted);
      setStatusState('Terenkripsi');
      toast.success('Catatan berhasil dienkripsi');
    } catch {
      toast.error('Enkripsi gagal. Silakan coba lagi.');
    } finally {
      setIsEncrypting(false);
    }
  };

  // Decrypt handler
  const handleDecrypt = async () => {
    if (!validate('decrypt')) return;

    setIsDecrypting(true);
    try {
      const response = await fetch('/api/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          encryptedData: result,
          encryptionKey: encryptionKey,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Dekripsi gagal');
        return;
      }

      setResult(data.decrypted);
      setStatusState('Terdekripsi');
      toast.success('Catatan berhasil didekripsi');
    } catch {
      toast.error('Dekripsi gagal. Silakan coba lagi.');
    } finally {
      setIsDecrypting(false);
    }
  };

  // Save handler — update jika edit mode, create jika baru
  const handleSave = async () => {
    if (!validate('save')) return;

    setIsSaving(true);
    try {
      const url = isEditMode ? `/api/notes/${editId}` : '/api/notes';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          encryptedNote: result,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Gagal menyimpan catatan');
        return;
      }

      setStatusState('Tersimpan');
      toast.success(
        isEditMode
          ? 'Catatan berhasil diperbarui'
          : 'Catatan disimpan ke brankas Anda'
      );

      // Kembali ke dashboard setelah update berhasil
      if (isEditMode) {
        setTimeout(() => router.push('/dashboard'), 1000);
      }
    } catch {
      toast.error('Gagal menyimpan catatan. Silakan coba lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  // Copy handler
  const handleCopy = async () => {
    if (!result.trim()) {
      toast.error('Tidak ada yang bisa disalin');
      return;
    }
    try {
      await navigator.clipboard.writeText(result);
      toast.success('Berhasil disalin ke papan klip');
    } catch {
      toast.error('Gagal menyalin ke papan klip');
    }
  };

  // Clear handler
  const handleClear = () => {
    setTitle('');
    setNoteContent('');
    setEncryptionKey('');
    setResult('');
    setStatusState('Siap');
    setErrors({});
    toast.info('Semua kolom telah dibersihkan');
  };

  // Status badge
  const getStatusBadge = () => {
    switch (statusState) {
      case 'Terenkripsi':
        return (
          <Badge className="bg-royal/10 text-royal border-royal/20 hover:bg-royal/20 gap-1.5">
            <Lock className="size-3" />
            Terenkripsi
          </Badge>
        );
      case 'Terdekripsi':
        return (
          <Badge className="bg-mint/10 text-mint border-mint/20 hover:bg-mint/20 gap-1.5">
            <Unlock className="size-3" />
            Terdekripsi
          </Badge>
        );
      case 'Tersimpan':
        return (
          <Badge className="bg-mint/10 text-mint border-mint/20 hover:bg-mint/20 gap-1.5">
            <Check className="size-3" />
            Tersimpan
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground gap-1.5">
            <FileText className="size-3" />
            Siap
          </Badge>
        );
    }
  };

  // Status indicator dot + text
  const getStatusIndicator = () => {
    const colorMap: Record<StatusState, string> = {
      Siap: 'bg-gray-400',
      Terenkripsi: 'bg-royal',
      Terdekripsi: 'bg-mint',
      Tersimpan: 'bg-mint',
    };

    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span
          className={cn(
            'size-2 rounded-full transition-colors duration-300',
            colorMap[statusState],
            statusState !== 'Siap' && 'animate-pulse'
          )}
        />
        <span className="font-medium">{statusState}</span>
      </div>
    );
  };

  // Loading state
  if (status === 'loading' || editLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ice">
        <div className="flex flex-col items-center gap-3">
          <div className="spinner-lg" />
          <p className="text-sm text-muted-foreground font-medium">
            {editLoading ? 'Memuat catatan...' : 'Memuat...'}
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ice">
        <div className="flex flex-col items-center gap-3">
          <div className="spinner-lg" />
          <p className="text-sm text-muted-foreground font-medium">Mengalihkan ke halaman masuk...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Simple Top Bar */}
      <header className="sticky top-0 z-50 glass-strong border-b border-border/50">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 sm:px-6 lg:px-8 h-14">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <img src="/logo.svg" alt="SecretInk" className="h-7 logo-zoom" />
            <span className="text-lg font-bold font-[family-name:var(--font-poppins)]">
              <span className="text-navy group-hover:text-royal transition-colors">Secret</span>
              <span className="text-royal group-hover:text-royal-light transition-colors">Ink</span>
            </span>
          </Link>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="gap-2 border-royal/20 text-royal hover:bg-royal/5 hover:text-royal"
          >
            <Link href="/dashboard">
              <ArrowLeft className="size-4 icon-pop" />
              Kembali ke Dashboard
            </Link>
          </Button>
        </div>
      </header>

      {/* Animated Background */}
      <div className="animated-bg">
        <div className="floating-orb" />
        <div className="floating-orb" />
        <div className="floating-orb" />
      </div>

      <main className="flex-1 pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Page Header */}
          <div className="mb-8 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center justify-center size-10 rounded-xl bg-accent">
                <img src="/logo.svg" alt="SecretInk Logo" className="size-5 logo-zoom" />
              </div>
              <h1
                className={cn(
                  'text-2xl sm:text-3xl font-bold tracking-tight text-navy',
                  'font-[family-name:var(--font-poppins)]'
                )}
              >
                {isEditMode ? 'Edit Catatan' : 'Catatan Rahasia'}
              </h1>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base ml-[52px]">
              {isEditMode
                ? 'Dekripsi catatan Anda, ubah isinya, enkripsi ulang, lalu simpan'
                : 'Buat, enkripsi, dan kelola catatan aman Anda dengan enkripsi standar militer'}
            </p>
          </div>

          {/* Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT COLUMN - Note Form */}
            <div
              className={cn(
                'glass-card rounded-2xl p-6 shadow-soft-lg',
                'animate-fade-in-up',
                'delay-100'
              )}
            >
              <h2
                className={cn(
                  'text-lg font-semibold text-navy mb-5',
                  'font-[family-name:var(--font-poppins)]'
                )}
              >
                {isEditMode ? 'Edit Catatan Terenkripsi' : 'Buat Catatan Terenkripsi'}
              </h2>

              <div className="space-y-4">
                {/* Title Input */}
                <div className="space-y-1.5">
                  <label htmlFor="note-title" className="text-sm font-medium text-navy">
                    Judul
                  </label>
                  <div className="relative input-royal rounded-md">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="note-title"
                      type="text"
                      placeholder="Judul catatan"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                      }}
                      className={cn(
                        'pl-10 h-10 bg-white/60 border-border/60',
                        'placeholder:text-muted-foreground',
                        errors.title && 'border-destructive focus-visible:border-destructive'
                      )}
                    />
                  </div>
                  {errors.title && (
                    <p className="text-xs text-destructive font-medium">{errors.title}</p>
                  )}
                </div>

                {/* Secret Note Textarea */}
                <div className="space-y-1.5">
                  <label htmlFor="note-content" className="text-sm font-medium text-navy">
                    Catatan Rahasia
                  </label>
                  <div className="relative input-royal rounded-md">
                    <Lock className="absolute left-3 top-3 size-4 text-muted-foreground pointer-events-none" />
                    <Textarea
                      id="note-content"
                      placeholder={
                        isEditMode
                          ? 'Dekripsi catatan terlebih dahulu, lalu tulis perubahan di sini...'
                          : 'Tulis catatan rahasia Anda di sini...'
                      }
                      rows={6}
                      value={noteContent}
                      onChange={(e) => {
                        setNoteContent(e.target.value);
                        if (errors.noteContent) setErrors((prev) => ({ ...prev, noteContent: '' }));
                      }}
                      className={cn(
                        'pl-10 bg-white/60 border-border/60 resize-y min-h-[120px]',
                        'placeholder:text-muted-foreground',
                        errors.noteContent && 'border-destructive focus-visible:border-destructive'
                      )}
                    />
                  </div>
                  {errors.noteContent && (
                    <p className="text-xs text-destructive font-medium">{errors.noteContent}</p>
                  )}
                </div>

                {/* Encryption Key Input */}
                <div className="space-y-1.5">
                  <label htmlFor="encryption-key" className="text-sm font-medium text-navy">
                    Kunci Enkripsi
                  </label>
                  <div className="relative input-royal rounded-md">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="encryption-key"
                      type={showKey ? 'text' : 'password'}
                      placeholder="Masukkan kunci enkripsi (min 6 karakter)"
                      value={encryptionKey}
                      onChange={(e) => {
                        setEncryptionKey(e.target.value);
                        if (errors.encryptionKey) setErrors((prev) => ({ ...prev, encryptionKey: '' }));
                      }}
                      className={cn(
                        'pl-10 pr-10 h-10 bg-white/60 border-border/60',
                        'placeholder:text-muted-foreground',
                        errors.encryptionKey && 'border-destructive focus-visible:border-destructive'
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-navy transition-colors"
                      aria-label={showKey ? 'Sembunyikan kunci enkripsi' : 'Tampilkan kunci enkripsi'}
                    >
                      {showKey ? (
                        <EyeOff className="size-4 icon-pop" />
                      ) : (
                        <Eye className="size-4 icon-pop" />
                      )}
                    </button>
                  </div>
                  {errors.encryptionKey && (
                    <p className="text-xs text-destructive font-medium">{errors.encryptionKey}</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                  {/* Encrypt Button */}
                  <Button
                    onClick={handleEncrypt}
                    disabled={isEncrypting}
                    className={cn(
                      'btn-royal rounded-lg h-10 text-sm font-semibold',
                      'font-[family-name:var(--font-poppins)]',
                      'disabled:opacity-70 disabled:cursor-not-allowed'
                    )}
                  >
                    {isEncrypting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Mengenkripsi...
                      </>
                    ) : (
                      <>
                        <Lock className="size-4 icon-pop" />
                        Enkripsi
                      </>
                    )}
                  </Button>

                  {/* Decrypt Button */}
                  <Button
                    onClick={handleDecrypt}
                    disabled={isDecrypting}
                    variant="outline"
                    className={cn(
                      'rounded-lg h-10 text-sm font-semibold',
                      'border-royal/30 text-royal hover:bg-royal/5 hover:text-royal',
                      'font-[family-name:var(--font-poppins)]',
                      'disabled:opacity-70 disabled:cursor-not-allowed'
                    )}
                  >
                    {isDecrypting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Mendekripsi...
                      </>
                    ) : (
                      <>
                        <Unlock className="size-4 icon-pop" />
                        Dekripsi
                      </>
                    )}
                  </Button>

                  {/* Save Button */}
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={cn(
                      'btn-mint rounded-lg h-10 text-sm font-semibold',
                      'font-[family-name:var(--font-poppins)]',
                      'disabled:opacity-70 disabled:cursor-not-allowed'
                    )}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="size-4 icon-pop" />
                        {isEditMode ? 'Perbarui' : 'Simpan'}
                      </>
                    )}
                  </Button>

                  {/* Copy Result Button */}
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    className={cn(
                      'rounded-lg h-10 text-sm font-medium',
                      'font-[family-name:var(--font-poppins)]'
                    )}
                  >
                    <Copy className="size-4 icon-pop" />
                    Salin Hasil
                  </Button>

                  {/* Clear Button */}
                  <Button
                    onClick={handleClear}
                    variant="outline"
                    className={cn(
                      'rounded-lg h-10 text-sm font-medium',
                      'border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive',
                      'font-[family-name:var(--font-poppins)]'
                    )}
                  >
                    <Trash2 className="size-4 icon-pop" />
                    Bersihkan
                  </Button>
                </div>

                {/* Validation errors for save/decrypt */}
                {errors.save && (
                  <p className="text-xs text-destructive font-medium">{errors.save}</p>
                )}
                {errors.decrypt && (
                  <p className="text-xs text-destructive font-medium">{errors.decrypt}</p>
                )}

                {/* Status Indicator */}
                <div className="pt-2 border-t border-border/50">
                  {getStatusIndicator()}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - Result Area */}
            <div
              className={cn(
                'glass-card rounded-2xl p-6 shadow-soft-lg',
                'animate-fade-in-up',
                'delay-200'
              )}
            >
              <div className="flex items-center justify-between mb-5">
                <h2
                  className={cn(
                    'text-lg font-semibold text-navy',
                    'font-[family-name:var(--font-poppins)]'
                  )}
                >
                  Hasil Output
                </h2>
                {getStatusBadge()}
              </div>

              {/* Result Area */}
              <div className="relative">
                <div
                  className={cn(
                    'rounded-xl border border-border/60 bg-white/40',
                    'min-h-[300px] max-h-[500px] overflow-y-auto',
                    'p-4 transition-all duration-300',
                    statusState === 'Terenkripsi' && 'border-royal/30 bg-royal/[0.02]',
                    statusState === 'Terdekripsi' && 'border-mint/30 bg-mint/[0.02]',
                    statusState === 'Tersimpan' && 'border-mint/30 bg-mint/[0.02]'
                  )}
                >
                  {result ? (
                    <pre
                      className={cn(
                        'text-sm whitespace-pre-wrap break-all leading-relaxed',
                        'font-mono',
                        statusState === 'Terenkripsi' ? 'text-royal/80' : '',
                        statusState === 'Terdekripsi' ? 'text-emerald-700' : '',
                        statusState === 'Tersimpan' ? 'text-royal/80' : '',
                        statusState === 'Siap' ? 'text-navy' : ''
                      )}
                    >
                      {result}
                    </pre>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="flex items-center justify-center size-16 rounded-2xl bg-accent/50 mb-4">
                        <Lock className="size-7 text-muted-foreground/50" />
                      </div>
                      <p className="text-muted-foreground text-sm font-medium">
                        Hasil Anda akan muncul di sini
                      </p>
                      <p className="text-muted-foreground/60 text-xs mt-1">
                        Enkripsi catatan untuk melihat output
                      </p>
                    </div>
                  )}
                </div>

                {/* Copy Button in top-right corner */}
                {result && (
                  <Button
                    onClick={handleCopy}
                    size="sm"
                    variant="outline"
                    className={cn(
                      'absolute top-3 right-3 gap-1.5',
                      'bg-white/80 backdrop-blur-sm',
                      'border-border/60 shadow-soft',
                      'hover:bg-white transition-all duration-200',
                      'animate-fade-in'
                    )}
                  >
                    <Copy className="size-3.5 icon-pop" />
                    Salin
                  </Button>
                )}
              </div>

              {/* Result Info */}
              {result && (
                <div
                  className={cn(
                    'mt-4 flex items-center gap-4 text-xs text-muted-foreground',
                    'animate-fade-in'
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-royal/50" />
                    {statusState === 'Terenkripsi' || statusState === 'Tersimpan'
                      ? 'Base64 Encoded'
                      : 'Teks Biasa'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-mint/50" />
                    {result.length} karakter
                  </span>
                </div>
              )}

              {/* Edit mode hint */}
              {isEditMode && result && statusState === 'Tersimpan' && (
                <div className="mt-4 rounded-lg bg-royal/5 border border-royal/20 p-3">
                  <p className="text-xs text-royal font-medium">
                    💡 Cara edit: Masukkan <strong>Kunci Enkripsi</strong> Anda  → Klik <strong>Dekripsi</strong> → Edit isi catatan → klik <strong>Enkripsi</strong> → klik <strong>Perbarui</strong>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}