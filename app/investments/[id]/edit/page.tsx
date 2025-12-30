/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/investments/[id]/edit/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { API_BASE_URL } from '@/src/api-config';

export default function EditListingPage() {
    const router = useRouter();
    const params = useParams();
    const landId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        areaHectares: '',
        leasePrice: '',
        availableFrom: '',
        availableUntil: '',
        category: 'Blé',
        location: '',
        soilType: '',
        cropType: '',
        hasWaterAccess: false,
        minSeasonMonths: '',
        maxSeasonMonths: '',
    });

    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreview, setImagePreview] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }
        setIsAuthenticated(true);
        fetchLandDetails(token);
    }, []);

    const fetchLandDetails = async (token: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/investments/lands/${landId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error('Erreur lors du chargement des détails');
            }

            const land = await response.json();
            
            // Format dates for input type="date" (YYYY-MM-DD)
            // Handle timezone issues by parsing the date string directly
            const formatDate = (dateString: string | undefined) => {
                if (!dateString) return '';
                // If it's already in YYYY-MM-DD format, return as is
                if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
                    return dateString;
                }
                // Otherwise parse ISO format carefully
                const date = new Date(dateString);
                // Get local date to avoid timezone shifts
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            setFormData({
                title: land.title || '',
                description: land.description || '',
                areaHectares: land.targetAmount?.toString() || '',
                leasePrice: land.currentAmount?.toString() || '',
                availableFrom: formatDate(land.availableFrom),
                availableUntil: formatDate(land.fundingDeadline),
                category: land.category || 'Blé',
                location: land.location || '',
                soilType: land.soilType || '',
                cropType: land.cropType || '',
                hasWaterAccess: land.hasWaterAccess || false,
                minSeasonMonths: land.minimumInvestment?.toString() || '',
                maxSeasonMonths: land.expectedROI?.toString() || '',
            });
            setExistingImages(land.images || []);
            setLoading(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur');
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setImageFiles(files);
        
        // Create preview URLs
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreview(previews);
    };

    const handleRemoveExistingImage = (index: number) => {
        setExistingImages(existingImages.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');

        const token = localStorage.getItem('token');
        if (!token) {
            setError('Vous devez être connecté');
            setSubmitting(false);
            return;
        }

        try {
            // Create FormData for file upload
            const uploadData = new FormData();
            uploadData.append('title', formData.title);
            uploadData.append('description', formData.description);
            uploadData.append('areaHectares', parseFloat(formData.areaHectares).toString());
            uploadData.append('leasePrice', parseFloat(formData.leasePrice).toString());
            uploadData.append('availableFrom', formData.availableFrom);
            uploadData.append('availableUntil', formData.availableUntil);
            uploadData.append('category', formData.category);
            uploadData.append('location', formData.location);
            uploadData.append('soilType', formData.soilType);
            uploadData.append('cropType', formData.cropType);
            uploadData.append('hasWaterAccess', formData.hasWaterAccess ? 'true' : 'false');
            if (formData.minSeasonMonths) {
                uploadData.append('minSeasonMonths', parseInt(formData.minSeasonMonths).toString());
            }
            if (formData.maxSeasonMonths) {
                uploadData.append('maxSeasonMonths', parseInt(formData.maxSeasonMonths).toString());
            }

            // Add new image files only (images existantes sont gardées automatiquement au backend)
            imageFiles.forEach((file) => {
                uploadData.append('images', file);
            });

            const response = await fetch(`${API_BASE_URL}/investments/lands/${landId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: uploadData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erreur lors de la mise à jour');
            }

            setSuccess('Terre mise à jour avec succès! Redirection...');
            
            setTimeout(() => {
                router.push(`/investments/${landId}`);
            }, 1500);
        } catch (err: any) {
            setError(err.message || 'Erreur lors de la mise à jour');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
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
            <main className="min-h-screen bg-slate-50 px-4 pt-24 pb-12">
                <div className="max-w-4xl mx-auto">
                    {/* Back Button */}
                    <button
                        onClick={() => router.back()}
                        className="mb-6 flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-green-700 font-bold border-2 border-green-200 hover:bg-green-50 hover:scale-105 transition-all duration-300 shadow-md"
                    >
                        <span className="text-xl">←</span>
                        <span>Retour</span>
                    </button>

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">
                            Modifier Votre Terre
                        </h1>
                        <p className="text-slate-600">
                            Mettez à jour les informations de votre annonce
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-lg text-red-700 flex items-start gap-3">
                            <span className="text-xl">⚠️</span>
                            <div>
                                <p className="font-semibold">Erreur</p>
                                <p className="text-sm">{error}</p>
                            </div>
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-700 flex items-start gap-3">
                            <span className="text-xl">✓</span>
                            <div>
                                <p className="font-semibold">Succès!</p>
                                <p className="text-sm">{success}</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-10 space-y-8 border border-emerald-100/50">
                        {/* Basic Info */}
                        <fieldset className="space-y-6">
                            <legend className="text-2xl font-bold text-emerald-900 pb-4 border-b-2 border-emerald-200">
                                📋 Informations de Base
                            </legend>

                            <div>
                                <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
                                    Titre de la Terre <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                                    placeholder="Ex: Terre fertile à Sfax - 5 hectares"
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition resize-none"
                                    placeholder="Décrivez les caractéristiques de votre terre..."
                                />
                            </div>
                        </fieldset>

                        {/* Land Details */}
                        <fieldset className="space-y-6">
                            <legend className="text-2xl font-bold text-emerald-900 pb-4 border-b-2 border-emerald-200">
                                🌱 Détails de la Terre
                            </legend>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="areaHectares" className="block text-sm font-semibold text-gray-900 mb-2">
                                        Superficie (hectares) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="areaHectares"
                                        name="areaHectares"
                                        value={formData.areaHectares}
                                        onChange={handleChange}
                                        required
                                        min="0.1"
                                        step="0.1"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                                        placeholder="Ex: 5"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="leasePrice" className="block text-sm font-semibold text-gray-900 mb-2">
                                        Prix Mensuel (TND) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="leasePrice"
                                        name="leasePrice"
                                        value={formData.leasePrice}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        step="100"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                                        placeholder="Ex: 1500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="soilType" className="block text-sm font-semibold text-gray-900 mb-2">
                                        Type de Sol
                                    </label>
                                    <select
                                        id="soilType"
                                        name="soilType"
                                        value={formData.soilType}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                                    >
                                        <option value="">Sélectionner...</option>
                                        <option value="Fertile">Fertile</option>
                                        <option value="Sableux">Sableux</option>
                                        <option value="Argileux">Argileux</option>
                                        <option value="Calcaire">Calcaire</option>
                                        <option value="Mélange">Mélange</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="category" className="block text-sm font-semibold text-gray-900 mb-2">
                                        Culture Principale <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                                    >
                                        <option value="Blé">Blé</option>
                                        <option value="Orge">Orge</option>
                                        <option value="Olives">Olives</option>
                                        <option value="Dattes">Dattes</option>
                                        <option value="Fruits">Fruits</option>
                                        <option value="Légumes">Légumes</option>
                                        <option value="Vignes">Vignes</option>
                                        <option value="Amandes">Amandes</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="cropType" className="block text-sm font-semibold text-gray-900 mb-2">
                                        Cultures Recommandées
                                    </label>
                                    <input
                                        type="text"
                                        id="cropType"
                                        name="cropType"
                                        value={formData.cropType}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                                        placeholder="Ex: Blé, Orge, Luzerne"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <input
                                    type="checkbox"
                                    id="hasWaterAccess"
                                    name="hasWaterAccess"
                                    checked={formData.hasWaterAccess}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <label htmlFor="hasWaterAccess" className="flex items-center gap-2 cursor-pointer">
                                    <span className="text-xl">💧</span>
                                    <span className="font-medium text-gray-900">La terre a accès à l'eau (irrigation)</span>
                                </label>
                            </div>
                        </fieldset>

                        {/* Availability */}
                        <fieldset className="space-y-6">
                            <legend className="text-2xl font-bold text-emerald-900 pb-4 border-b-2 border-emerald-200">
                                📅 Disponibilité
                            </legend>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="availableFrom" className="block text-sm font-semibold text-gray-900 mb-2">
                                        Disponible À Partir Du <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        id="availableFrom"
                                        name="availableFrom"
                                        value={formData.availableFrom}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="availableUntil" className="block text-sm font-semibold text-gray-900 mb-2">
                                        Disponible Jusqu'Au <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        id="availableUntil"
                                        name="availableUntil"
                                        value={formData.availableUntil}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="minSeasonMonths" className="block text-sm font-semibold text-gray-900 mb-2">
                                        Durée Minimum (mois)
                                    </label>
                                    <input
                                        type="number"
                                        id="minSeasonMonths"
                                        name="minSeasonMonths"
                                        value={formData.minSeasonMonths}
                                        onChange={handleChange}
                                        min="1"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                                        placeholder="Ex: 3"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="maxSeasonMonths" className="block text-sm font-semibold text-gray-900 mb-2">
                                        Durée Maximum (mois)
                                    </label>
                                    <input
                                        type="number"
                                        id="maxSeasonMonths"
                                        name="maxSeasonMonths"
                                        value={formData.maxSeasonMonths}
                                        onChange={handleChange}
                                        min="1"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                                        placeholder="Ex: 8"
                                    />
                                </div>
                            </div>
                        </fieldset>

                        {/* Location & Media */}
                        <fieldset className="space-y-6">
                            <legend className="text-2xl font-bold text-emerald-900 pb-4 border-b-2 border-emerald-200">
                                📍 Localisation & Médias
                            </legend>

                            <div>
                                <label htmlFor="location" className="block text-sm font-semibold text-gray-900 mb-2">
                                    Région / Gouvernorat <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                                    placeholder="Ex: Sfax, Jendouba, Kairouan"
                                />
                            </div>

                            {/* Existing Images */}
                            {existingImages.length > 0 && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Images Actuelles ({existingImages.length})
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {existingImages.map((image, idx) => (
                                            <div key={idx} className="relative">
                                                <img
                                                    src={image?.startsWith('http') ? image : `${API_BASE_URL}${image}`}
                                                    alt={`Image ${idx + 1}`}
                                                    className="w-full h-24 object-cover rounded-lg border border-emerald-200"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveExistingImage(idx)}
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* New Images */}
                            <div>
                                <label htmlFor="images" className="block text-sm font-semibold text-gray-900 mb-2">
                                    Ajouter des Images
                                </label>
                                <input
                                    type="file"
                                    id="images"
                                    name="images"
                                    onChange={handleImageChange}
                                    multiple
                                    accept="image/*"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                                />
                                <p className="mt-1 text-sm text-gray-600">
                                    Sélectionnez une ou plusieurs nouvelles images
                                </p>
                                
                                {/* New Image Preview */}
                                {imagePreview.length > 0 && (
                                    <div className="mt-4">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Nouvelles images ({imagePreview.length}):</p>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {imagePreview.map((preview, idx) => (
                                                <div key={idx} className="relative">
                                                    <img
                                                        src={preview}
                                                        alt={`Preview ${idx + 1}`}
                                                        className="w-full h-24 object-cover rounded-lg border border-emerald-200"
                                                    />
                                                    <p className="mt-1 text-xs text-gray-600 truncate">{imageFiles[idx]?.name}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </fieldset>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-6 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <span>✓</span>
                                <span>{submitting ? 'Mise à jour en cours...' : 'Mettre à Jour'}</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-8 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300"
                            >
                                Annuler
                            </button>
                        </div>
                    </form>
                </div>
            </main>
            <Footer />
        </>
    );
}
