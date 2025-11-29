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
    <div className="flex items-center justify-center min-h-screen bg-beige-50 p-4">
      <div className="w-full max-w-3xl p-0 md:p-6 bg-white rounded-2xl shadow-2xl border border-beige-200 overflow-hidden md:flex">

        {/* Left visual panel */}
        <div className="hidden md:block md:w-1/2 bg-green-700 p-6">
          <div className="h-full w-full bg-[url('/images/agriculture-tech-hero.jpg')] bg-cover bg-center rounded-l-2xl opacity-95" aria-hidden="true" />
        </div>

        {/* Right form panel */}
        <div className="w-full md:w-1/2 p-8">
          <div className="text-center mb-6">
            <div className="mx-auto w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center text-green-900 font-bold">AG</div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-green-800 mt-4">Créer un compte</h2>
            <p className="mt-2 text-sm text-gray-600">Rejoignez la communauté AgriConnect pour vendre, investir et collaborer.</p>
          </div>

          {errorMessage && <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">{errorMessage}</div>}
          {successMessage && <div className="mb-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded-md text-sm">{successMessage}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
              <input id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} type="text" placeholder="Votre nom complet" required className="block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input id="email" value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="votre@email.tn" required className="block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Numéro de téléphone</label>
              <input id="phoneNumber" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} type="tel" placeholder="+216 XX XXX XXX" required className="block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
              <input id="address" value={address} onChange={e => setAddress(e.target.value)} type="text" placeholder="Votre adresse complète" required className="block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>

            <div>
              <label htmlFor="accountType" className="block text-sm font-medium text-gray-700 mb-1">Type de compte</label>
              <select id="accountType" value={accountType} onChange={e => setAccountType(e.target.value)} className="block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="farmer">Producteur / Agriculteur</option>
                <option value="buyer">Acheteur / Distributeur</option>
                <option value="carrier">Transporteur</option>
                <option value="investor">Investisseur</option>
              </select>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <div className="relative">
                <input id="password" value={password} onChange={e => setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} placeholder="Minimum 8 caractères" required className="block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute inset-y-0 right-2 pr-2 text-sm text-gray-500">{showPassword ? 'Masquer' : 'Afficher'}</button>
              </div>

              <div className="mt-2 flex items-center gap-2 text-sm">
                <div className={`w-20 h-2 rounded ${passwordStrength >= 1 ? 'bg-yellow-300' : 'bg-gray-200'}`}></div>
                <div className={`w-20 h-2 rounded ${passwordStrength >= 3 ? 'bg-green-400' : passwordStrength === 2 ? 'bg-yellow-300' : 'bg-gray-200'}`}></div>
                <div className={`w-20 h-2 rounded ${passwordStrength >= 4 ? 'bg-green-600' : 'bg-gray-200'}`}></div>
                <div className="text-xs text-gray-500 ml-2">Force: {passwordStrength}/4</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input id="agree" type="checkbox" checked={agree} onChange={() => setAgree(a => !a)} className="h-4 w-4 text-green-600 rounded" />
              <label htmlFor="agree" className="text-sm text-gray-600">J'accepte les <Link href="/terms" className="text-green-600 hover:underline">conditions d'utilisation</Link></label>
            </div>

            <div>
              <button type="submit" disabled={!agree || loading} className="w-full py-2 px-4 rounded-md bg-green-700 text-white font-medium hover:bg-green-800 disabled:opacity-60">
                {loading ? 'Création...' : 'Créer le compte'}
              </button>
            </div>
          </form>

          <div className="text-center text-sm mt-6">
            <p className="text-gray-600">Vous avez déjà un compte? <Link href="/login" className="font-medium text-green-600 hover:text-green-500 ml-1">Se connecter</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
