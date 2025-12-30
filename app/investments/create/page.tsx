/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/investments/create/page.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { API_BASE_URL } from '@/src/api-config';
import { form, div, main } from 'framer-motion/client';

export default function CreateListingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const steps = [
        { num: 1, title: 'Informations', icon: '📋' },
        { num: 2, title: 'Détails', icon: '🌱' },
        { num: 3, title: 'Disponibilité', icon: '📅' },
        { num: 4, title: 'Médias', icon: '📸' }
    ];

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        addImages(files);
    };

    const addImages = (files: File[]) => {
        setImageFiles(prev => [...prev, ...files]);
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreview(prev => [...prev, ...previews]);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
        addImages(files);
    };

    const removeImage = (index: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreview(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const token = localStorage.getItem('token');
        if (!token) {
            setError('Vous devez être connecté pour publier une terre');
            setLoading(false);
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
            
            // Add image files
            imageFiles.forEach((file) => {
                uploadData.append('images', file);
            });

            const response = await fetch(`${API_BASE_URL}/investments/lands`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: uploadData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erreur lors de la publication');
            }

            const land = await response.json();
            setSuccess('Terre publiée avec succès! Redirection...');
            
            setTimeout(() => {
                router.push(`/investments/${land.id}`);
            }, 1500);
        } catch (err: any) {
            setError(err.message || 'Erreur lors de la publication');
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
            <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 px-4 pt-24 pb-12">
                <div className="max-w-5xl mx-auto">
                    {/* Back Button */}
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => router.back()}
                        className="mb-6 flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-green-700 font-bold border-2 border-green-200 hover:bg-green-50 hover:scale-105 transition-all duration-300 shadow-md"
                    >
                        <span className="text-xl">←</span>
                        <span>Retour</span>
                    </motion.button>

                    {/* Header with Logo */}
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <motion.div
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="mb-6 flex justify-center"
                        >
                            <img 
                                src="/images/logo-full.jpg" 
                                alt="GreenConnect" 
                                className="h-20 w-auto object-contain drop-shadow-lg"
                            />
                        </motion.div>
                        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent mb-3">
                            Publier Votre Terre
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Remplissez les informations pour mettre votre terre en location et commencer à générer des revenus
                        </p>
                    </motion.div>

                    {/* Progress Steps */}
                    <div className="mb-10">
                        <div className="flex items-center justify-between max-w-2xl mx-auto">
                            {steps.map((step, index) => (
                                <React.Fragment key={step.num}>
                                    <div className="flex flex-col items-center">
                                        <div className={`relative w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all ${
                                            currentStep === step.num
                                                ? 'bg-emerald-500 text-white shadow-lg scale-110'
                                                : currentStep > step.num
                                                ? 'bg-emerald-500 text-white'
                                                : 'bg-white text-slate-400 border-2 border-slate-300'
                                        }`}>
                                            {currentStep > step.num ? '✓' : step.icon}
                                        </div>
                                        <span className={`mt-2 text-xs font-medium ${
                                            currentStep >= step.num ? 'text-emerald-600' : 'text-slate-400'
                                        }`}>
                                            {step.title}
                                        </span>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={`flex-1 h-0.5 mx-3 transition-all ${
                                            currentStep > step.num ? 'bg-emerald-500' : 'bg-slate-300'
                                        }`} />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    {/* Alerts */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded text-red-700 text-sm"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">⚠️</span>
                                    <div>
                                        <p className="font-bold text-red-800">Erreur</p>
                                        <p className="text-sm text-red-700">{error}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {success && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded text-emerald-700 text-sm"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">✓</span>
                                    <p className="font-semibold">{success}</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Form Container */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden"
                    >
                        <form onSubmit={handleSubmit} className="p-8 md:p-12">
                            <AnimatePresence mode="wait">
                                {/* Step 1: Basic Info */}
                                {currentStep === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <div>
                                            <label className="block text-sm font-bold text-gray-800 mb-2">
                                                Titre de la Terre <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 outline-none transition-all text-lg"
                                                placeholder="Ex: Terre fertile de 5 hectares à Sfax"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-800 mb-2">
                                                Description Complète <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                required
                                                rows={6}
                                                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 outline-none transition-all resize-none"
                                                placeholder="Décrivez en détail votre terre: type de sol, cultures précédentes, accès, irrigation..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-800 mb-2">
                                                Région / Gouvernorat <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 outline-none transition-all text-lg"
                                                placeholder="Ex: Sfax, Jendouba, Kairouan..."
                                            />
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 2: Land Details */}
                                {currentStep === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-800 mb-2">
                                                    Superficie (hectares) <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    name="areaHectares"
                                                    value={formData.areaHectares}
                                                    onChange={handleChange}
                                                    required
                                                    min="0.1"
                                                    step="0.1"
                                                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 outline-none transition-all text-lg"
                                                    placeholder="5.0"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-800 mb-2">
                                                    Prix Mensuel (TND) <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    name="leasePrice"
                                                    value={formData.leasePrice}
                                                    onChange={handleChange}
                                                    required
                                                    min="0"
                                                    step="100"
                                                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 outline-none transition-all text-lg"
                                                    placeholder="1500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-800 mb-2">
                                                    Type de Sol
                                                </label>
                                                <select
                                                    name="soilType"
                                                    value={formData.soilType}
                                                    onChange={handleChange}
                                                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 outline-none transition-all text-lg"
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
                                                <label className="block text-sm font-bold text-gray-800 mb-2">
                                                    Culture Principale <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    name="category"
                                                    value={formData.category}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 outline-none transition-all text-lg"
                                                >
                                                    <option value="Blé">🌾 Blé</option>
                                                    <option value="Orge">🌾 Orge</option>
                                                    <option value="Olives">🫒 Olives</option>
                                                    <option value="Dattes">🌴 Dattes</option>
                                                    <option value="Fruits">🍎 Fruits</option>
                                                    <option value="Légumes">🥬 Légumes</option>
                                                    <option value="Vignes">🍇 Vignes</option>
                                                    <option value="Amandes">🌰 Amandes</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-800 mb-2">
                                                Cultures Recommandées
                                            </label>
                                            <input
                                                type="text"
                                                name="cropType"
                                                value={formData.cropType}
                                                onChange={handleChange}
                                                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 outline-none transition-all text-lg"
                                                placeholder="Ex: Blé, Orge, Luzerne..."
                                            />
                                        </div>

                                        <motion.div 
                                            whileHover={{ scale: 1.02 }}
                                            className="flex items-center gap-4 p-5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200 cursor-pointer"
                                            onClick={() => setFormData({...formData, hasWaterAccess: !formData.hasWaterAccess})}
                                        >
                                            <input
                                                type="checkbox"
                                                name="hasWaterAccess"
                                                checked={formData.hasWaterAccess}
                                                onChange={handleChange}
                                                className="w-6 h-6 text-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            />
                                            <label className="flex items-center gap-3 cursor-pointer flex-1">
                                                <span className="text-3xl">💧</span>
                                                <div>
                                                    <p className="font-bold text-gray-900">Accès à l'eau</p>
                                                    <p className="text-sm text-gray-600">Système d'irrigation disponible</p>
                                                </div>
                                            </label>
                                        </motion.div>
                                    </motion.div>
                                )}

                                {/* Step 3: Availability */}
                                {currentStep === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-800 mb-2">
                                                    Disponible À Partir Du <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="date"
                                                    name="availableFrom"
                                                    value={formData.availableFrom}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 outline-none transition-all text-lg"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-800 mb-2">
                                                    Disponible Jusqu'Au <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="date"
                                                    name="availableUntil"
                                                    value={formData.availableUntil}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 outline-none transition-all text-lg"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-800 mb-2">
                                                    Durée Minimum (mois)
                                                </label>
                                                <input
                                                    type="number"
                                                    name="minSeasonMonths"
                                                    value={formData.minSeasonMonths}
                                                    onChange={handleChange}
                                                    min="1"
                                                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 outline-none transition-all text-lg"
                                                    placeholder="3"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-800 mb-2">
                                                    Durée Maximum (mois)
                                                </label>
                                                <input
                                                    type="number"
                                                    name="maxSeasonMonths"
                                                    value={formData.maxSeasonMonths}
                                                    onChange={handleChange}
                                                    min="1"
                                                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 outline-none transition-all text-lg"
                                                    placeholder="8"
                                                />
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-6 rounded-2xl border-2 border-yellow-200">
                                            <div className="flex gap-3">
                                                <span className="text-2xl">ℹ️</span>
                                                <div>
                                                    <p className="font-bold text-gray-900 mb-1">À propos de la durée</p>
                                                    <p className="text-sm text-gray-700">
                                                        Définissez une période flexible pour attirer plus de locataires potentiels. 
                                                        Les durées standards sont de 3-6 mois pour une saison de culture.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 4: Media Upload */}
                                {currentStep === 4 && (
                                    <motion.div
                                        key="step4"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <div>
                                            <label className="block text-sm font-bold text-gray-800 mb-3">
                                                Photos de votre terre <span className="text-red-500">*</span>
                                            </label>
                                            
                                            {/* Drag & Drop Zone */}
                                            <div
                                                onDragOver={handleDragOver}
                                                onDragLeave={handleDragLeave}
                                                onDrop={handleDrop}
                                                onClick={() => fileInputRef.current?.click()}
                                                className={`relative border-4 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                                                    isDragging 
                                                        ? 'border-green-500 bg-green-50 scale-105' 
                                                        : 'border-gray-300 bg-gray-50 hover:border-green-400 hover:bg-green-50/50'
                                                }`}
                                            >
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    onChange={handleImageChange}
                                                    multiple
                                                    accept="image/*"
                                                    className="hidden"
                                                />
                                                <div className="text-6xl mb-4">📸</div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                    Glissez vos photos ici
                                                </h3>
                                                <p className="text-gray-600 mb-4">
                                                    ou cliquez pour sélectionner des fichiers
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    PNG, JPG, JPEG (Max 10 images)
                                                </p>
                                            </div>

                                            {/* Image Preview Grid */}
                                            {imagePreview.length > 0 && (
                                                <div className="mt-6">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <p className="font-bold text-gray-900">
                                                            {imagePreview.length} image{imagePreview.length > 1 ? 's' : ''} sélectionnée{imagePreview.length > 1 ? 's' : ''}
                                                        </p>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setImageFiles([]);
                                                                setImagePreview([]);
                                                            }}
                                                            className="text-sm text-red-600 hover:text-red-700 font-semibold"
                                                        >
                                                            Tout supprimer
                                                        </button>
                                                    </div>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                        {imagePreview.map((preview, idx) => (
                                                            <motion.div
                                                                key={idx}
                                                                initial={{ opacity: 0, scale: 0.8 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                className="relative group"
                                                            >
                                                                <img
                                                                    src={preview}
                                                                    alt={`Preview ${idx + 1}`}
                                                                    className="w-full h-32 object-cover rounded-xl border-2 border-green-200"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeImage(idx)}
                                                                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center font-bold hover:bg-red-600"
                                                                >
                                                                    ×
                                                                </button>
                                                                <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                                                                    {idx === 0 ? 'Principale' : `Photo ${idx + 1}`}
                                                                </div>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Navigation Buttons */}
                            <div className="flex gap-4 mt-10 pt-8 border-t-2 border-gray-100">
                                {currentStep > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => setCurrentStep(prev => prev - 1)}
                                        className="px-8 py-4 border-2 border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-all duration-300"
                                    >
                                        ← Précédent
                                    </button>
                                )}
                                
                                {currentStep < 4 ? (
                                    <button
                                        type="button"
                                        onClick={() => setCurrentStep(prev => prev + 1)}
                                        className="flex-1 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 hover:from-green-700 hover:to-emerald-700"
                                    >
                                        Suivant →
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={loading || imageFiles.length === 0}
                                        className="flex-1 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <span>🌿</span>
                                        <span>{loading ? 'Publication...' : 'Publier la Terre'}</span>
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="px-8 py-4 border-2 border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-all duration-300"
                                >
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </>
    );
}

