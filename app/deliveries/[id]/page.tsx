/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { API_BASE_URL } from '../../../src/api-config';

interface Delivery {
  [x: string]: any;
  id: number;
  status: string;
  goodsType: string;
  weight_kg: number;
  pickupAddress: string;
  deliveryAddress: string;
  distance_km: number;
  totalCost: number;
  desiredDeliveryDate: string;
  carrierRating?: number;
  carrier: {
    id: number;
    companyName: string;
    contactEmail: string;
    vehicleType: string;
  };
  trackingUpdates?: { timestamp: string; location: string; message: string }[];
}

export default function TrackDeliveryPage() {
  const params = useParams();
  const router = useRouter();
  const deliveryId = params.id as string;

  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!deliveryId) return;

    fetch(`${API_BASE_URL}/deliveries/${deliveryId}`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Livraison non trouvée');
      })
      .then((data) => {
        setDelivery(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [deliveryId]);

  const submitReview = async () => {
    if (!delivery) return;

    setSubmittingReview(true);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${API_BASE_URL}/deliveries/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          deliveryId: delivery.id,
          reviewerId: delivery.userId,
          rating,
        }),
      });

      if (!res.ok) {
        throw new Error('Erreur lors de la soumission de l\'évaluation');
      }

      alert('Merci pour votre évaluation !');
      // Refresh delivery data
      const updatedDelivery = await res.json();
      setDelivery(updatedDelivery);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
      case 'PENDING_PICKUP':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_TRANSIT':
        return 'bg-blue-100 text-blue-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'En attente';
      case 'PENDING_PICKUP':
        return 'En attente de collecte';
      case 'IN_TRANSIT':
        return 'En transit';
      case 'DELIVERED':
        return 'Livré';
      case 'CANCELED':
        return 'Annulé';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-900">Chargement...</div>
      </div>
    );
  }

  if (error || !delivery) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">📦</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Livraison non trouvée</h1>
            <p className="text-gray-900 mb-6">{error}</p>
            <Link
              href="/carriers"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700"
            >
              Retour aux transporteurs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/carriers" className="text-green-600 hover:text-green-700 mb-4 inline-block">
          ← Retour
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-extrabold text-green-800">
                Suivi de Livraison #{delivery.id}
              </h1>
              <p className="text-gray-800 mt-2">{delivery.goodsType}</p>
            </div>
            <div className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(delivery.status)}`}>
              {getStatusLabel(delivery.status)}
            </div>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Détails de la Livraison</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">Adresse de collecte</p>
              <p className="text-gray-800">{delivery.pickupAddress}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">Adresse de livraison</p>
              <p className="text-gray-800">{delivery.deliveryAddress}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">Poids</p>
              <p className="text-gray-800">{delivery.weight_kg} kg</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">Distance</p>
              <p className="text-gray-800">{delivery.distance_km} km</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">Date souhaitée</p>
              <p className="text-gray-800">
                {new Date(delivery.desiredDeliveryDate).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">Coût total</p>
              <p className="text-2xl font-bold text-green-600">{delivery.totalCost.toFixed(2)} TND</p>
            </div>
          </div>
        </div>

        {/* Carrier Info */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Transporteur</h2>
          <div className="flex items-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl">
              🚚
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-bold text-gray-800">{delivery.carrier.companyName}</h3>
              <p className="text-gray-800">{delivery.carrier.vehicleType}</p>
              <p className="text-sm text-gray-700">{delivery.carrier.contactEmail}</p>
            </div>
          </div>
        </div>

        {/* Review Section */}
        {delivery.status === 'DELIVERED' && !delivery.carrierRating && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Évaluer le Transporteur</h2>
            <p className="text-gray-800 mb-4">
              Votre livraison est terminée. Partagez votre expérience !
            </p>
            <div className="flex items-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-3xl ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
              <span className="ml-2 text-gray-700 font-semibold">{rating}/5</span>
            </div>
            <button
              onClick={submitReview}
              disabled={submittingReview}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition disabled:bg-gray-400"
            >
              {submittingReview ? 'Envoi...' : 'Soumettre l\'Évaluation'}
            </button>
          </div>
        )}

        {delivery.carrierRating && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Votre Évaluation</h2>
            <div className="flex items-center">
              <span className="text-3xl text-yellow-500">★</span>
              <span className="ml-2 text-xl font-semibold">{delivery.carrierRating}/5</span>
            </div>
            <p className="text-gray-800 mt-2">Merci pour votre évaluation !</p>
          </div>
        )}
      </div>
    </div>
  );
}
