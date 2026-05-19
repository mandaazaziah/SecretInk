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
  User,
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

  // Delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<NoteSummary | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ─── Auth redirect ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  // ─── Fetch notes on mount ──────────────────────────────────────────────────
  const fetchNotes = useCallback(async () => {
    try {
      setNotesLoading(true);
      const res = await fetch('/api/notes');
      if (res.ok) {
        const data = await res.json();
        setNotes(data.notes || []);
      } else {
        toast.error('Gagal memuat catatan');
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
      const res = await fetch(`/api/notes/${id}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedNote(data.note);
      } else {
        toast.error('Gagal memuat catatan');
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
    setSidebarOpen(false); // Close sidebar on mobile after selecting
  };

  // ─── Decrypt handler ───────────────────────────────────────────────────────
  const handleDecrypt = async () => {
    if (!selectedNote || !encryptionKey.trim()) {
      toast.error('Masukkan kunci enkripsi Anda');
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
        toast.success('Catatan berhasil didekripsi!');
      } else {
        toast.error(data.error || 'Dekripsi gagal');
        setDecryptedContent(null);
      }
    } catch {
      toast.error('Kesalahan jaringan. Silakan coba lagi.');
      setDecryptedContent(null);
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
        }
      } else {
        toast.error('Gagal menghapus catatan');
      }
    } catch {
      toast.error('Kesalahan jaringan. Silakan coba lagi.');
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
  const encryptedCount = notes.length; // All notes are encrypted
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
            <img src="/logo.svg" alt="SecretInk" className="h-7 logo-zoom" />
            <span
              className="text-lg font-bold tracking-tight"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              <span className="text-navy">Secret</span><span className="text-royal">Ink</span>
            </span>
          </div>

          <div className="flex flex-1 flex-col p-4 overflow-hidden">
            {/* Sidebar Title */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-lg font-bold text-navy">Catatan Saya</h2>
                <Badge
                  variant="secondary"
                  className="bg-royal/10 text-royal text-xs font-semibold"
                >
                  {totalNotes}
                </Badge>
              </div>
            </div>

            {/* New Note Button */}
            <Button asChild className="btn-royal mb-4 w-full gap-2 shadow-royal">
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-navy"
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
                  // Loading skeleton
                  [...Array(3)].map((_, i) => (
                    <div key={i} className="rounded-lg p-3">
                      <Skeleton className="mb-2 h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  ))
                ) : filteredNotes.length === 0 ? (
                  // Empty state
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-3 flex size-14 items-center justify-center rounded-2xl bg-royal/10">
                      <StickyNote className="size-7 text-royal icon-pop" strokeWidth={1.8} />
                    </div>
                    <p className="text-sm font-medium text-navy/70">Belum ada catatan</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Buat catatan pertama Anda!
                    </p>
                    <Button asChild className="btn-royal mt-3 gap-1.5 text-xs" size="sm">
                      <Link href="/notes">
                        <Plus className="size-3.5 icon-pop" />
                        Buat Catatan
                      </Link>
                    </Button>
                  </div>
                ) : (
                  // Note cards
                  filteredNotes.map((note) => (
                    <div
                      key={note.id}
                      onClick={() => handleSelectNote(note.id)}
                      className={cn(
                        'note-card group cursor-pointer rounded-lg p-3 transition-all duration-200',
                        selectedNoteId === note.id
                          ? 'border-l-royal bg-royal/5 border-l-[3px]'
                          : 'hover:bg-royal/5'
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
                          className="shrink-0 rounded-md p-1 text-muted-foreground opacity-0 transition-all duration-200 hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
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
            {/* Mobile sidebar toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X className="size-5 icon-pop" /> : <Menu className="size-5 icon-pop" />}
            </Button>
          </div>

          {/* Right: User info */}
          <div className="flex items-center gap-3">
            <Link href="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
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
              asChild
              className="text-muted-foreground hover:text-royal gap-1.5"
            >
              <Link href="/profile">
                <User className="size-4 icon-pop" />
                <span className="hidden sm:inline">Profil</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-muted-foreground hover:text-destructive gap-1.5"
            >
              <LogOut className="size-4 icon-pop" />
              <span className="hidden sm:inline">Keluar</span>
            </Button>
          </div>
        </header>

        {/* ─── MAIN CONTENT ─────────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
            {/* ═══════════ TOP STATS BAR ═══════════ */}
            <div className="animate-fade-in-up mb-6 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              {/* Total Catatan */}
              <div className="glass-card rounded-xl p-4 shadow-soft transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-0.5">
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
              <div className="glass-card rounded-xl p-4 shadow-soft transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-0.5">
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
              <div className="glass-card rounded-xl p-4 shadow-soft transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-0.5">
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
              <div className="glass-card rounded-xl p-4 shadow-soft transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-0.5">
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
              {/* ─── MAIN CONTENT ──────────────────────────────────────────────── */}
              <div className="min-w-0 flex-1">
                {noteLoading ? (
                  // Loading state
                  <div className="glass-card rounded-xl p-6 shadow-soft">
                    <Skeleton className="mb-4 h-8 w-1/3" />
                    <Skeleton className="mb-6 h-4 w-1/4" />
                    <Skeleton className="mb-3 h-10 w-full" />
                    <Skeleton className="mb-3 h-10 w-1/3" />
                    <Skeleton className="h-40 w-full" />
                  </div>
                ) : !selectedNoteId || !selectedNote ? (
                  // ─── Welcome Screen (No note selected) ─────────────────────
                  <div className="glass-card animate-fade-in-up flex flex-col items-center justify-center rounded-xl p-8 shadow-soft md:p-16">
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
                    <div className="glass-card rounded-xl p-6 shadow-soft">
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
                        <Button asChild variant="outline" size="sm" className="gap-1.5 shrink-0">
                          <Link href={`/notes?edit=${selectedNote.id}`}>
                            <Edit3 className="size-3.5 icon-pop" />
                            Edit
                          </Link>
                        </Button>
                      </div>
                    </div>

                    {/* Decrypt Section */}
                    <div className="glass-card rounded-xl p-6 shadow-soft">
                      <h3 className="font-heading mb-4 flex items-center gap-2 text-base font-semibold text-navy">
                        <KeyRound className="size-4 text-royal icon-pop" />
                        Dekripsi Catatan
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
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-navy transition-colors"
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
                          disabled={decrypting || !encryptionKey.trim()}
                          className="btn-royal w-full gap-2 shadow-royal"
                        >
                          {decrypting ? (
                            <>
                              <Loader2 className="size-4 animate-spin" />
                              Mendekripsi...
                            </>
                          ) : (
                            <>
                              <Lock className="size-4 icon-pop" />
                              Dekripsi Catatan
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Decrypted Content Display */}
                    {decryptedContent !== null && (
                      <div className="glass-card animate-fade-in-up rounded-xl p-6 shadow-soft">
                        <div className="mb-4 flex items-center justify-between">
                          <h3 className="font-heading flex items-center gap-2 text-base font-semibold text-navy">
                            <Check className="size-4 text-mint icon-pop" />
                            Konten Terdekripsi
                          </h3>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCopy}
                            className="gap-1.5"
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
                        </div>
                        <div className="rounded-lg bg-ice-dark p-4">
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

      {/* ═══════════ DELETE CONFIRMATION DIALOG ═══════════ */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="glass-card sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-heading text-navy">
              <Trash2 className="size-5 text-destructive icon-pop" />
              Hapus Catatan
            </DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus{' '}
              <span className="font-semibold text-navy">
                &ldquo;{noteToDelete?.title}&rdquo;
              </span>
              ? Tindakan ini tidak dapat dibatalkan. Catatan terenkripsi akan dihapus secara permanen.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleting}
              className="gap-1.5"
            >
              {deleting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                <>
                  <Trash2 className="size-4 icon-pop" />
                  Hapus
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
