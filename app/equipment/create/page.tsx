/* eslint-disable @typescript-eslint/no-explicit-any */
// app/equipment/create/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { API_BASE_URL } from '@/src/api-config';

export default function CreateEquipmentPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'Tractor',
        pricePerDay: '',
        location: '',
        availability: true,
        images: '',
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const token = localStorage.getItem('token');
        if (!token) {
            setError('Vous devez être connecté pour ajouter de l\'équipement');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/equipment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    category: formData.category,
                    pricePerDay: parseFloat(formData.pricePerDay),
                    location: formData.location,
                    availability: formData.availability,
                    images: formData.images ? formData.images.split(',').map(img => img.trim()) : [],
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erreur lors de la création de l\'équipement');
            }

            const equipment = await response.json();
            setSuccess('Équipement ajouté avec succès! Redirection...');
            
            setTimeout(() => {
                router.push('/equipment/browse');
            }, 1500);
        } catch (err: any) {
            setError(err.message || 'Erreur lors de la création de l\'équipement');
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
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
            <main className="max-w-4xl mx-auto px-4 py-12">
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-green-900">
                        Ajouter du Matériel Agricole
                    </h1>
                    <p className="mt-2 text-gray-800">
                        Mettez votre équipement en location et générez des revenus supplémentaires
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                            Nom de l&apos;Équipement *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-600 text-gray-900"
                            placeholder="Ex: Tracteur John Deere 6120M"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                            Description *
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-600 text-gray-900"
                            placeholder="Décrivez l'équipement en détail..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                                Catégorie *
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
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
                            <label htmlFor="pricePerDay" className="block text-sm font-semibold text-gray-700 mb-2">
                                Prix par Jour (TND) *
                            </label>
                            <input
                                type="number"
                                id="pricePerDay"
                                name="pricePerDay"
                                value={formData.pricePerDay}
                                onChange={handleChange}
                                required
                                min="1"
                                step="1"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-600 text-gray-900"
                                placeholder="Ex: 150"
                            />
                        </div>

                        <div>
                            <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                                Localisation *
                            </label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-600 text-gray-900"
                                placeholder="Ex: Sfax, Tunisie"
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="availability"
                                name="availability"
                                checked={formData.availability}
                                onChange={handleChange}
                                className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                            />
                            <label htmlFor="availability" className="ml-3 text-sm font-semibold text-gray-700">
                                Disponible immédiatement
                            </label>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="images" className="block text-sm font-semibold text-gray-700 mb-2">
                            Images (URLs séparées par des virgules)
                        </label>
                        <input
                            type="text"
                            id="images"
                            name="images"
                            value={formData.images}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-600 text-gray-900"
                            placeholder="https://exemple.com/image1.jpg, https://exemple.com/image2.jpg"
                        />
                        <p className="mt-1 text-sm text-gray-700">
                            Entrez les URLs des images séparées par des virgules
                        </p>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition shadow-md"
                        >
                            {loading ? 'Ajout en cours...' : 'Ajouter l\'Équipement'}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                        >
                            Annuler
                        </button>
                    </div>
                </form>
            </main>
            <Footer />
        </>
    );
}
