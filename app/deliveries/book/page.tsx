/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { API_BASE_URL } from '../../../src/api-config';

interface Suggestion {
  carrierId: number;
  companyName: string;
  averageRating: number;
  estimatedCost: number;
  estimatedDistance: number;
}

export default function BookDeliveryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCarrierId = searchParams.get('carrierId');

  const [step, setStep] = useState<'form' | 'suggestions' | 'confirm'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedCarrier, setSelectedCarrier] = useState<number | null>(
    preselectedCarrierId ? parseInt(preselectedCarrierId) : null
  );

  const [formData, setFormData] = useState({
    goodsType: '',
    weight_kg: '',
    pickupAddress: '',
    deliveryAddress: '',
    desiredDeliveryDate: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getSuggestions = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Vous devez être connecté pour réserver un transport');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        goodsType: formData.goodsType,
        weight_kg: parseFloat(formData.weight_kg),
        pickupAddress: formData.pickupAddress,
        deliveryAddress: formData.deliveryAddress,
        desiredDeliveryDate: formData.desiredDeliveryDate,
      };

      const res = await fetch(`${API_BASE_URL}/deliveries/suggestions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Erreur lors de la récupération des suggestions');
      }

      const data = await res.json();
      setSuggestions(data);
      setStep('suggestions');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmBooking = async () => {
    if (!selectedCarrier) {
      setError('Veuillez sélectionner un transporteur');
      return;
    }

    setError('');
    setLoading(true);

    const token = localStorage.getItem('token');
    try {
      const payload = {
        goodsType: formData.goodsType,
        weight_kg: parseFloat(formData.weight_kg),
        pickupAddress: formData.pickupAddress,
        deliveryAddress: formData.deliveryAddress,
        desiredDeliveryDate: formData.desiredDeliveryDate,
        carrierId: selectedCarrier,
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
        throw new Error('Erreur lors de la réservation');
      }

      const delivery = await res.json();
      alert(`Réservation réussie ! ID de livraison: ${delivery.id}`);
      router.push(`/deliveries/${delivery.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-6">
          <Link href="/carriers" className="text-green-600 hover:text-green-700 mb-4 inline-block">
            ← Retour aux transporteurs
          </Link>
          <h1 className="text-3xl font-extrabold text-green-800">Réserver un Transport</h1>
          <p className="text-gray-800 mt-2">
            Trouvez le meilleur transporteur pour vos marchandises.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Step 1: Form */}
        {step === 'form' && (
          <form onSubmit={getSuggestions} className="space-y-6">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 placeholder-gray-600 text-gray-900"
                placeholder="Fruits, Légumes, Matériel agricole..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Poids total (kg) *
              </label>
              <input
                type="number"
                name="weight_kg"
                value={formData.weight_kg}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 placeholder-gray-600 text-gray-900"
                placeholder="500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Adresse de collecte *
              </label>
              <textarea
                name="pickupAddress"
                value={formData.pickupAddress}
                onChange={handleChange}
                required
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 placeholder-gray-600 text-gray-900"
                placeholder="Rue, Ville, Code postal"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Adresse de livraison *
              </label>
              <textarea
                name="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleChange}
                required
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 placeholder-gray-600 text-gray-900"
                placeholder="Rue, Ville, Code postal"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date de livraison souhaitée *
              </label>
              <input
                type="date"
                name="desiredDeliveryDate"
                value={formData.desiredDeliveryDate}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition disabled:bg-gray-400"
            >
              {loading ? 'Recherche en cours...' : 'Voir les Transporteurs Disponibles'}
            </button>
          </form>
        )}

        {/* Step 2: Suggestions */}
        {step === 'suggestions' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Transporteurs Recommandés</h2>
            {suggestions.length === 0 ? (
              <div className="text-center py-10 text-gray-700">
                Aucun transporteur disponible pour ces critères.
                <button
                  onClick={() => setStep('form')}
                  className="block mx-auto mt-4 text-green-600 hover:text-green-700 underline"
                >
                  Modifier les critères
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.carrierId}
                    className={`border rounded-lg p-4 cursor-pointer transition ${
                      selectedCarrier === suggestion.carrierId
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                    onClick={() => setSelectedCarrier(suggestion.carrierId)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          {suggestion.companyName}
                        </h3>
                        <div className="flex items-center mt-1">
                          <span className="text-yellow-500">★</span>
                          <span className="ml-1 text-sm">{suggestion.averageRating.toFixed(1)}</span>
                        </div>
                        <p className="text-sm text-gray-800 mt-1">
                          Distance estimée: {suggestion.estimatedDistance} km
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          {suggestion.estimatedCost.toFixed(2)} TND
                        </div>
                        <p className="text-sm text-gray-700">Coût estimé</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setStep('form')}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300 transition"
              >
                Modifier
              </button>
              <button
                onClick={confirmBooking}
                disabled={!selectedCarrier || loading}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition disabled:bg-gray-400"
              >
                {loading ? 'Réservation...' : 'Confirmer la Réservation'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
