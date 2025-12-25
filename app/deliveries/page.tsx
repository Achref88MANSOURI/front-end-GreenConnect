/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { API_BASE_URL } from '../../src/api-config';

interface DeliveryItem {
  id: number;
  goodsType: string;
  weight_kg: number;
  pickupAddress: string;
  deliveryAddress: string;
  desiredDeliveryDate: string;
  totalCost: number;
  status: string;
  carrier?: {
    id: number;
    companyName: string;
  };
}

export default function MyDeliveriesPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<DeliveryItem[]>([]);

  useEffect(() => {
    const fetchMine = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vous devez être connecté pour voir vos livraisons.');
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE_URL}/deliveries/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          throw new Error('Erreur lors du chargement des livraisons');
        }
        const data = await res.json();
        setItems(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMine();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-green-800">Mes Livraisons</h1>
          <Link href="/deliveries/book" className="text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold">
            Réserver un transport
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
        )}

        {loading ? (
          <div className="text-gray-700">Chargement…</div>
        ) : items.length === 0 ? (
          <div className="text-center py-10 text-gray-700">
            Aucune livraison pour le moment.
            <div className="mt-4">
              <Link href="/deliveries/book" className="text-green-600 hover:text-green-700 underline">
                Réserver votre première livraison
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((d) => (
              <div key={d.id} className="border rounded-lg p-4 flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-700">#{d.id}</div>
                  <div className="text-lg font-bold text-gray-800">{d.goodsType} • {d.weight_kg} kg</div>
                  <div className="text-sm text-gray-800">De: {d.pickupAddress}</div>
                  <div className="text-sm text-gray-800">Vers: {d.deliveryAddress}</div>
                  <div className="text-sm text-gray-800">
                    Date souhaitée: {new Date(d.desiredDeliveryDate).toLocaleDateString()}
                  </div>
                  {d.carrier && (
                    <div className="text-sm text-gray-800">Transporteur: {d.carrier.companyName}</div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{Number(d.totalCost).toFixed(2)} TND</div>
                  <div className="text-sm text-gray-700">Statut: {d.status}</div>
                  <Link href={`/deliveries/${d.id}`} className="text-green-600 hover:text-green-700 underline mt-2 inline-block">
                    Détails
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
