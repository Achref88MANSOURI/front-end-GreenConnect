/* eslint-disable @typescript-eslint/no-explicit-any */
// app/equipment/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
        email: string;
    };
    createdAt: string;
}

export default function EquipmentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [equipment, setEquipment] = useState<Equipment | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchEquipmentDetails();
    }, [id]);

    const fetchEquipmentDetails = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/equipment/${id}`);
            if (!response.ok) {
                throw new Error('Équipement non trouvé');
            }
            const data = await response.json();
            setEquipment(data);
        } catch (err: any) {
            setError(err.message || 'Erreur lors du chargement de l\'équipement');
        } finally {
            setLoading(false);
        }
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

    if (error || !equipment) {
        return (
            <>
                <Header />
                <main className="max-w-7xl mx-auto px-4 py-12">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700 text-center">
                        {error || 'Équipement non trouvé'}
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="max-w-7xl mx-auto px-4 py-12">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="mb-6 text-green-600 hover:text-green-700 font-semibold flex items-center gap-2"
                >
                    ← Retour à la liste
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            {/* Image Gallery */}
                            {equipment.images && equipment.images.length > 0 ? (
                                <div className="h-96 bg-gradient-to-r from-green-100 to-gray-100 flex items-center justify-center">
                                    <img 
                                        src={`${API_BASE_URL}${equipment.images[0]}`}
                                        alt={equipment.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="h-96 bg-gradient-to-r from-green-100 to-gray-100 flex items-center justify-center text-green-700 text-9xl">
                                    🚜
                                </div>
                            )}

                            <div className="p-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h1 className="text-3xl font-extrabold text-green-900">
                                        {equipment.name}
                                    </h1>
                                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                        equipment.availability ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                    }`}>
                                        {equipment.availability ? 'Disponible' : 'Loué'}
                                    </span>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-gray-900 mb-6">
                                    <span>📍 {equipment.location}</span>
                                    <span>•</span>
                                    <span>🏷️ {categoryTranslations[equipment.category] || equipment.category}</span>
                                    <span>•</span>
                                    <span>📅 Ajouté le {new Date(equipment.createdAt).toLocaleDateString('fr-FR')}</span>
                                </div>

                                <div className="prose max-w-none">
                                    <h2 className="text-xl font-bold text-green-800 mb-3">Description</h2>
                                    <p className="text-gray-700 whitespace-pre-line">{equipment.description}</p>
                                </div>

                                <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div className="bg-green-50 rounded-lg p-4 text-center">
                                        <div className="text-sm text-gray-800">Prix par Jour</div>
                                        <div className="text-2xl font-bold text-green-700">{equipment.pricePerDay} TND</div>
                                    </div>
                                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                                        <div className="text-sm text-gray-800">Catégorie</div>
                                        <div className="text-lg font-bold text-blue-700">
                                            {categoryTranslations[equipment.category] || equipment.category}
                                        </div>
                                    </div>
                                    <div className="bg-purple-50 rounded-lg p-4 text-center">
                                        <div className="text-sm text-gray-800">Localisation</div>
                                        <div className="text-lg font-bold text-purple-700">{equipment.location}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Images */}
                        {equipment.images && equipment.images.length > 1 && (
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h2 className="text-xl font-bold text-green-800 mb-4">Galerie Photos</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {equipment.images.slice(1).map((img, idx) => (
                                        <img
                                            key={idx}
                                            src={`${API_BASE_URL}${img}`}
                                            alt={`${equipment.name} ${idx + 2}`}
                                            className="w-full h-48 object-cover rounded-lg"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar - Booking Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                            <h2 className="text-2xl font-bold text-green-800 mb-4">Réserver</h2>

                            {!equipment.availability ? (
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-800 text-center mb-6">
                                    Cet équipement n&apos;est pas disponible actuellement
                                </div>
                            ) : (
                                <>
                                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-gray-700 font-semibold">Prix par jour:</span>
                                            <span className="text-2xl font-bold text-green-700">
                                                {equipment.pricePerDay} TND
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-800 mt-2">
                                            Tarifs dégressifs possibles pour locations longue durée
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => router.push(`/booking/${equipment.id}`)}
                                        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-md mb-4"
                                    >
                                        Réserver Maintenant
                                    </button>

                                    <p className="text-xs text-gray-700 text-center">
                                        Vous serez redirigé vers la page de réservation
                                    </p>
                                </>
                            )}

                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <h3 className="font-semibold text-gray-800 mb-3">À propos du propriétaire</h3>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-xl">
                                        {equipment.owner.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-800">{equipment.owner.name}</div>
                                        <div className="text-sm text-gray-700">{equipment.owner.email}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        window.location.href = `mailto:${equipment.owner.email}?subject=Question à propos de ${equipment.name}`;
                                    }}
                                    className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                                >
                                    Contacter le Propriétaire
                                </button>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <h3 className="font-semibold text-gray-800 mb-3">Informations Importantes</h3>
                                <ul className="text-sm text-gray-800 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-600">✓</span>
                                        <span>Vérifiez l&apos;état de l&apos;équipement avant location</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-600">✓</span>
                                        <span>Caution remboursable requise</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-600">✓</span>
                                        <span>Assurance recommandée</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-600">✓</span>
                                        <span>Conditions d&apos;annulation flexibles</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
