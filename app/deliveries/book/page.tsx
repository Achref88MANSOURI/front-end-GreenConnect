/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { API_BASE_URL } from '../../../src/api-config';
import {
  Package, Truck, MapPin, Calendar, ArrowLeft, Star,
  ChevronRight, Sparkles, CheckCircle, AlertCircle, Loader2,
  Scale, Box, Navigation
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
  user?: {
    id: number;
    name: string;
  };
}

function BookDeliveryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const carrierId = searchParams.get('carrierId');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [carrier, setCarrier] = useState<Carrier | null>(null);

  const [formData, setFormData] = useState({
    goodsType: '',
    weight_kg: '',
    pickupAddress: '',
    deliveryAddress: '',
    desiredDeliveryDate: '',
  });

  // Load carrier info - carrierId is REQUIRED
  useEffect(() => {
    if (!carrierId) {
      setError('Veuillez sélectionner un transporteur depuis la liste des transporteurs.');
      setLoading(false);
      return;
    }

    fetch(`${API_BASE_URL}/carriers/${carrierId}`)
      .then(res => {
        if (!res.ok) throw new Error('Transporteur non trouvé');
        return res.json();
      })
      .then(data => {
        if (data.status !== 'Active') {
          setError('Ce transporteur n\'est pas disponible actuellement.');
        } else {
          setCarrier(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Erreur lors du chargement du transporteur');
        setLoading(false);
      });
  }, [carrierId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!carrier) {
      setError('Aucun transporteur sélectionné');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Vous devez être connecté pour réserver un transport');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const payload = {
        goodsType: formData.goodsType,
        weight_kg: parseFloat(formData.weight_kg),
        pickupAddress: formData.pickupAddress,
        deliveryAddress: formData.deliveryAddress,
        desiredDeliveryDate: formData.desiredDeliveryDate,
        carrierId: carrier.id,
      };

      const res = await fetch(`${API_BASE_URL}/deliveries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Erreur lors de la réservation');
      }

      const delivery = await res.json();
      setSuccess(true);
      setTimeout(() => {
        router.push(`/deliveries/${delivery.id}`);
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-20">
          <div className="max-w-3xl mx-auto px-4">
            <div className="flex justify-center items-center py-32">
              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-ping opacity-20"></div>
                  <div className="absolute inset-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full animate-pulse"></div>
                  <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                    <Truck className="w-8 h-8 text-green-600 animate-pulse" />
                  </div>
                </div>
                <p className="text-lg font-semibold text-gray-700">Chargement...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // No carrier selected - redirect to carriers page
  if (!carrier && !loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-20">
          <div className="max-w-3xl mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-orange-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Sélectionnez un transporteur</h2>
              <p className="text-gray-600 mb-8">
                {error || 'Pour réserver un transport, veuillez d\'abord choisir un transporteur depuis la liste.'}
              </p>
              <Link
                href="/carriers"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all"
              >
                <Truck className="w-5 h-5" />
                Voir les transporteurs disponibles
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
      <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-green-50/30">
        {/* Hero Section */}
        <section className="relative overflow-hidden text-white pt-24 pb-32 px-4">
          <div className="absolute inset-0">
            <img 
              src="/images/1.jpg" 
              alt="Delivery Background" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/90 via-emerald-800/85 to-teal-900/90"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20"></div>
          </div>

          <div className="relative max-w-4xl mx-auto z-10">
            <Link 
              href="/carriers" 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all mb-8"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour aux transporteurs
            </Link>

            <div className="text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/15 backdrop-blur-xl border border-white/30 mb-6">
                <Package className="w-5 h-5 text-green-300" />
                <span className="text-sm font-bold text-white">Nouvelle Réservation</span>
                <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
              </div>

              <h1 className="text-4xl md:text-5xl font-black mb-4">
                <span className="block text-white drop-shadow-2xl">Réserver</span>
                <span className="block bg-gradient-to-r from-green-300 via-emerald-300 to-teal-400 bg-clip-text text-transparent">
                  ce Transport
                </span>
              </h1>
              <p className="text-lg text-green-100/90 max-w-xl mx-auto">
                Complétez les détails de votre livraison
              </p>
            </div>

            {/* Progress Steps */}
            <div className="flex justify-center mt-10">
              <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                {[
                  { num: 1, label: 'Transporteur', done: true },
                  { num: 2, label: 'Détails', done: !success },
                  { num: 3, label: 'Confirmé', done: success },
                ].map((s, i) => (
                  <React.Fragment key={s.num}>
                    <div className={`flex items-center gap-2 ${s.done ? 'text-white' : 'text-white/40'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        s.done && s.num < 3 ? 'bg-green-500' : s.done ? 'bg-white text-green-700' : 'bg-white/20'
                      }`}>
                        {s.done && s.num < (success ? 4 : 2) ? <CheckCircle className="w-5 h-5" /> : s.num}
                      </div>
                      <span className="text-sm font-semibold hidden sm:inline">{s.label}</span>
                    </div>
                    {i < 2 && <ChevronRight className="w-5 h-5 text-white/40" />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" className="w-full h-16 fill-slate-50">
              <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,69.3C960,85,1056,107,1152,106.7C1248,107,1344,85,1392,74.7L1440,64L1440,120L0,120Z"></path>
            </svg>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto px-4 -mt-12 relative z-20 pb-20">
          {/* Selected Carrier Info */}
          {carrier && (
            <div className="mb-6 p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-3xl shadow-lg">
                  🚚
                </div>
                <div className="flex-1">
                  <p className="text-sm text-green-600 font-semibold mb-1">Transporteur sélectionné</p>
                  <p className="text-xl font-bold text-gray-900">{carrier.companyName}</p>
                  <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      {carrier.vehicleType}
                    </span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold">{Number(carrier.averageRating).toFixed(1)}</span>
                    </div>
                    <span>•</span>
                    <span>{(carrier.capacity_kg / 1000).toFixed(1)}T max</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Prix/km</p>
                  <p className="text-2xl font-black text-green-600">{carrier.pricePerKm} TND</p>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-6 bg-green-50 border-2 border-green-200 rounded-xl text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-green-800 mb-2">Réservation envoyée!</h3>
              <p className="text-green-600">Votre demande a été envoyée au transporteur. Redirection...</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Booking Form */}
          {!success && carrier && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <form onSubmit={handleSubmit}>
                {/* Goods Details */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <Box className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Détails de la marchandise</h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Type de marchandise *
                      </label>
                      <input
                        type="text"
                        name="goodsType"
                        value={formData.goodsType}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                        placeholder="Fruits, Légumes, Céréales..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Scale className="w-4 h-4 inline mr-1" />
                        Poids total (kg) *
                      </label>
                      <input
                        type="number"
                        name="weight_kg"
                        value={formData.weight_kg}
                        onChange={handleChange}
                        required
                        min="1"
                        max={carrier.capacity_kg}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                        placeholder="500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Capacité max: {(carrier.capacity_kg / 1000).toFixed(1)} tonnes
                      </p>
                    </div>
                  </div>
                </div>

                {/* Route */}
                <div className="p-6 border-b border-gray-100 bg-green-50/30">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                      <Navigation className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Itinéraire</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <MapPin className="w-4 h-4 inline mr-1 text-green-500" />
                        Adresse de collecte *
                      </label>
                      <textarea
                        name="pickupAddress"
                        value={formData.pickupAddress}
                        onChange={handleChange}
                        required
                        rows={2}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                        placeholder="Rue, Ville, Gouvernorat"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <MapPin className="w-4 h-4 inline mr-1 text-red-500" />
                        Adresse de livraison *
                      </label>
                      <textarea
                        name="deliveryAddress"
                        value={formData.deliveryAddress}
                        onChange={handleChange}
                        required
                        rows={2}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                        placeholder="Rue, Ville, Gouvernorat"
                      />
                    </div>
                  </div>
                </div>

                {/* Date */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Date souhaitée</h2>
                  </div>

                  <input
                    type="date"
                    name="desiredDeliveryDate"
                    value={formData.desiredDeliveryDate}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                  />
                </div>

                {/* Submit */}
                <div className="p-6 bg-gray-50/50 flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/carriers"
                    className="flex-1 px-6 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all text-center"
                  >
                    Changer de transporteur
                  </Link>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Envoyer la demande
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function BookDeliveryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    }>
      <BookDeliveryContent />
    </Suspense>
  );
}
