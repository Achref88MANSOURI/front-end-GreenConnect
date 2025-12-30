// app/login/page.tsx
"use client";

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { API_BASE_URL } from '../../src/api-config';
import { useToast } from '../components/ToastProvider';

// Define the Login Page Component
export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [redirectPath, setRedirectPath] = useState('/');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  // Récupérer le chemin de redirection après connexion
  useEffect(() => {
    const nextPath = searchParams.get('next');
    const savedPath = sessionStorage.getItem('redirectAfterLogin');
    if (nextPath) {
      setRedirectPath(decodeURIComponent(nextPath));
    } else if (savedPath) {
      setRedirectPath(savedPath);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      // Call backend API directly
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password
        }),
      });
      // Try to parse JSON; if HTML is returned (e.g., from Next.js), throw a readable error
      interface LoginResponse {
        access_token: string;
        user?: Record<string, unknown>;
        message?: string;
      }
      let data: LoginResponse | null = null;
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        data = await res.json() as LoginResponse;
      } else {
        const text = await res.text();
        throw new Error(`Unexpected response format: ${contentType}. Body starts with: ${text.slice(0, 100)}...`);
      }

      if (res.ok && data) {
        // Store JWT for protected actions
        localStorage.setItem("token", data.access_token);
        // Also store as cookie for server-side middleware
        try {
          const parts = data.access_token.split('.');
          let maxAge = 60 * 60 * 24 * 7; // default 7 days
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            if (payload && payload.exp && typeof payload.exp === 'number') {
              const nowSec = Math.floor(Date.now() / 1000);
              const diff = payload.exp - nowSec;
              if (diff > 0) maxAge = diff;
            }
          }
          document.cookie = `gc_token=${data.access_token}; path=/; max-age=${maxAge}; samesite=lax`;
        } catch {}
        // Optionally store user info if provided
        if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
        // Clear saved redirect path
        sessionStorage.removeItem('redirectAfterLogin');
        // Notify header/auth state
        window.dispatchEvent(new Event('storage'));
        addToast('Connexion réussie', 'success');
        // Redirect to saved path or home
        router.push(redirectPath);
      } else {
        addToast('Échec de connexion', 'error');
        const msg = data?.message || `HTTP ${res.status} ${res.statusText}`;
        throw new Error(msg);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full bg-green-200 blur-3xl opacity-40" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-yellow-200 blur-3xl opacity-40" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-24 pb-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Brand / Visual side */}
          <div className="hidden md:flex flex-col justify-between rounded-2xl p-8 bg-gradient-to-br from-green-700 to-emerald-600 text-white shadow-xl">
            <div>
              <div className="inline-flex items-center justify-center w-14 h-14 bg-yellow-400 text-green-900 rounded-xl font-extrabold text-lg shadow">GC</div>
              <h2 className="mt-6 text-3xl font-extrabold leading-tight">GreenConnect</h2>
              <p className="mt-2 text-emerald-100">Connectez-vous pour accéder à Souk-Moussel, Faza’et-Ard, Tawssel et plus.</p>
            </div>
            <ul className="mt-10 space-y-4 text-emerald-100">
              <li className="flex items-center gap-3"><span className="text-yellow-300">✔</span> Place de marché agricole</li>
              <li className="flex items-center gap-3"><span className="text-yellow-300">✔</span> Logistique et suivi</li>
              <li className="flex items-center gap-3"><span className="text-yellow-300">✔</span> Paiements sécurisés</li>
            </ul>
            <div className="mt-8 h-40 rounded-xl bg-[url('/images/agriculture-tech-hero.jpg')] bg-cover bg-center border border-emerald-400/30" aria-hidden="true" />
          </div>

          {/* Form side */}
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-2xl border border-emerald-100 p-6 sm:p-8">
            <div className="mb-6 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-extrabold text-green-800">Bienvenue</h1>
              <p className="mt-1 text-sm text-gray-500">Ravi de vous revoir. Connectez-vous pour continuer.</p>
            </div>

            {/* Social login buttons */}
            <div className="flex gap-3 mb-5">
              <button type="button" className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border rounded-md bg-white text-sm hover:shadow transition">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M21 12.2c0-.7-.1-1.4-.3-2H12v3.8h5.5c-.2 1.2-.9 2.2-1.9 2.9v2.4h3.1c1.8-1.6 2.8-4 2.8-7.1z" fill="#4285F4"/><path d="M12 22c2.7 0 4.9-.9 6.5-2.5l-3.1-2.4c-.8.6-1.9 1-3.4 1-2.6 0-4.8-1.7-5.6-4.1H3.2v2.6C4.8 19.8 8.1 22 12 22z" fill="#34A853"/><path d="M6.4 13.9A6.9 6.9 0 0 1 6 12c0-.6.1-1.2.2-1.7V7.7H3.2A10 10 0 0 0 2 12c0 1.6.4 3.2 1.2 4.6l3.2-2.7z" fill="#FBBC05"/><path d="M12 6.4c1.4 0 2.6.5 3.6 1.6l2.7-2.7C16.8 3.4 14.7 2.5 12 2.5 8.1 2.5 4.8 4.7 3.2 7.7l3.2 2.6c.8-2.4 3-4.4 5.6-4.4z" fill="#EA4335"/></svg>
                <span>Continuer avec Google</span>
              </button>
              <button type="button" className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border rounded-md bg-blue-600 text-white text-sm hover:shadow transition">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.5-4.5-10-10-10S2 6.5 2 12c0 4.99 3.66 9.12 8.44 9.88v-6.99H7.9v-2.89h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.77l-.44 2.89h-2.33v6.99C18.34 21.12 22 16.99 22 12z"/></svg>
                <span>Facebook</span>
              </button>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-grow border-t border-gray-200"></div>
              <div className="text-sm text-gray-400">Ou</div>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {errorMessage && (
              <div role="alert" aria-live="polite" className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div role="status" aria-live="polite" className="mb-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded-md text-sm">
                {successMessage}
              </div>
            )}

            {/* --- Login Form --- */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">@</span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="user@greenconnect.tn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full pl-8 pr-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Password Field with toggle */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">••</span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full pl-8 pr-10 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm">
                  <input type="checkbox" checked={remember} onChange={() => setRemember(r => !r)} className="h-4 w-4 text-green-600 border-gray-300 rounded" />
                  <span className="ml-2 text-gray-600">Se souvenir de moi</span>
                </label>

                <div className="text-sm">
                  <Link href="/reset-password" className="font-medium text-green-600 hover:text-green-500">Mot de passe oublié?</Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full inline-flex items-center justify-center gap-2 py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition ${loading ? 'opacity-80 cursor-not-allowed' : ''}`}
                >
                  {loading && (
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                  )}
                  {loading ? 'Connexion…' : 'Se connecter'}
                </button>
              </div>
            </form>

            <div className="text-center text-sm mt-6">
              <p className="text-gray-600">Pas encore de compte? <Link href="/register" className="font-medium text-green-600 hover:text-green-500 ml-1">Inscrivez-vous</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}