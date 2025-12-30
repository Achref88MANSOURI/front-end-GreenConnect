/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/immutability */
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../../src/api-config';

interface LandListing {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  targetAmount: number;
  currentAmount: number;
  minimumInvestment: number;
  expectedROI: number;
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
      const user = JSON.parse(storedUser);
      setCurrentUserId(user.id);
    }
  }, []);

  useEffect(() => {
    const fetchLands = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/investments/lands`);
        if (!response.ok) throw new Error('Failed to fetch lands');
        const data = await response.json();
        setLands(data);
        setError('');
      } catch (err) {
        setError('Could not load land listings');
      } finally {
        setLoading(false);
      }
    };

    fetchLands();
  }, []);

  const filteredLands = lands.filter((land) => {
    // Exclude lands owned by current user
    if (currentUserId && land.owner.id === currentUserId) return false;
    if (searchQuery && !land.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (locationFilter && !land.location.toLowerCase().includes(locationFilter.toLowerCase())) return false;
    if (minPrice && land.currentAmount < parseFloat(minPrice)) return false;
    if (maxPrice && land.currentAmount > parseFloat(maxPrice)) return false;
    if (minArea && land.targetAmount < parseFloat(minArea)) return false;
    if (maxArea && land.targetAmount > parseFloat(maxArea)) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-xl text-gray-400 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-6 py-4 rounded-lg">
        <p className="font-semibold">Error</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Filters Sidebar */}
      <aside className="lg:col-span-3">
        <div className="sticky top-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/10">
              <div className="text-3xl">🔍</div>
              <div>
                <h3 className="font-bold text-white text-lg">Filters</h3>
                <p className="text-gray-400 text-xs">Advanced search</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">Search</label>
                <input
                  placeholder="Land name..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:border-emerald-500 outline-none transition text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">Region</label>
                <input
                  placeholder="Location..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:border-emerald-500 outline-none transition text-sm"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">Budget TND</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Min"
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:border-emerald-500 outline-none transition text-sm"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:border-emerald-500 outline-none transition text-sm"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">Area ha</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:border-emerald-500 outline-none transition text-sm"
                    value={minArea}
                    onChange={(e) => setMinArea(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:border-emerald-500 outline-none transition text-sm"
                    value={maxArea}
                    onChange={(e) => setMaxArea(e.target.value)}
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer p-4 bg-emerald-500/20 border border-emerald-400/50 rounded-xl hover:bg-emerald-500/30 transition">
                <input
                  type="checkbox"
                  checked={waterAccessFilter}
                  onChange={(e) => setWaterAccessFilter(e.target.checked)}
                  className="w-5 h-5 rounded cursor-pointer"
                />
                <span className="text-sm font-semibold text-gray-300">Water Access</span>
              </label>

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
                className="w-full py-3 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 hover:from-emerald-500/50 hover:to-teal-500/50 text-emerald-300 font-bold rounded-xl transition border border-emerald-400/50"
              >
                Reset Filters
              </button>
            </div>
          </motion.div>
        </div>
      </aside>

      {/* Main Grid */}
      <div className="lg:col-span-9">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black text-white mb-2">Available Lands</h2>
                <p className="text-gray-400">
                  <span className="font-bold text-emerald-400">{filteredLands.length}</span> results
                </p>
              </div>
              <div className="text-6xl">🌾</div>
            </div>
          </div>
        </motion.div>

        {filteredLands.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl"
          >
            <div className="text-8xl mb-6">🌾</div>
            <h3 className="text-2xl font-bold text-white mb-3">No Lands Found</h3>
            <p className="text-gray-400 text-lg">Adjust your filters to find more</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {filteredLands.map((land) => (
              <motion.div
                key={land.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8 }}
                className="group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden hover:border-emerald-400/50 transition-all duration-300 h-full flex flex-col">
                  {/* Image */}
                  <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-gray-400/20 to-gray-600/20">
                    {land.images && land.images.length > 0 ? (
                      <Image
                        src={land.images[0]?.startsWith('http') ? land.images[0] : `${API_BASE_URL}${land.images[0]}`}
                        alt={land.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-6xl">LAND</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <motion.div whileHover={{ scale: 1.05 }} className="absolute top-4 right-4">
                      <span className="inline-block px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-xs font-bold shadow-lg">
                        Available
                      </span>
                    </motion.div>
                    <div className="absolute top-4 left-4">
                      <span className="inline-block px-3 py-1 bg-black/50 text-white rounded-full text-xs font-semibold">
                        {land.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-bold text-white text-lg mb-2 line-clamp-2 group-hover:text-emerald-300 transition-colors">
                      {land.title}
                    </h3>

                    {land.location && (
                      <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                        <span>Location:</span>
                        <span className="font-medium">{land.location}</span>
                      </div>
                    )}

                    <p className="text-gray-400 text-sm line-clamp-2 mb-5 flex-1">{land.description}</p>

                    <div className="grid grid-cols-2 gap-3 mb-6 pb-6 border-b border-white/10">
                      <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-lg p-3 border border-emerald-400/30">
                        <div className="text-xs text-gray-400 mb-1">Area</div>
                        <div className="text-lg font-bold text-emerald-300">{land.targetAmount} ha</div>
                      </div>
                      <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-lg p-3 border border-emerald-400/30">
                        <div className="text-xs text-gray-400 mb-1">Price/mo</div>
                        <div className="text-lg font-bold text-emerald-300">{land.currentAmount} TND</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                          {land.owner.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white truncate">{land.owner.name}</p>
                          <p className="text-xs text-gray-400">Owner</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Link
                          href={`/investments/${land.id}`}
                          className="flex-1 text-center py-3 px-4 rounded-lg border-2 border-emerald-400/50 text-emerald-300 hover:border-emerald-400 hover:bg-emerald-400/10 font-semibold text-sm transition-all"
                        >
                          Details
                        </Link>
                        {land.status === 'available' && (
                          <Link
                            href={`/investments/${land.id}#request`}
                            className="flex-1 text-center py-3 px-4 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 font-bold text-sm transition-all shadow-lg"
                          >
                            Rent
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
