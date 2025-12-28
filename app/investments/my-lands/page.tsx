'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { API_BASE_URL } from '@/src/api-config';

interface LeaseRequest {
  id: number;
  investorId: number;
  investor: {
    id: number;
    name: string;
    email: string;
  };
  projectId: number;
  amount: number;
  status: string;
  customDurationMonths?: number;
  investedAt: string;
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
  createdAt: string;
  investments: LeaseRequest[];
}

export default function MyLandsPage() {
  const router = useRouter();
  const [lands, setLands] = useState<Land[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchMyLands(token);
  }, [router]);

  const fetchMyLands = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/investments/my-listings`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Impossible de charger vos terres');
      }

      const data = await response.json();
      setLands(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
      setLoading(false);
    }
  };

  const handleApprove = async (leaseId: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Vous devez être connecté');
      return;
    }

    setActionLoading(leaseId);
    try {
      const response = await fetch(`${API_BASE_URL}/investments/leases/${leaseId}/approve`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'approbation');
      }

      // Refresh lands
      await fetchMyLands(token);
      setSuccess('Demande acceptée! Vous pouvez à présent contacter le cultivateur.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (leaseId: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Vous devez être connecté');
      return;
    }

    setActionLoading(leaseId);
    try {
      const response = await fetch(`${API_BASE_URL}/investments/leases/${leaseId}/reject`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Erreur lors du refus');
      }

      // Refresh lands
      await fetchMyLands(token);
      setSuccess('Demande refusée.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = (landId: number) => {
    router.push(`/investments/${landId}/edit`);
  };

  const handleDelete = async (landId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette terre?')) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Vous devez être connecté');
      return;
    }

    setActionLoading(landId);
    try {
      const response = await fetch(`${API_BASE_URL}/investments/lands/${landId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      // Refresh lands
      await fetchMyLands(token);
      setSuccess('Terre supprimée avec succès.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    } finally {
      setActionLoading(null);
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
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Mes Terres 🌾</h1>
            <p className="text-gray-600">Gérez vos annonces et examinez les demandes de location</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700">
              ✓ {success}
            </div>
          )}

          {lands.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="text-5xl mb-4">🌾</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Aucune terre publiée</h2>
              <p className="text-gray-600 mb-6">
                Vous n'avez pas encore publié de terre à louer. Commencez dès maintenant!
              </p>
              <Link
                href="/investments/create"
                className="inline-block px-8 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-lg hover:shadow-lg transition"
              >
                Publier une Terre
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {lands.map(land => (
                <div key={land.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Image */}
                    <div className="rounded-lg overflow-hidden h-40 bg-gray-200">
                      {land.images && land.images.length > 0 ? (
                        <img
                          src={land.images[0]?.startsWith('http') ? land.images[0] : `${API_BASE_URL}${land.images[0]}`}
                          alt={land.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">🌾</div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="md:col-span-2">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{land.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{land.description.substring(0, 100)}...</p>
                      <div className="flex gap-4 text-sm">
                        <span className="text-gray-700">📍 {land.location}</span>
                        <span className="text-emerald-700 font-semibold">{land.targetAmount} ha</span>
                        <span className="text-green-700 font-semibold">{land.currentAmount} TND/mois</span>
                      </div>
                      <div className="mt-3">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            land.status === 'available'
                              ? 'bg-emerald-100 text-emerald-700'
                              : land.status === 'reserved'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {land.status === 'available' ? '✓ Disponible' : land.status === 'reserved' ? '⏳ Réservée' : 'Louée'}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <Link
                        href={`/investments/${land.id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition text-center"
                      >
                        Voir Détails
                      </Link>
                      <button
                        onClick={() => handleEdit(land.id)}
                        disabled={actionLoading !== null}
                        className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition disabled:opacity-50"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(land.id)}
                        disabled={actionLoading !== null}
                        className="px-4 py-2 border-2 border-red-300 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-50 transition disabled:opacity-50"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>

                  {/* Lease Requests Section */}
                  {land.investments && land.investments.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="font-bold text-gray-900 mb-4">
                        Demandes de location ({land.investments.length})
                      </h4>
                      <div className="space-y-3">
                        {land.investments.map(request => (
                          <div key={request.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">{request.investor?.name ?? 'Locataire'}</p>
                                <p className="text-sm text-gray-600">{request.investor?.email ?? ''}</p>
                                <p className="text-sm text-gray-700 mt-2">
                                  💰 <strong>{request.amount} TND</strong> pour {request.customDurationMonths || '?'} mois
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Demandé le {new Date(request.investedAt).toLocaleDateString('fr-FR')}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                {request.status === 'ACTIVE' ? (
                                  <>
                                    <button
                                      onClick={() => handleApprove(request.id)}
                                      disabled={actionLoading === request.id}
                                      className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded hover:bg-emerald-700 transition disabled:opacity-50"
                                    >
                                      {actionLoading === request.id ? 'Approbation...' : 'Accepter'}
                                    </button>
                                    <button
                                      onClick={() => handleReject(request.id)}
                                      disabled={actionLoading === request.id}
                                      className="px-4 py-2 border-2 border-gray-300 text-gray-700 text-sm font-semibold rounded hover:bg-gray-50 transition disabled:opacity-50"
                                    >
                                      {actionLoading === request.id ? 'Refus...' : 'Refuser'}
                                    </button>
                                  </>
                                ) : (
                                  <span
                                    className={`px-3 py-1 rounded text-xs font-semibold ${
                                      request.status === 'APPROVED'
                                        ? 'bg-green-100 text-green-700'
                                        : request.status === 'REJECTED'
                                        ? 'bg-red-100 text-red-700'
                                        : 'bg-gray-100 text-gray-700'
                                    }`}
                                  >
                                    {request.status === 'APPROVED' ? '✓ Acceptée' : request.status === 'REJECTED' ? '✗ Refusée' : request.status}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
