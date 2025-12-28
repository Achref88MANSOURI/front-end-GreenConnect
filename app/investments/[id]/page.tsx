/* eslint-disable react/no-unescaped-entities */
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { API_BASE_URL } from '@/src/api-config';

interface Land {
  id: number;
  title: string;
  description: string;
  location: string;
  targetAmount: number;
  currentAmount: number;
  minimumInvestment: number;
  expectedROI: number;
  duration: number;
  fundingDeadline: string;
  images: string[];
  status: string;
  owner: {
    id: number;
    name: string;
    email: string;
    avatarUrl?: string;
  };
}

export default function LandDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [land, setLand] = useState<Land | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [leaseForm, setLeaseForm] = useState({
    seasonStartDate: '',
    customDurationMonths: '',
    farmingPlan: '',
  });
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const landId = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    const fetchLand = async () => {
      if (!landId) {
        setError('No land ID provided');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/investments/lands/${landId}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to load land details');
        }
        const data = await response.json();
        setLand(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading land');
      } finally {
        setLoading(false);
      }
    };

    // decode JWT to get current user id if logged in
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const payloadPart = token.split('.')[1];
        const decoded = JSON.parse(atob(payloadPart));
        if (decoded && typeof decoded.sub === 'number') {
          setCurrentUserId(decoded.sub);
        }
      }
    } catch {
      // ignore decode errors
    }

    fetchLand();
  }, [landId]);

  const handleLeaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/investments/lease-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectId: landId,
          seasonStartDate: leaseForm.seasonStartDate,
          customDurationMonths: parseInt(leaseForm.customDurationMonths),
          farmingPlan: leaseForm.farmingPlan,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit lease request');
      
      alert('Lease request submitted successfully!');
      setLeaseForm({ seasonStartDate: '', customDurationMonths: '', farmingPlan: '' });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error submitting lease request');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600"></div>
          <p className="mt-4 text-emerald-700 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !land) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <h1 className="text-2xl font-bold mb-2">Erreur</h1>
          <p>{error || 'Terre non trouvée'}</p>
        </div>
      </div>
    );
  }

  const areaHectares = land.targetAmount;
  const leasePrice = land.currentAmount;
  const minMonths = land.minimumInvestment;
  const maxMonths = land.expectedROI;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-emerald-700 font-semibold border-2 border-emerald-200 hover:bg-emerald-50 transition-all duration-300"
        >
          <span>←</span>
          <span>Retour</span>
        </button>

        {/* Image Gallery */}
        <div className="rounded-2xl overflow-hidden shadow-xl mb-8 h-96 bg-gradient-to-br from-emerald-200 to-teal-200 flex items-center justify-center">
          {land.images && land.images.length > 0 ? (
            <Image
              src={land.images[0]?.startsWith('http') ? land.images[0] : `${API_BASE_URL}${land.images[0]}`}
              alt={land.title}
              width={800}
              height={400}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-6xl">🌾</div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Main Content */}
          <div className="col-span-2">
            {/* Header */}
            <div className="bg-white rounded-2xl p-8 shadow-lg mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-900 via-green-800 to-teal-900 bg-clip-text text-transparent mb-2">
                    {land.title}
                  </h1>
                  <p className="text-lg text-emerald-700 font-medium">📍 {land.location}</p>
                </div>
                <div className={`px-4 py-2 rounded-full font-semibold text-white ${
                  land.status === 'available' ? 'bg-emerald-500' : 
                  land.status === 'reserved' ? 'bg-amber-500' :
                  'bg-gray-500'
                }`}>
                  {land.status === 'available' ? 'Disponible' : 
                   land.status === 'reserved' ? 'Réservé' : 'Indisponible'}
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{land.description}</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <p className="text-gray-600 text-sm font-medium mb-1">Surface</p>
                <p className="text-3xl font-bold text-emerald-700">{areaHectares} ha</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <p className="text-gray-600 text-sm font-medium mb-1">Prix Mensuel</p>
                <p className="text-3xl font-bold text-emerald-700">{leasePrice} TND</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <p className="text-gray-600 text-sm font-medium mb-1">Durée Min</p>
                <p className="text-3xl font-bold text-emerald-700">{minMonths} mois</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <p className="text-gray-600 text-sm font-medium mb-1">Durée Max</p>
                <p className="text-3xl font-bold text-emerald-700">{maxMonths} mois</p>
              </div>
            </div>

            {/* Characteristics */}
            <div className="bg-white rounded-2xl p-8 shadow-lg mb-6">
              <h2 className="text-2xl font-bold mb-6 text-emerald-900">Caractéristiques 🌱</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
                  <p className="text-emerald-700 font-semibold">💧 Accès à l'eau</p>
                  <p className="text-gray-600">Irrigation disponible</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
                  <p className="text-emerald-700 font-semibold">🌾 Type de sol</p>
                  <p className="text-gray-600">Fertile et bien drainé</p>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-emerald-900">Disponibilité 📅</h2>
              <p className="text-lg text-gray-700">
                <span className="font-semibold">Du</span> {land.availableFrom ? new Date(land.availableFrom).toLocaleDateString('fr-FR') : 'N/A'} 
                <span className="font-semibold ml-4">Au</span> {land.fundingDeadline ? new Date(land.fundingDeadline).toLocaleDateString('fr-FR') : 'N/A'}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-span-1">
            {/* Lease Form */}
            <div className="bg-white rounded-2xl p-8 shadow-lg sticky top-24 mb-6">
              <h3 className="text-xl font-bold mb-6 text-emerald-900">Demander une Location 🚜</h3>
              
              {land.status !== 'available' && (
                <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-amber-700 font-medium">
                    {land.status === 'reserved' ? '⏳ Cette terre est réservée' : '✓ Cette terre est louée'}
                  </p>
                </div>
              )}

              {currentUserId === land.owner.id && (
                <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <p className="text-emerald-800 font-medium">
                    C'est votre annonce. Les autres utilisateurs peuvent demander une location ici.
                  </p>
                </div>
              )}
              
              {currentUserId !== land.owner.id && land.status !== 'available' && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 font-medium">
                    Cette terre n'est pas disponible pour le moment.
                  </p>
                </div>
              )}

              {currentUserId !== land.owner.id && land.status === 'available' && (
              <form onSubmit={handleLeaseSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de Début
                  </label>
                  <input
                    type="date"
                    required
                    value={leaseForm.seasonStartDate}
                    onChange={(e) => setLeaseForm({ ...leaseForm, seasonStartDate: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-emerald-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Durée (mois)
                  </label>
                  <input
                    type="number"
                    required
                    min={minMonths}
                    max={maxMonths}
                    value={leaseForm.customDurationMonths}
                    onChange={(e) => setLeaseForm({ ...leaseForm, customDurationMonths: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-emerald-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plan d'Exploitation
                  </label>
                  <textarea
                    value={leaseForm.farmingPlan}
                    onChange={(e) => setLeaseForm({ ...leaseForm, farmingPlan: e.target.value })}
                    placeholder="Décrivez votre plan..."
                    className="w-full px-4 py-2 rounded-lg border border-emerald-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                    rows={4}
                  />
                </div>

                <button
                  type="submit"
                  disabled={land.status !== 'available'}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {land.status === 'available' ? 'Demander une Location' : 'Non disponible'}
                </button>
              </form>
              )}
            </div>

            {/* Owner Info */}
            <div className="bg-gradient-to-br from-emerald-600 to-green-600 rounded-2xl p-8 shadow-lg text-white">
              <h4 className="text-lg font-bold mb-4">Propriétaire 👨‍🌾</h4>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center font-bold text-emerald-600">
                  {land.owner.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">{land.owner.name}</p>
                  <p className="text-emerald-100 text-sm">{land.owner.email}</p>
                </div>
              </div>
              <button className="w-full py-2 bg-white text-emerald-600 font-semibold rounded-lg hover:bg-emerald-50 transition">
                Contacter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
