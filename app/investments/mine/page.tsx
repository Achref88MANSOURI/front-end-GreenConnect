'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { API_BASE_URL } from '@/src/api-config';
import { useToast } from '../../components/ToastProvider';

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
  const [success, setSuccess] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [confirmingCancelId, setConfirmingCancelId] = useState<number | null>(null);
  const { addToast } = useToast();

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

  const handleRemoveLease = async (leaseId: number, status: string) => {
    if (confirmingCancelId !== leaseId) {
      setConfirmingCancelId(leaseId);
      addToast(status === 'ACTIVE' ? 'Cliquez à nouveau pour annuler la demande' : 'Cliquez à nouveau pour supprimer cette entrée', 'info');
      setTimeout(() => setConfirmingCancelId(prev => (prev === leaseId ? null : prev)), 2500);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Vous devez être connecté');
      return;
    }

    setActionLoading(leaseId);
    try {
      const response = await fetch(`${API_BASE_URL}/investments/leases/${leaseId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      await fetchMyInvestments(token);
      const msg = status === 'ACTIVE' ? 'Demande annulée avec succès' : 'Entrée supprimée de vos locations';
      setSuccess(msg);
      addToast(msg, 'success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    } finally {
      setActionLoading(null);
      setConfirmingCancelId(null);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-br from-teal-50 via-green-50 to-emerald-50 flex items-center justify-center">
          <div className="text-teal-600 text-xl animate-pulse">Chargement...</div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="relative min-h-screen bg-gradient-to-br from-teal-50 via-green-50 to-emerald-50 pt-24 pb-16 overflow-hidden">
        {/* Animated Background Patterns */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
            className="absolute -top-40 -right-40 w-80 h-80 bg-teal-200/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200/10 rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4">
          {/* Premium Header */}
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <button
              onClick={() => router.back()}
              className="mb-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/80 text-teal-700 font-semibold border border-teal-200 hover:bg-white hover:shadow-lg transition-all duration-300"
            >
              <motion.span animate={{ x: [0, -4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>←</motion.span>
              <span>Retour</span>
            </button>

            <div className="flex items-end gap-6 mb-12">
              <motion.div
                animate={{ y: [0, -12, 0], rotate: [0, 8, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="text-7xl drop-shadow-lg"
              >
                🚜
              </motion.div>
              <div className="flex-1">
                <h1 className="text-6xl font-black bg-gradient-to-r from-teal-700 via-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">
                  Mes Locations
                </h1>
                <p className="text-lg text-teal-600/70 font-medium">Suivez vos terres en location et vos récoltes</p>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <motion.div whileHover={{ y: -4 }} className="bg-white/90 backdrop-blur rounded-2xl p-5 shadow-lg border border-teal-100">
                <p className="text-sm text-teal-600/70 font-bold mb-2">🌾 Total</p>
                <p className="text-4xl font-black text-teal-700">{investments.length}</p>
              </motion.div>
              <motion.div whileHover={{ y: -4 }} className="bg-white/90 backdrop-blur rounded-2xl p-5 shadow-lg border border-emerald-100">
                <p className="text-sm text-emerald-600/70 font-bold mb-2">✓ Approuvées</p>
                <p className="text-4xl font-black text-emerald-700">{investments.filter(inv => inv.status === 'APPROVED').length}</p>
              </motion.div>
              <motion.div whileHover={{ y: -4 }} className="bg-white/90 backdrop-blur rounded-2xl p-5 shadow-lg border border-amber-100">
                <p className="text-sm text-amber-600/70 font-bold mb-2">⏳ En attente</p>
                <p className="text-4xl font-black text-amber-700">{investments.filter(inv => inv.status === 'ACTIVE').length}</p>
              </motion.div>
              <motion.div whileHover={{ y: -4 }} className="bg-white/90 backdrop-blur rounded-2xl p-5 shadow-lg border border-red-100">
                <p className="text-sm text-red-600/70 font-bold mb-2">✗ Refusées</p>
                <p className="text-4xl font-black text-red-700">{investments.filter(inv => inv.status === 'REJECTED').length}</p>
              </motion.div>
              <motion.div whileHover={{ y: -4 }} className="bg-white/90 backdrop-blur rounded-2xl p-5 shadow-lg border border-cyan-100">
                <p className="text-sm text-cyan-600/70 font-bold mb-2">💰 Estimé</p>
                <p className="text-4xl font-black text-cyan-700">{investments.reduce((sum, inv) => sum + inv.amount, 0)}</p>
                <p className="text-xs text-cyan-600">TND</p>
              </motion.div>
            </div>
          </motion.div>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 p-5 bg-red-100 border-l-4 border-red-500 rounded-2xl text-red-700 shadow-lg">
              <p className="font-bold">⚠️ {error}</p>
            </motion.div>
          )}

          {success && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 p-5 bg-green-100 border-l-4 border-green-500 rounded-2xl text-green-700 shadow-lg">
              <p className="font-bold">✓ {success}</p>
            </motion.div>
          )}

          {investments.length === 0 ? (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white/95 backdrop-blur rounded-3xl p-20 text-center shadow-2xl">
              <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 2.5, repeat: Infinity }} className="text-9xl mb-8">🌱</motion.div>
              <h2 className="text-4xl font-black text-teal-900 mb-4">Aucune location active</h2>
              <p className="text-teal-600/70 mb-10 text-lg">Explorez les terres disponibles et débutez votre aventure agricole!</p>
              <Link
                href="/investments"
                className="inline-flex items-center gap-3 px-12 py-4 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-lg rounded-2xl shadow-xl hover:scale-105 transition-all"
              >
                <span>🔍</span>
                <span>Découvrir les Terres</span>
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {/* Timeline View */}
              <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-300 via-emerald-300 to-green-300 hidden md:block" />

                <div className="space-y-8">
                  {investments.map((investment, index) => (
                    <motion.div
                      key={investment.id}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="md:pl-32"
                    >
                      {/* Timeline Dot */}
                      <div className="absolute left-0 top-6 w-14 h-14 md:left-0 md:w-14 md:h-14 hidden md:flex items-center justify-center">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-bold shadow-lg border-4 border-white"
                        >
                          {index + 1}
                        </motion.div>
                      </div>

                      {/* Card */}
                      <motion.div
                        whileHover={{ y: -6 }}
                        className="group bg-white/95 backdrop-blur rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden border border-teal-200/50 transition-all duration-300"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 p-7">
                          {/* Image */}
                          <div className="md:col-span-2 rounded-2xl overflow-hidden h-48 bg-gradient-to-br from-teal-100 to-emerald-100 relative group/img shadow-md">
                            {investment.project.images && investment.project.images.length > 0 ? (
                              <Image
                                src={investment.project.images[0]?.startsWith('http') ? investment.project.images[0] : `${API_BASE_URL}${investment.project.images[0]}`}
                                alt={investment.project.title}
                                fill
                                className="object-cover group-hover/img:scale-110 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-teal-300/30 text-6xl">🌾</div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity" />
                          </div>

                          {/* Main Content */}
                          <div className="md:col-span-3 space-y-4 flex flex-col justify-between">
                            <div>
                              <h3 className="text-2xl font-black text-teal-900 mb-2 group-hover:text-emerald-700 transition-colors">
                                {investment.project.title}
                              </h3>
                              <p className="text-teal-600/60 text-sm mb-4 line-clamp-2">{investment.project.description}</p>

                              <div className="flex flex-wrap gap-3 mb-4">
                                <span className="inline-flex items-center gap-1.5 bg-teal-100 text-teal-700 px-3 py-1.5 rounded-full text-xs font-bold border border-teal-300">
                                  📍 {investment.project.location}
                                </span>
                                <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-300">
                                  🏞️ {investment.project.targetAmount} ha
                                </span>
                              </div>

                              {/* Owner Card */}
                              <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-3 border border-teal-200">
                                <p className="text-xs text-teal-600/70 font-bold mb-2">👤 Propriétaire</p>
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                                    {investment.project.owner.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-xs font-bold text-teal-900 truncate">{investment.project.owner.name}</p>
                                    <p className="text-xs text-teal-600/50 truncate">{investment.project.owner.email}</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-3 gap-2">
                              <div className="bg-gradient-to-br from-orange-100 to-amber-100 border border-orange-300 rounded-lg p-3">
                                <p className="text-xs text-orange-700 font-bold">💰</p>
                                <p className="text-lg font-black text-orange-700">{investment.amount}</p>
                                <p className="text-xs text-orange-600">TND/mois</p>
                              </div>
                              <div className="bg-gradient-to-br from-blue-100 to-cyan-100 border border-blue-300 rounded-lg p-3">
                                <p className="text-xs text-blue-700 font-bold">⏱️</p>
                                <p className="text-lg font-black text-blue-700">{investment.customDurationMonths || '-'}</p>
                                <p className="text-xs text-blue-600">mois</p>
                              </div>
                              <div className={`rounded-lg p-3 text-center flex flex-col items-center justify-center border font-bold ${
                                investment.status === 'APPROVED'
                                  ? 'bg-emerald-100/80 border-emerald-400 text-emerald-800 shadow-md shadow-emerald-200'
                                  : investment.status === 'ACTIVE'
                                  ? 'bg-amber-100/80 border-amber-400 text-amber-800 shadow-md shadow-amber-200'
                                  : investment.status === 'REJECTED'
                                  ? 'bg-red-100/80 border-red-400 text-red-800 shadow-md shadow-red-200'
                                  : 'bg-gray-100/80 border-gray-400 text-gray-800 shadow-md shadow-gray-200'
                              }`}>
                                <span className="text-lg">{investment.status === 'APPROVED' ? '✓' : 
                                 investment.status === 'ACTIVE' ? '⏳' : 
                                 investment.status === 'REJECTED' ? '✗' : '?'}</span>
                                <span className="text-xs leading-tight mt-1">{investment.status === 'APPROVED' ? 'Acceptée' : 
                                 investment.status === 'ACTIVE' ? 'En attente' : 
                                 investment.status === 'REJECTED' ? 'Refusée' : investment.status}</span>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <Link
                                href={`/investments/${investment.project.id}`}
                                className="flex-1 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-lg font-bold text-sm text-center transition-all shadow-md"
                              >
                                Voir Détails
                              </Link>
                              {['ACTIVE', 'APPROVED', 'REJECTED'].includes(investment.status) && (
                                <button
                                  onClick={() => handleRemoveLease(investment.id, investment.status)}
                                  disabled={actionLoading === investment.id}
                                  className={`px-4 py-2 text-white rounded-lg font-bold text-sm transition-all shadow-md ${
                                    investment.status === 'ACTIVE'
                                      ? 'bg-red-500 hover:bg-red-600 disabled:bg-gray-400'
                                      : 'bg-slate-600 hover:bg-slate-700 disabled:bg-gray-400'
                                  }`}
                                >
                                  {actionLoading === investment.id ? '...' : investment.status === 'ACTIVE' ? '✗ Annuler' : '🗑️ Supprimer'}
                                </button>
                              )}
                              <div className="text-xs text-teal-600/60 py-2 px-3 bg-teal-50 rounded-lg border border-teal-200 whitespace-nowrap">
                                📅 {new Date(investment.investedAt).toLocaleDateString('fr-FR')}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
