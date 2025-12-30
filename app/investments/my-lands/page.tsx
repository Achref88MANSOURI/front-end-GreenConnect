/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
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
  const [activeTab, setActiveTab] = useState<'lands' | 'requests'>('lands');

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

      await fetchMyLands(token);
      setSuccess('Terre supprimée avec succès');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setActionLoading(null);
    }
  };

  const allRequests = lands.flatMap(land => 
    land.investments.map(inv => ({ ...inv, land }))
  );
  const pendingRequests = allRequests.filter(req => req.status === 'PENDING');
  const approvedRequests = allRequests.filter(req => req.status === 'APPROVED');

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-green-50 via-white to-emerald-50 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="text-6xl"
          >
            🌾
          </motion.div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-green-50 via-white to-emerald-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-12"
          >
            <button
              onClick={() => router.back()}
              className="mb-6 flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-green-700 font-semibold border-2 border-green-200 hover:bg-green-50 transition-all duration-300 shadow-md hover:shadow-lg group"
            >
              <motion.span
                animate={{ x: [0, -5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >←</motion.span>
              <span>Retour</span>
            </button>

            <div className="flex items-center gap-4 mb-4">
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-6xl"
              >
                🏞️
              </motion.div>
              <div>
                <h1 className="text-5xl font-extrabold bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                  Mes Terres Publiées
                </h1>
                <p className="text-lg text-gray-600">Gérez vos terres et demandes de location</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg"
              >
                <p className="text-sm opacity-90 mb-1">Total Terres</p>
                <p className="text-4xl font-bold">{lands.length}</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg"
              >
                <p className="text-sm opacity-90 mb-1">Demandes en Attente</p>
                <p className="text-4xl font-bold">{pendingRequests.length}</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg"
              >
                <p className="text-sm opacity-90 mb-1">Locations Actives</p>
                <p className="text-4xl font-bold">{approvedRequests.length}</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                onClick={() => router.push('/investments/create')}
                className="bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl p-6 text-white shadow-lg cursor-pointer hover:shadow-2xl transition-all duration-300"
              >
                <p className="text-sm opacity-90 mb-1">Ajouter</p>
                <p className="text-4xl font-bold">+</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Success/Error Messages */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-6 p-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl text-emerald-700 shadow-md flex items-center gap-3"
              >
                <span className="text-2xl">✓</span>
                <span className="font-semibold">{success}</span>
              </motion.div>
            )}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 shadow-md flex items-center gap-3"
              >
                <span className="text-2xl">⚠</span>
                <span className="font-semibold">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b-2 border-gray-200">
            <button
              onClick={() => setActiveTab('lands')}
              className={`relative px-8 py-4 font-bold text-lg transition-all duration-300 ${
                activeTab === 'lands'
                  ? 'text-green-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>🏞️</span>
                <span>Mes Terres ({lands.length})</span>
              </span>
              {activeTab === 'lands' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`relative px-8 py-4 font-bold text-lg transition-all duration-300 ${
                activeTab === 'requests'
                  ? 'text-green-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>📨</span>
                <span>Demandes ({pendingRequests.length})</span>
              </span>
              {activeTab === 'requests' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full"
                />
              )}
            </button>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'lands' ? (
              <motion.div
                key="lands"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {lands.length === 0 ? (
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="bg-white rounded-2xl border-2 border-green-200 p-16 text-center shadow-xl"
                  >
                    <div className="text-8xl mb-6">🌱</div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Aucune terre publiée</h2>
                    <p className="text-gray-600 mb-8 text-lg">Publiez votre première terre et commencez à gagner des revenus!</p>
                    <Link
                      href="/investments/create"
                      className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                    >
                      <span>➕</span>
                      <span>Publier une Terre</span>
                    </Link>
                  </motion.div>
                ) : (
                  lands.map((land, index) => (
                    <motion.div
                      key={land.id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                      className="bg-white rounded-2xl border-2 border-green-100 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
                        {/* Image */}
                        <div className="rounded-xl overflow-hidden h-56 lg:h-auto bg-gradient-to-br from-green-100 to-emerald-200 relative">
                          {land.images && land.images.length > 0 ? (
                            <Image
                              src={land.images[0]?.startsWith('http') ? land.images[0] : `${API_BASE_URL}${land.images[0]}`}
                              alt={land.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-green-300 text-6xl">🌾</div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="lg:col-span-2 space-y-4">
                          <div>
                            <h3 className="text-2xl font-bold text-green-900 mb-2">{land.title}</h3>
                            <p className="text-gray-600 line-clamp-2">{land.description}</p>
                          </div>

                          <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                              <span>📍</span>
                              <span className="font-semibold text-green-700">{land.location}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-200">
                              <span>🏞️</span>
                              <span className="font-semibold text-emerald-700">{land.targetAmount} ha</span>
                            </div>
                            <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                              <span>💰</span>
                              <span className="font-semibold text-blue-700">{land.currentAmount} TND/mois</span>
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <p className="text-sm text-gray-600 mb-2">
                              <span className="font-semibold">{land.investments.length}</span> demande{land.investments.length !== 1 ? 's' : ''} de location
                            </p>
                            <div className="flex gap-2">
                              {land.investments.filter(inv => inv.status === 'PENDING').length > 0 && (
                                <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold">
                                  {land.investments.filter(inv => inv.status === 'PENDING').length} en attente
                                </span>
                              )}
                              {land.investments.filter(inv => inv.status === 'APPROVED').length > 0 && (
                                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
                                  {land.investments.filter(inv => inv.status === 'APPROVED').length} approuvée{land.investments.filter(inv => inv.status === 'APPROVED').length > 1 ? 's' : ''}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3">
                          <Link
                            href={`/investments/${land.id}`}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                          >
                            <span>👁️</span>
                            <span>Voir</span>
                          </Link>
                          <button
                            onClick={() => handleEdit(land.id)}
                            disabled={actionLoading === land.id}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                          >
                            <span>✏️</span>
                            <span>Modifier</span>
                          </button>
                          <button
                            onClick={() => handleDelete(land.id)}
                            disabled={actionLoading === land.id}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                          >
                            <span>🗑️</span>
                            <span>Supprimer</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            ) : (
              <motion.div
                key="requests"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {pendingRequests.length === 0 ? (
                  <div className="bg-white rounded-2xl border-2 border-gray-200 p-16 text-center">
                    <div className="text-7xl mb-4">📭</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Aucune demande en attente</h2>
                    <p className="text-gray-600">Les nouvelles demandes apparaîtront ici</p>
                  </div>
                ) : (
                  pendingRequests.map((request, index) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white rounded-2xl border-2 border-amber-200 shadow-lg hover:shadow-2xl transition-all duration-300 p-6"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-1">{request.land.title}</h3>
                              <p className="text-sm text-gray-600">{request.land.location} • {request.land.targetAmount} ha</p>
                            </div>
                            <span className="bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-bold">
                              ⏳ En attente
                            </span>
                          </div>

                          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                            <p className="text-xs text-blue-600 font-semibold uppercase mb-2">Demandeur</p>
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                {request.investor.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900">{request.investor.name}</p>
                                <p className="text-sm text-gray-600">{request.investor.email}</p>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                              <p className="text-xs text-emerald-600 font-semibold mb-1">Montant Proposé</p>
                              <p className="text-2xl font-bold text-emerald-700">{request.amount} TND</p>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                              <p className="text-xs text-purple-600 font-semibold mb-1">Durée</p>
                              <p className="text-2xl font-bold text-purple-700">{request.customDurationMonths || '-'} mois</p>
                            </div>
                          </div>

                          <div className="text-sm text-gray-600">
                            Demandé le {new Date(request.investedAt).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <button
                            onClick={() => handleApprove(request.id)}
                            disabled={actionLoading === request.id}
                            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-bold hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span>✓</span>
                            <span>{actionLoading === request.id ? 'Traitement...' : 'Accepter'}</span>
                          </button>
                          <button
                            onClick={() => handleReject(request.id)}
                            disabled={actionLoading === request.id}
                            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-bold hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span>✗</span>
                            <span>{actionLoading === request.id ? 'Traitement...' : 'Refuser'}</span>
                          </button>
                          <Link
                            href={`/investments/${request.land.id}`}
                            className="w-full flex items-center justify-center gap-2 px-6 py-4 border-2 border-blue-600 text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-all duration-300"
                          >
                            <span>👁️</span>
                            <span>Voir la Terre</span>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </>
  );
}
