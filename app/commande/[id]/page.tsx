import React from 'react';
import Link from 'next/link';

interface Props {
  params: { id: string };
}

export default function OrderConfirmation({ params }: Props) {
  const { id } = params;

  return (
    <div className="font-inter">
      <header className="bg-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold">Souk-Moussel</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white rounded-xl shadow-2xl p-8 text-center">
          <svg className="mx-auto h-20 w-20 text-green-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h2 className="text-3xl font-extrabold text-green-900 mb-2">Commande reçue</h2>
          <p className="text-gray-600 mb-6">Merci pour votre commande. Votre numéro de commande est :</p>

          <div className="inline-flex items-center px-4 py-2 bg-beige-50 rounded-lg border">
            <span className="font-mono text-sm text-gray-800">{id}</span>
          </div>

          <p className="text-sm text-gray-500 mt-6">Vous recevrez un e-mail de confirmation sous peu. Pour suivre votre commande, contactez notre support ou consultez la section "Mes commandes" (à venir).</p>

          <div className="mt-8 flex justify-center gap-3">
            <Link href="/marketplace" className="px-4 py-2 bg-green-600 text-white rounded-md">Retour au catalogue</Link>
            <Link href="/" className="px-4 py-2 border rounded-md">Accueil</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
