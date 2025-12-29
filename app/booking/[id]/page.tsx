/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { API_BASE_URL } from '../../../src/api-config';

interface Equipment {
  id: number;
  name: string;
  description: string;
  pricePerDay: number;
  location: string;
  images?: string[];
  owner?: { id: number; name: string };
}

export default function BookEquipmentPage() {
  const params = useParams();
  const router = useRouter();
  const idParam = params?.id as string;
  const equipmentId = idParam ? parseInt(idParam, 10) : NaN;

  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchEquipment = async () => {
      if (!equipmentId) return;
      try {
        const res = await fetch(`${API_BASE_URL}/equipment/${equipmentId}`);
        if (!res.ok) throw new Error('Équipement introuvable');
        const data = await res.json();
        setEquipment(data);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchEquipment();
  }, [equipmentId]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const u = JSON.parse(stored);
        if (u && typeof u.id === 'number') setCurrentUserId(u.id);
      }
    } catch (_) {
      setCurrentUserId(null);
    }
  }, []);

  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Vous devez être connecté pour réserver cet équipement');
      setLoading(false);
      return;
    }

    if (!startDate || !endDate) {
      setError('Veuillez choisir une période');
      setLoading(false);
      return;
    }

    if (equipment && equipment.owner && currentUserId && equipment.owner.id === currentUserId) {
      setError("Vous êtes le propriétaire de cet équipement; vous ne pouvez pas le réserver");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/booking/${equipmentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ startDate, endDate }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Erreur lors de la réservation');
      }

      const booking = await res.json();
      alert(`Réservation créée (ID ${booking.id}). Vous serez notifié une fois approuvée.`);
      router.push(`/equipment/${equipmentId}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-green-800">Réserver l'Équipement</h1>
          <Link href={`/equipment/${equipmentId}`} className="text-green-600 hover:text-green-700">← Retour</Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {equipment ? (
          <div className="mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
                {equipment.images && equipment.images[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={equipment.images[0]} alt={equipment.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl">🚜</span>
                )}
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">{equipment.name}</div>
                <div className="text-sm text-gray-800">{equipment.location}</div>
                <div className="text-sm text-green-700 font-semibold">{equipment.pricePerDay} TND / jour</div>
                {equipment.owner && (
                  <div className="text-xs text-gray-700 mt-1">Propriétaire: {equipment.owner.name}</div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-700">Chargement des détails…</div>
        )}

        <form onSubmit={submitBooking} className="space-y-6 mt-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date de début</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date de fin</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || new Date().toISOString().split('T')[0]}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !!(equipment && equipment.owner && currentUserId && equipment.owner.id === currentUserId)}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition disabled:bg-gray-400"
          >
            {loading ? 'Réservation…' : 'Confirmer la réservation'}
          </button>
        </form>
      </div>
    </div>
  );
}
