/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/investments/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { API_BASE_URL } from '@/src/api-config';

interface LandListing {
    id: number;
    title: string;
    description: string;
    areaHectares: number;
    leasePrice: number;
    hasWaterAccess: boolean;
    soilType?: string;
    cropType?: string;
    category: string;
    location: string;
    status: string;
    availableFrom: string;
    availableUntil: string;
    minSeasonMonths?: number;
    maxSeasonMonths?: number;
    images?: string[];
    owner: {
        id: number;
        name: string;
        email: string;
    };
    createdAt: string;
}

interface LeaseRequest {
    id: number;
    seasonStartDate: string;
    seasonEndDate?: string;
    durationMonths: number;
    rentTotal: number;
    status: string;
    renter: {
        id: number;
        name: string;
    };
    requestedAt: string;
}

export default function LandDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [land, setLand] = useState<LandListing | null>(null);
    const [leaseRequests, setLeaseRequests] = useState<LeaseRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState<number | null>(null);

    // Lease request form
    const [showLeaseForm, setShowLeaseForm] = useState(false);
    const [leaseLoading, setLeaseLoading] = useState(false);
    const [leaseError, setLeaseError] = useState('');
    const [leaseSuccess, setLeaseSuccess] = useState('');
    const [leaseFormData, setLeaseFormData] = useState({
        seasonStartDate: '',
        customDurationMonths: '',
        farmingPlan: '',
        notes: '',
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUserId(payload.sub);
            } catch (err) {
                console.error('Failed to decode token');
            }
        }
        fetchLandDetails();
    }, [id]);

    const fetchLandDetails = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/investments/lands/${id}`);
            if (!response.ok) {
                throw new Error('Terre non trouvée');
            }
            const data = await response.json();
            setLand(data);

            // Fetch lease requests if authenticated
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const leaseResponse = await fetch(`${API_BASE_URL}/investments/lands/${id}/lease-requests`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    if (leaseResponse.ok) {
                        const leaseData = await leaseResponse.json();
                        setLeaseRequests(leaseData);
                    }
                } catch (err) {
                    // Silently fail
                }
            }
        } catch (err: any) {
            setError(err.message || 'Erreur lors du chargement');
        } finally {
            setLoading(false);
        }
    };

    const handleLeaseSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLeaseLoading(true);
        setLeaseError('');
        setLeaseSuccess('');

        const token = localStorage.getItem('token');
        if (!token) {
            setLeaseError('Vous devez être connecté pour louer une terre');
            setLeaseLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/investments/lease-request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    projectId: land?.id,
                    seasonStartDate: leaseFormData.seasonStartDate,
                    customDurationMonths: leaseFormData.customDurationMonths ? parseInt(leaseFormData.customDurationMonths) : null,
                    farmingPlan: leaseFormData.farmingPlan,
                    notes: leaseFormData.notes,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erreur lors de la demande');
            }

            setLeaseSuccess('Demande de location soumise avec succès!');
            setLeaseFormData({ seasonStartDate: '', customDurationMonths: '', farmingPlan: '', notes: '' });
            setShowLeaseForm(false);
            
            setTimeout(() => {
                fetchLandDetails();
            }, 1000);
        } catch (err: any) {
            setLeaseError(err.message);
        } finally {
            setLeaseLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 px-4 py-12">
                    <div className="max-w-6xl mx-auto text-center">
                        <div className="text-3xl text-emerald-700 animate-pulse">🌾 Chargement...</div>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    if (error || !land) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 px-4 py-12">
                    <div className="max-w-6xl mx-auto">
                        <div className="bg-red-50 border border-red-300 rounded-lg p-6 text-red-700">
                            <p className="font-semibold">Erreur</p>
                            <p>{error || 'Terre non trouvée'}</p>
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    const isOwner = userId === land.owner.id;

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 px-4 py-12">
                <div className="max-w-6xl mx-auto">
                    {/* Back Button */}
                    <button
                        onClick={() => router.back()}
                        className="mb-6 text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-2"
                    >
                        ← Retour aux terres
                    </button>

                    {/* Image Gallery */}
                    <div className="mb-8 rounded-2xl overflow-hidden shadow-lg border border-emerald-200/50">
                        <div className="h-96 bg-gradient-to-br from-emerald-200 to-green-200 flex items-center justify-center">
                            {land.images && land.images.length > 0 ? (
                                <img
                                    src={land.images[0]}
                                    alt={land.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="text-9xl">🌾</div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Header */}
                            <div className="bg-white rounded-2xl p-8 border border-emerald-100/50 shadow-sm">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h1 className="text-4xl font-bold text-emerald-900 mb-2">{land.title}</h1>
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <span>📍</span>
                                            <span className="text-lg">{land.location}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm ${
                                            land.status === 'available' ? 'bg-emerald-100 text-emerald-700' :
                                            land.status === 'reserved' ? 'bg-amber-100 text-amber-700' :
                                            'bg-green-100 text-green-700'
                                        }`}>
                                            {land.status === 'available' ? '✓ Disponible' : 
                                             land.status === 'reserved' ? '⏳ Réservée' : '✓ Louée'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Key Metrics */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-white rounded-xl p-6 border border-emerald-100/50 shadow-sm">
                                    <div className="text-sm text-gray-600 mb-2">Superficie</div>
                                    <div className="text-3xl font-bold text-emerald-700">{land.areaHectares} ha</div>
                                </div>
                                <div className="bg-white rounded-xl p-6 border border-green-100/50 shadow-sm">
                                    <div className="text-sm text-gray-600 mb-2">Prix Mensuel</div>
                                    <div className="text-3xl font-bold text-green-700">{land.leasePrice.toLocaleString()} ₺</div>
                                </div>
                                {land.minSeasonMonths && (
                                    <div className="bg-white rounded-xl p-6 border border-blue-100/50 shadow-sm">
                                        <div className="text-sm text-gray-600 mb-2">Durée Minimum</div>
                                        <div className="text-3xl font-bold text-blue-700">{land.minSeasonMonths} mois</div>
                                    </div>
                                )}
                                {land.maxSeasonMonths && (
                                    <div className="bg-white rounded-xl p-6 border border-purple-100/50 shadow-sm">
                                        <div className="text-sm text-gray-600 mb-2">Durée Maximum</div>
                                        <div className="text-3xl font-bold text-purple-700">{land.maxSeasonMonths} mois</div>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div className="bg-white rounded-2xl p-8 border border-emerald-100/50 shadow-sm">
                                <h2 className="text-2xl font-bold text-emerald-900 mb-4">À Propos de Cette Terre</h2>
                                <p className="text-gray-700 leading-relaxed text-lg">{land.description}</p>
                            </div>

                            {/* Features */}
                            <div className="bg-white rounded-2xl p-8 border border-emerald-100/50 shadow-sm">
                                <h2 className="text-2xl font-bold text-emerald-900 mb-6">Caractéristiques</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {land.hasWaterAccess && (
                                        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                            <span className="text-3xl">💧</span>
                                            <div>
                                                <p className="font-semibold text-blue-900">Accès à l'eau</p>
                                                <p className="text-sm text-blue-700">Irrigation incluse</p>
                                            </div>
                                        </div>
                                    )}
                                    {land.soilType && (
                                        <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
                                            <span className="text-3xl">🌱</span>
                                            <div>
                                                <p className="font-semibold text-amber-900">Type de sol</p>
                                                <p className="text-sm text-amber-700">{land.soilType}</p>
                                            </div>
                                        </div>
                                    )}
                                    {land.category && (
                                        <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                                            <span className="text-3xl">🌾</span>
                                            <div>
                                                <p className="font-semibold text-green-900">Culture principale</p>
                                                <p className="text-sm text-green-700">{land.category}</p>
                                            </div>
                                        </div>
                                    )}
                                    {land.cropType && (
                                        <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                                            <span className="text-3xl">🌽</span>
                                            <div>
                                                <p className="font-semibold text-purple-900">Cultures recommandées</p>
                                                <p className="text-sm text-purple-700">{land.cropType}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Availability */}
                            <div className="bg-white rounded-2xl p-8 border border-emerald-100/50 shadow-sm">
                                <h2 className="text-2xl font-bold text-emerald-900 mb-6">📅 Disponibilité</h2>
                                <div className="flex items-center gap-4 text-lg">
                                    <div>
                                        <p className="text-sm text-gray-600">Du</p>
                                        <p className="font-bold text-emerald-700">{new Date(land.availableFrom).toLocaleDateString('fr-FR')}</p>
                                    </div>
                                    <span className="text-2xl">→</span>
                                    <div>
                                        <p className="text-sm text-gray-600">Au</p>
                                        <p className="font-bold text-emerald-700">{new Date(land.availableUntil).toLocaleDateString('fr-FR')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Owner Info */}
                            <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-8 border border-emerald-200 shadow-sm">
                                <h2 className="text-2xl font-bold text-emerald-900 mb-4">Propriétaire</h2>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-green-400 flex items-center justify-center text-white text-2xl font-bold">
                                        {land.owner.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold text-emerald-900">{land.owner.name}</p>
                                        <p className="text-emerald-700">{land.owner.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Price Summary */}
                            <div className="bg-white rounded-2xl p-6 border border-emerald-100/50 shadow-lg sticky top-24">
                                <h3 className="text-xl font-bold text-emerald-900 mb-4">Résumé du Prix</h3>
                                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Prix par mois</span>
                                        <span className="font-bold text-emerald-700">{land.leasePrice.toLocaleString()} ₺</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Pour 3 mois</span>
                                        <span className="font-semibold text-gray-900">{(land.leasePrice * 3).toLocaleString()} ₺</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Pour 6 mois</span>
                                        <span className="font-semibold text-gray-900">{(land.leasePrice * 6).toLocaleString()} ₺</span>
                                    </div>
                                </div>

                                {!isOwner && land.status === 'available' && (
                                    <>
                                        {!showLeaseForm ? (
                                            <button
                                                onClick={() => setShowLeaseForm(true)}
                                                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300"
                                            >
                                                🌿 Louer Cette Terre
                                            </button>
                                        ) : (
                                            <div className="space-y-4">
                                                {leaseError && (
                                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                                        {leaseError}
                                                    </div>
                                                )}
                                                {leaseSuccess && (
                                                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm">
                                                        {leaseSuccess}
                                                    </div>
                                                )}
                                                <form onSubmit={handleLeaseSubmit} className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-900 mb-1">
                                                            Date de début *
                                                        </label>
                                                        <input
                                                            type="date"
                                                            value={leaseFormData.seasonStartDate}
                                                            onChange={(e) => setLeaseFormData({ ...leaseFormData, seasonStartDate: e.target.value })}
                                                            required
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-900 mb-1">
                                                            Durée (mois) *
                                                        </label>
                                                        <input
                                                            type="number"
                                                            value={leaseFormData.customDurationMonths}
                                                            onChange={(e) => setLeaseFormData({ ...leaseFormData, customDurationMonths: e.target.value })}
                                                            required
                                                            min="1"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
                                                            placeholder="Ex: 3"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-900 mb-1">
                                                            Plan de culture
                                                        </label>
                                                        <textarea
                                                            value={leaseFormData.farmingPlan}
                                                            onChange={(e) => setLeaseFormData({ ...leaseFormData, farmingPlan: e.target.value })}
                                                            rows={2}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm resize-none"
                                                            placeholder="Qu'allez-vous cultiver..."
                                                        />
                                                    </div>
                                                    <button
                                                        type="submit"
                                                        disabled={leaseLoading}
                                                        className="w-full py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-all text-sm"
                                                    >
                                                        {leaseLoading ? 'Envoi...' : 'Envoyer la Demande'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowLeaseForm(false)}
                                                        className="w-full py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 text-sm"
                                                    >
                                                        Annuler
                                                    </button>
                                                </form>
                                            </div>
                                        )}
                                    </>
                                )}

                                {isOwner && (
                                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
                                        ✓ C'est votre terre
                                    </div>
                                )}

                                {land.status !== 'available' && !isOwner && (
                                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm text-center font-semibold">
                                        Cette terre n'est pas disponible
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
