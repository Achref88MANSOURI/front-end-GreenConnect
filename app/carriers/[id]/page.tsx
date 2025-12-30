/* eslint-disable @typescript-eslint/no-explicit-any */
// app/carriers/[id]/page.tsx
'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { API_BASE_URL } from '@/src/api-config';
import { 
  Truck, Star, Package, MapPin, Phone, Mail, ArrowLeft,
  Edit2, Trash2, Calendar, Clock, CheckCircle, XCircle,
  AlertCircle, Users, Shield, Award, TrendingUp
} from 'lucide-react';

interface Carrier {
  id: number;
  companyName: string;
  vehicleType: string;
  capacity_kg: number;
  pricePerKm: number;
  pricePerTonne?: number;
  averageRating: number;
  totalReviews: number;
  status: string;
  contactEmail: string;
  contactPhone?: string;
  userId: number;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export default function CarrierDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [carrier, setCarrier] = useState<Carrier | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    // Get current user
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const u = JSON.parse(stored);
        if (u && typeof u.id === 'number') setCurrentUserId(u.id);
      }
    } catch (_) {
      setCurrentUserId(null);
    }

    // Fetch carrier details
    fetch(`${API_BASE_URL}/carriers/${id}`)
      .then(res => {
        if (res.ok) return res.json();
        if (res.status === 404) throw new Error('Transporteur non trouvé');
        throw new Error('Échec du chargement');
      })
      .then(data => {
        setCarrier(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const isOwner = carrier && currentUserId && carrier.userId === currentUserId;

  const handleDelete = async () => {
    if (!carrier) return;
    setDeleting(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/carriers/${carrier.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Échec de la suppression');
      }

      router.push('/carriers');
    } catch (err: any) {
      setError(err.message);
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-20">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex justify-center items-center py-32">
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full animate-ping opacity-20"></div>
                  <div className="absolute inset-2 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full animate-pulse"></div>
                  <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                    <Truck className="w-10 h-10 text-orange-600 animate-pulse" />
                  </div>
                </div>
                <p className="text-lg font-semibold text-gray-700">Chargement des détails...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !carrier) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-20">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{error || 'Transporteur non trouvé'}</h2>
              <p className="text-gray-600 mb-8">Le transporteur demandé n&apos;existe pas ou a été supprimé.</p>
              <Link
                href="/carriers"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl font-bold hover:from-orange-600 hover:to-amber-700 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                Retour aux transporteurs
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-orange-50/30">
        {/* Hero Section */}
        <section className="relative overflow-hidden text-white pt-24 pb-40 px-4">
          <div className="absolute inset-0">
            <img 
              src="/images/1.jpg" 
              alt="Transport Background" 
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 ${isOwner 
              ? 'bg-gradient-to-br from-orange-900/90 via-amber-800/85 to-orange-900/90' 
              : 'bg-gradient-to-br from-green-900/90 via-emerald-800/85 to-teal-900/90'
            }`}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20"></div>
          </div>

          <div className="relative max-w-5xl mx-auto z-10">
            {/* Back Button */}
            <Link 
              href="/carriers" 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all mb-8"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour aux transporteurs
            </Link>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Left: Image/Icon */}
              <div className="md:col-span-1">
                <div className={`aspect-square rounded-3xl bg-gradient-to-br ${isOwner ? 'from-orange-400 to-amber-500' : 'from-green-400 to-emerald-500'} flex items-center justify-center shadow-2xl border-4 border-white/20`}>
                  <div className="text-center">
                    <div className="text-9xl mb-4">🚚</div>
                    <span className="text-2xl font-bold text-white/90">{carrier.vehicleType}</span>
                  </div>
                </div>

                {/* Owner Actions */}
                {isOwner && (
                  <div className="mt-6 space-y-3">
                    <Link
                      href={`/carriers/${carrier.id}/edit`}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white text-orange-600 rounded-xl font-bold hover:bg-orange-50 transition-all shadow-lg"
                    >
                      <Edit2 className="w-5 h-5" />
                      Modifier mon camion
                    </Link>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-500/20 backdrop-blur-md border border-red-400/30 text-white rounded-xl font-bold hover:bg-red-500/30 transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                      Supprimer
                    </button>
                  </div>
                )}
              </div>

              {/* Right: Details */}
              <div className="md:col-span-2">
                {/* Badges */}
                <div className="flex flex-wrap gap-3 mb-4">
                  {isOwner && (
                    <div className="px-4 py-2 bg-orange-500/30 backdrop-blur-md border border-orange-400/30 rounded-full text-sm font-bold flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Mon Camion
                    </div>
                  )}
                  <div className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${
                    carrier.status === 'Active' 
                      ? 'bg-green-500/30 backdrop-blur-md border border-green-400/30' 
                      : 'bg-gray-500/30 backdrop-blur-md border border-gray-400/30'
                  }`}>
                    {carrier.status === 'Active' ? (
                      <>
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        Disponible
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4" />
                        Indisponible
                      </>
                    )}
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-black mb-4">{carrier.companyName}</h1>
                
                {carrier.user && (
                  <p className="text-xl text-white/80 mb-6 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Propriétaire: {carrier.user.name}
                  </p>
                )}

                {/* Rating */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/30 backdrop-blur-md rounded-xl border border-yellow-400/30">
                    <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                    <span className="text-2xl font-black">{Number(carrier.averageRating).toFixed(1)}</span>
                  </div>
                  <span className="text-lg text-white/80">({carrier.totalReviews} avis clients)</span>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <Package className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm text-white/70">Capacité</p>
                        <p className="text-2xl font-bold">{(carrier.capacity_kg / 1000).toFixed(1)} T</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm text-white/70">Prix/km</p>
                        <p className="text-2xl font-bold">{carrier.pricePerKm} TND</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" className="w-full h-20 fill-slate-50">
              <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,69.3C960,85,1056,107,1152,106.7C1248,107,1344,85,1392,74.7L1440,64L1440,120L0,120Z"></path>
            </svg>
          </div>
        </section>

        {/* Detail Cards */}
        <div className="max-w-5xl mx-auto px-4 -mt-20 relative z-20 pb-20">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Pricing Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Tarification</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-orange-600" />
                    <span className="text-gray-700">Prix par kilomètre</span>
                  </div>
                  <span className="text-2xl font-bold text-orange-600">{carrier.pricePerKm} TND</span>
                </div>
                
                {carrier.pricePerTonne && (
                  <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-amber-600" />
                      <span className="text-gray-700">Prix par tonne</span>
                    </div>
                    <span className="text-2xl font-bold text-amber-600">{carrier.pricePerTonne} TND</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Capacité maximale</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{(carrier.capacity_kg / 1000).toFixed(1)} tonnes</span>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Contact</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-gray-900">{carrier.contactEmail}</p>
                  </div>
                </div>
                
                {carrier.contactPhone && (
                  <div className="flex items-center gap-4 p-4 bg-cyan-50 rounded-xl">
                    <Phone className="w-5 h-5 text-cyan-600" />
                    <div>
                      <p className="text-sm text-gray-600">Téléphone</p>
                      <p className="font-semibold text-gray-900">{carrier.contactPhone}</p>
                    </div>
                  </div>
                )}

                {carrier.user && (
                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <Users className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-600">Propriétaire</p>
                        <p className="font-semibold text-gray-900">{carrier.user.name}</p>
                      </div>
                    </div>
                    <Link
                      href={`/users/${carrier.userId}`}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all text-sm"
                    >
                      <Users className="w-4 h-4" />
                      Voir profil
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Book Now CTA (only for non-owners) */}
          {!isOwner && carrier.status === 'Active' && (
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-8 text-white">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Prêt à réserver ce transporteur?</h3>
                  <p className="text-green-100">Réservez maintenant et recevez une confirmation instantanée.</p>
                </div>
                <Link
                  href={`/deliveries/book?carrierId=${carrier.id}`}
                  className="flex items-center gap-2 px-8 py-4 bg-white text-green-600 rounded-xl font-bold hover:bg-green-50 transition-all shadow-lg whitespace-nowrap"
                >
                  <Calendar className="w-5 h-5" />
                  Réserver Maintenant
                </Link>
              </div>
            </div>
          )}

          {/* Owner: Manage Requests Link */}
          {isOwner && (
            <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl shadow-xl p-8 text-white">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Gérer les demandes de réservation</h3>
                  <p className="text-orange-100">Consultez et répondez aux demandes des clients.</p>
                </div>
                <Link
                  href="/deliveries/received"
                  className="flex items-center gap-2 px-8 py-4 bg-white text-orange-600 rounded-xl font-bold hover:bg-orange-50 transition-all shadow-lg whitespace-nowrap"
                >
                  <Package className="w-5 h-5" />
                  Voir les demandes
                </Link>
              </div>
            </div>
          )}

          {/* Metadata */}
          {carrier.createdAt && (
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Ajouté le {new Date(carrier.createdAt).toLocaleDateString('fr-FR')}
              </div>
            </div>
          )}
        </div>

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
              <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-3">Supprimer ce camion?</h3>
              <p className="text-gray-600 text-center mb-8">
                Cette action est irréversible. Toutes les réservations associées seront annulées.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Suppression...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5" />
                      Supprimer
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
