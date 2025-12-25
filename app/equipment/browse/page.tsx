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
    }, [equipment, searchTerm, selectedCategory, selectedLocation, availableOnly]);

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

    if (loading) {
        return (
            <>
                <Header />
                <main className="max-w-7xl mx-auto px-4 py-12">
                    <p className="text-center text-gray-800">Chargement...</p>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="max-w-7xl mx-auto px-4 py-12">
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-extrabold text-green-900">
                                Parcourir l&apos;Équipement Agricole
                            </h1>
                            <p className="mt-2 text-gray-800">
                                Trouvez le matériel dont vous avez besoin à des tarifs compétitifs
                            </p>
                        </div>
                        <Link
                            href="/equipment/create"
                            className="px-5 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition shadow-md text-center"
                        >
                            ➕ Ajouter mon Équipement
                        </Link>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    </div>
                )}

                <section className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Filters */}
                    <aside className="lg:col-span-1 bg-gray-50 p-6 rounded-xl border border-gray-200 h-fit">
                        <h2 className="text-lg font-bold text-green-800 mb-4">Filtres</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
                                <input
                                    type="text"
                                    placeholder="Rechercher..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 placeholder-gray-600 text-gray-900"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">Localisation</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Sfax"
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 placeholder-gray-600 text-gray-900"
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
                                <label htmlFor="availableOnly" className="ml-2 text-sm text-gray-700">
                                    Disponible uniquement
                                </label>
                            </div>

                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedCategory('Tous');
                                    setSelectedLocation('');
                                    setAvailableOnly(false);
                                }}
                                className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-100 transition"
                            >
                                Réinitialiser les Filtres
                            </button>
                        </div>
                    </aside>

                    {/* Equipment Grid */}
                    <section className="lg:col-span-3">
                        <div className="mb-4 text-gray-800">
                            {filteredEquipment.length} équipement{filteredEquipment.length > 1 ? 's' : ''} trouvé{filteredEquipment.length > 1 ? 's' : ''}
                        </div>

                        {filteredEquipment.length === 0 ? (
                            <div className="bg-gray-50 rounded-lg p-12 text-center">
                                <p className="text-gray-900 text-lg mb-4">Aucun équipement trouvé</p>
                                <Link
                                    href="/equipment/create"
                                    className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                                >
                                    Ajouter le Premier Équipement
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredEquipment.map((eq) => (
                                    <div key={eq.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition border border-gray-200 overflow-hidden">
                                        <div className="h-48 bg-gradient-to-r from-green-100 to-gray-100 flex items-center justify-center">
                                            {eq.images && eq.images.length > 0 ? (
                                                <img
                                                    src={eq.images[0]}
                                                    alt={eq.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="text-green-700 text-6xl">🚜</div>
                                            )}
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

                                            <p className="text-sm text-gray-800 mb-3 line-clamp-2">{eq.description}</p>

                                            <div className="space-y-2 text-sm mb-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-700">Catégorie:</span>
                                                    <span className="font-semibold text-gray-800">
                                                        {categoryTranslations[eq.category] || eq.category}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-700">Prix/jour:</span>
                                                    <span className="font-bold text-green-700">{eq.pricePerDay} TND</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-700">📈 Localisation:</span>
                                                    <span className="text-gray-800">{eq.location}</span>
                                                </div>
                                            </div>

                                            <div className="pt-3 border-t border-gray-200">
                                                <div className="flex items-center gap-2 text-sm text-gray-800 mb-3">
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
                                ))}
                            </div>
                        )}
                    </section>
                </section>
            </main>
            <Footer />
        </>
    );
}
