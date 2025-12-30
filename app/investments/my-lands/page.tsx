
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { API_BASE_URL } from '@/src/api-config';
import { motion } from 'framer-motion';
import { useToast } from '../../components/ToastProvider';

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
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<number | null>(null);
  const [leaseStatusMap, setLeaseStatusMap] = useState<Record<number, string>>({});
  const { addToast } = useToast();

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

      // Toast new requests or status changes for owners
      const nextMap: Record<number, string> = {};
      data.forEach((land: Land) => {
        land.investments?.forEach((inv: LeaseRequest) => {
          nextMap[inv.id] = inv.status;

          const prevStatus = leaseStatusMap[inv.id];
          const investorName = inv.investor?.name || 'Un investisseur';

          if (!prevStatus) {
            if (inv.status === 'ACTIVE') {
              addToast(`${investorName} a demandé à louer ${land.title}`, 'info');
            }
          } else if (prevStatus !== inv.status) {
            if (inv.status === 'APPROVED') {
              addToast(`Demande approuvée pour ${land.title}`, 'success');
            } else if (inv.status === 'REJECTED') {
              addToast(`Demande refusée pour ${land.title}`, 'info');
            } else if (inv.status === 'ACTIVE') {
              addToast(`Demande réouverte pour ${land.title}`, 'info');
            }
          }
        });
      });
      setLeaseStatusMap(nextMap);
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
      addToast('Demande acceptée', 'success');
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
      addToast('Demande refusée', 'info');
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
    if (confirmingDeleteId !== landId) {
      setConfirmingDeleteId(landId);
      addToast('Cliquez à nouveau pour confirmer la suppression', 'info');
      setTimeout(() => setConfirmingDeleteId(prev => (prev === landId ? null : prev)), 2500);
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
      addToast('Terre supprimée avec succès', 'success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    } finally {
      setActionLoading(null);
      setConfirmingDeleteId(null);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 flex items-center justify-center">
          <div className="text-purple-300 text-xl animate-pulse">Chargement...</div>
        </main>
        <Footer />
      </>
    );
  }

  const totalPending = lands.reduce((sum, land) => sum + land.investments.filter(inv => inv.status === 'ACTIVE').length, 0);
  const totalApproved = lands.reduce((sum, land) => sum + land.investments.filter(inv => inv.status === 'APPROVED').length, 0);
  const totalArea = lands.reduce((sum, land) => sum + land.targetAmount, 0);

  return (
    <>
      <Header />
      <main className="relative min-h-screen bg-gradient-to-br from-amber-50 via-green-50 to-emerald-50 pt-24 pb-16 overflow-hidden">
        {/* Agricultural Animated Background - Nature Inspired */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 right-0 w-96 h-96 bg-green-300/15 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ rotate: -360, scale: [1, 1.05, 1] }}
            transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-0 left-0 w-96 h-96 bg-amber-300/15 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ y: [0, 40, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 right-1/3 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl"
          />
        </div>

        {/* Retour Button - Fixed Position */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          onClick={() => router.back()}
          className="fixed left-4 top-24 md:left-6 md:top-24 z-40 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/90 backdrop-blur-md text-amber-800 font-semibold border border-amber-300/60 hover:bg-white hover:border-amber-500/80 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <motion.span animate={{ x: [0, -4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>←</motion.span>
          <span>Retour</span>
        </motion.button>

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          {/* Premium Header */}
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-14"
          >
            <div className="flex items-end justify-between mb-10">
              <div className="flex items-end gap-6">
                <motion.div
                  animate={{ y: [0, -15, 0], rotate: [0, 8, -8, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="text-7xl drop-shadow-lg"
                >
                  🌾
                </motion.div>
                <div>
                  <h1 className="text-7xl font-black bg-gradient-to-r from-amber-700 via-green-700 to-emerald-800 bg-clip-text text-transparent mb-1">
                    Mes Terres
                  </h1>
                  <p className="text-lg text-green-700/70 font-medium">Cultivez votre portefeuille agricole et gérez vos récoltes</p>
                </div>
              </div>
              <Link
                href="/investments/create"
                className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-amber-600 via-yellow-500 to-green-600 hover:from-amber-700 hover:via-yellow-600 hover:to-green-700 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-amber-400/50 transition-all duration-300 hover:scale-105 group"
              >
                <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-2xl">🌱</motion.span>
                <span>Ajouter Terre</span>
              </Link>
            </div>

            {/* Agricultural Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              {/* Total Lands */}
              <motion.div 
                whileHover={{ y: -6, boxShadow: '0 20px 50px rgba(120, 53, 15, 0.2)' }}
                className="group bg-gradient-to-br from-amber-600/30 to-amber-700/20 backdrop-blur-xl border border-amber-500/40 rounded-2xl p-6 shadow-lg hover:border-amber-500/70 transition-all"
              >
                <p className="text-sm text-amber-800 font-bold mb-2">🏞️ Terres Totales</p>
                <div className="flex items-end justify-between">
                  <p className="text-5xl font-black text-amber-900">{lands.length}</p>
                  <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-2xl">📊</motion.div>
                </div>
                <div className="mt-3 h-1 bg-amber-700/30 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '80%' }} transition={{ duration: 1.5 }} className="h-full bg-gradient-to-r from-amber-500 to-yellow-500" />
                </div>
              </motion.div>

              {/* Active Requests */}
              <motion.div 
                whileHover={{ y: -6, boxShadow: '0 20px 50px rgba(220, 38, 38, 0.2)' }}
                className="group bg-gradient-to-br from-red-500/20 to-red-600/10 backdrop-blur-xl border border-red-500/40 rounded-2xl p-6 shadow-lg hover:border-red-500/70 transition-all"
              >
                <p className="text-sm text-red-800 font-bold mb-2">🔔 Demandes Actives</p>
                <div className="flex items-end justify-between">
                  <p className="text-5xl font-black text-red-700">{totalPending}</p>
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-2xl">🌾</motion.div>
                </div>
                <div className="mt-3 h-1 bg-red-700/30 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '60%' }} transition={{ duration: 1.5, delay: 0.2 }} className="h-full bg-gradient-to-r from-red-500 to-orange-500" />
                </div>
              </motion.div>

              {/* Approved */}
              <motion.div 
                whileHover={{ y: -6, boxShadow: '0 20px 50px rgba(34, 197, 94, 0.2)' }}
                className="group bg-gradient-to-br from-green-600/30 to-emerald-700/20 backdrop-blur-xl border border-green-500/40 rounded-2xl p-6 shadow-lg hover:border-green-500/70 transition-all"
              >
                <p className="text-sm text-green-800 font-bold mb-2">✓ Approuvées</p>
                <div className="flex items-end justify-between">
                  <p className="text-5xl font-black text-green-700">{totalApproved}</p>
                  <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-2xl">✨</motion.div>
                </div>
                <div className="mt-3 h-1 bg-green-700/30 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '75%' }} transition={{ duration: 1.5, delay: 0.4 }} className="h-full bg-gradient-to-r from-green-500 to-emerald-500" />
                </div>
              </motion.div>

              {/* Total Area */}
              <motion.div 
                whileHover={{ y: -6, boxShadow: '0 20px 50px rgba(120, 53, 15, 0.2)' }}
                className="group bg-gradient-to-br from-yellow-600/30 to-amber-700/20 backdrop-blur-xl border border-yellow-500/40 rounded-2xl p-6 shadow-lg hover:border-yellow-500/70 transition-all"
              >
                <p className="text-sm text-yellow-800 font-bold mb-2">🌻 Surface Totale</p>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-5xl font-black text-yellow-800">{totalArea}</p>
                    <p className="text-xs text-yellow-700/70 mt-1 font-bold">hectares</p>
                  </div>
                  <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="text-2xl">🌾</motion.div>
                </div>
                <div className="mt-3 h-1 bg-yellow-700/30 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '70%' }} transition={{ duration: 1.5, delay: 0.6 }} className="h-full bg-gradient-to-r from-yellow-500 to-amber-500" />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 p-5 bg-red-100 border-l-4 border-red-500 rounded-2xl text-red-700 shadow-lg">
              <p className="font-bold">⚠️ {error}</p>
            </motion.div>
          )}

          {success && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 p-5 bg-green-100 border-l-4 border-green-600 rounded-2xl text-green-700 shadow-lg">
              <p className="font-bold">✓ {success}</p>
            </motion.div>
          )}

          {lands.length === 0 ? (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white/95 backdrop-blur rounded-3xl p-20 text-center shadow-2xl border border-green-200">
              <motion.div animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }} transition={{ duration: 2.5, repeat: Infinity }} className="text-9xl mb-8">🌱</motion.div>
              <h2 className="text-4xl font-black text-amber-900 mb-4">Aucune terre publiée</h2>
              <p className="text-green-700/70 mb-10 text-lg">Commencez à cultiver votre portefeuille dès maintenant!</p>
              <Link
                href="/investments/create"
                className="inline-flex items-center gap-3 px-12 py-4 bg-gradient-to-r from-amber-600 to-green-600 hover:from-amber-700 hover:to-green-700 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-amber-400/50 transition-all hover:scale-105"
              >
                <span>🌾</span>
                <span>Publier une Terre</span>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {lands.map((land, index) => (
                <motion.div
                  key={land.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -8, boxShadow: '0 30px 60px rgba(180, 83, 9, 0.2)' }}
                  className="group relative h-full bg-gradient-to-br from-white/95 via-amber-50/90 to-green-50/90 backdrop-blur-xl border border-amber-200/80 rounded-3xl shadow-xl overflow-hidden transition-all duration-300 hover:border-green-300/80"
                >
                  {/* Gradient Overlay - Nature Inspired */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-200/0 via-transparent to-green-300/0 group-hover:from-amber-200/5 group-hover:to-green-300/5 transition-all duration-300" />

                  {/* Image Section */}
                  <div className="relative h-56 overflow-hidden bg-gradient-to-br from-amber-200 to-green-200 group-hover:scale-105 transition-transform duration-500">
                    {land.images && land.images.length > 0 ? (
                      <Image
                        src={land.images[0]?.startsWith('http') ? land.images[0] : `${API_BASE_URL}${land.images[0]}`}
                        alt={land.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-green-300/30 text-6xl">🌾</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent" />
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <motion.div whileHover={{ scale: 1.1 }} className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold backdrop-blur-md border shadow-lg ${
                        land.status === 'available'
                          ? 'bg-green-600/90 text-white border-green-500'
                          : land.status === 'reserved'
                          ? 'bg-amber-600/90 text-white border-amber-500'
                          : 'bg-yellow-600/90 text-white border-yellow-500'
                      }`}>
                        <span>{land.status === 'available' ? '✓' : land.status === 'reserved' ? '⏳' : '🌾'}</span>
                        <span>{land.status === 'available' ? 'Disponible' : land.status === 'reserved' ? 'Réservée' : 'Louée'}</span>
                      </motion.div>
                    </div>

                    {/* Quick Info Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                      <motion.div whileHover={{ scale: 1.05 }} className={`backdrop-blur-md rounded-lg px-3 py-2 text-xs font-bold border shadow-md transition-all ${
                        land.investments.filter(inv => inv.status === 'ACTIVE').length > 0
                          ? 'bg-amber-100/90 text-amber-800 border-amber-300'
                          : 'bg-white/90 text-slate-800 border-slate-200'
                      }`}>
                        📋 {land.investments.filter(inv => inv.status === 'ACTIVE').length} demandes
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} className={`backdrop-blur-md rounded-lg px-3 py-2 text-xs font-bold border shadow-md transition-all ${
                        land.investments.filter(inv => inv.status === 'APPROVED').length > 0
                          ? 'bg-green-100/90 text-green-800 border-green-300'
                          : 'bg-white/90 text-slate-800 border-slate-200'
                      }`}>
                        ✓ {land.investments.filter(inv => inv.status === 'APPROVED').length} acceptées
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} className="bg-white/90 backdrop-blur-md rounded-lg px-3 py-2 text-xs font-bold text-green-800 border border-green-300/60 shadow-md">
                        📐 {land.targetAmount} ha
                      </motion.div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="relative z-10 p-6 space-y-4">
                    <div>
                      <h3 className="text-2xl font-black text-amber-900 mb-2 group-hover:text-green-700 transition-colors">
                        {land.title}
                      </h3>
                      <p className="text-green-700/60 text-sm line-clamp-2">{land.description}</p>
                    </div>

                    {/* Location & Price */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 bg-gradient-to-r from-amber-100 to-yellow-100 backdrop-blur px-4 py-2.5 rounded-xl border border-amber-300/60 group-hover:border-amber-400/80 transition-all">
                        <span className="text-lg">📍</span>
                        <span className="text-amber-900 font-medium text-sm">{land.location}</span>
                      </div>
                      <div className="flex items-center gap-3 bg-gradient-to-r from-green-100 to-emerald-100 backdrop-blur px-4 py-2.5 rounded-xl border border-green-400/60">
                        <span className="text-lg">💰</span>
                        <span className="text-green-800 font-black text-sm">{land.currentAmount} TND/mois</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-3 gap-2 pt-3">
                      <Link
                        href={`/investments/${land.id}`}
                        className="py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl text-xs font-bold text-center transition-all shadow-md hover:shadow-green-500/50"
                      >
                        Voir
                      </Link>
                      <button
                        onClick={() => handleEdit(land.id)}
                        disabled={actionLoading !== null}
                        className="py-2.5 border-2 border-amber-600 text-amber-700 hover:bg-amber-100/50 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(land.id)}
                        disabled={actionLoading !== null}
                        className="py-2.5 border-2 border-red-500 text-red-600 hover:bg-red-100/50 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                      >
                        Supprimer
                      </button>
                    </div>

                    {/* Lease Requests */}
                    {land.investments && land.investments.length > 0 && (
                      <motion.div initial={false} className="pt-4 border-t border-green-200">
                        <button className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-xl border border-green-300/60 transition-all group/expand">
                          <div className="flex items-center gap-2">
                            <span>📋</span>
                            <span className="text-amber-900 font-bold text-sm">Demandes ({land.investments.length})</span>
                          </div>
                          <motion.span animate={{ rotate: 0 }} className="text-green-700">▼</motion.span>
                        </button>
                        <div className="mt-3 space-y-2 max-h-96 overflow-y-auto">
                          {land.investments.map(request => (
                            <motion.div
                              key={request.id}
                              whileHover={{ x: 4 }}
                              className={`backdrop-blur border rounded-lg p-3 hover:shadow-md transition-all ${
                                request.status === 'ACTIVE'
                                  ? 'bg-gradient-to-r from-amber-100/70 to-orange-100/70 border-amber-300/70'
                                  : request.status === 'APPROVED'
                                  ? 'bg-gradient-to-r from-green-100/70 to-emerald-100/70 border-green-300/70'
                                  : 'bg-gradient-to-r from-red-100/70 to-pink-100/70 border-red-300/70'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${
                                    request.status === 'ACTIVE'
                                      ? 'bg-gradient-to-br from-amber-500 to-orange-600'
                                      : request.status === 'APPROVED'
                                      ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                                      : 'bg-gradient-to-br from-red-500 to-pink-600'
                                  }`}>
                                    {request.investor?.name?.charAt(0).toUpperCase() || 'L'}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-amber-900 text-xs font-bold truncate">{request.investor?.name ?? 'Locataire'}</p>
                                    <p className="text-amber-700/60 text-xs truncate">{request.investor?.email ?? ''}</p>
                                  </div>
                                </div>
                                {request.status === 'ACTIVE' ? (
                                  <div className="flex gap-2 shrink-0">
                                    <button
                                      onClick={() => handleApprove(request.id)}
                                      disabled={actionLoading === request.id}
                                      className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition-all disabled:opacity-50 shadow-md hover:shadow-green-500/40"
                                    >
                                      {actionLoading === request.id ? '...' : '✓ Accepter'}
                                    </button>
                                    <button
                                      onClick={() => handleReject(request.id)}
                                      disabled={actionLoading === request.id}
                                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-all disabled:opacity-50 shadow-md hover:shadow-red-500/40"
                                    >
                                      {actionLoading === request.id ? '...' : '✗ Refuser'}
                                    </button>
                                  </div>
                                ) : (
                                  <span className={`text-xs font-bold px-3 py-1.5 rounded-lg shrink-0 border ${
                                    request.status === 'APPROVED'
                                      ? 'bg-green-600/20 text-green-800 border-green-400'
                                      : 'bg-red-600/20 text-red-800 border-red-400'
                                  }`}>
                                    {request.status === 'APPROVED' ? '✓ Acceptée' : '✗ Refusée'}
                                  </span>
                                )}
                              </div>
                              <div className="grid grid-cols-3 gap-2 text-amber-800/70 text-xs">
                                <p>💰 {request.amount} TND</p>
                                <p>⏱️ {request.customDurationMonths || '?'} mois</p>
                                <p>📅 {new Date(request.investedAt).toLocaleDateString('fr-FR')}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
