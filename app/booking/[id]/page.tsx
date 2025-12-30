/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { API_BASE_URL } from '../../../src/api-config';
import { useToast } from '../../components/ToastProvider';
import { ArrowLeft, Phone, AlertCircle } from 'lucide-react';

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
  const { addToast } = useToast();
  const idParam = params?.id as string;
  const equipmentId = idParam ? parseInt(idParam, 10) : NaN;

  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
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

    if (!phoneNumber || phoneNumber.trim().length < 8) {
      setError('Veuillez entrer un numéro de téléphone valide');
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
        body: JSON.stringify({ startDate, endDate, phoneNumber }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        
        // Gestion des erreurs spécifiques
        if (res.status === 409 && data.message?.includes('already booked')) {
          throw new Error('Cet équipement est déjà réservé pour ces dates. Veuillez choisir d\'autres dates.');
        }
        
        throw new Error(data.message || 'Erreur lors de la réservation');
      }

      const booking = await res.json();
      addToast(`Réservation créée (ID ${booking.id}). Vous serez notifié une fois approuvée.`, 'success');
      router.push(`/equipment/${equipmentId}`);
    } catch (err: any) {
      const errorMsg = err.message || 'Erreur lors de la réservation';
      setError(errorMsg);
      addToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back to catalogue link */}
        <Link href="/equipment/browse" className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          Retour au catalogue
        </Link>
        
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-extrabold text-green-800">Réserver l'Équipement</h1>
            <Link href={`/equipment/${equipmentId}`} className="text-green-600 hover:text-green-700">← Détails</Link>
          </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-800">Erreur de réservation</p>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {equipment ? (
          <div className="mb-6">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0 shadow-sm">
                {equipment.images && equipment.images[0] ? (
                  <img 
                    src={equipment.images[0]} 
                    alt={equipment.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={equipment.images && equipment.images[0] ? 'hidden' : ''}>
                  <span className="text-4xl">🚜</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-lg font-bold text-gray-900">{equipment.name}</div>
                <div className="text-sm text-gray-600 mt-1">{equipment.location}</div>
                <div className="text-base font-semibold text-green-600 mt-2">{equipment.pricePerDay} TND / jour</div>
                {equipment.owner && (
                  <div className="text-xs text-gray-600 mt-2">
                    <span className="text-gray-500">Propriétaire: </span>
                    <span className="font-medium text-gray-700">{equipment.owner.name}</span>
                  </div>
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

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Phone className="w-4 h-4 text-green-600" />
              Numéro de téléphone
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Ex: 20 123 456"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
            <p className="text-xs text-gray-500 mt-1">Le propriétaire vous contactera sur ce numéro</p>
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
    </div>
  );
}
