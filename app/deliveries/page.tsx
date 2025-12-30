/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useToast } from '../components/ToastProvider';
import { API_BASE_URL } from '../../src/api-config';
import { 
  Package, Truck, Calendar, MapPin, ArrowRight, 
  CheckCircle, XCircle, Clock, AlertCircle, Eye,
  Inbox, Send, Plus, Sparkles, Users, TrendingUp, Loader2
} from 'lucide-react';

interface DeliveryItem {
  id: number;
  goodsType: string;
  weight_kg: number;
  pickupAddress: string;
  deliveryAddress: string;
  desiredDeliveryDate: string;
  totalCost: number;
  status: string;
  userId: number;
  carrier?: {
    id: number;
    companyName: string;
    vehicleType: string;
    userId: number;
  };
  user?: {
    id: number;
    name: string;
    email: string;
  };
  createdAt?: string;
}

type TabType = 'my-bookings' | 'received-requests';

function DeliveriesContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  
  const [activeTab, setActiveTab] = useState<TabType>(
    tabParam === 'received' ? 'received-requests' : 'my-bookings'
  );
  const [myBookings, setMyBookings] = useState<DeliveryItem[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<DeliveryItem[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [confirmingId, setConfirmingId] = useState<number | null>(null);
  const { addToast } = useToast();

  // Update tab when URL param changes
  useEffect(() => {
    if (tabParam === 'received') {
      setActiveTab('received-requests');
    }
  }, [tabParam]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Vous devez être connecté.');
      setLoadingBookings(false);
      setLoadingRequests(false);
      return;
    }

    // Fetch my bookings
    fetch(`${API_BASE_URL}/deliveries/mine`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : Promise.reject('Erreur de chargement'))
      .then(data => {
        setMyBookings(data);
        setLoadingBookings(false);
      })
      .catch(() => setLoadingBookings(false));

    // Fetch received requests (for carrier owners)
    fetch(`${API_BASE_URL}/deliveries/received`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : Promise.reject('Erreur'))
      .then(data => {
        setReceivedRequests(data);
        setLoadingRequests(false);
      })
      .catch(() => setLoadingRequests(false));
  }, []);

  const handleAccept = async (deliveryId: number) => {
    setActionLoading(deliveryId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/deliveries/${deliveryId}/accept`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Échec');
      setReceivedRequests(prev => 
        prev.map(d => d.id === deliveryId ? { ...d, status: 'ACCEPTED' } : d)
      );
    } catch (err) {
      setError('Échec de l\'acceptation');
    }
    setActionLoading(null);
  };

  const handleReject = async (deliveryId: number) => {
    setActionLoading(deliveryId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/deliveries/${deliveryId}/reject`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Échec');
      setReceivedRequests(prev => 
        prev.map(d => d.id === deliveryId ? { ...d, status: 'REJECTED' } : d)
      );
    } catch (err) {
      setError('Échec du refus');
    }
    setActionLoading(null);
  };

  const handleCancel = async (deliveryId: number) => {
    if (confirmingId !== deliveryId) {
      setConfirmingId(deliveryId);
      addToast('Cliquez encore pour annuler cette réservation', 'info');
      setTimeout(() => setConfirmingId(prev => (prev === deliveryId ? null : prev)), 2500);
      return;
    }
    setActionLoading(deliveryId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/deliveries/${deliveryId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Échec');
      setMyBookings(prev => prev.filter(d => d.id !== deliveryId));
      addToast('Réservation annulée avec succès', 'success');
    } catch (err) {
      setError('Échec de l\'annulation');
      addToast('Échec de l\'annulation', 'error');
    }
    setActionLoading(null);
    setConfirmingId(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">
            <Clock className="w-3.5 h-3.5" />
            En Attente
          </span>
        );
      case 'ACCEPTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
            <CheckCircle className="w-3.5 h-3.5" />
            Acceptée
          </span>
        );
      case 'IN_TRANSIT':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
            <Truck className="w-3.5 h-3.5" />
            En Transit
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5" />
            Livrée
          </span>
        );
      case 'CANCELED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
            <XCircle className="w-3.5 h-3.5" />
            Annulée
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
            <XCircle className="w-3.5 h-3.5" />
            Refusée
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
            {status}
          </span>
        );
    }
  };

  const pendingRequests = receivedRequests.filter(d => d.status === 'PENDING');
  const confirmedBookings = myBookings.filter(d => d.status === 'ACCEPTED' || d.status === 'IN_TRANSIT');

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-green-50/30">
        {/* ========== HERO SECTION ========== */}
        <section className="relative overflow-hidden text-white pt-24 pb-32 px-4">
          <div className="absolute inset-0">
            <img 
              src="/images/1.jpg" 
              alt="Deliveries Background" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/90 via-emerald-800/85 to-teal-900/90"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20"></div>
          </div>
          
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-10 w-4 h-4 bg-green-400/60 rounded-full animate-pulse"></div>
            <div className="absolute top-40 right-20 w-3 h-3 bg-emerald-300/50 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>

          <div className="relative max-w-7xl mx-auto z-10">
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/15 backdrop-blur-xl border border-white/30">
                <Package className="w-5 h-5 text-green-300" />
                <span className="text-sm font-bold text-white">Gestion des Livraisons</span>
                <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
              </div>
            </div>

            <div className="text-center mb-10">
              <h1 className="text-5xl md:text-6xl font-black mb-6">
                <span className="block text-white drop-shadow-2xl">Mes</span>
                <span className="block bg-gradient-to-r from-green-300 via-emerald-300 to-teal-400 bg-clip-text text-transparent">
                  Livraisons
                </span>
              </h1>
              <p className="text-xl text-green-100/90 max-w-2xl mx-auto">
                Gérez vos réservations et les demandes reçues en un seul endroit
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { icon: Send, value: myBookings.length.toString(), label: 'Mes Réservations', color: 'from-green-400 to-emerald-500' },
                { icon: Inbox, value: receivedRequests.length.toString(), label: 'Demandes Reçues', color: 'from-blue-400 to-cyan-500' },
                { icon: Clock, value: pendingRequests.length.toString(), label: 'En Attente', color: 'from-yellow-400 to-orange-500' },
                { icon: CheckCircle, value: confirmedBookings.length.toString(), label: 'Confirmées', color: 'from-emerald-400 to-teal-500' },
              ].map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 text-center hover:bg-white/20 transition-all">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                  <p className="text-sm text-green-200">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" className="w-full h-20 fill-slate-50">
              <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,69.3C960,85,1056,107,1152,106.7C1248,107,1344,85,1392,74.7L1440,64L1440,120L0,120Z"></path>
            </svg>
          </div>
        </section>

        {/* ========== MAIN CONTENT ========== */}
        <div className="max-w-6xl mx-auto px-4 -mt-16 relative z-20 pb-20">
          {/* Quick Action */}
          <div className="mb-10">
            <Link href="/carriers" className="group relative overflow-hidden bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 block">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                    <Truck className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Nouvelle Réservation</h3>
                    <p className="text-green-100">Parcourir et choisir un transporteur</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline-block px-4 py-2 bg-white/20 backdrop-blur rounded-xl text-sm font-semibold">
                    Voir les transporteurs
                  </span>
                  <ArrowRight className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
              <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="flex border-b border-gray-100">
              <button
                onClick={() => setActiveTab('my-bookings')}
                className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 font-semibold transition-all ${
                  activeTab === 'my-bookings'
                    ? 'bg-green-50 text-green-700 border-b-2 border-green-500'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Send className="w-5 h-5" />
                Mes Réservations
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === 'my-bookings' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {myBookings.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('received-requests')}
                className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 font-semibold transition-all ${
                  activeTab === 'received-requests'
                    ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Inbox className="w-5 h-5" />
                Demandes Reçues
                {pendingRequests.length > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white animate-pulse">
                    {pendingRequests.length}
                  </span>
                )}
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* MY BOOKINGS TAB */}
              {activeTab === 'my-bookings' && (
                <div>
                  {loadingBookings ? (
                    <div className="flex justify-center py-12">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 relative">
                          <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
                          <div className="absolute inset-2 bg-green-600 rounded-full animate-pulse flex items-center justify-center">
                            <Package className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <p className="text-gray-600">Chargement...</p>
                      </div>
                    </div>
                  ) : myBookings.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                        <Send className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Aucune réservation</h3>
                      <p className="text-gray-600 mb-6">Vous n&apos;avez pas encore fait de réservation de transport.</p>
                      <Link
                        href="/deliveries/book"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all"
                      >
                        <Plus className="w-5 h-5" />
                        Faire une réservation
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {myBookings.map((delivery) => (
                        <div 
                          key={delivery.id} 
                          className="group bg-white border-2 border-gray-100 rounded-xl p-5 hover:border-green-200 hover:shadow-lg transition-all"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <span className="text-sm font-mono text-gray-500">#{delivery.id}</span>
                                {getStatusBadge(delivery.status)}
                              </div>
                              
                              <h4 className="text-lg font-bold text-gray-900 mb-2">
                                {delivery.goodsType} • {delivery.weight_kg} kg
                              </h4>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-green-500" />
                                  <span className="truncate">De: {delivery.pickupAddress}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-red-500" />
                                  <span className="truncate">Vers: {delivery.deliveryAddress}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-blue-500" />
                                  <span>{new Date(delivery.desiredDeliveryDate).toLocaleDateString('fr-FR')}</span>
                                </div>
                                {delivery.carrier && (
                                  <div className="flex items-center gap-2">
                                    <Truck className="w-4 h-4 text-orange-500" />
                                    <span>{delivery.carrier.companyName}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-3">
                              <div className="text-2xl font-black text-green-600">
                                {Number(delivery.totalCost).toFixed(2)} TND
                              </div>
                              
                              <div className="flex gap-2">
                                <Link
                                  href={`/deliveries/${delivery.id}`}
                                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all flex items-center gap-1 text-sm"
                                >
                                  <Eye className="w-4 h-4" />
                                  Détails
                                </Link>
                                {delivery.status === 'PENDING' && (
                                  <button
                                    onClick={() => handleCancel(delivery.id)}
                                    disabled={actionLoading === delivery.id}
                                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition-all flex items-center gap-1 text-sm disabled:opacity-50"
                                  >
                                    <XCircle className="w-4 h-4" />
                                    Annuler
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* RECEIVED REQUESTS TAB */}
              {activeTab === 'received-requests' && (
                <div>
                  {loadingRequests ? (
                    <div className="flex justify-center py-12">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 relative">
                          <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
                          <div className="absolute inset-2 bg-blue-600 rounded-full animate-pulse flex items-center justify-center">
                            <Inbox className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <p className="text-gray-600">Chargement...</p>
                      </div>
                    </div>
                  ) : receivedRequests.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                        <Inbox className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Aucune demande reçue</h3>
                      <p className="text-gray-600 mb-6">
                        Vous n&apos;avez pas encore reçu de demandes de réservation.
                        <br />Assurez-vous d&apos;avoir enregistré un transporteur.
                      </p>
                      <Link
                        href="/carriers/register"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl font-bold hover:from-orange-600 hover:to-amber-700 transition-all"
                      >
                        <Truck className="w-5 h-5" />
                        Ajouter un camion
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {receivedRequests.map((request) => (
                        <div 
                          key={request.id} 
                          className={`group bg-white border-2 rounded-xl p-5 transition-all ${
                            request.status === 'PENDING' 
                              ? 'border-yellow-200 bg-yellow-50/30 hover:border-yellow-300' 
                              : 'border-gray-100 hover:border-gray-200'
                          }`}
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <span className="text-sm font-mono text-gray-500">#{request.id}</span>
                                {getStatusBadge(request.status)}
                                {request.status === 'PENDING' && (
                                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold animate-pulse">
                                    ⏳ Action requise
                                  </span>
                                )}
                              </div>
                              
                              <h4 className="text-lg font-bold text-gray-900 mb-2">
                                {request.goodsType} • {request.weight_kg} kg
                              </h4>
                              
                              {request.user && (
                                <div className="flex items-center gap-3 mb-3 px-3 py-2 bg-blue-50 rounded-lg w-fit">
                                  <Users className="w-4 h-4 text-blue-600" />
                                  <span className="text-sm font-semibold text-blue-700">Client: {request.user.name}</span>
                                  <span className="text-sm text-blue-600">• {request.user.email}</span>
                                </div>
                              )}
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-green-500" />
                                  <span className="truncate">De: {request.pickupAddress}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-red-500" />
                                  <span className="truncate">Vers: {request.deliveryAddress}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-blue-500" />
                                  <span>{new Date(request.desiredDeliveryDate).toLocaleDateString('fr-FR')}</span>
                                </div>
                                {request.carrier && (
                                  <div className="flex items-center gap-2">
                                    <Truck className="w-4 h-4 text-orange-500" />
                                    <span>{request.carrier.companyName}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-3">
                              <div className="text-2xl font-black text-green-600">
                                {Number(request.totalCost).toFixed(2)} TND
                              </div>
                              
                              {request.status === 'PENDING' ? (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleAccept(request.id)}
                                    disabled={actionLoading === request.id}
                                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all flex items-center gap-1 text-sm disabled:opacity-50"
                                  >
                                    {actionLoading === request.id ? (
                                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                      <CheckCircle className="w-4 h-4" />
                                    )}
                                    Accepter
                                  </button>
                                  <button
                                    onClick={() => handleReject(request.id)}
                                    disabled={actionLoading === request.id}
                                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition-all flex items-center gap-1 text-sm disabled:opacity-50"
                                  >
                                    <XCircle className="w-4 h-4" />
                                    Refuser
                                  </button>
                                </div>
                              ) : (
                                <Link
                                  href={`/deliveries/${request.id}`}
                                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all flex items-center gap-1 text-sm"
                                >
                                  <Eye className="w-4 h-4" />
                                  Voir détails
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 py-20 px-4">
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>

          <div className="relative max-w-4xl mx-auto text-center z-10">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
              Besoin d&apos;un <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Transport</span>?
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              Trouvez le transporteur idéal pour vos marchandises agricoles.
            </p>
            <Link
              href="/carriers"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
            >
              <Truck className="w-5 h-5" />
              Voir les Transporteurs
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default function MyDeliveriesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    }>
      <DeliveriesContent />
    </Suspense>
  );
}