"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { API_BASE_URL } from '../../src/api-config';

interface LandListing {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  targetAmount: number;  // areaHectares
  currentAmount: number;  // leasePrice
  minimumInvestment: number;  // minSeasonMonths
  expectedROI: number;  // maxSeasonMonths
  status: string;
  images?: string[];
  owner: {
    id: number;
    name: string;
  };
}

export default function InvestmentsClient() {
  const [lands, setLands] = useState<LandListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minArea, setMinArea] = useState('');
  const [maxArea, setMaxArea] = useState('');
  const [waterAccessFilter, setWaterAccessFilter] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUserId(user.id);
      } catch (e) {
        setCurrentUserId(null);
      }
    }
    fetchLands();
  }, []);

  const fetchLands = () => {
    fetch(`${API_BASE_URL}/investments/lands`)
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Impossible de charger les terres');
      })
      .then(data => {
        setLands(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  const filteredLands = lands.filter(land => {
    // Exclude current user's lands
    if (currentUserId && land.owner.id === currentUserId) return false;
    // Only show available and leased lands (not reserved)
    if (land.status !== 'available' && land.status !== 'leased') return false;
    if (searchQuery && !land.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (locationFilter && !land.location?.toLowerCase().includes(locationFilter.toLowerCase())) return false;
    if (minPrice && land.currentAmount < parseFloat(minPrice)) return false;
    if (maxPrice && land.currentAmount > parseFloat(maxPrice)) return false;
    if (minArea && land.targetAmount < parseFloat(minArea)) return false;
    if (maxArea && land.targetAmount > parseFloat(maxArea)) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-xl text-gray-600 animate-pulse">Chargement des terres...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
        <p className="font-semibold">Erreur</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Sidebar Filters */}
      <aside className="lg:col-span-1">
        <div className="sticky top-24 bg-white rounded-2xl border border-emerald-200/50 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-emerald-900 mb-6 flex items-center gap-2">
            <span>🔍</span>
            <span>Filtres</span>
          </h2>

          <div className="space-y-5">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Recherche</label>
              <input
                placeholder="Nom de la terre..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Région</label>
              <input
                placeholder="Ex: Sfax, Jendouba..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Prix Mensuel (TND)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>

            {/* Area Range */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Superficie (ha)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
                  value={minArea}
                  onChange={(e) => setMinArea(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
                  value={maxArea}
                  onChange={(e) => setMaxArea(e.target.value)}
                />
              </div>
            </div>

            {/* Water Access */}
            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={waterAccessFilter}
                  onChange={(e) => setWaterAccessFilter(e.target.checked)}
                  className="w-5 h-5 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-sm font-medium text-gray-700">Accès à l'eau 💧</span>
              </label>
            </div>

            {/* Reset Button */}
            <button
              onClick={() => {
                setSearchQuery('');
                setLocationFilter('');
                setMinPrice('');
                setMaxPrice('');
                setMinArea('');
                setMaxArea('');
                setWaterAccessFilter(false);
              }}
              className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition text-sm mt-4"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </aside>

      {/* Listings Grid */}
      <section className="lg:col-span-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-gray-700">
              <span className="font-bold text-emerald-700">{filteredLands.length}</span>
              <span className="text-gray-600"> terre{filteredLands.length !== 1 ? 's' : ''} disponible{filteredLands.length !== 1 ? 's' : ''}</span>
            </p>
          </div>
        </div>

        {filteredLands.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
            <div className="text-5xl mb-4">🌾</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune terre trouvée</h3>
            <p className="text-gray-600">Modifiez vos filtres pour explorer d'autres options</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredLands.map(land => (
              <div
                key={land.id}
                className="bg-white rounded-2xl border border-emerald-100/50 overflow-hidden hover:shadow-lg hover:border-emerald-300 transition-all duration-300 group"
              >
                {/* Image Section */}
                <div className="relative h-48 bg-gradient-to-br from-emerald-100 via-green-100 to-teal-100 overflow-hidden">
                  {land.images && land.images.length > 0 ? (
                    <Image
                      src={land.images[0]?.startsWith('http') ? land.images[0] : `${API_BASE_URL}${land.images[0]}`}
                      alt={land.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-emerald-200 text-6xl">
                      🌾
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      ✓ Disponible
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-emerald-900 mb-2 truncate">{land.title}</h3>
                  
                  {land.location && (
                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                      <span>📍</span>
                      <span>{land.location}</span>
                    </div>
                  )}

                  <p className="text-gray-700 text-sm line-clamp-2 mb-4">{land.description}</p>

                  {/* Key Info Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-100">
                    <div className="bg-emerald-50 rounded-lg p-3">
                      <div className="text-xs text-gray-600 mb-1">Superficie</div>
                      <div className="text-lg font-bold text-emerald-700">{land.targetAmount} ha</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="text-xs text-gray-600 mb-1">Prix Mensuel</div>
                      <div className="text-lg font-bold text-green-700">{land.currentAmount.toLocaleString()} TND</div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                  </div>

                  {/* Owner Info */}
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-green-400 flex items-center justify-center text-white text-sm font-bold">
                      {land.owner.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-600">Propriétaire</p>
                      <p className="text-sm font-semibold text-gray-900">{land.owner.name}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Link
                      href={`/investments/${land.id}`}
                      className="flex-1 text-center py-2 rounded-lg border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-semibold text-sm transition-all duration-300"
                    >
                      Voir Détails
                    </Link>
                    {land.status === 'available' && (
                      <Link
                        href={`/investments/${land.id}#request`}
                        className="flex-1 text-center py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:shadow-md font-semibold text-sm transition-all duration-300"
                      >
                        Louer
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
