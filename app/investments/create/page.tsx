/* eslint-disable @typescript-eslint/no-explicit-any */
// app/investments/create/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { API_BASE_URL } from '@/src/api-config';

export default function CreateInvestmentPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        targetAmount: '',
        minimumInvestment: '',
        expectedROI: '',
        duration: '',
        category: 'Olives',
        location: '',
        images: '',
    });

    useEffect(() => {
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const token = localStorage.getItem('token');
        if (!token) {
            setError('Vous devez être connecté pour créer un projet');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/investments/projects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    targetAmount: parseFloat(formData.targetAmount),
                    minimumInvestment: parseFloat(formData.minimumInvestment),
                    expectedROI: parseFloat(formData.expectedROI),
                    duration: parseInt(formData.duration),
                    category: formData.category,
                    location: formData.location,
                    images: formData.images ? formData.images.split(',').map(img => img.trim()) : [],
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erreur lors de la création du projet');
            }

            const project = await response.json();
            setSuccess('Projet créé avec succès! Redirection...');
            
            setTimeout(() => {
                router.push(`/investments/${project.id}`);
            }, 1500);
        } catch (err: any) {
            setError(err.message || 'Erreur lors de la création du projet');
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <>
                <Header />
                <main className="max-w-7xl mx-auto px-4 pt-24 pb-12">
                    <p className="text-center text-gray-800">Chargement...</p>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="max-w-4xl mx-auto px-4 pt-24 pb-12">
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-green-900">
                        Créer un Projet d&apos;Investissement
                    </h1>
                    <p className="mt-2 text-gray-800">
                        Lancez votre projet agricole et trouvez des investisseurs
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
                        <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                            Titre du Projet *
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-600 text-gray-900"
                            placeholder="Ex: Exploitation d'oliviers bio - Sfax"
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
                            rows={6}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-600 text-gray-900"
                            placeholder="Décrivez votre projet en détail..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="targetAmount" className="block text-sm font-semibold text-gray-700 mb-2">
                                Montant Total (TND) *
                            </label>
                            <input
                                type="number"
                                id="targetAmount"
                                name="targetAmount"
                                value={formData.targetAmount}
                                onChange={handleChange}
                                required
                                min="1000"
                                step="100"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-600 text-gray-900"
                                placeholder="Ex: 50000"
                            />
                        </div>

                        <div>
                            <label htmlFor="minimumInvestment" className="block text-sm font-semibold text-gray-700 mb-2">
                                Investissement Minimum (TND) *
                            </label>
                            <input
                                type="number"
                                id="minimumInvestment"
                                name="minimumInvestment"
                                value={formData.minimumInvestment}
                                onChange={handleChange}
                                required
                                min="100"
                                step="100"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-600 text-gray-900"
                                placeholder="Ex: 1000"
                            />
                        </div>

                        <div>
                            <label htmlFor="expectedROI" className="block text-sm font-semibold text-gray-700 mb-2">
                                ROI Attendu (%) *
                            </label>
                            <input
                                type="number"
                                id="expectedROI"
                                name="expectedROI"
                                value={formData.expectedROI}
                                onChange={handleChange}
                                required
                                min="0"
                                max="100"
                                step="0.1"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-600 text-gray-900"
                                placeholder="Ex: 12.5"
                            />
                        </div>

                        <div>
                            <label htmlFor="duration" className="block text-sm font-semibold text-gray-700 mb-2">
                                Durée (mois) *
                            </label>
                            <input
                                type="number"
                                id="duration"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                required
                                min="1"
                                max="120"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-600 text-gray-900"
                                placeholder="Ex: 24"
                            />
                        </div>

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
                                <option value="Olives">Olives</option>
                                <option value="Greenhouse">Serre</option>
                                <option value="Livestock">Élevage</option>
                                <option value="Grains">Céréales</option>
                                <option value="Fruits">Fruits</option>
                                <option value="Vegetables">Légumes</option>
                                <option value="Equipment">Équipement</option>
                                <option value="Infrastructure">Infrastructure</option>
                                <option value="Other">Autre</option>
                            </select>
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
                            {loading ? 'Création en cours...' : 'Créer le Projet'}
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
