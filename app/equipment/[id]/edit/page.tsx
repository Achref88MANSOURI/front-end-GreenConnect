/* eslint-disable @typescript-eslint/no-explicit-any */
// app/equipment/[id]/edit/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { API_BASE_URL } from '@/src/api-config';
import { Wrench, Upload, MapPin, Tag, FileText, DollarSign, CheckCircle, XCircle, Sparkles, ArrowLeft, Camera, Loader2, Shield, Clock, TrendingUp, Star, Zap, Save, Trash2 } from 'lucide-react';

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

export default function EditEquipmentPage() {
    const router = useRouter();
    const params = useParams();
    const equipmentId = params.id as string;

    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [uploadedImages, setUploadedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [dragActive, setDragActive] = useState(false);

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
            fetchEquipment();
        }
    }, [router, equipmentId]);

    const fetchEquipment = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/equipment/${equipmentId}`);
            if (!response.ok) {
                throw new Error('Équipement non trouvé');
            }
            const data: Equipment = await response.json();

            // Check if current user is owner
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                if (user.id === data.owner.id) {
                    setIsOwner(true);
                } else {
                    setError('Vous n\'êtes pas autorisé à modifier cet équipement');
                    setTimeout(() => router.push(`/equipment/${equipmentId}`), 2000);
                    return;
                }
            }

            setFormData({
                name: data.name,
                description: data.description,
                category: data.category,
                pricePerDay: data.pricePerDay.toString(),
                location: data.location,
                availability: data.availability,
            });

            if (data.images && data.images.length > 0) {
                setExistingImages(data.images);
            }
        } catch (err: any) {
            setError(err.message || 'Erreur lors du chargement de l\'équipement');
        } finally {
            setFetchLoading(false);
        }
    };

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

    const removeExistingImage = (index: number) => {
        setExistingImages(existingImages.filter((_, i) => i !== index));
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
            setError('Vous devez être connecté pour modifier l\'équipement');
            setLoading(false);
            return;
        }

        try {
            // Update equipment data (without images for now - backend may need adjustment)
            const updateData = {
                name: formData.name,
                description: formData.description,
                category: formData.category,
                pricePerDay: parseFloat(formData.pricePerDay),
                location: formData.location,
                availability: formData.availability,
            };

            const response = await fetch(`${API_BASE_URL}/equipment/${equipmentId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updateData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erreur lors de la modification de l\'équipement');
            }

            setSuccess('Équipement modifié avec succès! Redirection...');
            
            setTimeout(() => {
                router.push(`/equipment/${equipmentId}`);
            }, 1500);
        } catch (err: any) {
            setError(err.message || 'Erreur lors de la modification de l\'équipement');
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

    if (!isAuthenticated || fetchLoading) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
                    <div className="text-center">
                        <div className="relative w-20 h-20 mx-auto mb-6">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-ping opacity-20"></div>
                            <div className="absolute inset-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse"></div>
                            <div className="absolute inset-4 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-white animate-spin" />
                            </div>
                        </div>
                        <p className="text-white/80 font-medium">Chargement de l&apos;équipement...</p>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    if (!isOwner && error) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4">
                    <div className="max-w-md w-full text-center">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
                            <XCircle className="w-12 h-12 text-red-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-3">Accès refusé</h1>
                        <p className="text-gray-600 mb-8">{error}</p>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/30">
                {/* ========== HERO SECTION ========== */}
                <section className="relative overflow-hidden pt-20 pb-32">
                    {/* Background */}
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/90 via-indigo-800/85 to-slate-900/95"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.3),transparent_60%)]"></div>
                    </div>
                    
                    {/* Animated particles */}
                    <div className="absolute inset-0 overflow-hidden z-[1]">
                        {[...Array(12)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-2 h-2 bg-blue-400/30 rounded-full animate-float-particle"
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
                        <Link
                            href={`/equipment/${equipmentId}`}
                            className="group inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-medium">Retour aux détails</span>
                        </Link>

                        <div className="text-center max-w-3xl mx-auto">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-8 shadow-[0_0_40px_rgba(59,130,246,0.3)]">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg">
                                    <Wrench className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-sm font-bold text-white tracking-wide uppercase">Modifier l&apos;Équipement</span>
                                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                            </div>

                            <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
                                Modifier{' '}
                                <span className="relative">
                                    <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent blur-2xl opacity-60">Votre Matériel</span>
                                    <span className="relative bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Votre Matériel</span>
                                </span>
                            </h1>
                            <p className="text-xl text-white/80 leading-relaxed">
                                Mettez à jour les informations de votre équipement pour une meilleure visibilité.
                            </p>
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
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-[2rem] blur-xl opacity-20"></div>
                            
                            <div className="relative bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100">
                                {/* Form Header */}
                                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                                            <Sparkles className="w-7 h-7 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-white">Informations du Matériel</h2>
                                            <p className="text-white/80 text-sm">Modifiez les champs nécessaires</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 md:p-10 space-y-8">
                                    {/* Name Field */}
                                    <div className="group">
                                        <label htmlFor="name" className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                                            <Tag className="w-4 h-4 text-blue-600" />
                                            Nom de l&apos;Équipement <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 placeholder-gray-400 text-gray-900 transition-all text-lg"
                                            placeholder="Ex: Tracteur John Deere 6120M"
                                        />
                                    </div>

                                    {/* Description Field */}
                                    <div className="group">
                                        <label htmlFor="description" className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                                            <FileText className="w-4 h-4 text-blue-600" />
                                            Description Détaillée <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            required
                                            rows={5}
                                            className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 placeholder-gray-400 text-gray-900 transition-all resize-none"
                                            placeholder="Décrivez votre équipement en détail..."
                                        />
                                    </div>

                                    {/* Category Selection */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-4">
                                            <Wrench className="w-4 h-4 text-blue-600" />
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
                                                            ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/20'
                                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {formData.category === cat.value && (
                                                        <div className="absolute top-2 right-2">
                                                            <CheckCircle className="w-5 h-5 text-blue-600" />
                                                        </div>
                                                    )}
                                                    <span className="text-3xl block mb-2">{cat.icon}</span>
                                                    <span className={`text-sm font-semibold ${formData.category === cat.value ? 'text-blue-700' : 'text-gray-700'}`}>
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
                                                <DollarSign className="w-4 h-4 text-blue-600" />
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
                                                    className="w-full pl-5 pr-16 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 placeholder-gray-400 text-gray-900 transition-all text-lg"
                                                    placeholder="150"
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">TND</span>
                                            </div>
                                        </div>

                                        <div className="group">
                                            <label htmlFor="location" className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                                                <MapPin className="w-4 h-4 text-blue-600" />
                                                Localisation <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="location"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 placeholder-gray-400 text-gray-900 transition-all text-lg"
                                                placeholder="Ex: Sfax, Tunisie"
                                            />
                                        </div>
                                    </div>

                                    {/* Availability Toggle */}
                                    <div className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${formData.availability ? 'bg-blue-500' : 'bg-gray-400'}`}>
                                                <Clock className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">Disponible</p>
                                                <p className="text-sm text-gray-600">L&apos;équipement peut être réservé</p>
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
                                            <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-500"></div>
                                        </label>
                                    </div>

                                    {/* Existing Images */}
                                    {existingImages.length > 0 && (
                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-4">
                                                <Camera className="w-4 h-4 text-blue-600" />
                                                Images actuelles
                                            </label>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {existingImages.map((image, index) => (
                                                    <div key={index} className="relative group rounded-xl overflow-hidden bg-gray-100 aspect-square">
                                                        <img 
                                                            src={`${API_BASE_URL}${image}`} 
                                                            alt={`Image ${index + 1}`}
                                                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeExistingImage(index)}
                                                            className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                        {index === 0 && (
                                                            <span className="absolute top-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full font-semibold flex items-center gap-1">
                                                                <Star className="w-3 h-3" /> Principal
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Submit Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="group flex-1 relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-5 px-8 rounded-xl font-bold text-lg overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_-10px_rgba(59,130,246,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <span className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                                            <span className="relative flex items-center gap-3">
                                                {loading ? (
                                                    <>
                                                        <Loader2 className="w-6 h-6 animate-spin" />
                                                        Enregistrement...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="w-6 h-6" />
                                                        Enregistrer les modifications
                                                    </>
                                                )}
                                            </span>
                                        </button>
                                        <Link
                                            href={`/equipment/${equipmentId}`}
                                            className="px-8 py-5 border-2 border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all text-center"
                                        >
                                            Annuler
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </form>
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
