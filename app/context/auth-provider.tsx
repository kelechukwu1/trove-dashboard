"use client";

import { ReactNode, useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";

interface AuthProviderProps {
  children: ReactNode;
  requireAuth?: boolean;
  isProtected?: boolean;
}

export function AuthProvider({
  children,
  requireAuth = false,
  isProtected = false,
}: AuthProviderProps) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && requireAuth && !isAuthenticated) {
      router.replace("/login");
    }
    if (mounted && isProtected && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [mounted, isAuthenticated, requireAuth, isProtected, router]);

  if (!mounted) {
    return null; // Prevent Next.js SSR hydration mismatch
  }

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (isProtected && isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
