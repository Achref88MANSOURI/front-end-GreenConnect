"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

// Modules protégés qui nécessitent une connexion
const PROTECTED_MODULES = ["/marketplace", "/investments", "/carriers", "/deliveries"];

export default function AuthOverlay({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [showOverlay, setShowOverlay] = useState(false);

  const hasValidToken = () => {
    try {
      if (typeof window === "undefined") return false;
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found");
        return false;
      }
      const parts = token.split(".");
      if (parts.length !== 3) {
        console.log("Invalid token format");
        return false;
      }
      const payloadStr = atob(parts[1]);
      const payload = JSON.parse(payloadStr || "{}");
      if (!payload || typeof payload !== "object") return false;
      if (payload.exp && typeof payload.exp === "number") {
        const nowSec = Math.floor(Date.now() / 1000);
        if (payload.exp < nowSec) {
          console.log("Token expired");
          return false;
        }
      }
      console.log("Valid token found");
      return !!payload.sub;
    } catch (e) {
      console.log("Token validation error:", e);
      return false;
    }
  };

  useEffect(() => {
    // Vérifier si on est sur un module protégé
    const isProtected = pathname ? PROTECTED_MODULES.some((mod) => pathname.startsWith(mod)) : false;
    const hasToken = hasValidToken();
    
    console.log("=== AuthOverlay Debug ===");
    console.log("Current pathname:", pathname);
    console.log("Is protected module:", isProtected);
    console.log("Has valid token:", hasToken);
    console.log("Should show overlay:", isProtected && !hasToken);
    
    if (isProtected && !hasToken) {
      console.log("SHOWING OVERLAY");
      setShowOverlay(true);
    } else {
      console.log("HIDING OVERLAY");
      setShowOverlay(false);
    }
  }, [pathname]);

  console.log("Render - showOverlay:", showOverlay);

  return (
    <>
      {children}
      
      {showOverlay && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md"
          style={{ zIndex: 9999 }}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border-2 border-emerald-200">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">🔒</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Connexion Requise</h2>
              <p className="text-gray-600">
                Vous devez vous connecter pour accéder à ce module de la plateforme GreenConnect.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  const nextPath = pathname || "/";
                  router.push(`/login?next=${encodeURIComponent(nextPath)}`);
                }}
                className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg"
              >
                Se Connecter
              </button>
              
              <button
                onClick={() => router.push("/register")}
                className="w-full px-6 py-3 border-2 border-emerald-600 text-emerald-700 rounded-lg font-semibold hover:bg-emerald-50 transition-all"
              >
                Créer un Compte
              </button>
              
              <button
                onClick={() => router.push("/")}
                className="w-full px-6 py-3 text-gray-600 hover:text-gray-900 transition-all text-sm"
              >
                ← Retour à l'accueil
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
