/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { API_BASE_URL } from '@/src/api-config';

interface MyInvestment {
  id: number;
  amount: number;
  status: string;
  investedAt: string;
  project: {
    id: number;
    title: string;
    owner?: { id: number; name: string };
  };
}

export default function MyInvestmentsPage() {
  const [items, setItems] = useState<MyInvestment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMine = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vous devez être connecté pour voir vos investissements.');
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE_URL}/investments/my-investments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || 'Erreur lors du chargement des investissements');
        }
        const data = (await res.json()) as MyInvestment[];
        setItems(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMine();
  }, []);

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-green-800">Mes Investissements</h1>
          <Link href="/investments" className="text-green-600 hover:text-green-700">← Parcourir les projets</Link>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>
        )}

        {loading ? (
          <div className="text-gray-700">Chargement…</div>
        ) : items.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-12 text-center">
            <p className="text-gray-900 text-lg mb-4">Vous n'avez pas encore investi.</p>
            <Link href="/investments" className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">
              Voir les projets
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((it) => (
              <div key={it.id} className="border rounded-lg p-4 flex justify-between items-center bg-white shadow-sm">
                <div>
                  <div className="text-sm text-gray-700">#{it.id} • {new Date(it.investedAt).toLocaleDateString('fr-FR')}</div>
                  <div className="text-lg font-bold text-gray-800">{it.project.title}</div>
                  {it.project.owner?.name && (
                    <div className="text-sm text-gray-800">Propriétaire: {it.project.owner.name}</div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{Number(it.amount).toLocaleString()} TND</div>
                  <div className="text-sm text-gray-700">Statut: {it.status}</div>
                  <Link href={`/investments/${it.project.id}`} className="text-green-600 hover:text-green-700 underline mt-2 inline-block">
                    Voir le projet
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
