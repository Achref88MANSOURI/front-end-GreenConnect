// app/login/page.tsx
"use client";

import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// Define the Login Page Component
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Call backend API directly
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password
        }),
      });
      // Try to parse JSON; if HTML is returned (e.g., from Next.js), throw a readable error
      let data: any = null;
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(`Unexpected response format: ${contentType}. Body starts with: ${text.slice(0, 100)}...`);
      }

      if (res.ok) {
        // Store JWT for protected actions
        localStorage.setItem("token", data.access_token);
        // Optionally store user info if provided
        if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
        // Notify header/auth state
        window.dispatchEvent(new Event('storage'));
        alert("Login successful!");
        router.push('/');
      } else {
        alert("Login failed");
        const msg = data?.message || `HTTP ${res.status} ${res.statusText}`;
        throw new Error(msg);
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Centering the form on the screen
    <div className="flex items-center justify-center min-h-screen bg-beige-50 p-4">
      
      {/* Login Card Container */}
      <div className="w-full max-w-2xl p-0 md:p-6 space-y-0 bg-white rounded-2xl shadow-2xl border border-beige-200 overflow-hidden md:flex md:items-stretch">

        {/* Left illustration (hidden on small screens) */}
        <div className="hidden md:block md:w-1/2 bg-green-700 p-8">
          <div className="h-full w-full bg-[url('/images/agriculture-tech-hero.jpg')] bg-cover bg-center rounded-l-2xl opacity-95" aria-hidden="true" />
        </div>

        {/* Right: form */}
        <div className="w-full md:w-1/2 p-8">
          <div className="text-center mb-6">
            <div className="mx-auto w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center text-green-900 font-bold text-lg">AG</div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-green-800 mt-4">Bienvenue</h2>
            <p className="mt-2 text-sm text-gray-600">Connectez-vous pour accéder à Souk-Moussel, Faza’et-Ard, Tawssel et plus.</p>
          </div>

          {/* Social login buttons */}
          <div className="flex gap-3 mb-4">
            <button className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border rounded-md bg-white text-sm hover:shadow transition">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M21 12.2c0-.7-.1-1.4-.3-2H12v3.8h5.5c-.2 1.2-.9 2.2-1.9 2.9v2.4h3.1c1.8-1.6 2.8-4 2.8-7.1z" fill="#4285F4"/><path d="M12 22c2.7 0 4.9-.9 6.5-2.5l-3.1-2.4c-.8.6-1.9 1-3.4 1-2.6 0-4.8-1.7-5.6-4.1H3.2v2.6C4.8 19.8 8.1 22 12 22z" fill="#34A853"/><path d="M6.4 13.9A6.9 6.9 0 0 1 6 12c0-.6.1-1.2.2-1.7V7.7H3.2A10 10 0 0 0 2 12c0 1.6.4 3.2 1.2 4.6l3.2-2.7z" fill="#FBBC05"/><path d="M12 6.4c1.4 0 2.6.5 3.6 1.6l2.7-2.7C16.8 3.4 14.7 2.5 12 2.5 8.1 2.5 4.8 4.7 3.2 7.7l3.2 2.6c.8-2.4 3-4.4 5.6-4.4z" fill="#EA4335"/></svg>
              <span>Google</span>
            </button>
            <button className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border rounded-md bg-blue-600 text-white text-sm hover:shadow transition">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.5-4.5-10-10-10S2 6.5 2 12c0 4.99 3.66 9.12 8.44 9.88v-6.99H7.9v-2.89h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.77l-.44 2.89h-2.33v6.99C18.34 21.12 22 16.99 22 12z"/></svg>
              <span>Facebook</span>
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-grow border-t border-gray-200"></div>
            <div className="text-sm text-gray-400">Ou</div>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {errorMessage && <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">{errorMessage}</div>}
          {successMessage && <div className="mb-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded-md text-sm">{successMessage}</div>}

          {/* --- Login Form --- */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                id="email" 
                name="email" 
                type="email" 
                required 
                placeholder="user@agriconnect.tn" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm" 
              />
            </div>

            {/* Password Field with toggle */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <div className="relative">
                <input 
                  id="password" 
                  name="password" 
                  type={showPassword ? 'text' : 'password'} 
                  required 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm" 
                />
                <button type="button" onClick={() => setShowPassword(s => !s)} aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'} className="absolute inset-y-0 right-2 pr-2 flex items-center text-sm text-gray-500">
                  {showPassword ? 'Masquer' : 'Afficher'}
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
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition">Se connecter</button>
            </div>
          </form>

          <div className="text-center text-sm mt-6">
            <p className="text-gray-600">Pas encore de compte? <Link href="/register" className="font-medium text-green-600 hover:text-green-500 ml-1">Inscrivez-vous</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}