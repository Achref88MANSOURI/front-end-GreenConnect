/* eslint-disable @typescript-eslint/no-explicit-any */
// app/carriers/page.tsx
'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { API_BASE_URL } from '@/src/api-config';
import { 
  Truck, Plus, Star, Package, Users, 
  ChevronRight, Sparkles, Search, Eye, Calendar,
  CheckCircle, XCircle, ArrowRight
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
  userId: number;
  user?: {
    id: number;
    name: string;
  };
}

export default function CarriersPage() {
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showOnlyMine, setShowOnlyMine] = useState(false);

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

    // Fetch carriers
    fetch(`${API_BASE_URL}/carriers`)
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Échec du chargement des transporteurs');
      })
      .then(data => {
        setCarriers(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredCarriers = carriers.filter(carrier => {
    const matchesSearch = carrier.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          carrier.vehicleType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || carrier.vehicleType === filterType;
    const matchesMine = !showOnlyMine || carrier.userId === currentUserId;
    return matchesSearch && matchesType && matchesMine;
  });

  const myCarriers = carriers.filter(c => c.userId === currentUserId);
  const otherCarriers = filteredCarriers.filter(c => c.userId !== currentUserId);
  const vehicleTypes = [...new Set(carriers.map(c => c.vehicleType))];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-orange-50/30">
        {/* ========== HERO SECTION ========== */}
        <section className="relative overflow-hidden text-white pt-24 pb-32 px-4">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src="/images/1.jpg" 
              alt="Transport Background" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-orange-900/90 via-amber-800/85 to-orange-900/90"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20"></div>
          </div>
          
          {/* Animated Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-10 w-4 h-4 bg-orange-400/60 rounded-full animate-pulse"></div>
            <div className="absolute top-40 right-20 w-3 h-3 bg-amber-300/50 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-32 left-1/3 w-5 h-5 bg-yellow-200/40 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
          </div>

          <div className="relative max-w-7xl mx-auto z-10">
            {/* Badge */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/15 backdrop-blur-xl border border-white/30">
                <Truck className="w-5 h-5 text-orange-300" />
                <span className="text-sm font-bold text-white">Tawssel - Transport Agricole</span>
                <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-10">
              <h1 className="text-5xl md:text-7xl font-black mb-6">
                <span className="block text-white drop-shadow-2xl">Transporteurs</span>
                <span className="block bg-gradient-to-r from-yellow-300 via-orange-300 to-amber-400 bg-clip-text text-transparent">
                  Disponibles
                </span>
              </h1>
              <p className="text-xl text-orange-100/90 max-w-2xl mx-auto">
                Trouvez le transporteur idéal pour vos marchandises agricoles
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { icon: Truck, value: carriers.length.toString(), label: 'Transporteurs', color: 'from-orange-400 to-amber-500' },
                { icon: Users, value: '500+', label: 'Clients Satisfaits', color: 'from-blue-400 to-cyan-500' },
                { icon: Package, value: '10K+', label: 'Livraisons', color: 'from-green-400 to-emerald-500' },
                { icon: Star, value: '4.8', label: 'Note Moyenne', color: 'from-yellow-400 to-orange-500' },
              ].map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 text-center hover:bg-white/20 transition-all">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                  <p className="text-sm text-orange-200">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" className="w-full h-20 fill-slate-50">
              <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,69.3C960,85,1056,107,1152,106.7C1248,107,1344,85,1392,74.7L1440,64L1440,120L0,120Z"></path>
            </svg>
          </div>
        </section>

        {/* ========== MAIN CONTENT ========== */}
        <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20 pb-20">
          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-4 mb-10">
            <Link href="/carriers/register" className="group relative overflow-hidden bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                  <Plus className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Ajouter un Camion</h3>
                  <p className="text-orange-100 text-sm">Devenez transporteur</p>
                </div>
                <ArrowRight className="w-6 h-6 ml-auto opacity-0 group-hover:opacity-100 transition-all" />
              </div>
            </Link>

            <Link href="/deliveries" className="group relative overflow-hidden bg-white rounded-2xl p-6 border-2 border-orange-100 shadow-lg hover:shadow-xl hover:border-orange-300 transition-all hover:-translate-y-1">
              <div className="relative flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center">
                  <Package className="w-7 h-7 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Mes Livraisons</h3>
                  <p className="text-gray-600 text-sm">Suivre mes réservations</p>
                </div>
                <ArrowRight className="w-6 h-6 ml-auto text-orange-600 opacity-0 group-hover:opacity-100 transition-all" />
              </div>
            </Link>

          </div>

          {/* Error State */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3">
              <XCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <div className="flex flex-wrap items-center gap-4">
              {/* Search */}
              <div className="relative flex-1 min-w-[250px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un transporteur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                />
              </div>

              {/* Vehicle Type Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
              >
                <option value="all">Tous les types</option>
                {vehicleTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              {/* My Carriers Toggle */}
              {currentUserId && (
                <button
                  onClick={() => setShowOnlyMine(!showOnlyMine)}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                    showOnlyMine 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                  }`}
                >
                  <Truck className="w-5 h-5" />
                  Mes Camions ({myCarriers.length})
                </button>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full animate-ping opacity-20"></div>
                  <div className="absolute inset-2 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full animate-pulse"></div>
                  <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                    <Truck className="w-8 h-8 text-orange-600 animate-pulse" />
                  </div>
                </div>
                <p className="text-lg font-semibold text-gray-700">Chargement des transporteurs...</p>
              </div>
            </div>
          ) : (
            <>
              {/* My Carriers Section */}
              {currentUserId && myCarriers.length > 0 && !showOnlyMine && (
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
                      <Truck className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Mes Camions</h2>
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                      {myCarriers.length}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myCarriers.map(carrier => (
                      <CarrierCard key={carrier.id} carrier={carrier} isOwner={true} />
                    ))}
                  </div>
                </div>
              )}

              {/* All/Other Carriers */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {showOnlyMine ? 'Mes Camions' : 'Transporteurs Disponibles'}
                  </h2>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                    {showOnlyMine ? myCarriers.length : otherCarriers.length}
                  </span>
                </div>

                {(showOnlyMine ? myCarriers : otherCarriers).length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                      <Truck className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Aucun transporteur trouvé</h3>
                    <p className="text-gray-600 mb-6">
                      {showOnlyMine 
                        ? "Vous n'avez pas encore ajouté de camion." 
                        : "Aucun transporteur ne correspond à vos critères."}
                    </p>
                    {showOnlyMine && (
                      <Link
                        href="/carriers/register"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl font-bold hover:from-orange-600 hover:to-amber-700 transition-all"
                      >
                        <Plus className="w-5 h-5" />
                        Ajouter mon premier camion
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(showOnlyMine ? myCarriers : otherCarriers).map(carrier => (
                      <CarrierCard 
                        key={carrier.id} 
                        carrier={carrier} 
                        isOwner={carrier.userId === currentUserId}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* CTA Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 py-24 px-4">
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>

          <div className="relative max-w-4xl mx-auto text-center z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-semibold text-white/90">Rejoignez +500 transporteurs</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Prêt à <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">Développer</span> Votre Activité?
            </h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Inscrivez votre camion et commencez à recevoir des demandes de transport dès aujourd&apos;hui.
            </p>

            <div className="flex justify-center">
              <Link
                href="/carriers/register"
                className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl font-bold hover:from-orange-600 hover:to-amber-700 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Devenir Transporteur
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

// Carrier Card Component
function CarrierCard({ carrier, isOwner }: { carrier: Carrier; isOwner: boolean }) {
  return (
    <div className="group relative">
      {/* Glow Effect */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${isOwner ? 'from-orange-400 via-amber-500 to-orange-400' : 'from-green-400 via-emerald-500 to-teal-400'} rounded-2xl blur-lg opacity-0 group-hover:opacity-40 transition-all duration-500`}></div>
      
      <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden">
        {/* Header with gradient */}
        <div className={`h-32 bg-gradient-to-br ${isOwner ? 'from-orange-500 to-amber-600' : 'from-green-600 to-emerald-700'} flex items-center justify-center text-white relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="text-center relative z-10">
            <div className="text-5xl mb-2">🚚</div>
            <div className="text-sm font-semibold">{carrier.vehicleType}</div>
          </div>
          
          {/* Owner Badge */}
          {isOwner && (
            <div className="absolute top-3 left-3 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Mon Camion
            </div>
          )}
          
          {/* Status Badge */}
          <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
            carrier.status === 'Active' 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {carrier.status === 'Active' ? (
              <>
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                Disponible
              </>
            ) : 'Indisponible'}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">{carrier.companyName}</h3>
          
          {carrier.user && (
            <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
              <Users className="w-4 h-4" />
              {carrier.user.name}
            </p>
          )}

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Capacité</span>
              <span className="font-semibold text-gray-900">{(carrier.capacity_kg / 1000).toFixed(1)} tonnes</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Prix/km</span>
              <span className="font-bold text-orange-600">{carrier.pricePerKm} TND</span>
            </div>
            {carrier.pricePerTonne && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Prix/tonne</span>
                <span className="font-semibold text-gray-900">{carrier.pricePerTonne} TND</span>
              </div>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4 p-2 bg-yellow-50 rounded-lg">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <span className="font-bold text-gray-900">{Number(carrier.averageRating).toFixed(1)}</span>
            <span className="text-sm text-gray-600">({carrier.totalReviews} avis)</span>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Link
              href={`/carriers/${carrier.id}`}
              className="flex-1 text-center py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 hover:border-orange-400 hover:bg-orange-50 transition-all text-sm font-semibold flex items-center justify-center gap-1"
            >
              <Eye className="w-4 h-4" />
              Détails
            </Link>
            
            {!isOwner && carrier.status === 'Active' && (
              <Link
                href={`/deliveries/book?carrierId=${carrier.id}`}
                className="flex-1 text-center py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all text-sm font-semibold"
              >
                Réserver
              </Link>
            )}
            
            {isOwner && (
              <Link
                href={`/carriers/${carrier.id}/edit`}
                className="flex-1 text-center py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:from-orange-600 hover:to-amber-700 transition-all text-sm font-semibold"
              >
                Gérer
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
