/* eslint-disable @typescript-eslint/no-explicit-any */
// app/equipment/create/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { API_BASE_URL } from '@/src/api-config';
import { Wrench, Upload, MapPin, Tag, FileText, DollarSign, CheckCircle, XCircle, Sparkles, ArrowLeft, Camera, Loader2, Shield, Clock, TrendingUp, Star, Zap, Phone } from 'lucide-react';

export default function CreateEquipmentPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [uploadedImages, setUploadedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [activeStep, setActiveStep] = useState(1);
    const [dragActive, setDragActive] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'Tractor',
        pricePerDay: '',
        location: '',
        availability: true,
        ownerPhone: '',
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        } else {
            setIsAuthenticated(true);
            // Load user phone if available
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    const userData = JSON.parse(storedUser);
                    if (userData.phoneNumber) {
                        setFormData(prev => ({ ...prev, ownerPhone: userData.phoneNumber }));
                    }
                } catch (e) {
                    console.error('Error parsing user data', e);
                }
            }
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

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const newFiles = Array.from(e.dataTransfer.files);
            setUploadedImages([...uploadedImages, ...newFiles]);
            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setImagePreviews([...imagePreviews, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        URL.revokeObjectURL(imagePreviews[index]);
        setUploadedImages(uploadedImages.filter((_, i) => i !== index));
        setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    };

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

        if (!formData.ownerPhone || formData.ownerPhone.trim().length < 8) {
            setError('Veuillez entrer votre numéro de téléphone (minimum 8 chiffres)');
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

    const categories = [
        { value: 'Tractor', label: 'Tracteur', icon: '🚜', color: 'from-green-500 to-emerald-600' },
        { value: 'Harvester', label: 'Moissonneuse', icon: '🌾', color: 'from-yellow-500 to-orange-600' },
        { value: 'Planter', label: 'Planteuse', icon: '🌱', color: 'from-lime-500 to-green-600' },
        { value: 'Irrigation', label: 'Irrigation', icon: '💧', color: 'from-blue-500 to-cyan-600' },
        { value: 'Sprayer', label: 'Pulvérisateur', icon: '🧴', color: 'from-purple-500 to-pink-600' },
        { value: 'Trailer', label: 'Remorque', icon: '🚛', color: 'from-gray-500 to-slate-600' },
        { value: 'Other', label: 'Autre', icon: '⚙️', color: 'from-teal-500 to-cyan-600' },
    ];

    if (!isAuthenticated) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
                    <div className="text-center">
                        <div className="relative w-20 h-20 mx-auto mb-6">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-ping opacity-20"></div>
                            <div className="absolute inset-2 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full animate-pulse"></div>
                            <div className="absolute inset-4 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-white animate-spin" />
                            </div>
                        </div>
                        <p className="text-white/80 font-medium">Vérification de l&apos;authentification...</p>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50/30">
                {/* ========== HERO SECTION WITH IMAGE BACKGROUND ========== */}
                <section className="relative overflow-hidden pt-20 pb-32">
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                        <img 
                            src="/images/1.jpg" 
                            alt="Agricultural equipment" 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/90 via-green-800/85 to-slate-900/95"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3),transparent_60%)]"></div>
                    </div>
                    
                    {/* Animated particles */}
                    <div className="absolute inset-0 overflow-hidden z-[1]">
                        {[...Array(12)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-2 h-2 bg-emerald-400/30 rounded-full animate-float-particle"
                                style={{
                                    left: `${5 + (i * 8)}%`,
                                    top: `${10 + (i % 4) * 20}%`,
                                    animationDelay: `${i * 0.3}s`,
                                    animationDuration: `${4 + (i % 3)}s`
                                }}
                            />
                        ))}
                    </div>
                    
                    {/* Grid pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] z-[1]"></div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 pt-16">
                        {/* Back Button */}
                        <button
                            onClick={() => router.back()}
                            className="group inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-medium">Retour</span>
                        </button>

                        <div className="text-center max-w-3xl mx-auto">
                            {/* Premium Badge */}
                            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-8 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg">
                                    <Wrench className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-sm font-bold text-white tracking-wide uppercase">Ajouter un Équipement</span>
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                            </div>

                            <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
                                Listez Votre{' '}
                                <span className="relative">
                                    <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent blur-2xl opacity-60">Matériel</span>
                                    <span className="relative bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">Matériel</span>
                                </span>
                            </h1>
                            <p className="text-xl text-white/80 leading-relaxed">
                                Partagez votre équipement agricole et générez des{' '}
                                <span className="font-semibold text-emerald-300">revenus supplémentaires</span> tout en aidant d&apos;autres agriculteurs.
                            </p>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-12">
                            {[
                                { icon: TrendingUp, value: '+60%', label: 'Revenus en plus', color: 'text-green-400' },
                                { icon: Shield, value: '100%', label: 'Sécurisé', color: 'text-blue-400' },
                                { icon: Clock, value: '24h', label: 'Mise en ligne', color: 'text-yellow-400' },
                            ].map((stat, i) => (
                                <div key={i} className="text-center p-4 bg-white/10 backdrop-blur rounded-2xl border border-white/10">
                                    <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                                    <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                                    <p className="text-xs text-white/60">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ========== FORM SECTION ========== */}
                <section className="relative -mt-20 pb-24">
                    <div className="max-w-4xl mx-auto px-4">
                        {/* Alerts */}
                        {error && (
                            <div className="mb-6 p-5 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl flex items-start gap-4 animate-fadeIn shadow-lg">
                                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                                    <XCircle className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-red-800">Erreur</p>
                                    <p className="text-red-700">{error}</p>
                                </div>
                            </div>
                        )}

                        {success && (
                            <div className="mb-6 p-5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl flex items-start gap-4 animate-fadeIn shadow-lg">
                                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-green-800">Succès!</p>
                                    <p className="text-green-700">{success}</p>
                                </div>
                            </div>
                        )}

                        {/* Main Form Card */}
                        <form onSubmit={handleSubmit} className="relative">
                            {/* Glow Effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-[2rem] blur-xl opacity-20"></div>
                            
                            <div className="relative bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100">
                                {/* Form Header */}
                                <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 p-8">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                                                <Sparkles className="w-7 h-7 text-white" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-white">Informations du Matériel</h2>
                                                <p className="text-white/80 text-sm">Remplissez tous les champs pour une meilleure visibilité</p>
                                            </div>
                                        </div>
                                        <div className="hidden md:flex items-center gap-2">
                                            {[1, 2, 3].map((step) => (
                                                <div key={step} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step <= activeStep ? 'bg-white text-emerald-600' : 'bg-white/20 text-white/60'}`}>
                                                    {step}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 md:p-10 space-y-8">
                                    {/* Name Field */}
                                    <div className="group">
                                        <label htmlFor="name" className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                                            <Tag className="w-4 h-4 text-emerald-600" />
                                            Nom de l&apos;Équipement <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 placeholder-gray-400 text-gray-900 transition-all text-lg"
                                                placeholder="Ex: Tracteur John Deere 6120M"
                                            />
                                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 opacity-0 group-focus-within:opacity-10 transition-opacity pointer-events-none"></div>
                                        </div>
                                    </div>

                                    {/* Description Field */}
                                    <div className="group">
                                        <label htmlFor="description" className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                                            <FileText className="w-4 h-4 text-emerald-600" />
                                            Description Détaillée <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <textarea
                                                id="description"
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                required
                                                rows={5}
                                                className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 placeholder-gray-400 text-gray-900 transition-all resize-none"
                                                placeholder="Décrivez votre équipement en détail: état, caractéristiques, marque, année, puissance..."
                                            />
                                        </div>
                                        <p className="mt-2 text-sm text-gray-500 flex items-center gap-1">
                                            <Zap className="w-4 h-4 text-yellow-500" />
                                            Une description détaillée augmente vos chances de location de 40%
                                        </p>
                                    </div>

                                    {/* Category Selection - Visual Cards */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-4">
                                            <Wrench className="w-4 h-4 text-emerald-600" />
                                            Catégorie <span className="text-red-500">*</span>
                                        </label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {categories.map((cat) => (
                                                <button
                                                    key={cat.value}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, category: cat.value })}
                                                    className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                                                        formData.category === cat.value
                                                            ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/20'
                                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {formData.category === cat.value && (
                                                        <div className="absolute top-2 right-2">
                                                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                                                        </div>
                                                    )}
                                                    <span className="text-3xl block mb-2">{cat.icon}</span>
                                                    <span className={`text-sm font-semibold ${formData.category === cat.value ? 'text-emerald-700' : 'text-gray-700'}`}>
                                                        {cat.label}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Price and Location Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="group">
                                            <label htmlFor="pricePerDay" className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                                                <DollarSign className="w-4 h-4 text-emerald-600" />
                                                Prix par Jour <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    id="pricePerDay"
                                                    name="pricePerDay"
                                                    value={formData.pricePerDay}
                                                    onChange={handleChange}
                                                    required
                                                    min="1"
                                                    step="1"
                                                    className="w-full pl-5 pr-16 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 placeholder-gray-400 text-gray-900 transition-all text-lg"
                                                    placeholder="150"
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">TND</span>
                                            </div>
                                        </div>

                                        <div className="group">
                                            <label htmlFor="location" className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                                                <MapPin className="w-4 h-4 text-emerald-600" />
                                                Localisation <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="location"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 placeholder-gray-400 text-gray-900 transition-all text-lg"
                                                placeholder="Ex: Sfax, Tunisie"
                                            />
                                        </div>
                                    </div>

                                    {/* Availability Toggle */}
                                    <div className="flex items-center justify-between p-5 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${formData.availability ? 'bg-emerald-500' : 'bg-gray-400'}`}>
                                                <Clock className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">Disponible immédiatement</p>
                                                <p className="text-sm text-gray-600">Votre équipement sera visible dès maintenant</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="availability"
                                                checked={formData.availability}
                                                onChange={handleChange}
                                                className="sr-only peer"
                                            />
                                            <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
                                        </label>
                                    </div>

                                    {/* Image Upload Section */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-4">
                                            <Camera className="w-4 h-4 text-emerald-600" />
                                            Photos de l&apos;Équipement
                                            <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-semibold">Recommandé</span>
                                        </label>
                                        
                                        <div
                                            onDragEnter={handleDrag}
                                            onDragLeave={handleDrag}
                                            onDragOver={handleDrag}
                                            onDrop={handleDrop}
                                            className={`relative border-3 border-dashed rounded-2xl p-10 text-center transition-all duration-300 ${
                                                dragActive 
                                                    ? 'border-emerald-500 bg-emerald-50 scale-[1.02]' 
                                                    : 'border-gray-300 hover:border-emerald-400 hover:bg-gray-50'
                                            }`}
                                        >
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
                                                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                                                    <Upload className={`w-10 h-10 transition-colors ${dragActive ? 'text-emerald-600' : 'text-emerald-500'}`} />
                                                </div>
                                                <p className="text-lg font-semibold text-gray-900 mb-2">
                                                    Glissez-déposez vos images ici
                                                </p>
                                                <p className="text-gray-500 mb-4">ou cliquez pour parcourir</p>
                                                <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                                                    <Camera className="w-4 h-4" />
                                                    Sélectionner des images
                                                </span>
                                                <p className="text-xs text-gray-400 mt-4">PNG, JPG, GIF jusqu&apos;à 5MB</p>
                                            </label>
                                        </div>

                                        {/* Image Previews */}
                                        {uploadedImages.length > 0 && (
                                            <div className="mt-6">
                                                <div className="flex items-center justify-between mb-4">
                                                    <p className="text-sm font-bold text-gray-700">
                                                        {uploadedImages.length} image{uploadedImages.length > 1 ? 's' : ''} sélectionnée{uploadedImages.length > 1 ? 's' : ''}
                                                    </p>
                                                    <button
                                                        type="button"
                                                        onClick={() => { setUploadedImages([]); setImagePreviews([]); }}
                                                        className="text-sm text-red-600 hover:text-red-700 font-semibold"
                                                    >
                                                        Tout supprimer
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    {uploadedImages.map((file, index) => (
                                                        <div key={index} className="relative group rounded-xl overflow-hidden bg-gray-100 aspect-square">
                                                            <img 
                                                                src={imagePreviews[index]} 
                                                                alt={file.name}
                                                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                            <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <p className="text-xs text-white font-medium truncate">{file.name}</p>
                                                                <p className="text-xs text-white/70">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeImage(index)}
                                                                className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                                                            >
                                                                <XCircle className="w-5 h-5" />
                                                            </button>
                                                            {index === 0 && (
                                                                <span className="absolute top-2 left-2 px-2 py-1 bg-emerald-500 text-white text-xs rounded-full font-semibold flex items-center gap-1">
                                                                    <Star className="w-3 h-3" /> Principal
                                                                </span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Submit Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="group flex-1 relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white py-5 px-8 rounded-xl font-bold text-lg overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_-10px_rgba(16,185,129,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <span className="absolute inset-0 bg-gradient-to-r from-emerald-700 via-green-700 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                                            <span className="relative flex items-center gap-3">
                                                {loading ? (
                                                    <>
                                                        <Loader2 className="w-6 h-6 animate-spin" />
                                                        Ajout en cours...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Sparkles className="w-6 h-6" />
                                                        Publier l&apos;Équipement
                                                    </>
                                                )}
                                            </span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => router.back()}
                                            className="px-8 py-5 border-2 border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all"
                                        >
                                            Annuler
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>

                        {/* Trust Indicators */}
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { icon: Shield, title: 'Paiements Sécurisés', desc: 'Transactions protégées à 100%', color: 'text-blue-600', bg: 'bg-blue-50' },
                                { icon: Clock, title: 'Support 24/7', desc: 'Notre équipe est toujours là', color: 'text-purple-600', bg: 'bg-purple-50' },
                                { icon: TrendingUp, title: 'Visibilité Maximum', desc: 'Votre annonce vue par des milliers', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                            ].map((item, i) => (
                                <div key={i} className={`flex items-center gap-4 p-5 ${item.bg} rounded-2xl`}>
                                    <div className={`w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm`}>
                                        <item.icon className={`w-6 h-6 ${item.color}`} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{item.title}</p>
                                        <p className="text-sm text-gray-600">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />

            {/* Animations */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes float-particle {
                    0% { transform: translateY(0) translateX(0); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(-100px) translateX(20px); opacity: 0; }
                }
                .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
                .animate-float-particle { animation: float-particle 4s ease-out infinite; }
            `}</style>
        </>
    );
}
