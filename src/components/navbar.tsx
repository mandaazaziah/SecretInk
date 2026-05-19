"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Menu,
  LogOut,
  Home,
  Info,
  LogIn,
  UserPlus,
  User,
} from "lucide-react";

// Only Beranda & Tentang in navbar
const navLinks = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/about", label: "Tentang", icon: Info },
];

// ─── Two-color brand title component ──────────────────────────────────────
function BrandTitle({ className }: { className?: string }) {
  return (
    <span
      className={cn("tracking-tight", className)}
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <span className="text-navy">Secret</span>
      <span className="text-royal">Ink</span>
    </span>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50",
        "glass-strong",
        "border-b border-[rgba(226,232,240,0.5)]",
        "shadow-soft"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand - Left */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
        >
          <img
            src="/logo.svg"
            alt="SecretInk Logo"
            className="size-8 logo-zoom"
          />
          <BrandTitle className="text-xl font-bold" />
        </Link>

        {/* Center Navigation Links (desktop) */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md",
                  "transition-colors duration-200",
                  active
                    ? "text-royal"
                    : "text-navy-light hover:text-royal hover:bg-accent/50"
                )}
              >
                <Icon className="size-4 icon-pop" />
                {link.label}
                {active && (
                  <span
                    className={cn(
                      "absolute bottom-0 left-3 right-3 h-0.5 rounded-full",
                      "bg-royal"
                    )}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right Auth Section (desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {status === "loading" ? (
            <div className="size-8 rounded-full bg-muted animate-pulse" />
          ) : session?.user ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Avatar className="size-8 border border-border/50">
                  <AvatarImage
                    src={session.user.image || undefined}
                    alt={session.user.name || "User avatar"}
                  />
                  <AvatarFallback className="bg-accent text-royal text-xs font-semibold">
                    {session.user.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2) || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-navy truncate max-w-[120px]">
                  {session.user.name}
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
                  Profil
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-muted-foreground hover:text-destructive gap-1.5"
              >
                <LogOut className="size-4" />
                Keluar
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="gap-1.5"
              >
                <Link href="/login">
                  <LogIn className="size-4" />
                  Masuk
                </Link>
              </Button>
              <Button
                size="sm"
                asChild
                className="btn-royal gap-1.5"
              >
                <Link href="/register">
                  <UserPlus className="size-4" />
                  Mulai Gratis
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Trigger */}
        <div className="md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                aria-label="Buka menu navigasi"
              >
                <Menu className="size-5 text-navy" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[280px] p-0">
              <SheetHeader
                className={cn(
                  "border-b border-border/50 px-6 py-4",
                  "glass-strong"
                )}
              >
                <SheetTitle className="flex items-center gap-2.5">
                  <img src="/logo.svg" alt="SecretInk Logo" className="size-6 logo-zoom" />
                  <BrandTitle className="text-lg font-bold" />
                </SheetTitle>
              </SheetHeader>

              {/* Mobile Navigation Links */}
              <div className="flex flex-col px-3 py-4">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.href);
                  return (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                          "transition-all duration-200",
                          active
                            ? "bg-accent text-royal"
                            : "text-navy-light hover:bg-accent/50 hover:text-royal"
                        )}
                      >
                        <Icon className="size-4" />
                        {link.label}
                        {active && (
                          <span className="ml-auto size-1.5 rounded-full bg-royal" />
                        )}
                      </Link>
                    </SheetClose>
                  );
                })}
              </div>

              {/* Mobile Auth Section */}
              <div className="mt-auto border-t border-border/50 px-4 py-4">
                {status === "loading" ? (
                  <div className="flex items-center gap-3 px-2">
                    <div className="size-8 rounded-full bg-muted animate-pulse" />
                    <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                  </div>
                ) : session?.user ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 px-2">
                      <Avatar className="size-9 border border-border/50">
                        <AvatarImage
                          src={session.user.image || undefined}
                          alt={session.user.name || "User avatar"}
                        />
                        <AvatarFallback className="bg-accent text-royal text-xs font-semibold">
                          {session.user.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-navy truncate">
                          {session.user.name}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">
                          {session.user.email}
                        </span>
                      </div>
                    </div>
                    <SheetClose asChild>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-navy-light hover:bg-accent/50 hover:text-royal transition-all duration-200"
                      >
                        <User className="size-4" />
                        Dashboard
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-navy-light hover:bg-accent/50 hover:text-royal transition-all duration-200"
                      >
                        <User className="size-4" />
                        Pengaturan Profil
                      </Link>
                    </SheetClose>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setMobileOpen(false);
                        handleSignOut();
                      }}
                      className="w-full text-muted-foreground hover:text-destructive gap-1.5"
                    >
                      <LogOut className="size-4" />
                      Keluar
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <SheetClose asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="w-full gap-1.5"
                      >
                        <Link href="/login">
                          <LogIn className="size-4" />
                          Masuk
                        </Link>
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button
                        size="sm"
                        asChild
                        className="w-full btn-royal gap-1.5"
                      >
                        <Link href="/register">
                          <UserPlus className="size-4" />
                          Mulai Gratis
                        </Link>
                      </Button>
                    </SheetClose>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
