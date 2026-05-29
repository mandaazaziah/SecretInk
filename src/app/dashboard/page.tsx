'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Shield,
  FileText,
  Lock,
  Clock,
  Plus,
  Search,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  Check,
  Loader2,
  StickyNote,
  KeyRound,
  Edit3,
  X,
  Menu,
  LogOut,
  Timer,
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────────

interface NoteSummary {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface NoteDetail {
  id: string;
  title: string;
  encryptedNote: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

// ─── Helper: Format date ────────────────────────────────────────────────────────

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Hari ini';
  } else if (diffDays === 1) {
    return 'Kemarin';
  } else if (diffDays < 7) {
    return `${diffDays} hari yang lalu`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} minggu yang lalu`;
  } else {
    return date.toLocaleDateString('id-ID', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  }
}

function formatFullDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('id-ID', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ─── Dashboard Page Component ───────────────────────────────────────────────────

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // ─── State ──────────────────────────────────────────────────────────────────
  const [notes, setNotes] = useState<NoteSummary[]>([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<NoteDetail | null>(null);
  const [noteLoading, setNoteLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Decrypt state
  const [encryptionKey, setEncryptionKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [decryptedContent, setDecryptedContent] = useState<string | null>(null);
  const [decrypting, setDecrypting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Timer State untuk Sesi Dekripsi
  const [decryptSessionTimer, setDecryptSessionTimer] = useState<number | null>(null);

  // Delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<NoteSummary | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Logout confirmation dialog
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  // ─── Auth redirect ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  // ─── Timer Countdown Effect ────────────────────────────────────────────────
  useEffect(() => {
    if (decryptSessionTimer === null) return;

    if (decryptSessionTimer > 0) {
      const timer = setTimeout(() => {
        setDecryptSessionTimer(decryptSessionTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Waktu Habis (0 detik)
      setDecryptedContent(null);
      setEncryptionKey('');
      setDecryptSessionTimer(null);
      toast.info('Sesi waktu habis, silakan masukkan kunci kembali.');
    }
  }, [decryptSessionTimer]);

  // ─── Fetch notes on mount ──────────────────────────────────────────────────
  const fetchNotes = useCallback(async () => {
    try {
      setNotesLoading(true);
      const res = await fetch('/api/notes');
      if (res.ok) {
        const data = await res.json();
        setNotes(data.notes || []);
      } else {
        toast.error('Gagal memuat daftar catatan');
      }
    } catch {
      toast.error('Kesalahan jaringan. Silakan coba lagi.');
    } finally {
      setNotesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchNotes();
    }
  }, [status, fetchNotes]);

  // ─── Fetch single note ─────────────────────────────────────────────────────
  const fetchNote = useCallback(async (id: string) => {
    try {
      setNoteLoading(true);
      setDecryptedContent(null);
      setEncryptionKey('');
      setDecryptSessionTimer(null); // Reset timer jika membuka note lain
      const res = await fetch(`/api/notes/${id}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedNote(data.note);
      } else {
        toast.error('Gagal memuat detail catatan');
        setSelectedNote(null);
      }
    } catch {
      toast.error('Kesalahan jaringan. Silakan coba lagi.');
      setSelectedNote(null);
    } finally {
      setNoteLoading(false);
    }
  }, []);

  // ─── Select note handler ───────────────────────────────────────────────────
  const handleSelectNote = (id: string) => {
    setSelectedNoteId(id);
    fetchNote(id);
    setSidebarOpen(false);
  };

  // ─── Decrypt handler ───────────────────────────────────────────────────────
  const handleDecrypt = async () => {
    if (!selectedNote || !encryptionKey.trim()) {
      toast.error('Masukkan kunci enkripsi Anda terlebih dahulu');
      return;
    }

    try {
      setDecrypting(true);
      const res = await fetch('/api/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          encryptedData: selectedNote.encryptedNote,
          encryptionKey: encryptionKey,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setDecryptedContent(data.decrypted);
        setDecryptSessionTimer(5); // Mulai sesi 5 detik
        toast.success('Catatan berhasil didekripsi!');
      } else {
        toast.error('Kunci enkripsi yang Anda masukkan salah. Silakan coba lagi.');
        setDecryptedContent(null);
        setDecryptSessionTimer(null);
      }
    } catch {
      toast.error('Terjadi kesalahan jaringan saat mendekripsi.');
      setDecryptedContent(null);
      setDecryptSessionTimer(null);
    } finally {
      setDecrypting(false);
    }
  };

  // ─── Delete handler ────────────────────────────────────────────────────────
  const handleDeleteClick = (note: NoteSummary, e: React.MouseEvent) => {
    e.stopPropagation();
    setNoteToDelete(note);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!noteToDelete) return;

    try {
      setDeleting(true);
      const res = await fetch(`/api/notes/${noteToDelete.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Catatan berhasil dihapus');
        setNotes((prev) => prev.filter((n) => n.id !== noteToDelete.id));
        if (selectedNoteId === noteToDelete.id) {
          setSelectedNoteId(null);
          setSelectedNote(null);
          setDecryptedContent(null);
          setDecryptSessionTimer(null);
        }
      } else {
        toast.error('Gagal menghapus catatan');
      }
    } catch {
      toast.error('Kesalahan jaringan saat menghapus catatan.');
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setNoteToDelete(null);
    }
  };

  // ─── Copy handler ──────────────────────────────────────────────────────────
  const handleCopy = async () => {
    if (!decryptedContent) return;
    try {
      await navigator.clipboard.writeText(decryptedContent);
      setCopied(true);
      toast.success('Konten berhasil disalin ke papan klip!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Gagal menyalin konten');
    }
  };

  // ─── Filter notes by search ────────────────────────────────────────────────
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ─── Stats computation ─────────────────────────────────────────────────────
  const totalNotes = notes.length;
  const encryptedCount = notes.length;
  const latestActivity =
    notes.length > 0 ? formatDate(notes[0].createdAt) : '-';

  // ─── Loading state ─────────────────────────────────────────────────────────
  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center" style={{ backgroundColor: '#F8F9FA' }}>
        <Loader2 className="size-8 animate-spin text-royal" />
      </div>
    );
  }

  if (!session) return null;

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#F8F9FA' }}>
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="floating-orb" />
        <div className="floating-orb" />
        <div className="floating-orb" />
      </div>

      {/* ═══════════ SIDEBAR ═══════════ */}
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          'glass-sidebar fixed inset-y-0 left-0 z-50 w-80 transition-transform duration-300 ease-in-out md:static md:z-auto md:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar Logo Header */}
          <div className="flex items-center gap-2.5 border-b border-border/50 px-5 py-4">
            <img src="/logo.png" alt="SecretInk" className="h-7" />
            <span
              className="text-lg font-bold tracking-tight cursor-default"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              <span className="text-navy">Secret</span><span className="text-royal">Ink</span>
            </span>
          </div>

          <div className="flex flex-1 flex-col p-4 overflow-hidden">
            {/* Sidebar Title */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-lg font-bold text-navy cursor-default">Catatan Saya</h2>
              </div>
            </div>

            {/* New Note Button */}
            <Button asChild className="btn-royal mb-4 w-full gap-2 shadow-royal cursor-pointer">
              <Link href="/notes">
                <Plus className="size-4 icon-pop" />
                Catatan Baru
              </Link>
            </Button>

            {/* Search/Filter Input */}
            <div className="input-royal relative mb-4 rounded-lg border border-border">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari catatan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 pl-9 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-navy cursor-pointer"
                  aria-label="Hapus pencarian"
                >
                  <X className="size-3.5 icon-pop" />
                </button>
              )}
            </div>

            {/* Notes List */}
            <ScrollArea className="flex-1 -mx-1">
              <div className="space-y-1 px-1">
                {notesLoading ? (
                  [...Array(3)].map((_, i) => (
                    <div key={i} className="rounded-lg p-3">
                      <Skeleton className="mb-2 h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  ))
                ) : filteredNotes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center cursor-default">
                    <div className="mb-3 flex size-14 items-center justify-center rounded-2xl bg-royal/10">
                      <StickyNote className="size-7 text-royal icon-pop" strokeWidth={1.8} />
                    </div>
                    <p className="text-sm font-medium text-navy/70">Belum ada catatan</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Buat catatan pertama Anda!
                    </p>
                    <Button asChild className="btn-royal mt-3 gap-1.5 text-xs cursor-pointer" size="sm">
                      <Link href="/notes">
                        <Plus className="size-3.5 icon-pop" />
                        Buat Catatan
                      </Link>
                    </Button>
                  </div>
                ) : (
                  filteredNotes.map((note) => (
                    <div
                      key={note.id}
                      onClick={() => handleSelectNote(note.id)}
                      className={cn(
                        'note-card group cursor-pointer rounded-lg p-3 transition-all duration-200 border',
                        selectedNoteId === note.id
                          ? 'border-l-royal bg-royal/5 border-l-[3px] border-transparent'
                          : 'border-transparent hover:bg-royal/5 hover:border-royal/50 hover:shadow-sm'
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <Lock
                              className={cn(
                                'size-3.5 shrink-0 icon-pop',
                                selectedNoteId === note.id
                                  ? 'text-royal'
                                  : 'text-muted-foreground'
                              )}
                            />
                            <p
                              className={cn(
                                'truncate text-sm font-medium',
                                selectedNoteId === note.id
                                  ? 'text-royal'
                                  : 'text-navy'
                              )}
                            >
                              {note.title}
                            </p>
                          </div>
                          <p className="mt-1 pl-5 text-xs text-muted-foreground">
                            {formatDate(note.createdAt)}
                          </p>
                        </div>
                        <button
                          onClick={(e) => handleDeleteClick(note, e)}
                          className="shrink-0 rounded-md p-1 text-muted-foreground opacity-0 transition-all duration-200 hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100 cursor-pointer"
                          aria-label={`Hapus catatan: ${note.title}`}
                        >
                          <Trash2 className="size-3.5 icon-pop" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </aside>

      {/* ═══════════ MAIN AREA ═══════════ */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* ─── TOP HEADER BAR ─────────────────────────────────────────────── */}
        <header className="glass-strong z-20 flex items-center justify-between border-b border-border/50 px-4 py-3 shadow-soft sm:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden cursor-pointer"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X className="size-5 icon-pop" /> : <Menu className="size-5 icon-pop" />}
            </Button>
          </div>

          {/* Right: User info */}
          <div className="flex items-center gap-3">
            <Link href="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
              <Avatar className="size-8 border border-border/50">
                <AvatarImage
                  src={session.user?.image || undefined}
                  alt={session.user?.name || 'Avatar pengguna'}
                />
                <AvatarFallback className="bg-accent text-royal text-xs font-semibold">
                  {session.user?.name
                    ?.split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2) || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium text-navy truncate max-w-[120px] sm:block">
                {session.user?.name}
              </span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLogoutDialogOpen(true)}
              className="text-muted-foreground hover:text-destructive gap-1.5 cursor-pointer"
            >
              <LogOut className="size-4 icon-pop" />
              <span className="hidden sm:inline">Keluar</span>
            </Button>
          </div>
        </header>

        {/* ─── MAIN CONTENT ─────────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto">
          <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
            {/* ═══════════ TOP STATS BAR ═══════════ */}
            {/* Responsive grid for stats cards */}
            <div className="animate-fade-in-up mb-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-4">
              {/* Total Catatan */}
              <div className="glass-card rounded-xl p-4 shadow-soft transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-0.5 cursor-default">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-royal/10">
                    <FileText className="size-5 text-royal icon-pop" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Total Catatan</p>
                    <p className="font-heading text-xl font-bold text-navy">{totalNotes}</p>
                  </div>
                </div>
              </div>

              {/* Terenkripsi */}
              <div className="glass-card rounded-xl p-4 shadow-soft transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-0.5 cursor-default">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-mint/10">
                    <Lock className="size-5 text-mint icon-pop" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Terenkripsi</p>
                    <p className="font-heading text-xl font-bold text-navy">{encryptedCount}</p>
                  </div>
                </div>
              </div>

              {/* Aktivitas Terakhir */}
              <div className="glass-card rounded-xl p-4 shadow-soft transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-0.5 cursor-default">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-royal/10">
                    <Clock className="size-5 text-royal icon-pop" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Aktivitas Terakhir</p>
                    <p className="font-heading text-sm font-bold text-navy truncate max-w-[100px]">
                      {latestActivity}
                    </p>
                  </div>
                </div>
              </div>

              {/* Level Keamanan */}
              <div className="glass-card rounded-xl p-4 shadow-soft transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-0.5 cursor-default">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-royal/10">
                    <Shield className="size-5 text-royal icon-pop" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Level Keamanan</p>
                    <p className="font-heading text-xl font-bold text-navy">AES-256</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ═══════════ MAIN CONTENT AREA ═══════════ */}
            <div className="flex gap-6">
              <div className="min-w-0 flex-1">
                {noteLoading ? (
                  <div className="glass-card rounded-xl p-6 shadow-soft">
                    <Skeleton className="mb-4 h-8 w-1/3" />
                    <Skeleton className="mb-6 h-4 w-1/4" />
                    <Skeleton className="mb-3 h-10 w-full" />
                    <Skeleton className="mb-3 h-10 w-1/3" />
                    <Skeleton className="h-40 w-full" />
                  </div>
                ) : !selectedNoteId || !selectedNote ? (
                  // ─── Welcome Screen ─────────────────────────────────────────
                  <div className="glass-card animate-fade-in-up flex flex-col items-center justify-center rounded-xl p-8 shadow-soft md:p-16 cursor-default">
                    <div
                      className="mb-6 flex size-20 items-center justify-center rounded-2xl"
                      style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)' }}
                    >
                      <Shield className="size-10 text-royal icon-pop" strokeWidth={1.8} />
                    </div>
                    <h2 className="font-heading mb-2 text-2xl font-bold text-navy">
                      Brankas Aman Anda
                    </h2>
                    <p className="mb-6 max-w-sm text-center text-sm text-muted-foreground">
                      Pilih catatan dari sidebar untuk mendekripsi dan membaca konten terenkripsi Anda.
                    </p>
                    <div className="flex items-center gap-2 rounded-full bg-royal/5 px-4 py-2">
                      <Lock className="size-4 text-royal icon-pop" />
                      <span className="text-xs font-medium text-royal">
                        Semua catatan terenkripsi AES-256
                      </span>
                    </div>
                  </div>
                ) : (
                  // ─── Note Detail View ────────────────────────────────────────
                  <div className="animate-fade-in-up space-y-4">
                    {/* Note Header */}
                    <div className="glass-card rounded-xl p-6 shadow-soft cursor-default">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <Lock className="size-5 text-royal icon-pop" />
                            <h1 className="font-heading truncate text-2xl font-bold text-navy">
                              {selectedNote.title}
                            </h1>
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="size-3.5 icon-pop" />
                              Dibuat: {formatFullDate(selectedNote.createdAt)}
                            </span>
                            {selectedNote.updatedAt !== selectedNote.createdAt && (
                              <span className="flex items-center gap-1">
                                <Edit3 className="size-3.5 icon-pop" />
                                Diperbarui: {formatFullDate(selectedNote.updatedAt)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Decrypt Section */}
                    <div className="glass-card rounded-xl p-6 shadow-soft">
                      <h3 className="font-heading mb-4 flex items-center gap-2 text-base font-semibold text-navy cursor-default">
                        <KeyRound className="size-4 text-royal icon-pop" />
                        Kunci Enkripsi
                      </h3>

                      <div className="space-y-3">
                        {/* Encryption Key Input */}
                        <div className="input-royal relative rounded-lg border border-border">
                          <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            type={showKey ? 'text' : 'password'}
                            placeholder="Masukkan kunci enkripsi Anda"
                            value={encryptionKey}
                            onChange={(e) => setEncryptionKey(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleDecrypt();
                            }}
                            className="border-0 pl-9 pr-10 focus-visible:ring-0 focus-visible:ring-offset-0"
                            aria-label="Kunci enkripsi"
                          />
                          <button
                            onClick={() => setShowKey(!showKey)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-navy transition-colors cursor-pointer"
                            aria-label={showKey ? 'Sembunyikan kunci' : 'Tampilkan kunci'}
                            type="button"
                          >
                            {showKey ? (
                              <EyeOff className="size-4 icon-pop" />
                            ) : (
                              <Eye className="size-4 icon-pop" />
                            )}
                          </button>
                        </div>

                        {/* Decrypt Button */}
                        <Button
                          onClick={handleDecrypt}
                          disabled={decrypting || !encryptionKey.trim() || decryptSessionTimer !== null}
                          className="btn-royal w-full gap-2 shadow-royal cursor-pointer"
                        >
                          {decrypting ? (
                            <>
                              <Loader2 className="size-4 animate-spin" />
                              Mendekripsi...
                            </>
                          ) : (
                            <>
                              <Lock className="size-4 icon-pop" />
                              {decryptSessionTimer !== null ? 'Sesi Sedang Berjalan' : 'Dekripsi Catatan'}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Decrypted Content Display */}
                    {decryptedContent !== null && (
                      <div className="glass-card animate-fade-in-up rounded-xl p-6 shadow-soft relative overflow-hidden">
                        {/* Sinkronisasi Garis Sesi Detik Menggunakan CSS Native Keyframes */}
                        <style>{`
                          @keyframes shrinkProgressBar {
                            from { width: 100%; }
                            to { width: 0%; }
                          }
                        `}</style>
                        <div 
                          className="absolute top-0 left-0 h-1 bg-red-500"
                          style={{ 
                            animation: 'shrinkProgressBar 5s linear forwards' 
                          }} 
                        />
                        
                        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between mt-1 gap-3">
                          <h3 className="font-heading flex items-center gap-2 text-base font-semibold text-navy cursor-default">
                            <Check className="size-4 text-mint icon-pop" />
                            Konten Terdekripsi
                            {decryptSessionTimer !== null && (
                              <span className="ml-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-100 text-red-600 text-xs font-bold animate-pulse">
                                <Timer className="size-3" />
                                {decryptSessionTimer}s
                              </span>
                            )}
                          </h3>
                          {/* Responsive flex-wrap for buttons */}
                          <div className="flex flex-wrap items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleCopy}
                              className="gap-1.5 cursor-pointer flex-1 sm:flex-none justify-center"
                            >
                              {copied ? (
                                <>
                                  <Check className="size-3.5 text-mint icon-pop" />
                                  Tersalin!
                                </>
                              ) : (
                                <>
                                  <Copy className="size-3.5 icon-pop" />
                                  Salin
                                </>
                              )}
                            </Button>
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="gap-1.5 cursor-pointer flex-1 sm:flex-none justify-center"
                            >
                              <Link href={`/notes?edit=${selectedNote.id}`}>
                                <Edit3 className="size-3.5 icon-pop" />
                                Edit
                              </Link>
                            </Button>
                          </div>
                        </div>
                        <div className="rounded-lg bg-ice-dark p-4 cursor-text border border-red-500/20">
                          <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-navy">
                            {decryptedContent}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ═══════════ DIALOG KONFIRMASI HAPUS ═══════════ */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        {/* Added [&>button]:hidden to remove default close icon */}
        <DialogContent className="p-0 overflow-hidden sm:max-w-md bg-white border-0 rounded-2xl shadow-xl [&>button]:hidden">
          {/* Header Pop-up */}
          <div className="bg-red-50/80 px-5 py-4 border-b border-red-100/80">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 font-heading text-red-700 text-lg font-bold">
                <div className="flex size-8 items-center justify-center rounded-md bg-red-500 text-white shadow-sm">
                  <Trash2 className="size-4" />
                </div>
                Hapus Catatan
              </DialogTitle>
            </DialogHeader>
          </div>

          {/* Body Content */}
          <div className="px-5 py-4">
            <DialogDescription className="text-sm leading-relaxed text-slate-600">
              Apakah Anda yakin ingin menghapus catatan{' '}
              <span className="font-semibold text-navy">
                &ldquo;{noteToDelete?.title}&rdquo;
              </span>
              ? Tindakan ini tidak dapat dibatalkan. Catatan terenkripsi akan dihapus secara permanen dari brankas aman Anda.
            </DialogDescription>
          </div>

          {/* Footer Pop-up */}
          <div className="bg-slate-50/80 px-5 py-3 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
              className="cursor-pointer border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 h-9 text-sm"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleting}
              className="gap-1.5 cursor-pointer bg-red-600 hover:bg-red-700 h-9 text-sm shadow-sm"
            >
              {deleting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                <>
                  <Trash2 className="size-4" />
                  Hapus Permanen
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ═══════════ LOGOUT CONFIRMATION DIALOG ═══════════ */}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white border-0 shadow-2xl [&>button]:hidden rounded-2xl p-6">
          <DialogHeader className="mb-2">
            <DialogTitle className="flex flex-col items-center gap-3 font-heading text-navy text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-red-500/10 mb-1">
                <LogOut className="size-6 text-red-500" />
              </div>
              <span className="text-xl font-bold">Konfirmasi Keluar</span>
            </DialogTitle>
            <DialogDescription className="text-center text-slate-600/90 font-medium">
              Apakah Anda yakin ingin keluar dari akun Anda? Anda harus masuk kembali untuk mengakses catatan.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6 sm:justify-center w-full">
            <Button
              variant="outline"
              onClick={() => setLogoutDialogOpen(false)}
              className="flex-1 rounded-xl h-11 border-slate-300/50 bg-white/40 text-slate-700 hover:bg-white/60 hover:text-navy cursor-pointer transition-colors"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex-1 rounded-xl h-11 bg-red-500 hover:bg-red-600 shadow-md cursor-pointer transition-colors"
            >
              Keluar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}