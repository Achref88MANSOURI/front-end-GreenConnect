"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_BASE_URL } from '../../src/api-config';

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
}

export default function CarriersClient() {
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/carriers`)
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Failed to fetch carriers');
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-xl text-gray-800">Chargement des transporteurs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Erreur: {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {carriers.length === 0 ? (
        <div className="col-span-3 text-center py-10 text-gray-700">
          Aucun transporteur disponible pour le moment.
        </div>
      ) : (
        carriers.map(carrier => (
          <div
            key={carrier.id}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden border border-gray-200"
          >
            <div className="h-40 bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center text-white">
              <div className="text-center">
                <div className="text-4xl mb-2">🚚</div>
                <div className="text-sm font-semibold">{carrier.vehicleType}</div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-extrabold text-green-800 line-clamp-1">
                {carrier.companyName}
              </h3>
              <p className="text-sm font-semibold text-gray-700 mt-1">
                {carrier.vehicleType} - {carrier.capacity_kg / 1000} tonnes
              </p>
              <p className="text-lg font-bold text-green-600 mt-2">
                {carrier.pricePerKm} TND/km
              </p>
              {carrier.pricePerTonne && (
                <p className="text-sm text-gray-800">
                  + {carrier.pricePerTonne} TND/tonne
                </p>
              )}
              <div className="flex items-center mt-2">
                <span className="text-yellow-500 text-lg">★</span>
                <span className="ml-1 text-sm font-semibold">
                  {carrier.averageRating.toFixed(1)} ({carrier.totalReviews} avis)
                </span>
              </div>
              <div className={`mt-3 text-sm font-semibold ${
                carrier.status === 'Active' ? 'text-green-500' : 'text-red-500'
              }`}>
                Statut: {carrier.status === 'Active' ? 'Disponible' : 'Indisponible'}
              </div>
              <Link
                href={`/deliveries/book?carrierId=${carrier.id}`}
                className={`mt-4 block text-center py-2 rounded-lg font-bold transition ${
                  carrier.status === 'Active'
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed pointer-events-none'
                }`}
              >
                {carrier.status === 'Active' ? 'Réserver ce Transport' : 'Indisponible'}
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
