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
    const [uploadedImages, setUploadedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'Tractor',
        pricePerDay: '',
        location: '',
        availability: true,
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

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setUploadedImages([...uploadedImages, ...newFiles]);
            
            // Create previews for new files
            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setImagePreviews([...imagePreviews, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        // Cleanup the object URL to prevent memory leaks
        URL.revokeObjectURL(imagePreviews[index]);
        setUploadedImages(uploadedImages.filter((_, i) => i !== index));
        setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
        };
    }, []);

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
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('pricePerDay', parseFloat(formData.pricePerDay).toString());
            formDataToSend.append('location', formData.location);
            formDataToSend.append('availability', formData.availability.toString());
            
            uploadedImages.forEach((file) => {
                formDataToSend.append('images', file);
            });

            const response = await fetch(`${API_BASE_URL}/equipment`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formDataToSend,
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
                <main className="max-w-7xl mx-auto px-4 pt-24 pb-12">
                    <p className="text-center text-gray-900">Chargement...</p>
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
                        Ajouter du Matériel Agricole
                    </h1>
                    <p className="mt-2 text-gray-900">
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
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
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
                        <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
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
                            <label htmlFor="category" className="block text-sm font-semibold text-gray-900 mb-2">
                                Catégorie *
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
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
                            <label htmlFor="pricePerDay" className="block text-sm font-semibold text-gray-900 mb-2">
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
                            <label htmlFor="location" className="block text-sm font-semibold text-gray-900 mb-2">
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
                            <label htmlFor="availability" className="ml-3 text-sm font-semibold text-gray-900">
                                Disponible immédiatement
                            </label>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="images" className="block text-sm font-semibold text-gray-900 mb-2">
                            Télécharger des Images
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition">
                            <input
                                type="file"
                                id="images"
                                name="images"
                                onChange={handleImageUpload}
                                multiple
                                accept="image/*"
                                className="hidden"
                            />
                            <label htmlFor="images" className="cursor-pointer">
                                <p className="text-gray-900 font-semibold mb-1">Cliquez pour télécharger ou glissez-déposez</p>
                                <p className="text-sm text-gray-600">Formats supportés: JPG, PNG, GIF (max 5MB par image)</p>
                            </label>
                        </div>

                        {uploadedImages.length > 0 && (
                            <div className="mt-4">
                                <p className="text-sm font-semibold text-gray-900 mb-3">Images sélectionnées:</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {uploadedImages.map((file, index) => (
                                        <div key={index} className="relative group">
                                            <img 
                                                src={imagePreviews[index]} 
                                                alt={file.name}
                                                className="w-full h-32 object-cover rounded-lg bg-gray-100"
                                            />
                                            <div className="mt-1">
                                                <p className="text-xs text-gray-600 truncate">{file.name}</p>
                                                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
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
                            className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition text-gray-900"
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
