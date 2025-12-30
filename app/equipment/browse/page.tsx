/* eslint-disable @typescript-eslint/no-explicit-any */
// app/equipment/browse/page.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { API_BASE_URL } from '@/src/api-config';
import { Star, Sparkles, TrendingUp, Users, Zap, Shield, Award, ChevronDown, Search, MapPin, Filter, ArrowRight, Check, Heart, Calendar, Package, ClipboardList, Send, Inbox, Eye, Clock, Verified, ChevronRight } from 'lucide-react';

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

// Custom hook for scroll animations
function useScrollAnimation() {
    const [scrollY, setScrollY] = useState(0);
    
    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    return scrollY;
}

// Custom hook for intersection observer
function useInView(threshold = 0.1) {
    const ref = useRef<HTMLDivElement>(null);
    const [isInView, setIsInView] = useState(false);
    
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                }
            },
            { threshold, rootMargin: '50px' }
        );
        
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [threshold]);
    
    return { ref, isInView };
}

export default function BrowseEquipmentPage() {
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [filteredEquipment, setFilteredEquipment] = useState<Equipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Tous');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [availableOnly, setAvailableOnly] = useState(false);
    const [includeMine, setIncludeMine] = useState(false);
    const [includeOthers, setIncludeOthers] = useState(true);
    const [sortBy, setSortBy] = useState<'relevance' | 'priceAsc' | 'priceDesc' | 'newest'>('relevance');
    const [activeTab, setActiveTab] = useState<'browse' | 'favorites'>('browse');

    useEffect(() => {
        fetchEquipment();
    }, []);

    useEffect(() => {
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
        filterEquipment();
    }, [equipment, searchTerm, selectedCategory, selectedLocation, availableOnly, includeMine, includeOthers, sortBy]);

    const fetchEquipment = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/equipment`);
            if (!response.ok) {
                throw new Error('Erreur lors du chargement des équipements');
            }
            const data = await response.json();
            setEquipment(data);
            setFilteredEquipment(data);
        } catch (err: any) {
            setError(err.message || 'Erreur lors du chargement des équipements');
        } finally {
            setLoading(false);
        }
    };

    const filterEquipment = () => {
        let filtered = [...equipment];

        if (searchTerm) {
            filtered = filtered.filter(eq =>
                eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                eq.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory !== 'Tous') {
            filtered = filtered.filter(eq => eq.category === selectedCategory);
        }

        if (selectedLocation) {
            filtered = filtered.filter(eq =>
                eq.location.toLowerCase().includes(selectedLocation.toLowerCase())
            );
        }

        if (availableOnly) {
            filtered = filtered.filter(eq => eq.availability);
        }

        // Ownership filter via checkboxes
        filtered = filtered.filter(eq => {
            const isMine = Boolean(currentUserId) && eq.owner?.id === currentUserId;
            if (isMine) return includeMine;
            return includeOthers;
        });

        // Sorting
        if (sortBy === 'priceAsc') {
            filtered.sort((a, b) => a.pricePerDay - b.pricePerDay);
        } else if (sortBy === 'priceDesc') {
            filtered.sort((a, b) => b.pricePerDay - a.pricePerDay);
        } else if (sortBy === 'newest') {
            // Fallback: no createdAt in interface here, but backend returns it.
            // Use string compare if present; otherwise leave as-is
            filtered.sort((a: any, b: any) => (b.createdAt?.localeCompare?.(a.createdAt) ?? 0));
        }

        setFilteredEquipment(filtered);
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

    const categoryIcons: { [key: string]: string } = {
        'Tractor': '🚜',
        'Harvester': '🌾',
        'Planter': '🌱',
        'Irrigation': '💧',
        'Sprayer': '💨',
        'Trailer': '🛣️',
        'Other': '⚙️'
    };

    function EquipmentCard({ eq, index }: { eq: Equipment; index: number }) {
        const [isHovered, setIsHovered] = useState(false);
        const [isFavorited, setIsFavorited] = useState(false);
        const cardRef = useRef<HTMLDivElement>(null);
        const [isVisible, setIsVisible] = useState(false);

        useEffect(() => {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => setIsVisible(true), index * 100);
                    }
                },
                { threshold: 0.1, rootMargin: '50px' }
            );
            if (cardRef.current) observer.observe(cardRef.current);
            return () => observer.disconnect();
        }, [index]);

        return (
            <div 
                ref={cardRef}
                className={`group relative transition-all duration-700 ${
                    isVisible 
                        ? 'opacity-100 translate-y-0 scale-100' 
                        : 'opacity-0 translate-y-12 scale-95'
                }`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Multi-layer glow effect on hover */}
                <div className={`absolute -inset-2 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400 rounded-[2rem] blur-xl transition-all duration-700 ${
                    isHovered ? 'opacity-50 scale-105' : 'opacity-0 scale-100'
                }`}></div>
                <div className={`absolute -inset-1 bg-gradient-to-r from-emerald-300 via-green-400 to-cyan-400 rounded-3xl blur-lg transition-all duration-500 ${
                    isHovered ? 'opacity-40' : 'opacity-0'
                }`}></div>
                
                <div className={`relative bg-white rounded-[1.5rem] shadow-xl transition-all duration-500 border-2 overflow-hidden ${
                    isHovered 
                        ? 'shadow-2xl shadow-green-500/20 border-green-200 -translate-y-3 scale-[1.02]' 
                        : 'border-gray-100/80 shadow-gray-200/50'
                }`}>
                    {/* Animated background patterns */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-green-100/60 to-transparent rounded-bl-[100px] transition-transform duration-700 ${
                            isHovered ? 'scale-150 rotate-12' : 'scale-100'
                        }`}></div>
                        <div className={`absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-100/40 to-transparent rounded-tr-[80px] transition-transform duration-700 ${
                            isHovered ? 'scale-150 -rotate-12' : 'scale-100'
                        }`}></div>
                        {/* Floating particles */}
                        <div className={`absolute top-20 left-10 w-2 h-2 bg-green-400/50 rounded-full transition-all duration-1000 ${
                            isHovered ? 'opacity-100 translate-y-[-20px]' : 'opacity-0'
                        }`}></div>
                        <div className={`absolute top-32 right-12 w-3 h-3 bg-emerald-400/40 rounded-full transition-all duration-1000 delay-100 ${
                            isHovered ? 'opacity-100 translate-y-[-30px]' : 'opacity-0'
                        }`}></div>
                    </div>
                    
                    {/* Image Section - Enhanced */}
                    <div className="relative h-56 bg-gradient-to-br from-slate-100 via-green-50 to-emerald-100 flex items-center justify-center overflow-hidden">
                        {eq.images && eq.images.length > 0 ? (
                            <>
                                <img
                                    src={`${API_BASE_URL}${eq.images[0]}`}
                                    alt={eq.name}
                                    className={`w-full h-full object-cover transition-all duration-1000 ${
                                        isHovered ? 'scale-110 brightness-105' : 'scale-100'
                                    }`}
                                    loading="lazy"
                                />
                                {/* Premium overlay effects */}
                                <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition-opacity duration-500 ${
                                    isHovered ? 'opacity-100' : 'opacity-40'
                                }`}></div>
                                <div className={`absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent transition-opacity duration-500 ${
                                    isHovered ? 'opacity-100' : 'opacity-0'
                                }`}></div>
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center relative">
                                {/* Premium icon container */}
                                <div className="relative">
                                    <div className={`absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl blur-2xl transition-all duration-700 ${
                                        isHovered ? 'opacity-60 scale-150' : 'opacity-30 scale-100'
                                    }`}></div>
                                    <div className={`relative bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-green-100/50 transition-all duration-500 ${
                                        isHovered ? 'scale-110 rotate-3 shadow-green-500/30' : 'scale-100 rotate-0'
                                    }`}>
                                        <span className="text-7xl block drop-shadow-lg">{categoryIcons[eq.category] || '🚜'}</span>
                                    </div>
                                </div>
                                {/* Background animation */}
                                <div className="absolute inset-0 pointer-events-none">
                                    <div className={`absolute top-1/4 left-1/4 w-20 h-20 bg-green-300/20 rounded-full blur-xl transition-all duration-1000 ${
                                        isHovered ? 'scale-200 opacity-100' : 'scale-100 opacity-50'
                                    }`}></div>
                                    <div className={`absolute bottom-1/4 right-1/4 w-16 h-16 bg-emerald-300/20 rounded-full blur-xl transition-all duration-1000 delay-200 ${
                                        isHovered ? 'scale-200 opacity-100' : 'scale-100 opacity-50'
                                    }`}></div>
                                </div>
                            </div>
                        )}
                        
                        {/* Top badges row */}
                        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                            {/* Category badge - Glass morphism */}
                            <div className={`px-4 py-2 rounded-2xl text-xs font-bold bg-white/80 backdrop-blur-xl border border-white/50 text-gray-800 shadow-xl flex items-center gap-2 transition-all duration-300 ${
                                isHovered ? 'scale-105 shadow-2xl' : ''
                            }`}>
                                <span className="text-lg">{categoryIcons[eq.category] || '⚙️'}</span>
                                <span className="hidden sm:inline">{categoryTranslations[eq.category] || eq.category}</span>
                            </div>
                            
                            {/* Availability badge - Animated */}
                            <div className={`px-4 py-2 rounded-2xl text-xs font-bold shadow-xl flex items-center gap-2 transition-all duration-300 ${
                                eq.availability 
                                    ? 'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white shadow-green-500/40' 
                                    : 'bg-white/80 backdrop-blur-xl text-gray-600 border border-gray-200'
                            } ${isHovered ? 'scale-105' : ''}`}>
                                {eq.availability ? (
                                    <>
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                        </span>
                                        <span>Disponible</span>
                                    </>
                                ) : (
                                    <>
                                        <Clock className="w-3 h-3" />
                                        <span>Indisponible</span>
                                    </>
                                )}
                            </div>
                        </div>
                        
                        {/* Floating action buttons */}
                        <div className={`absolute top-16 right-4 flex flex-col gap-2 transition-all duration-500 ${
                            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                        }`}>
                            <button 
                                onClick={(e) => { e.preventDefault(); setIsFavorited(!isFavorited); }}
                                className={`w-10 h-10 rounded-2xl backdrop-blur-xl flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 ${
                                    isFavorited 
                                        ? 'bg-red-500 text-white shadow-red-500/40' 
                                        : 'bg-white/90 text-gray-600 hover:text-red-500'
                                }`}
                            >
                                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                            </button>
                            <Link 
                                href={`/equipment/${eq.id}`}
                                className="w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-xl flex items-center justify-center shadow-lg text-gray-600 hover:text-green-600 transition-all duration-300 hover:scale-110"
                            >
                                <Eye className="w-5 h-5" />
                            </Link>
                        </div>
                        
                        {/* Bottom info overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                            <div className="flex justify-between items-end">
                                {/* Location badge - Premium */}
                                {eq.location && (
                                    <div className={`px-3 py-2 rounded-xl text-xs font-semibold bg-white/90 backdrop-blur-xl border border-white/50 text-gray-700 shadow-lg flex items-center gap-2 transition-all duration-300 ${
                                        isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-90'
                                    }`}>
                                        <MapPin className="w-3.5 h-3.5 text-green-600" />
                                        <span>{eq.location}</span>
                                    </div>
                                )}
                                
                                {/* Price badge - Glassmorphic Premium */}
                                <div className={`relative transition-all duration-500 ${
                                    isHovered ? 'scale-110' : 'scale-100'
                                }`}>
                                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur-lg opacity-50"></div>
                                    <div className="relative px-5 py-3 rounded-2xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white shadow-xl shadow-green-500/40">
                                        <span className="text-xl font-black">{eq.pricePerDay}</span>
                                        <span className="text-green-100 text-sm font-medium ml-1">TND/jour</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Section - Enhanced */}
                    <div className="p-6 relative">
                        {/* Title with animated underline */}
                        <div className="mb-4">
                            <h3 className={`text-xl font-black text-gray-900 line-clamp-1 transition-colors duration-300 ${
                                isHovered ? 'text-green-700' : ''
                            }`}>{eq.name}</h3>
                            <div className={`h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mt-2 transition-all duration-500 ${
                                isHovered ? 'w-full' : 'w-0'
                            }`}></div>
                        </div>

                        <p className="text-sm text-gray-600 mb-5 line-clamp-2 leading-relaxed">{eq.description}</p>

                        {/* Premium stats cards */}
                        <div className="grid grid-cols-2 gap-3 mb-5">
                            <div className={`p-3 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 transition-all duration-300 ${
                                isHovered ? 'scale-105 shadow-lg' : ''
                            }`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-6 h-6 rounded-lg bg-green-500 flex items-center justify-center">
                                        <Package className="w-3.5 h-3.5 text-white" />
                                    </div>
                                    <span className="text-xs text-gray-500 font-medium">Catégorie</span>
                                </div>
                                <p className="text-sm font-bold text-gray-900 truncate">{categoryTranslations[eq.category] || eq.category}</p>
                            </div>
                            <div className={`p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 transition-all duration-300 ${
                                isHovered ? 'scale-105 shadow-lg' : ''
                            }`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center">
                                        <TrendingUp className="w-3.5 h-3.5 text-white" />
                                    </div>
                                    <span className="text-xs text-gray-500 font-medium">Prix/jour</span>
                                </div>
                                <p className="text-sm font-black text-green-600">{eq.pricePerDay} TND</p>
                            </div>
                        </div>

                        {/* Separator with glow */}
                        <div className="relative py-4">
                            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                            <div className={`absolute inset-0 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent transition-opacity duration-500 ${
                                isHovered ? 'opacity-100' : 'opacity-0'
                            }`}></div>
                        </div>

                        {/* Owner section - Premium card */}
                        <Link 
                            href={`/users/${eq.owner.id}`}
                            className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 cursor-pointer ${
                                isHovered ? 'bg-gradient-to-r from-green-50 to-emerald-50' : 'bg-gray-50/50 hover:bg-green-50/30'
                            }`}
                        >
                            <div className="relative">
                                <div className={`absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur transition-all duration-300 ${
                                    isHovered ? 'opacity-50 scale-110' : 'opacity-0 scale-100'
                                }`}></div>
                                <div className="relative w-12 h-12 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg shadow-green-500/30">
                                    {eq.owner.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                                    <Verified className="w-2.5 h-2.5 text-white" />
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-900 truncate">{eq.owner.name}</p>
                                <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                    <Shield className="w-3 h-3" />
                                    Propriétaire vérifié
                                </p>
                            </div>
                            <div className={`w-8 h-8 rounded-full bg-green-100 flex items-center justify-center transition-all duration-300 ${
                                isHovered ? 'bg-green-500 text-white rotate-0' : 'text-green-600 -rotate-45'
                            }`}>
                                <ChevronRight className="w-4 h-4" />
                            </div>
                        </Link>

                        {/* Action buttons - Ultra Premium */}
                        <div className="flex gap-3 mt-5">
                            <Link
                                href={`/equipment/${eq.id}`}
                                className={`flex-1 text-center py-3.5 rounded-xl border-2 font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                                    isHovered 
                                        ? 'border-green-400 bg-green-50 text-green-700 shadow-lg' 
                                        : 'border-gray-200 text-gray-700 hover:border-green-300'
                                }`}
                            >
                                <Eye className="w-4 h-4" />
                                <span>Détails</span>
                                <ArrowRight className={`w-4 h-4 transition-all duration-300 ${
                                    isHovered ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'
                                }`} />
                            </Link>
                            {eq.availability && (!currentUserId || currentUserId !== eq.owner.id) && (
                                <Link
                                    href={`/booking/${eq.id}`}
                                    className={`flex-1 text-center py-3.5 rounded-xl text-white font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                                        isHovered
                                            ? 'bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 shadow-xl shadow-green-500/40 scale-105'
                                            : 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/25'
                                    }`}
                                >
                                    <Calendar className="w-4 h-4" />
                                    <span>Réserver</span>
                                </Link>
                            )}
                            {eq.availability && currentUserId && currentUserId === eq.owner.id && (
                                <div className="flex-1 text-center py-3.5 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 border border-gray-300 text-sm font-medium flex items-center justify-center gap-2">
                                    <Check className="w-4 h-4" />
                                    <span>Votre équipement</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-green-50/30">
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <div className="text-center">
                            <div className="relative w-20 h-20 mx-auto mb-6">
                                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-ping opacity-20"></div>
                                <div className="absolute inset-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full animate-pulse"></div>
                                <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                                    <Zap className="w-8 h-8 text-green-600 animate-pulse" />
                                </div>
                            </div>
                            <p className="text-lg font-semibold text-gray-700">Chargement des équipements...</p>
                            <p className="text-sm text-gray-500 mt-2">Veuillez patienter</p>
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-green-50/30">
                {/* ========== PREMIUM HERO SECTION WITH IMAGE BACKGROUND ========== */}
                <section className="relative overflow-hidden text-white pt-24 pb-32 px-4 min-h-[85vh] flex items-center">
                    {/* Full-screen Image Background */}
                    <div className="absolute inset-0">
                        <img 
                            src="/images/1.jpg" 
                            alt="Agricultural Equipment" 
                            className="w-full h-full object-cover"
                        />
                        {/* Multi-layer Gradient Overlays for premium depth */}
                        <div className="absolute inset-0 bg-gradient-to-br from-green-900/85 via-emerald-800/80 to-teal-900/85"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-green-900/40 via-transparent to-emerald-900/40"></div>
                    </div>
                    
                    {/* Animated Background Elements */}
                    <div className="absolute inset-0 pointer-events-none">
                        {/* Large gradient orbs with glow */}
                        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-green-400/20 to-emerald-300/15 rounded-full mix-blend-screen filter blur-3xl animate-float"></div>
                        <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-gradient-to-r from-teal-400/15 to-cyan-300/10 rounded-full mix-blend-screen filter blur-3xl animate-float-delayed"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl animate-pulse-slow"></div>
                        
                        {/* Premium Floating particles with glow */}
                        <div className="absolute top-20 left-10 w-4 h-4 bg-green-400/60 rounded-full animate-float-particle shadow-lg shadow-green-400/50"></div>
                        <div className="absolute top-40 right-20 w-3 h-3 bg-emerald-300/50 rounded-full animate-float-particle shadow-lg shadow-emerald-300/50" style={{animationDelay: '1s'}}></div>
                        <div className="absolute bottom-32 left-1/3 w-5 h-5 bg-teal-200/40 rounded-full animate-float-particle shadow-lg shadow-teal-200/50" style={{animationDelay: '2s'}}></div>
                        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-white/50 rounded-full animate-float-particle shadow-lg shadow-white/30" style={{animationDelay: '0.5s'}}></div>
                        <div className="absolute bottom-40 right-1/3 w-2 h-2 bg-yellow-300/40 rounded-full animate-float-particle shadow-lg shadow-yellow-300/30" style={{animationDelay: '1.5s'}}></div>
                        <div className="absolute top-60 left-1/4 w-3 h-3 bg-cyan-300/30 rounded-full animate-float-particle shadow-lg shadow-cyan-300/30" style={{animationDelay: '2.5s'}}></div>
                        
                        {/* Subtle grid pattern overlay */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
                        
                        {/* Light rays effect */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.1)_0%,transparent_60%)]"></div>
                    </div>

                    <div className="relative max-w-7xl mx-auto z-10">
                        {/* Premium badge with enhanced glow */}
                        <div className="flex justify-center mb-8">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 rounded-full blur opacity-40 group-hover:opacity-60 transition duration-500 animate-pulse"></div>
                                <div className="relative inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/15 backdrop-blur-xl border border-white/30 shadow-2xl">
                                    <div className="flex items-center gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400 drop-shadow-lg" />
                                        ))}
                                    </div>
                                    <div className="h-4 w-px bg-white/30"></div>
                                    <span className="text-sm font-bold text-white tracking-wide">+500 Équipements Disponibles</span>
                                    <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                                </div>
                            </div>
                        </div>

                        {/* Main title with enhanced gradient and animation */}
                        <div className="text-center mb-10 animate-title-slide">
                            <div className="inline-block mb-4">
                                <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-green-200 text-sm font-semibold">
                                    🌾 La Plateforme N°1 en Tunisie
                                </span>
                            </div>
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6">
                                <span className="block text-white drop-shadow-2xl mb-2">Équipement Agricole</span>
                                <span className="relative inline-block">
                                    <span className="block bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-400 bg-clip-text text-transparent animate-gradient-x drop-shadow-lg">
                                        Premium
                                    </span>
                                    <div className="absolute -bottom-2 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent blur-sm"></div>
                                </span>
                            </h1>
                            <p className="text-xl md:text-2xl text-green-100/90 max-w-3xl mx-auto leading-relaxed font-light">
                                Accédez à la plus grande plateforme de <span className="font-semibold text-white">location d&apos;équipement agricole</span> en Tunisie.
                                <br className="hidden md:block" />
                                Partagez, louez et optimisez vos ressources.
                            </p>
                        </div>

                        {/* Tab navigation with enhanced glow and glass effect */}
                        <div className="flex justify-center mb-12">
                            <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-all"></div>
                                <div className="relative inline-flex p-2 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/25 shadow-2xl">
                                    <button
                                        onClick={() => setActiveTab('browse')}
                                        className={`px-10 py-4 rounded-xl font-bold text-sm transition-all duration-500 flex items-center gap-3 ${
                                            activeTab === 'browse'
                                                ? 'bg-white text-green-700 shadow-xl shadow-white/30 scale-105'
                                                : 'text-white/90 hover:text-white hover:bg-white/15'
                                        }`}
                                    >
                                        <Search className={`w-5 h-5 ${activeTab === 'browse' ? 'animate-pulse' : ''}`} />
                                        <span>Parcourir</span>
                                        {activeTab === 'browse' && (
                                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-bold">{filteredEquipment.length}</span>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('favorites')}
                                        className={`px-10 py-4 rounded-xl font-bold text-sm transition-all duration-500 flex items-center gap-3 ${
                                            activeTab === 'favorites'
                                                ? 'bg-white text-green-700 shadow-xl shadow-white/30 scale-105'
                                                : 'text-white/90 hover:text-white hover:bg-white/15'
                                        }`}
                                    >
                                        <Heart className={`w-5 h-5 ${activeTab === 'favorites' ? 'text-red-500 fill-red-500' : ''}`} />
                                        <span>Favoris</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Stats row with enhanced glass cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
                            {[
                                { icon: Zap, value: '500+', label: 'Équipements', color: 'from-yellow-400 to-orange-500', glow: 'shadow-yellow-500/30' },
                                { icon: Users, value: '1,200+', label: 'Utilisateurs', color: 'from-blue-400 to-cyan-500', glow: 'shadow-blue-500/30' },
                                { icon: TrendingUp, value: '2.5M', label: 'TND Investis', color: 'from-green-400 to-emerald-500', glow: 'shadow-green-500/30' },
                                { icon: Award, value: '98%', label: 'Satisfaction', color: 'from-purple-400 to-pink-500', glow: 'shadow-purple-500/30' },
                            ].map((stat, index) => (
                                <div 
                                    key={index} 
                                    className="group relative"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className={`absolute -inset-1 bg-gradient-to-r ${stat.color} rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-all duration-500`}></div>
                                    <div className="relative bg-white/10 backdrop-blur-xl border border-white/25 rounded-2xl p-5 text-center hover:bg-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                                        <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-xl ${stat.glow} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                            <stat.icon className="w-7 h-7 text-white drop-shadow-lg" />
                                        </div>
                                        <p className="text-3xl md:text-4xl font-black text-white tracking-tight">{stat.value}</p>
                                        <p className="text-sm text-green-200 font-medium mt-1">{stat.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Scroll indicator with enhanced animation */}
                        <div className="flex flex-col items-center mt-14 space-y-2">
                            <span className="text-sm text-white/60 font-medium tracking-wide">Découvrir</span>
                            <div className="animate-scroll-indicator p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                                <ChevronDown className="w-6 h-6 text-white/80" />
                            </div>
                        </div>
                    </div>

                    {/* Bottom wave with enhanced design */}
                    <div className="absolute bottom-0 left-0 right-0">
                        <svg viewBox="0 0 1440 140" className="w-full h-24 fill-slate-50 drop-shadow-2xl">
                            <defs>
                                <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#f8fafc" />
                                    <stop offset="50%" stopColor="#ffffff" />
                                    <stop offset="100%" stopColor="#f8fafc" />
                                </linearGradient>
                            </defs>
                            <path fill="url(#wave-gradient)" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,69.3C960,85,1056,107,1152,106.7C1248,107,1344,85,1392,74.7L1440,64L1440,140L1392,140C1344,140,1248,140,1152,140C1056,140,960,140,864,140C768,140,672,140,576,140C480,140,384,140,288,140C192,140,96,140,48,140L0,140Z"></path>
                        </svg>
                    </div>
                </section>

                {/* ========== MAIN CONTENT ========== */}
                <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20 pb-20">
                    {/* Quick action cards with enhanced premium design */}
                    <div className="grid md:grid-cols-2 gap-6 mb-10">
                        <Link href="/equipment/create" className="group relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
                            {/* Animated gradient background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 group-hover:scale-105 transition-transform duration-700"></div>
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                            
                            {/* Floating particles */}
                            <div className="absolute top-4 left-4 w-2 h-2 bg-white/30 rounded-full animate-float-particle"></div>
                            <div className="absolute bottom-8 right-8 w-3 h-3 bg-white/20 rounded-full animate-float-particle" style={{animationDelay: '1s'}}></div>
                            
                            <div className="relative p-8 text-white">
                                <div className="flex items-center gap-5">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-white/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                                        <div className="relative w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border border-white/30">
                                            <Zap className="w-8 h-8" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-black mb-1">Ajouter mon Équipement</h3>
                                        <p className="text-green-100 text-base font-medium">Commencez à générer des revenus passifs</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                                        <ArrowRight className="w-6 h-6" />
                                    </div>
                                </div>
                                
                                {/* Bonus info */}
                                <div className="mt-6 pt-4 border-t border-white/20 flex items-center gap-4 text-sm">
                                    <span className="flex items-center gap-1.5">
                                        <Shield className="w-4 h-4" /> Assurance incluse
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <TrendingUp className="w-4 h-4" /> ROI moyen 25%
                                    </span>
                                </div>
                            </div>
                        </Link>
                        
                        <Link href="/marketplace" className="group relative overflow-hidden bg-white rounded-3xl border-2 border-green-100 shadow-xl hover:shadow-2xl hover:border-green-300 transition-all duration-500 hover:-translate-y-2">
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-green-100 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                            
                            <div className="relative p-8">
                                <div className="flex items-center gap-5">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-green-200/50 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                                        <div className="relative w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 border border-green-200">
                                            <TrendingUp className="w-8 h-8 text-green-600" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-black text-gray-900 mb-1">Découvrir le Marketplace</h3>
                                        <p className="text-gray-600 text-base font-medium">Produits agricoles locaux de qualité</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                                        <ArrowRight className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                                
                                {/* Bonus info */}
                                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-4 text-sm text-gray-600">
                                    <span className="flex items-center gap-1.5">
                                        <Award className="w-4 h-4 text-green-600" /> Qualité garantie
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Users className="w-4 h-4 text-green-600" /> +200 producteurs
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Quick navigation buttons for user's equipment and bookings */}
                    {currentUserId && (
                        <div className="grid md:grid-cols-2 gap-4 mb-10">
                            <Link href="/equipment/bookings/received" className="group flex items-center gap-4 p-5 bg-white rounded-2xl border-2 border-orange-100 hover:border-orange-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
                                    <Inbox className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900">Réservations Reçues</h4>
                                    <p className="text-sm text-gray-500">Demandes sur vos équipements</p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
                            </Link>
                            
                            <Link href="/equipment/bookings/sent" className="group flex items-center gap-4 p-5 bg-white rounded-2xl border-2 border-purple-100 hover:border-purple-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                                    <Send className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900">Réservations Envoyées</h4>
                                    <p className="text-sm text-gray-500">Vos demandes de location</p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                            </Link>
                        </div>
                    )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-xl">⚠️</span>
                        </div>
                        <p>{error}</p>
                    </div>
                )}

                <section className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* ========== ULTRA PREMIUM SIDEBAR FILTERS ========== */}
                    <aside className="lg:col-span-1">
                        <div className="relative group">
                            {/* Glow effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400 rounded-3xl blur-lg opacity-0 group-hover:opacity-20 transition-all duration-500"></div>
                            
                            <div className="relative bg-white p-6 rounded-3xl border border-gray-200 shadow-2xl sticky top-24 overflow-hidden">
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100 via-emerald-50 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 opacity-70"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-teal-100 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 opacity-50"></div>
                                
                                <div className="relative">
                                    {/* Header with enhanced design */}
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-green-400/30 rounded-2xl blur-lg"></div>
                                            <div className="relative w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30">
                                                <Filter className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black text-gray-900">Filtres</h2>
                                            <p className="text-xs text-gray-500">Affinez votre recherche</p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        {/* Search input - Ultra Premium */}
                                        <div className="group/input">
                                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-lg bg-green-100 flex items-center justify-center">
                                                    <Search className="w-3.5 h-3.5 text-green-600" />
                                                </div>
                                                Recherche
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="Rechercher..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="w-full p-4 pl-12 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 placeholder-gray-400 text-gray-900 transition-all bg-gray-50 group-hover/input:bg-white"
                                                />
                                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                {searchTerm && (
                                                    <button 
                                                        onClick={() => setSearchTerm('')}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 transition-colors"
                                                    >
                                                        ×
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* Category select - Ultra Premium */}
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
                                                    <span className="text-sm">🏷️</span>
                                                </div>
                                                Catégorie
                                            </label>
                                            <select
                                                value={selectedCategory}
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                                className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 text-gray-900 transition-all appearance-none bg-gray-50 hover:bg-white cursor-pointer font-medium"
                                            >
                                                <option value="Tous">📋 Toutes les catégories</option>
                                                <option value="Tractor">🚜 Tracteur</option>
                                                <option value="Harvester">🌾 Moissonneuse</option>
                                                <option value="Planter">🌱 Planteuse</option>
                                                <option value="Irrigation">💧 Irrigation</option>
                                                <option value="Sprayer">💨 Pulvérisateur</option>
                                                <option value="Trailer">🛣️ Remorque</option>
                                                <option value="Other">⚙️ Autre</option>
                                            </select>
                                        </div>

                                        {/* Location input - Ultra Premium */}
                                        <div className="group/input">
                                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center">
                                                    <MapPin className="w-3.5 h-3.5 text-purple-600" />
                                                </div>
                                                Localisation
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="Ex: Sfax, Tunis..."
                                                    value={selectedLocation}
                                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                                    className="w-full p-4 pl-12 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 placeholder-gray-400 text-gray-900 transition-all bg-gray-50 group-hover/input:bg-white"
                                                />
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            </div>
                                        </div>

                                        {/* Availability checkbox - Ultra Premium */}
                                        <div className="group/check cursor-pointer" onClick={() => setAvailableOnly(!availableOnly)}>
                                            <div className={`flex items-center p-4 rounded-2xl border-2 transition-all ${
                                                availableOnly 
                                                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 shadow-lg shadow-green-500/10' 
                                                    : 'bg-gray-50 border-gray-200 hover:border-green-200 hover:bg-green-50/50'
                                            }`}>
                                                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                                                    availableOnly 
                                                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 border-transparent' 
                                                        : 'border-gray-300 bg-white group-hover/check:border-green-400'
                                                }`}>
                                                    {availableOnly && <Check className="w-4 h-4 text-white" />}
                                                </div>
                                                <label className="ml-4 text-sm font-semibold text-gray-700 cursor-pointer select-none">
                                                    Disponible uniquement
                                                </label>
                                                {availableOnly && (
                                                    <div className="ml-auto px-2 py-0.5 bg-green-500 text-white text-xs rounded-full font-bold">
                                                        Actif
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Ownership filter - Ultra Premium */}
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center">
                                                    <Users className="w-3.5 h-3.5 text-orange-600" />
                                                </div>
                                                Propriété
                                            </label>
                                            <div className="flex flex-col gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setIncludeMine((v) => !v)}
                                                    className={`px-4 py-4 rounded-2xl text-sm font-bold border-2 transition-all flex items-center gap-3 ${
                                                        includeMine 
                                                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-transparent shadow-xl shadow-green-500/30 scale-[1.02]' 
                                                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-green-300 hover:bg-green-50'
                                                    }`}
                                                >
                                                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                                                        includeMine ? 'bg-white/20' : 'bg-gray-200'
                                                    }`}>
                                                        {includeMine ? <Check className="w-4 h-4" /> : null}
                                                    </div>
                                                    Mes équipements
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setIncludeOthers((v) => !v)}
                                                    className={`px-4 py-4 rounded-2xl text-sm font-bold border-2 transition-all flex items-center gap-3 ${
                                                        includeOthers 
                                                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-transparent shadow-xl shadow-emerald-500/30 scale-[1.02]' 
                                                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
                                                    }`}
                                                >
                                                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                                                        includeOthers ? 'bg-white/20' : 'bg-gray-200'
                                                    }`}>
                                                        {includeOthers ? <Check className="w-4 h-4" /> : null}
                                                    </div>
                                                    Équipements des autres
                                                </button>
                                            </div>
                                            {(!includeMine && !includeOthers) && (
                                                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                                                    <span className="text-base">⚠️</span> Sélectionnez au moins une option
                                                </div>
                                            )}
                                        </div>

                                        {/* Sort - Ultra Premium */}
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-lg bg-cyan-100 flex items-center justify-center">
                                                    <TrendingUp className="w-3.5 h-3.5 text-cyan-600" />
                                                </div>
                                                Trier par
                                            </label>
                                            <select
                                                value={sortBy}
                                                onChange={(e) => setSortBy(e.target.value as any)}
                                                className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 text-gray-900 transition-all appearance-none bg-gray-50 hover:bg-white cursor-pointer font-medium"
                                            >
                                                <option value="relevance">📊 Pertinence</option>
                                                <option value="priceAsc">💰 Prix croissant</option>
                                                <option value="priceDesc">💎 Prix décroissant</option>
                                                <option value="newest">🆕 Plus récent</option>
                                            </select>
                                        </div>

                                        {/* Divider */}
                                        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

                                        {/* Reset button - Ultra Premium */}
                                        <button
                                            onClick={() => {
                                                setSearchTerm('');
                                                setSelectedCategory('Tous');
                                                setSelectedLocation('');
                                                setAvailableOnly(false);
                                                setIncludeMine(true);
                                                setIncludeOthers(true);
                                                setSortBy('relevance');
                                            }}
                                            className="group/btn w-full mt-2 px-4 py-4 rounded-2xl text-sm font-bold bg-gradient-to-r from-gray-800 to-gray-900 text-white hover:from-gray-900 hover:to-black transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 hover:scale-[1.02]"
                                        >
                                            <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center group-hover/btn:rotate-180 transition-transform duration-500">
                                                <span className="text-base">🔄</span>
                                            </div>
                                            Réinitialiser les Filtres
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* ========== EQUIPMENT GRID SECTION ========== */}
                    <section className="lg:col-span-3">
                        {/* Results header - Ultra Premium with glassmorphism */}
                        <div className="mb-10 relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400 rounded-[2rem] blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                            <div className="relative p-6 bg-white/80 backdrop-blur-xl rounded-[1.5rem] border border-white/50 shadow-2xl overflow-hidden">
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-green-200/30 to-transparent rounded-bl-[100px]"></div>
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-200/30 to-transparent rounded-tr-[80px]"></div>
                                
                                <div className="relative flex flex-wrap items-center gap-6">
                                    {/* Count display - Premium animated */}
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
                                            <div className="relative w-16 h-16 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-xl shadow-green-500/30 transform hover:scale-110 hover:rotate-3 transition-all duration-300">
                                                <Zap className="w-8 h-8 text-white drop-shadow-lg" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-5xl font-black bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">{filteredEquipment.length}</span>
                                                <span className="text-lg font-bold text-gray-400">équipement{filteredEquipment.length > 1 ? 's' : ''}</span>
                                            </div>
                                            <p className="text-sm text-gray-500 font-medium">
                                                {filteredEquipment.length > 0 ? 'Disponibles pour vous' : 'Aucun résultat'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Separator */}
                                    <div className="hidden md:block h-14 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
                                    
                                    {/* Active filter chips - Ultra Premium */}
                                    <div className="flex flex-wrap gap-3 flex-1">
                                        {searchTerm && (
                                            <span className="group/chip px-4 py-2.5 text-sm bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-green-500/30 hover:shadow-xl hover:scale-105 transition-all">
                                                <Search className="w-4 h-4" /> 
                                                <span className="max-w-[100px] truncate">{searchTerm}</span>
                                                <button onClick={() => setSearchTerm('')} className="w-5 h-5 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center text-white ml-1 transition-colors">×</button>
                                            </span>
                                        )}
                                        {selectedCategory !== 'Tous' && (
                                            <span className="px-4 py-2.5 text-sm bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                                                <span className="text-lg">{categoryIcons[selectedCategory]}</span> {categoryTranslations[selectedCategory] || selectedCategory}
                                            </span>
                                        )}
                                        {selectedLocation && (
                                            <span className="px-4 py-2.5 text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:scale-105 transition-all">
                                                <MapPin className="w-4 h-4" /> {selectedLocation}
                                            </span>
                                        )}
                                        {availableOnly && (
                                            <span className="px-4 py-2.5 text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:scale-105 transition-all">
                                                <Check className="w-4 h-4" /> Disponible
                                            </span>
                                        )}
                                        {sortBy !== 'relevance' && (
                                            <span className="px-4 py-2.5 text-sm bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-bold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:scale-105 transition-all">
                                                {sortBy==='priceAsc'?'💰 Prix ↑':sortBy==='priceDesc'?'💎 Prix ↓':'🆕 Plus récent'}
                                            </span>
                                        )}
                                        {!searchTerm && selectedCategory === 'Tous' && !selectedLocation && !availableOnly && sortBy === 'relevance' && (
                                            <span className="px-4 py-2.5 text-sm bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 rounded-2xl font-medium flex items-center gap-2">
                                                <Sparkles className="w-4 h-4" /> Tous les équipements
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {filteredEquipment.length === 0 ? (
                            <div className="relative bg-gradient-to-br from-gray-50 via-white to-slate-100 rounded-3xl p-16 text-center border-2 border-dashed border-gray-300 overflow-hidden">
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-100 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 opacity-50"></div>
                                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-emerald-100 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 opacity-50"></div>
                                
                                <div className="relative">
                                    <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-xl">
                                        <Search className="w-12 h-12 text-gray-400" />
                                    </div>
                                    <h3 className="text-3xl font-black text-gray-800 mb-3">Aucun équipement trouvé</h3>
                                    <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">Essayez de modifier vos filtres ou ajoutez le premier équipement!</p>
                                    <Link
                                        href="/equipment/create"
                                        className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all shadow-xl shadow-green-500/30 hover:shadow-2xl hover:scale-105"
                                    >
                                        <Zap className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                        Ajouter le Premier Équipement
                                        <ArrowRight className="w-5 h-5 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                {filteredEquipment.map((eq, index) => (
                                    <EquipmentCard key={eq.id} eq={eq} index={index} />
                                ))}
                            </div>
                        )}

                        {/* Why choose section - Ultra Premium */}
                        {filteredEquipment.length > 0 && (
                            <div className="mt-16 relative overflow-hidden">
                                {/* Decorative background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-3xl"></div>
                                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-200/30 to-transparent rounded-full -translate-y-1/2 translate-x-1/2"></div>
                                <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-emerald-200/30 to-transparent rounded-full translate-y-1/2 -translate-x-1/2"></div>
                                
                                <div className="relative rounded-3xl p-10 border border-green-200">
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-green-400/30 rounded-2xl blur-lg"></div>
                                            <div className="relative w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                                                <Sparkles className="w-7 h-7 text-white" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-black text-gray-900">Pourquoi Choisir Faza&apos;et-Ard?</h3>
                                            <p className="text-gray-600 font-medium">La plateforme de confiance pour les agriculteurs tunisiens</p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid md:grid-cols-3 gap-6">
                                        {[
                                            { icon: Shield, title: 'Sécurité Garantie', desc: 'Assurance complète et vérification des utilisateurs', color: 'from-green-400 to-emerald-500', glow: 'shadow-green-500/30' },
                                            { icon: TrendingUp, title: 'Économies Réelles', desc: 'Jusqu\'à 60% d\'économies sur vos coûts opérationnels', color: 'from-blue-400 to-cyan-500', glow: 'shadow-blue-500/30' },
                                            { icon: Award, title: 'Support 24/7', desc: 'Une équipe dédiée à votre service', color: 'from-purple-400 to-pink-500', glow: 'shadow-purple-500/30' },
                                        ].map((item, index) => (
                                            <div key={index} className="group relative">
                                                <div className={`absolute -inset-1 bg-gradient-to-r ${item.color} rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-all duration-500`}></div>
                                                <div className="relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-green-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                                                    <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-5 shadow-xl ${item.glow} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                                        <item.icon className="w-7 h-7 text-white" />
                                                    </div>
                                                    <h4 className="font-black text-gray-900 mb-2 text-lg">{item.title}</h4>
                                                    <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                </section>
                </div>

                {/* ========== PREMIUM CTA SECTION WITH IMAGE ========== */}
                <section className="relative overflow-hidden py-32 px-4">
                    {/* Image Background */}
                    <div className="absolute inset-0">
                        <img 
                            src="/images/2.jpg" 
                            alt="Agriculture Background" 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-gray-900/90 to-slate-800/95"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30"></div>
                    </div>
                    
                    {/* Animated background elements */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-green-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-emerald-500/15 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-teal-500/10 rounded-full blur-3xl"></div>
                        
                        {/* Floating particles */}
                        <div className="absolute top-20 left-20 w-3 h-3 bg-green-400/60 rounded-full animate-float-particle shadow-lg shadow-green-400/50"></div>
                        <div className="absolute bottom-20 right-20 w-4 h-4 bg-emerald-400/50 rounded-full animate-float-particle shadow-lg shadow-emerald-400/50" style={{animationDelay: '1s'}}></div>
                        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-teal-400/50 rounded-full animate-float-particle shadow-lg shadow-teal-400/50" style={{animationDelay: '2s'}}></div>
                        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-yellow-400/40 rounded-full animate-float-particle shadow-lg shadow-yellow-400/30" style={{animationDelay: '0.5s'}}></div>
                    </div>

                    <div className="relative max-w-5xl mx-auto text-center z-10">
                        {/* Badge with glow */}
                        <div className="flex justify-center mb-8">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 rounded-full blur opacity-40 group-hover:opacity-60 transition duration-500"></div>
                                <div className="relative inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/15 backdrop-blur-xl border border-white/25 shadow-2xl">
                                    <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                                    <span className="text-sm font-bold text-white/95">Rejoignez +1000 agriculteurs satisfaits</span>
                                </div>
                            </div>
                        </div>

                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight">
                            Prêt à <span className="relative inline-block">
                                <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">Transformer</span>
                                <div className="absolute -bottom-2 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-green-400/50 to-transparent blur-sm"></div>
                            </span>
                            <br />
                            Votre Agriculture?
                        </h2>
                        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
                            Rejoignez la révolution agricole tunisienne. Partagez, louez, et prospérez <span className="text-white font-semibold">ensemble</span>.
                        </p>

                        {/* Stats row with enhanced design */}
                        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-12">
                            {[
                                { value: '500+', label: 'Équipements', color: 'text-white' },
                                { value: '98%', label: 'Satisfaction', color: 'text-green-400' },
                                { value: '24/7', label: 'Support', color: 'text-white' },
                            ].map((stat, index) => (
                                <div key={index} className="text-center group">
                                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 group-hover:bg-white/10 transition-all duration-500">
                                        <p className={`text-4xl md:text-5xl font-black ${stat.color}`}>{stat.value}</p>
                                        <p className="text-sm text-gray-400 font-medium mt-1">{stat.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* CTA buttons with enhanced design */}
                        <div className="flex flex-col sm:flex-row gap-5 justify-center mb-12">
                            <Link
                                href="/equipment/create"
                                className="group relative overflow-hidden px-10 py-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all shadow-2xl shadow-green-500/30 hover:shadow-green-500/50 flex items-center justify-center gap-3 hover:scale-105"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                <Zap className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                Partager mon Équipement
                                <ArrowRight className="w-5 h-5 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                            </Link>
                            <Link
                                href="/investments"
                                className="group px-10 py-5 bg-white/10 backdrop-blur-xl border-2 border-white/25 text-white rounded-2xl font-bold hover:bg-white/20 hover:border-white/40 transition-all flex items-center justify-center gap-3 hover:scale-105"
                            >
                                <TrendingUp className="w-6 h-6 group-hover:translate-y-[-2px] transition-transform" />
                                Découvrir les Investissements
                            </Link>
                        </div>

                        {/* Trust indicators with enhanced design */}
                        <div className="flex flex-wrap items-center justify-center gap-8 text-gray-400">
                            {[
                                { icon: Shield, text: 'Paiements sécurisés' },
                                { icon: Award, text: 'Certifié ISO' },
                                { icon: Users, text: 'Communauté vérifiée' },
                            ].map((item, index) => (
                                <div key={index} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                    <item.icon className="w-5 h-5" />
                                    <span className="text-sm font-medium">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />

            {/* ========== ULTRA PREMIUM ANIMATIONS ========== */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(30px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeInScale {
                    from { opacity: 0; transform: scale(0.8); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                }
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-30px) rotate(-5deg); }
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.1); }
                }
                @keyframes float-particle {
                    0% { transform: translateY(0) translateX(0); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(-100px) translateX(20px); opacity: 0; }
                }
                @keyframes scroll-indicator {
                    0%, 100% { transform: translateY(0); opacity: 0.6; }
                    50% { transform: translateY(10px); opacity: 1; }
                }
                @keyframes gradient-x {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                @keyframes title-slide {
                    from { opacity: 0; transform: translateY(-30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                @keyframes glow-pulse {
                    0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.3); }
                    50% { box-shadow: 0 0 40px rgba(34, 197, 94, 0.6); }
                }
                @keyframes card-hover {
                    0% { transform: translateY(0) scale(1); }
                    100% { transform: translateY(-8px) scale(1.02); }
                }
                @keyframes slide-in-bottom {
                    from { opacity: 0; transform: translateY(100px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slide-in-left {
                    from { opacity: 0; transform: translateX(-50px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes slide-in-right {
                    from { opacity: 0; transform: translateX(50px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes rotate-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes bounce-soft {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes scale-up {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
                .animate-fadeInUp { animation: fadeInUp 0.8s ease-out; }
                .animate-fadeInScale { animation: fadeInScale 0.5s ease-out; }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
                .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
                .animate-float-particle { animation: float-particle 4s ease-out infinite; }
                .animate-scroll-indicator { animation: scroll-indicator 2s ease-in-out infinite; }
                .animate-gradient-x { 
                    background-size: 200% 200%;
                    animation: gradient-x 3s ease infinite;
                }
                .animate-title-slide { animation: title-slide 0.8s ease-out; }
                .animate-shimmer {
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                    background-size: 200% 100%;
                    animation: shimmer 2s infinite;
                }
                .animate-glow-pulse { animation: glow-pulse 2s ease-in-out infinite; }
                .animate-card-hover { animation: card-hover 0.3s ease-out forwards; }
                .animate-slide-in-bottom { animation: slide-in-bottom 0.8s ease-out; }
                .animate-slide-in-left { animation: slide-in-left 0.6s ease-out; }
                .animate-slide-in-right { animation: slide-in-right 0.6s ease-out; }
                .animate-rotate-slow { animation: rotate-slow 20s linear infinite; }
                .animate-bounce-soft { animation: bounce-soft 2s ease-in-out infinite; }
                .animate-scale-up { animation: scale-up 0.5s ease-out; }
                
                /* Premium hover effects */
                .hover-lift {
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .hover-lift:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.15);
                }
                
                /* Glass morphism */
                .glass {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
                
                /* Gradient text */
                .text-gradient {
                    background: linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                
                /* Smooth scrollbar */
                ::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                ::-webkit-scrollbar-track {
                    background: #f1f5f9;
                    border-radius: 10px;
                }
                ::-webkit-scrollbar-thumb {
                    background: linear-gradient(180deg, #10b981, #059669);
                    border-radius: 10px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(180deg, #059669, #047857);
                }
            `}</style>
        </>
    );
}
