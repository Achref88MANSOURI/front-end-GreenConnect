/* eslint-disable @typescript-eslint/no-explicit-any */
// app/carriers/[id]/edit/page.tsx
'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { API_BASE_URL } from '@/src/api-config';
import { 
  Truck, ArrowLeft, Save, Package, Mail, 
  Phone, DollarSign, AlertCircle, CheckCircle,
  Loader2
} from 'lucide-react';

interface CarrierForm {
  companyName: string;
  vehicleType: string;
  capacity_kg: number;
  pricePerKm: number;
  pricePerTonne?: number;
  contactEmail: string;
  contactPhone?: string;
  status: string;
}

export default function EditCarrierPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  const [form, setForm] = useState<CarrierForm>({
    companyName: '',
    vehicleType: 'Camion',
    capacity_kg: 5000,
    pricePerKm: 1.5,
    pricePerTonne: undefined,
    contactEmail: '',
    contactPhone: '',
    status: 'Active',
  });

  const vehicleTypes = [
    'Camion',
    'Camionnette',
    'Pickup',
    'Remorque',
    'Tracteur',
    'Semi-remorque',
    'Fourgon',
  ];

  useEffect(() => {
    // Get current user
    let currentUserId: number | null = null;
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const u = JSON.parse(stored);
        if (u && typeof u.id === 'number') currentUserId = u.id;
      }
    } catch (_) {
      currentUserId = null;
    }

    // Fetch carrier details
    fetch(`${API_BASE_URL}/carriers/${id}`)
      .then(res => {
        if (res.ok) return res.json();
        if (res.status === 404) throw new Error('Transporteur non trouvé');
        throw new Error('Échec du chargement');
      })
      .then(data => {
        // Check ownership
        if (data.userId !== currentUserId) {
          setError('Vous n\'êtes pas autorisé à modifier ce transporteur');
          setIsOwner(false);
        } else {
          setIsOwner(true);
          setForm({
            companyName: data.companyName || '',
            vehicleType: data.vehicleType || 'Camion',
            capacity_kg: data.capacity_kg || 5000,
            pricePerKm: data.pricePerKm || 1.5,
            pricePerTonne: data.pricePerTonne || undefined,
            contactEmail: data.contactEmail || '',
            contactPhone: data.contactPhone || '',
            status: data.status || 'Active',
          });
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/carriers/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Échec de la mise à jour');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/carriers/${id}`);
      }, 1500);
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-20">
          <div className="max-w-3xl mx-auto px-4">
            <div className="flex justify-center items-center py-32">
              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full animate-ping opacity-20"></div>
                  <div className="absolute inset-2 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full animate-pulse"></div>
                  <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                    <Truck className="w-8 h-8 text-orange-600 animate-pulse" />
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

  if (!isOwner) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-20">
          <div className="max-w-3xl mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Accès refusé</h2>
              <p className="text-gray-600 mb-8">{error || 'Vous ne pouvez pas modifier ce transporteur.'}</p>
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
        <section className="relative overflow-hidden text-white pt-24 pb-32 px-4">
          <div className="absolute inset-0">
            <img 
              src="/images/1.jpg" 
              alt="Transport Background" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-orange-900/90 via-amber-800/85 to-orange-900/90"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20"></div>
          </div>

          <div className="relative max-w-3xl mx-auto z-10">
            <Link 
              href={`/carriers/${id}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all mb-8"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour aux détails
            </Link>

            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-xl border border-white/30 mb-6">
                <Truck className="w-5 h-5 text-orange-300" />
                <span className="text-sm font-bold">Modifier mon camion</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-4">
                <span className="block text-white drop-shadow-2xl">Modifier</span>
                <span className="block bg-gradient-to-r from-yellow-300 via-orange-300 to-amber-400 bg-clip-text text-transparent">
                  Mon Transporteur
                </span>
              </h1>
              <p className="text-lg text-orange-100/90">
                Mettez à jour les informations de votre véhicule
              </p>
            </div>
          </div>

          {/* Wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" className="w-full h-16 fill-slate-50">
              <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,69.3C960,85,1056,107,1152,106.7C1248,107,1344,85,1392,74.7L1440,64L1440,120L0,120Z"></path>
            </svg>
          </div>
        </section>

        {/* Form Section */}
        <div className="max-w-3xl mx-auto px-4 -mt-12 relative z-20 pb-20">
          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 flex items-center gap-3">
              <CheckCircle className="w-5 h-5" />
              <p className="font-semibold">Modifications enregistrées! Redirection en cours...</p>
            </div>
          )}

          {/* Error Message */}
          {error && !success && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Company Info Section */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Informations du véhicule</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom de l&apos;entreprise *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={form.companyName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-gray-900"
                    placeholder="Ex: Transport Express Tunisie"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Type de véhicule *
                  </label>
                  <select
                    name="vehicleType"
                    value={form.vehicleType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-gray-900"
                  >
                    {vehicleTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Package className="w-4 h-4 inline mr-1" />
                    Capacité (kg) *
                  </label>
                  <input
                    type="number"
                    name="capacity_kg"
                    value={form.capacity_kg}
                    onChange={handleChange}
                    required
                    min="100"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-gray-900"
                    placeholder="5000"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {(form.capacity_kg / 1000).toFixed(2)} tonnes
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Statut *
                  </label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-gray-900"
                  >
                    <option value="Active">Disponible</option>
                    <option value="Inactive">Indisponible</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="p-6 border-b border-gray-100 bg-orange-50/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Tarification</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Prix par kilomètre (TND) *
                  </label>
                  <input
                    type="number"
                    name="pricePerKm"
                    value={form.pricePerKm}
                    onChange={handleChange}
                    required
                    min="0.1"
                    step="0.1"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-gray-900"
                    placeholder="1.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Prix par tonne (TND) <span className="text-gray-400">(optionnel)</span>
                  </label>
                  <input
                    type="number"
                    name="pricePerTonne"
                    value={form.pricePerTonne || ''}
                    onChange={handleChange}
                    min="0"
                    step="0.5"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-gray-900"
                    placeholder="50"
                  />
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Informations de contact</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email de contact *
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={form.contactEmail}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900"
                    placeholder="contact@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Téléphone <span className="text-gray-400">(optionnel)</span>
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={form.contactPhone || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900"
                    placeholder="+216 XX XXX XXX"
                  />
                </div>
              </div>
            </div>

            {/* Submit Section */}
            <div className="p-6 bg-gray-50/50 flex flex-col sm:flex-row gap-4">
              <Link
                href={`/carriers/${id}`}
                className="flex-1 px-6 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all text-center"
              >
                Annuler
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl font-bold hover:from-orange-600 hover:to-amber-700 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Enregistrer les modifications
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
