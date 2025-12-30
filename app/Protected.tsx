"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

// Pages publiques - accessibles sans compte
const PUBLIC_PATHS = new Set([
  "/", 
  "/about", 
  "/contact", 
  "/login", 
  "/register", 
  "/signup", 
  "/reset-password",
  "/terms"
]);

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
      // Sauvegarder l'URL pour rediriger après connexion
      sessionStorage.setItem('redirectAfterLogin', pathname || '/');
      router.replace(`/login?next=${encodeURIComponent(pathname || "/")}`);
      return;
    }

    setIsReady(true);
  }, [pathname, router]);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-ping opacity-20"></div>
            <div className="absolute inset-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full animate-pulse"></div>
            <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
          <p className="text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
