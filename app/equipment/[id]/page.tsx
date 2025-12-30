/* eslint-disable @typescript-eslint/no-explicit-any */
// app/equipment/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ConfirmModal from '../../components/ConfirmModal';
import { useToast } from '../../components/ToastProvider';
import { API_BASE_URL } from '@/src/api-config';
import { 
    ArrowLeft, MapPin, Tag, Calendar, Star, Shield, Clock, CheckCircle, 
    ChevronLeft, ChevronRight, Heart, Share2, MessageCircle, Phone, Mail, 
    Zap, Award, TrendingUp, Users, Sparkles, AlertCircle, Loader2, X,
    Eye, Bookmark, CalendarDays, Banknote, Info, ExternalLink, Edit, Trash2
} from 'lucide-react';

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
    const { addToast } = useToast();
    const id = params.id as string;

    const [equipment, setEquipment] = useState<Equipment | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        // Get current user ID from localStorage
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

    const categoryData: { [key: string]: { label: string; icon: string; color: string } } = {
        'Tractor': { label: 'Tracteur', icon: '🚜', color: 'from-green-500 to-emerald-600' },
        'Harvester': { label: 'Moissonneuse', icon: '🌾', color: 'from-yellow-500 to-orange-600' },
        'Planter': { label: 'Planteuse', icon: '🌱', color: 'from-lime-500 to-green-600' },
        'Irrigation': { label: 'Irrigation', icon: '💧', color: 'from-blue-500 to-cyan-600' },
        'Sprayer': { label: 'Pulvérisateur', icon: '🧴', color: 'from-purple-500 to-pink-600' },
        'Trailer': { label: 'Remorque', icon: '🚛', color: 'from-gray-500 to-slate-600' },
        'Other': { label: 'Autre', icon: '⚙️', color: 'from-teal-500 to-cyan-600' }
    };

    const nextImage = () => {
        if (equipment?.images) {
            setCurrentImageIndex((prev) => (prev + 1) % equipment.images!.length);
        }
    };

    const prevImage = () => {
        if (equipment?.images) {
            setCurrentImageIndex((prev) => (prev - 1 + equipment.images!.length) % equipment.images!.length);
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
                    <div className="text-center">
                        <div className="relative w-24 h-24 mx-auto mb-8">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-ping opacity-20"></div>
                            <div className="absolute inset-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full animate-pulse"></div>
                            <div className="absolute inset-6 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                                <Loader2 className="w-10 h-10 text-white animate-spin" />
                            </div>
                        </div>
                        <p className="text-white/80 font-medium text-lg">Chargement de l&apos;équipement...</p>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    if (error || !equipment) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4">
                    <div className="max-w-md w-full text-center">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
                            <AlertCircle className="w-12 h-12 text-red-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-3">Équipement non trouvé</h1>
                        <p className="text-gray-600 mb-8">{error || 'L\'équipement que vous recherchez n\'existe pas ou a été supprimé.'}</p>
                        <button
                            onClick={() => router.push('/equipment/browse')}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Retour à la liste
                        </button>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    const category = categoryData[equipment.category] || categoryData['Other'];

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50/30">
                {/* ========== HERO IMAGE SECTION ========== */}
                <section className="relative pt-20">
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-transparent h-[500px]"></div>
                    
                    <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
                        {/* Breadcrumb & Actions */}
                        <div className="flex items-center justify-between mb-6">
                            <Link
                                href="/equipment/browse"
                                className="group inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                <span className="font-medium">Retour au catalogue</span>
                            </Link>
                            
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => setIsFavorite(!isFavorite)}
                                    className={`p-3 rounded-full backdrop-blur-xl border transition-all ${
                                        isFavorite 
                                            ? 'bg-red-500 border-red-400 text-white' 
                                            : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                                    }`}
                                >
                                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                                </button>
                                <button className="p-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Main Image Gallery */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                            {/* Main Image */}
                            <div className="lg:col-span-8 relative group">
                                <div 
                                    className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-slate-800 cursor-pointer"
                                    onClick={() => setIsLightboxOpen(true)}
                                >
                                    {equipment.images && equipment.images.length > 0 ? (
                                        <img 
                                            src={`${API_BASE_URL}${equipment.images[currentImageIndex]}`}
                                            alt={equipment.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-emerald-500/20 to-green-600/20 flex items-center justify-center">
                                            <span className="text-[150px]">{category.icon}</span>
                                        </div>
                                    )}
                                    
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="absolute bottom-6 left-6 flex items-center gap-2 text-white">
                                            <Eye className="w-5 h-5" />
                                            <span className="font-medium">Cliquez pour agrandir</span>
                                        </div>
                                    </div>

                                    {/* Navigation Arrows */}
                                    {equipment.images && equipment.images.length > 1 && (
                                        <>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                                            >
                                                <ChevronLeft className="w-6 h-6 text-gray-800" />
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                                            >
                                                <ChevronRight className="w-6 h-6 text-gray-800" />
                                            </button>
                                        </>
                                    )}

                                    {/* Image Counter */}
                                    {equipment.images && equipment.images.length > 1 && (
                                        <div className="absolute bottom-4 right-4 px-4 py-2 rounded-full bg-black/60 backdrop-blur text-white text-sm font-medium">
                                            {currentImageIndex + 1} / {equipment.images.length}
                                        </div>
                                    )}

                                    {/* Availability Badge */}
                                    <div className={`absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${
                                        equipment.availability 
                                            ? 'bg-emerald-500 text-white' 
                                            : 'bg-gray-500 text-white'
                                    }`}>
                                        <span className={`w-2 h-2 rounded-full ${equipment.availability ? 'bg-white animate-pulse' : 'bg-gray-300'}`}></span>
                                        {equipment.availability ? 'Disponible' : 'Loué'}
                                    </div>
                                </div>
                            </div>

                            {/* Thumbnail Grid */}
                            <div className="lg:col-span-4 grid grid-cols-2 gap-4">
                                {equipment.images && equipment.images.length > 1 ? (
                                    equipment.images.slice(0, 4).map((img, idx) => (
                                        <div 
                                            key={idx}
                                            onClick={() => setCurrentImageIndex(idx)}
                                            className={`relative aspect-square rounded-2xl overflow-hidden cursor-pointer transition-all ${
                                                currentImageIndex === idx 
                                                    ? 'ring-4 ring-emerald-500 ring-offset-2' 
                                                    : 'hover:opacity-80'
                                            }`}
                                        >
                                            <img 
                                                src={`${API_BASE_URL}${img}`}
                                                alt={`${equipment.name} ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            {idx === 3 && equipment.images!.length > 4 && (
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                    <span className="text-white font-bold text-xl">+{equipment.images!.length - 4}</span>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-2 aspect-square rounded-2xl bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                                        <div className="text-center">
                                            <span className="text-6xl block mb-2">{category.icon}</span>
                                            <p className="text-emerald-700 font-medium">{category.label}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========== CONTENT SECTION ========== */}
                <section className="max-w-7xl mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Title & Meta */}
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${category.color} text-white text-sm font-semibold`}>
                                        <span>{category.icon}</span>
                                        {category.label}
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium flex items-center gap-1">
                                        <Star className="w-4 h-4 fill-current" />
                                        Vérifié
                                    </span>
                                </div>
                                
                                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                                    {equipment.name}
                                </h1>
                                
                                <div className="flex flex-wrap items-center gap-4 text-gray-600">
                                    <span className="flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-emerald-600" />
                                        {equipment.location}
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                                    <span className="flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-emerald-600" />
                                        Ajouté le {new Date(equipment.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>

                            {/* Price Highlight - Mobile */}
                            <div className="lg:hidden">
                                <div className="p-6 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl text-white">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-black">{equipment.pricePerDay}</span>
                                        <span className="text-xl">TND</span>
                                        <span className="text-white/80">/ jour</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { icon: Banknote, label: 'Prix/Jour', value: `${equipment.pricePerDay} TND`, color: 'bg-emerald-50 text-emerald-600' },
                                    { icon: Tag, label: 'Catégorie', value: category.label, color: 'bg-blue-50 text-blue-600' },
                                    { icon: MapPin, label: 'Localisation', value: equipment.location, color: 'bg-purple-50 text-purple-600' },
                                    { icon: Shield, label: 'Statut', value: equipment.availability ? 'Disponible' : 'Loué', color: equipment.availability ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600' },
                                ].map((stat, i) => (
                                    <div key={i} className={`p-5 rounded-2xl ${stat.color.split(' ')[0]} border border-gray-100`}>
                                        <stat.icon className={`w-6 h-6 ${stat.color.split(' ')[1]} mb-3`} />
                                        <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                                        <p className="font-bold text-gray-900">{stat.value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Description */}
                            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                                        <Info className="w-6 h-6 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">Description</h2>
                                </div>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                                    {equipment.description}
                                </p>
                            </div>

                            {/* Features */}
                            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                                        <Sparkles className="w-6 h-6 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">Caractéristiques</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { icon: CheckCircle, text: 'État vérifié et certifié' },
                                        { icon: Shield, text: 'Assurance disponible' },
                                        { icon: Clock, text: 'Location flexible' },
                                        { icon: TrendingUp, text: 'Entretien régulier' },
                                        { icon: Award, text: 'Qualité garantie' },
                                        { icon: Users, text: 'Support technique inclus' },
                                    ].map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                            <feature.icon className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                                            <span className="text-gray-700 font-medium">{feature.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-6">
                                {/* Booking Card */}
                                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                                    {/* Price Header */}
                                    <div className="p-6 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600">
                                        <div className="flex items-baseline gap-2 text-white">
                                            <span className="text-5xl font-black">{equipment.pricePerDay}</span>
                                            <span className="text-2xl">TND</span>
                                            <span className="text-white/80">/ jour</span>
                                        </div>
                                        <p className="text-white/80 mt-2 text-sm">Tarifs dégressifs pour longue durée</p>
                                    </div>

                                    <div className="p-6 space-y-6">
                                        {/* Check if current user is the owner */}
                                        {currentUserId && equipment.owner.id === currentUserId ? (
                                            /* Owner Actions */
                                            <>
                                                <div className="p-4 bg-blue-50 rounded-xl text-center mb-4">
                                                    <p className="text-blue-700 font-medium">C'est votre équipement</p>
                                                </div>
                                                <Link
                                                    href={`/equipment/${equipment.id}/edit`}
                                                    className="group w-full relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white py-4 px-6 rounded-xl font-bold text-lg overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_-10px_rgba(59,130,246,0.5)]"
                                                >
                                                    <span className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                                    <span className="relative flex items-center gap-2">
                                                        <Edit className="w-5 h-5" />
                                                        Modifier
                                                    </span>
                                                </Link>
                                                
                                                <button
                                                    onClick={() => setShowDeleteModal(true)}
                                                    disabled={deleting}
                                                    className="w-full py-3 px-6 bg-red-100 border-2 border-red-200 rounded-xl font-semibold text-red-700 hover:bg-red-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                    {deleting ? 'Suppression...' : 'Supprimer'}
                                                </button>
                                            </>
                                        ) : !equipment.availability ? (
                                            <div className="p-4 bg-gray-100 rounded-xl text-center">
                                                <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                                <p className="text-gray-600 font-medium">Non disponible actuellement</p>
                                            </div>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => router.push(`/booking/${equipment.id}`)}
                                                    className="group w-full relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white py-4 px-6 rounded-xl font-bold text-lg overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_-10px_rgba(16,185,129,0.5)]"
                                                >
                                                    <span className="absolute inset-0 bg-gradient-to-r from-emerald-700 via-green-700 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                                    <span className="relative flex items-center gap-2">
                                                        <CalendarDays className="w-5 h-5" />
                                                        Réserver Maintenant
                                                    </span>
                                                </button>
                                                
                                                <button className="w-full py-3 px-6 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                                                    <Bookmark className="w-5 h-5" />
                                                    Sauvegarder
                                                </button>
                                            </>
                                        )}

                                        {/* Trust Indicators */}
                                        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                                            {[
                                                { icon: Shield, text: 'Paiement sécurisé' },
                                                { icon: CheckCircle, text: 'Annulation gratuite' },
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                                    <item.icon className="w-4 h-4 text-emerald-600" />
                                                    <span>{item.text}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Owner Card */}
                                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Users className="w-5 h-5 text-emerald-600" />
                                        Propriétaire
                                    </h3>
                                    
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                                            {equipment.owner.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-lg">{equipment.owner.name}</p>
                                            <div className="flex items-center gap-1 text-yellow-500">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className="w-4 h-4 fill-current" />
                                                ))}
                                                <span className="text-gray-600 text-sm ml-1">5.0</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Link
                                            href={`/users/${equipment.owner.id}`}
                                            className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30"
                                        >
                                            <ExternalLink className="w-5 h-5" />
                                            Voir le profil
                                        </Link>
                                        
                                    </div>
                                </div>

                                {/* Info Card */}
                                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl p-6 border border-emerald-200">
                                    <h3 className="font-bold text-emerald-800 mb-4 flex items-center gap-2">
                                        <Info className="w-5 h-5" />
                                        Informations Importantes
                                    </h3>
                                    <ul className="space-y-3">
                                        {[
                                            'Vérifiez l\'état avant location',
                                            'Caution remboursable requise',
                                            'Assurance recommandée',
                                            'Annulation flexible 24h avant'
                                        ].map((info, i) => (
                                            <li key={i} className="flex items-start gap-3 text-emerald-700">
                                                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                                <span>{info}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========== LIGHTBOX ========== */}
                {isLightboxOpen && equipment.images && (
                    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setIsLightboxOpen(false)}>
                        <button 
                            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                            onClick={() => setIsLightboxOpen(false)}
                        >
                            <X className="w-6 h-6" />
                        </button>
                        
                        <button 
                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                            className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                        >
                            <ChevronLeft className="w-8 h-8" />
                        </button>
                        
                        <img 
                            src={`${API_BASE_URL}${equipment.images[currentImageIndex]}`}
                            alt={equipment.name}
                            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                        />
                        
                        <button 
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                            className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                        >
                            <ChevronRight className="w-8 h-8" />
                        </button>
                        
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
                            {equipment.images.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                                    className={`w-3 h-3 rounded-full transition-all ${
                                        currentImageIndex === idx ? 'bg-white w-8' : 'bg-white/40 hover:bg-white/60'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </main>
            <Footer />

            {/* Animations */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
            `}</style>

            {/* Confirmation Modal */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={async () => {
                    setDeleting(true);
                    const token = localStorage.getItem('token');
                    try {
                        const res = await fetch(`${API_BASE_URL}/equipment/${equipment.id}`, {
                            method: 'DELETE',
                            headers: { Authorization: `Bearer ${token}` },
                        });
                        if (!res.ok) throw new Error('Erreur lors de la suppression');
                        router.push('/equipment/browse');
                    } catch (err) {
                        addToast('Erreur lors de la suppression', 'error');
                        setDeleting(false);
                    }
                }}
                title="Supprimer l'équipement"
                message="Êtes-vous sûr de vouloir supprimer cet équipement ? Cette action est irréversible."
                confirmText="Supprimer"
                cancelText="Annuler"
                isDangerous={true}
            />
        </>
    );
}
