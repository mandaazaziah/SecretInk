"use client";

import { SessionProvider, useSession } from "next-auth/react";
import IdleLogout from "@/components/idle-logout";

function SessionAwareIdleLogout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  return (
    <>
      <IdleLogout
        timeoutMs={5 * 60 * 1000}
        callbackUrl="/login"
        isAuthenticated={status === "authenticated" && !!session}
      />
      {children}
    </>
  );
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SessionAwareIdleLogout>{children}</SessionAwareIdleLogout>
    </SessionProvider>
  );
}

