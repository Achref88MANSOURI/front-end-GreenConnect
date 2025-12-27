/* eslint-disable @typescript-eslint/no-explicit-any */
// app/equipment/browse/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { API_BASE_URL } from '@/src/api-config';

interface Equipment {
    id: number;
    name: string;
    description: string;
    category: string;
    pricePerDay: number;
    location: string;
    availability: boolean;
    images?: string[];
    owner: {
        id: number;
        name: string;
    };
}

export default function BrowseEquipmentPage() {
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [filteredEquipment, setFilteredEquipment] = useState<Equipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Tous');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [availableOnly, setAvailableOnly] = useState(false);
    const [includeMine, setIncludeMine] = useState(true);
    const [includeOthers, setIncludeOthers] = useState(true);
    const [sortBy, setSortBy] = useState<'relevance' | 'priceAsc' | 'priceDesc' | 'newest'>('relevance');

    useEffect(() => {
        fetchEquipment();
    }, []);

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

    useEffect(() => {
        filterEquipment();
    }, [equipment, searchTerm, selectedCategory, selectedLocation, availableOnly, includeMine, includeOthers, sortBy]);

    const fetchEquipment = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/equipment`);
            if (!response.ok) {
                throw new Error('Erreur lors du chargement des équipements');
            }
            const data = await response.json();
            setEquipment(data);
            setFilteredEquipment(data);
        } catch (err: any) {
            setError(err.message || 'Erreur lors du chargement des équipements');
        } finally {
            setLoading(false);
        }
    };

    const filterEquipment = () => {
        let filtered = [...equipment];

        if (searchTerm) {
            filtered = filtered.filter(eq =>
                eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                eq.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory !== 'Tous') {
            filtered = filtered.filter(eq => eq.category === selectedCategory);
        }

        if (selectedLocation) {
            filtered = filtered.filter(eq =>
                eq.location.toLowerCase().includes(selectedLocation.toLowerCase())
            );
        }

        if (availableOnly) {
            filtered = filtered.filter(eq => eq.availability);
        }

        // Ownership filter via checkboxes
        filtered = filtered.filter(eq => {
            const isMine = Boolean(currentUserId) && eq.owner?.id === currentUserId;
            if (isMine) return includeMine;
            return includeOthers;
        });

        // Sorting
        if (sortBy === 'priceAsc') {
            filtered.sort((a, b) => a.pricePerDay - b.pricePerDay);
        } else if (sortBy === 'priceDesc') {
            filtered.sort((a, b) => b.pricePerDay - a.pricePerDay);
        } else if (sortBy === 'newest') {
            // Fallback: no createdAt in interface here, but backend returns it.
            // Use string compare if present; otherwise leave as-is
            filtered.sort((a: any, b: any) => (b.createdAt?.localeCompare?.(a.createdAt) ?? 0));
        }

        setFilteredEquipment(filtered);
    };

    const categoryTranslations: { [key: string]: string } = {
        'Tractor': 'Tracteur',
        'Harvester': 'Moissonneuse',
        'Planter': 'Planteuse',
        'Irrigation': 'Irrigation',
        'Sprayer': 'Pulvérisateur',
        'Trailer': 'Remorque',
        'Other': 'Autre'
    };

    const categoryIcons: { [key: string]: string } = {
        'Tractor': '🚜',
        'Harvester': '🌾',
        'Planter': '🌱',
        'Irrigation': '💧',
        'Sprayer': '💨',
        'Trailer': '🛣️',
        'Other': '⚙️'
    };

    function EquipmentCard({ eq }: { eq: Equipment }) {
        return (
            <div className="rounded-2xl p-[1px] bg-gradient-to-br from-green-200 to-emerald-200 hover:from-green-300 hover:to-emerald-300 transition">
                <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition border border-gray-200 overflow-hidden group transform duration-200 hover:-translate-y-1">
                    <div className="relative h-48 bg-gradient-to-r from-green-100 to-gray-100 flex items-center justify-center">
                        {eq.images && eq.images.length > 0 ? (
                            <img
                                src={`${API_BASE_URL}${eq.images[0]}`}
                                alt={eq.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-6xl mb-2">{categoryIcons[eq.category] || '🚜'}</div>
                                    <p className="text-sm text-black">{categoryTranslations[eq.category] || eq.category}</p>
                                </div>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                        <div className="absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-semibold bg-white/90 backdrop-blur border text-gray-800">
                            {categoryTranslations[eq.category] || eq.category}
                        </div>
                        <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md text-xs font-bold bg-green-600 text-white">
                            {eq.pricePerDay} TND/jour
                        </div>
                        {eq.location && (
                            <div className="absolute bottom-2 left-2 px-2 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur border text-gray-800">
                                📍 {eq.location}
                            </div>
                        )}
                        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold border ${eq.availability ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-gray-200 text-gray-800 border-gray-300'}`}>
                            {eq.availability ? 'Disponible' : 'Indisponible'}
                        </div>
                    </div>

                    <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-bold text-green-800 flex-1">{eq.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                eq.availability ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                                {eq.availability ? 'Disponible' : 'Loué'}
                            </span>
                        </div>

                        <p className="text-sm text-black mb-3 line-clamp-2">{eq.description}</p>

                        <div className="space-y-2 text-sm mb-4">
                            <div className="flex items-center justify-between">
                                <span className="text-black">Catégorie:</span>
                                <span className="font-semibold text-black">
                                    {categoryTranslations[eq.category] || eq.category}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-black">Prix/jour:</span>
                                <span className="font-bold text-green-700">{eq.pricePerDay} TND</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-black">📈 Localisation:</span>
                                <span className="text-black">{eq.location}</span>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-gray-200">
                            <div className="flex items-center gap-2 text-sm text-black mb-3">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold">
                                    {eq.owner.name.charAt(0).toUpperCase()}
                                </div>
                                <span>{eq.owner.name}</span>
                            </div>

                            <div className="flex gap-2">
                                <Link
                                    href={`/equipment/${eq.id}`}
                                    className="flex-1 text-center py-2 rounded-md border border-green-600 text-green-600 hover:bg-green-50 transition text-sm font-medium"
                                >
                                    Détails
                                </Link>
                                {eq.availability && (!currentUserId || currentUserId !== eq.owner.id) && (
                                    <Link
                                        href={`/booking/${eq.id}`}
                                        className="flex-1 text-center py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition text-sm font-medium"
                                    >
                                        Réserver
                                    </Link>
                                )}
                                {eq.availability && currentUserId && currentUserId === eq.owner.id && (
                                    <span className="flex-1 text-center py-2 rounded-md bg-gray-100 text-gray-800 border border-gray-300 text-sm">
                                        Vous êtes le propriétaire
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <>
                <Header />
                <main className="max-w-7xl mx-auto px-4 py-12">
                    <p className="text-center text-black">Chargement...</p>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="max-w-7xl mx-auto px-4 py-12">
                <div className="relative mb-8 rounded-2xl bg-gradient-to-r from-green-50 via-white to-green-50 border border-green-100 p-6 overflow-hidden">
                    {/* Decorative accents (behind content) */}
                    <div className="absolute -top-16 -right-16 w-64 h-64 bg-gradient-to-br from-green-200 to-emerald-300 rounded-full opacity-30 blur-2xl -z-10"></div>
                    <div className="absolute -bottom-10 -left-10 w-52 h-52 bg-gradient-to-tr from-emerald-200 to-green-300 rounded-full opacity-25 blur-xl -z-10"></div>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
                        <div className="flex items-start gap-3">
                            <span className="text-4xl">🌿</span>
                            <div>
                                <h1 className="text-4xl font-extrabold text-green-900">
                                    Parcourir l&apos;Équipement Agricole
                                </h1>
                                <p className="mt-2 text-black">
                                    Trouvez le matériel dont vous avez besoin à des tarifs compétitifs
                                </p>
                                <div className="mt-4 flex gap-3">
                                    <Link href="/equipment/create" className="px-4 py-2 rounded-full bg-green-600 text-white text-sm font-semibold shadow hover:bg-green-700 transition">
                                        Ajouter mon Équipement
                                    </Link>
                                    <Link href="/marketplace" className="px-4 py-2 rounded-full bg-white text-green-700 border border-green-200 text-sm font-semibold shadow-sm hover:bg-green-50 transition">
                                        Découvrir le Marketplace
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-2">
                                <span className="text-sm text-black">Trier:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    className="text-sm p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 text-black"
                                >
                                    <option value="relevance">Pertinence</option>
                                    <option value="priceAsc">Prix ↑</option>
                                    <option value="priceDesc">Prix ↓</option>
                                    <option value="newest">Plus récent</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    {/* Wavy divider */}
                    <svg className="absolute bottom-0 left-0 right-0 h-12 text-green-100 -z-10 pointer-events-none" viewBox="0 0 1440 320" preserveAspectRatio="none">
                        <path fill="currentColor" d="M0,160L60,144C120,128,240,96,360,101.3C480,107,600,149,720,154.7C840,160,960,128,1080,96C1200,64,1320,32,1380,16L1440,0L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
                    </svg>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    </div>
                )}

                <section className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Filters */}
                    <aside className="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-200 shadow-md h-fit sticky top-24">
                        <h2 className="text-lg font-bold text-green-800 mb-4">Filtres</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-black mb-2">🔍 Recherche</label>
                                <input
                                    type="text"
                                    placeholder="Rechercher..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 placeholder-black text-black"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-black mb-2">🏷️ Catégorie</label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 text-black"
                                >
                                    <option value="Tous">Tous</option>
                                    <option value="Tractor">Tracteur</option>
                                    <option value="Harvester">Moissonneuse</option>
                                    <option value="Planter">Planteuse</option>
                                    <option value="Irrigation">Irrigation</option>
                                    <option value="Sprayer">Pulvérisateur</option>
                                    <option value="Trailer">Remorque</option>
                                    <option value="Other">Autre</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-black mb-2">📍 Localisation</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Sfax"
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 placeholder-black text-black"
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="availableOnly"
                                    checked={availableOnly}
                                    onChange={(e) => setAvailableOnly(e.target.checked)}
                                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                />
                                <label htmlFor="availableOnly" className="ml-2 text-sm text-black">
                                    Disponible uniquement
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-black mb-2">👤 Propriété</label>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIncludeMine((v) => !v)}
                                        className={`px-3 py-2 rounded-full text-sm border transition ${includeMine ? 'bg-green-600 text-white border-green-600 shadow' : 'bg-white text-black border-gray-300 hover:bg-green-50'}`}
                                    >
                                        Mes équipements
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIncludeOthers((v) => !v)}
                                        className={`px-3 py-2 rounded-full text-sm border transition ${includeOthers ? 'bg-emerald-600 text-white border-emerald-600 shadow' : 'bg-white text-black border-gray-300 hover:bg-emerald-50'}`}
                                    >
                                        Équipements des autres
                                    </button>
                                </div>
                                {(!includeMine && !includeOthers) && (
                                    <p className="mt-2 text-xs text-red-600">Sélectionnez au moins une option.</p>
                                )}
                            </div>

                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedCategory('Tous');
                                    setSelectedLocation('');
                                    setAvailableOnly(false);
                                    setIncludeMine(true);
                                    setIncludeOthers(true);
                                    setSortBy('relevance');
                                }}
                                className="w-full mt-4 px-4 py-2 rounded-md text-sm font-semibold bg-green-600 text-white hover:bg-green-700 transition shadow"
                            >
                                Réinitialiser les Filtres
                            </button>
                        </div>
                    </aside>

                    {/* Equipment Grid */}
                    <section className="lg:col-span-3">
                        <div className="mb-4 flex items-center gap-3 flex-wrap">
                            <span className="text-black">
                                {filteredEquipment.length} équipement{filteredEquipment.length > 1 ? 's' : ''} trouvé{filteredEquipment.length > 1 ? 's' : ''}
                            </span>
                            {/* Active filter chips */}
                            {searchTerm && (
                                <span className="px-2 py-1 text-xs bg-gray-100 text-black rounded-full border">Recherche: {searchTerm}</span>
                            )}
                            {selectedCategory !== 'Tous' && (
                                <span className="px-2 py-1 text-xs bg-gray-100 text-black rounded-full border">Catégorie: {categoryTranslations[selectedCategory] || selectedCategory}</span>
                            )}
                            {selectedLocation && (
                                <span className="px-2 py-1 text-xs bg-gray-100 text-black rounded-full border">Localisation: {selectedLocation}</span>
                            )}
                            {availableOnly && (
                                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full border border-green-200">Disponible</span>
                            )}
                            {includeMine && !includeOthers && (
                                <span className="px-2 py-1 text-xs bg-gray-100 text-black rounded-full border">Propriété: Mes équipements</span>
                            )}
                            {!includeMine && includeOthers && (
                                <span className="px-2 py-1 text-xs bg-gray-100 text-black rounded-full border">Propriété: Équipements des autres</span>
                            )}
                            {sortBy !== 'relevance' && (
                                <span className="px-2 py-1 text-xs bg-gray-100 text-black rounded-full border">Tri: {sortBy==='priceAsc'?'Prix ↑':sortBy==='priceDesc'?'Prix ↓':'Plus récent'}</span>
                            )}
                        </div>

                        {filteredEquipment.length === 0 ? (
                            <div className="bg-gray-50 rounded-lg p-12 text-center">
                                <p className="text-black text-lg mb-4">Aucun équipement trouvé</p>
                                <Link
                                    href="/equipment/create"
                                    className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                                >
                                    Ajouter le Premier Équipement
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredEquipment.map((eq) => <EquipmentCard key={eq.id} eq={eq} />)}
                            </div>
                        )}
                    </section>
                </section>
            </main>
            <Footer />
        </>
    );
}
