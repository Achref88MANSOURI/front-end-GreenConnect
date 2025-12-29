"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

// Pages publiques - accessibles sans compte
const PUBLIC_PATHS = new Set(["/", "/about", "/contact", "/login", "/register", "/signup", "/reset-password"]);

export default function Protected({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  const hasValidToken = () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) return false;
      const parts = token.split(".");
      if (parts.length !== 3) return false;
      const payloadStr = atob(parts[1]);
      const payload = JSON.parse(payloadStr || "{}");
      if (!payload || typeof payload !== "object") return false;
      if (payload.exp && typeof payload.exp === "number") {
        const nowSec = Math.floor(Date.now() / 1000);
        if (payload.exp < nowSec) return false;
      }
      return !!payload.sub;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    // Si page publique, laisser passer
    if (pathname && PUBLIC_PATHS.has(pathname)) {
      setIsReady(true);
      return;
    }

    // Si pas de token et pas page publique, rediriger vers login
    if (!hasValidToken()) {
      router.replace(`/login?next=${encodeURIComponent(pathname || "/")}`);
      return;
    }

    setIsReady(true);
  }, [pathname, router]);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Chargement…</div>
      </div>
    );
  }

  return <>{children}</>;
}
