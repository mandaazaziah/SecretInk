"use client";

import { useEffect, useRef } from "react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

type Props = {
  /** default 5 menit */
  timeoutMs?: number;
  /** route yang dituju setelah logout */
  callbackUrl?: string;
  /** aktifkan hanya jika sedang login (session ada) */
  isAuthenticated?: boolean;
};

export default function IdleLogout({
  timeoutMs = 5 * 60 * 1000,
  callbackUrl = "/login",
  isAuthenticated = false,
}: Props) {
  const lastActiveAtRef = useRef<number>(Date.now());
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const signOutInFlightRef = useRef(false);

  const clearTimer = () => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
  };

  const schedule = () => {
    clearTimer();
    timeoutIdRef.current = setTimeout(async () => {
      if (!isAuthenticated) return;
      if (signOutInFlightRef.current) return;

      signOutInFlightRef.current = true;
      toast.info("Sesi habis karena tidak ada aktivitas. Silakan login kembali.");
      await signOut({ callbackUrl });
    }, timeoutMs);
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    lastActiveAtRef.current = Date.now();
    schedule();

    const events: (keyof WindowEventMap)[] = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
    ];

    const onActivity = () => {
      lastActiveAtRef.current = Date.now();
      signOutInFlightRef.current = false;
      schedule();
    };

    for (const ev of events) {
      window.addEventListener(ev, onActivity, { passive: true });
    }

    // visibilitychange: kalau user balik setelah tab lama, logout bisa terjadi kalau sudah timeout
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        const idleMs = Date.now() - lastActiveAtRef.current;
        if (idleMs >= timeoutMs) {
          onActivity(); // akan mengatur ulang timer, tapi jika sudah timeout, signOut tetap akan berjalan lewat timer berikutnya
        } else {
          schedule();
        }
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      clearTimer();
      for (const ev of events) {
        window.removeEventListener(ev, onActivity as any);
      }
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, timeoutMs]);

  return null;
}

