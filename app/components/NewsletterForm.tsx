"use client";

import React, { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      // Demo-only: replace with real API call
      await new Promise((r) => setTimeout(r, 600));
      setStatus('sent');
      setEmail('');
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3" aria-label="Newsletter subscription">
      <label htmlFor="email" className="sr-only">Email</label>
      <input
        id="email"
        type="email"
        placeholder="votre@email.tn"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 px-4 py-3 rounded-md bg-green-900/50 placeholder-green-200 text-white border border-green-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />
      <button
        type="submit"
        disabled={status === 'sending'}
        className="px-6 py-3 bg-yellow-400 text-green-900 font-semibold rounded-md hover:bg-yellow-500 transition disabled:opacity-50"
      >
        {status === 'sending' ? 'Envoi…' : 'S\'abonner'}
      </button>

      {status === 'sent' && <div className="text-sm text-green-200 mt-2">Merci ! Vérifiez votre boîte mail.</div>}
      {status === 'error' && <div className="text-sm text-red-300 mt-2">Une erreur est survenue. Réessayez.</div>}
    </form>
  );
}
