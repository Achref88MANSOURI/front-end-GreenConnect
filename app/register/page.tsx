// app/register/page.tsx
"use client";

import Link from 'next/link';
import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState('farmer');
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const passwordStrength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score; // 0..4
  }, [password]);
  // Simplified UI without heavy motion effects

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrorMessage('');
  setSuccessMessage('');

  if (!agree) {
    setErrorMessage("Veuillez accepter les conditions d'utilisation.");
    return;
  }

  setLoading(true);

  try {
    const res = await fetch("http://localhost:5000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fullName,
        email,
        password,
        role: accountType,
        phoneNumber: phoneNumber,
        address: address
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Erreur lors de l'inscription");
    }

    const data = await res.json();
    setSuccessMessage(`Inscription réussie : ${data.name}`);
    router.push('/login');
  } catch (err: any) {
    setErrorMessage(err.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 p-4">
      {/* Subtle static shapes */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full bg-green-200 blur-3xl opacity-30" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-yellow-200 blur-3xl opacity-30" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Left visual / brand panel */}
          <div className="hidden md:flex flex-col justify-between rounded-2xl p-8 bg-gradient-to-br from-green-700 to-emerald-600 text-white shadow-xl">
            <div>
              <div className="inline-flex items-center justify-center w-14 h-14 bg-yellow-400 text-green-900 rounded-xl font-extrabold text-lg shadow">GC</div>
              <h2 className="mt-6 text-3xl font-extrabold leading-tight">GreenConnect</h2>
              <p className="mt-2 text-emerald-100">Rejoignez la communauté pour vendre, investir, collaborer et transporter.</p>
            </div>
            <ul className="mt-10 space-y-4 text-emerald-100">
              <li className="flex items-center gap-3"><span className="text-yellow-300">✔</span> Compte en quelques secondes</li>
              <li className="flex items-center gap-3"><span className="text-yellow-300">✔</span> Sécurité et transparence</li>
              <li className="flex items-center gap-3"><span className="text-yellow-300">✔</span> Une plateforme, plusieurs services</li>
            </ul>
            <div className="mt-8 h-40 rounded-xl bg-[url('/images/agriculture-tech-hero.jpg')] bg-cover bg-center border border-emerald-400/30" aria-hidden="true" />
          </div>

          {/* Right form panel */}
          <div className="w-full bg-white/90 backdrop-blur rounded-2xl shadow-2xl border border-emerald-100 p-6 sm:p-8">
            <div className="mb-6 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-extrabold text-green-800">Créer un compte</h2>
              <p className="mt-1 text-sm text-gray-500">Bienvenue chez GreenConnect — complétez vos informations pour démarrer.</p>
            </div>

          {errorMessage && <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">{errorMessage}</div>}
          {successMessage && <div className="mb-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded-md text-sm">{successMessage}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
              <input id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} type="text" placeholder="Votre nom complet" required className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input id="email" value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="user@greenconnect.tn" required className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Numéro de téléphone</label>
              <input id="phoneNumber" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} type="tel" placeholder="+216 XX XXX XXX" required className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
              <input id="address" value={address} onChange={e => setAddress(e.target.value)} type="text" placeholder="Votre adresse complète" required className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>

            {/* Hidden default role maintained for backend compatibility */}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <div className="relative">
                <input id="password" value={password} onChange={e => setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} placeholder="Minimum 8 caractères" required className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 pr-16" />
                <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute inset-y-0 right-2 pr-2 text-sm text-gray-600 hover:text-gray-800">{showPassword ? '🙈 Masquer' : '👁️ Afficher'}</button>
              </div>

               <div className="mt-3">
                 <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                   <div
                     className={`h-full rounded-full ${passwordStrength <= 1 ? 'bg-yellow-300' : passwordStrength <= 3 ? 'bg-green-400' : 'bg-green-600'}`}
                     style={{ width: `${(passwordStrength / 4) * 100}%`, transition: 'width 300ms ease' }}
                   />
                 </div>
                 <div className="text-xs text-gray-500 mt-1">Force: {passwordStrength}/4</div>
               </div>
            </div>

            <div className="flex items-center gap-2">
              <input id="agree" type="checkbox" checked={agree} onChange={() => setAgree(a => !a)} className="h-4 w-4 text-green-600 rounded" />
              <label htmlFor="agree" className="text-sm text-gray-600">J'accepte les <Link href="/terms" className="text-green-600 hover:underline">conditions d'utilisation</Link></label>
            </div>

            <div>
              <button type="submit" disabled={!agree || loading} className={`w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-md bg-green-700 text-white font-medium hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition ${(!agree || loading) ? 'opacity-60 cursor-not-allowed' : ''}`}>
                {loading && (
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                )}
                {loading ? 'Création…' : 'Créer le compte'}
              </button>
            </div>
          </form>

          <div className="text-center text-sm mt-6">
            <p className="text-gray-600">Vous avez déjà un compte? <Link href="/login" className="font-medium text-green-600 hover:text-green-500 ml-1">Se connecter</Link></p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
