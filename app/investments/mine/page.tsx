'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { API_BASE_URL } from '@/src/api-config';

interface Owner {
  id: number;
  name: string;
  email: string;
}

interface Land {
  id: number;
  title: string;
  description: string;
  location: string;
  targetAmount: number;
  currentAmount: number;
  status: string;
  images: string[];
  owner: Owner;
}

interface Investment {
  id: number;
  amount: number;
  status: string;
  investedAt: string;
  customDurationMonths?: number;
  project: Land;
}

export default function MyInvestmentsPage() {
  const router = useRouter();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchMyInvestments(token);
  }, [router]);

  const fetchMyInvestments = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/investments/my-investments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Impossible de charger vos locations');
      }

      const data = await response.json();
      setInvestments(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-600">Chargement...</div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-emerald-700 font-semibold border-2 border-emerald-200 hover:bg-emerald-50 transition-all duration-300"
          >
            <span>←</span>
            <span>Retour</span>
          </button>

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Mes Locations 🚜</h1>
            <p className="text-gray-600">Suivez vos locations de terres auprès d'autres agriculteurs</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {investments.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="text-5xl mb-4">🚜</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Aucune location active</h2>
              <p className="text-gray-600 mb-6">
                Vous n'avez pas encore loué de terre. Explorez les terres disponibles et demandez une location!
              </p>
              <Link
                href="/investments"
                className="inline-block px-8 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-lg hover:shadow-lg transition"
              >
                Explorer les Terres
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {investments.map(investment => (
                <div key={investment.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Image */}
                    <div className="rounded-lg overflow-hidden h-40 bg-gray-200">
                      {investment.project.images && investment.project.images.length > 0 ? (
                        <img
                          src={investment.project.images[0]?.startsWith('http') ? investment.project.images[0] : `${API_BASE_URL}${investment.project.images[0]}`}
                          alt={investment.project.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">🌾</div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="md:col-span-2">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{investment.project.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{investment.project.description.substring(0, 100)}...</p>
                      <div className="flex gap-4 text-sm mb-3">
                        <span className="text-gray-700">📍 {investment.project.location}</span>
                        <span className="text-emerald-700 font-semibold">{investment.project.targetAmount} ha</span>
                      </div>

                      {/* Owner Info */}
                      <div className="bg-gray-50 rounded p-3 border border-gray-200">
                        <p className="text-xs text-gray-600 mb-1">Propriétaire</p>
                        <p className="font-semibold text-gray-900">{investment.project.owner.name}</p>
                        <p className="text-xs text-gray-600">{investment.project.owner.email}</p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-3">
                      <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                        <p className="text-xs text-emerald-600 font-semibold uppercase mb-1">Montant</p>
                        <p className="text-2xl font-bold text-emerald-700">{investment.amount} TND</p>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <p className="text-xs text-blue-600 font-semibold uppercase mb-1">Durée</p>
                        <p className="text-lg font-bold text-blue-700">{investment.customDurationMonths || '-'} mois</p>
                      </div>

                      <div className="bg-gray-100 rounded-lg p-4 border border-gray-300">
                        <p className="text-xs text-gray-600 font-semibold uppercase mb-1">État</p>
                        <span className={`inline-block px-3 py-1 rounded text-xs font-semibold ${
                          investment.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-700'
                            : investment.status === 'ACTIVE'
                            ? 'bg-amber-100 text-amber-700'
                            : investment.status === 'REJECTED'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-200 text-gray-700'
                        }`}>
                          {investment.status === 'APPROVED' ? 'Louée' : 
                           investment.status === 'ACTIVE' ? 'En cours' : 
                           investment.status === 'REJECTED' ? 'Refusée' : investment.status}
                        </span>
                      </div>

                      <Link
                        href={`/investments/${investment.project.id}`}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition text-center block"
                      >
                        Voir Détails
                      </Link>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-xs text-gray-600 mb-2 font-semibold uppercase">Demandé le</p>
                    <p className="text-sm text-gray-700">{new Date(investment.investedAt).toLocaleDateString('fr-FR', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
