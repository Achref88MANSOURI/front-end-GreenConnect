/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { API_BASE_URL } from '../../../src/api-config';

export default function RegisterCarrierPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    companyName: '',
    contactEmail: '',
    vehicleType: '',
    capacity_kg: '',
    pricePerKm: '',
    pricePerTonne: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Vous devez être connecté pour vous inscrire comme transporteur');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        companyName: formData.companyName,
        contactEmail: formData.contactEmail,
        vehicleType: formData.vehicleType,
        capacity_kg: parseInt(formData.capacity_kg),
        pricePerKm: parseFloat(formData.pricePerKm),
        pricePerTonne: formData.pricePerTonne ? parseFloat(formData.pricePerTonne) : undefined,
        availability: [
          { dayOfWeek: 1, startTime: '08:00', endTime: '17:00' },
          { dayOfWeek: 2, startTime: '08:00', endTime: '17:00' },
          { dayOfWeek: 3, startTime: '08:00', endTime: '17:00' },
          { dayOfWeek: 4, startTime: '08:00', endTime: '17:00' },
          { dayOfWeek: 5, startTime: '08:00', endTime: '17:00' },
        ],
        serviceZones: [{ name: 'Tunisie', coordinates: null }],
      };

      const res = await fetch(`${API_BASE_URL}/carriers/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Erreur lors de l\'inscription');
      }

      alert('Inscription réussie ! Vous êtes maintenant transporteur.');
      router.push('/carriers');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-6">
          <Link href="/carriers" className="text-green-600 hover:text-green-700 mb-4 inline-block">
            ← Retour aux transporteurs
          </Link>
          <h1 className="text-3xl font-extrabold text-green-800">Devenir Transporteur</h1>
          <p className="text-gray-800 mt-2">
            Rejoignez notre réseau de transporteurs et développez votre activité.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nom de l'entreprise *
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-600 text-gray-900"
              placeholder="Transport Express SARL"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email de contact *
            </label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-600 text-gray-900"
              placeholder="contact@transportexpress.tn"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Type de véhicule *
            </label>
            <select
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">-- Sélectionner --</option>
              <option value="Camion frigorifique">Camion frigorifique</option>
              <option value="Camion plateau">Camion plateau</option>
              <option value="Camion benne">Camion benne</option>
              <option value="Fourgonnette">Fourgonnette</option>
              <option value="Semi-remorque">Semi-remorque</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Capacité (kg) *
            </label>
            <input
              type="number"
              name="capacity_kg"
              value={formData.capacity_kg}
              onChange={handleChange}
              required
              min="100"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-600 text-gray-900"
              placeholder="5000"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Prix par km (TND) *
              </label>
              <input
                type="number"
                name="pricePerKm"
                value={formData.pricePerKm}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-600 text-gray-900"
                placeholder="2.50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Prix par tonne (TND)
              </label>
              <input
                type="number"
                name="pricePerTonne"
                value={formData.pricePerTonne}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-600 text-gray-900"
                placeholder="15.00"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition disabled:bg-gray-400"
          >
            {loading ? 'Inscription en cours...' : 'S\'inscrire comme Transporteur'}
          </button>
        </form>
      </div>
    </div>
  );
}
