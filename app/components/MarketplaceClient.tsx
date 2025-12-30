/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-no-undef */
"use client";

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { API_BASE_URL } from '../../src/api-config';
import { 
  ShoppingCart, Search, MapPin, ChevronLeft, ChevronRight, ArrowUp, 
  Sparkles, TrendingUp, Heart, Package, Truck, Shield, 
  Grid3X3, LayoutList, RefreshCw, X, Leaf
} from 'lucide-react';
import { Product } from '../data/products';
import ProductCard from './ProductCard';

// Category data with icons and colors
const categories = [
  { id: 'all', label: 'Tous', icon: Grid3X3, color: 'from-gray-500 to-gray-600' },
  { id: 'fruits', label: 'Fruits', icon: '🍎', color: 'from-red-500 to-orange-500' },
  { id: 'legumes', label: 'Légumes', icon: '🥬', color: 'from-green-500 to-emerald-500' },
  { id: 'cereales', label: 'Céréales', icon: '🌾', color: 'from-amber-500 to-yellow-500' },
  { id: 'huiles', label: 'Huiles', icon: '🫒', color: 'from-lime-500 to-green-500' },
  { id: 'epices', label: 'Épices', icon: '🌶️', color: 'from-red-600 to-rose-500' },
  { id: 'bio', label: 'Bio', icon: Leaf, color: 'from-emerald-500 to-teal-500' },
];

// Stats data
const stats = [
  { value: '2,500+', label: 'Produits', icon: Package },
  { value: '500+', label: 'Agriculteurs', icon: Leaf },
  { value: '24h', label: 'Livraison', icon: Truck },
  { value: '100%', label: 'Qualité', icon: Shield },
];

export default function MarketplaceClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [lastScrollY, setLastScrollY] = useState(0);
  const [heroVisible, setHeroVisible] = useState(true);
  const [searchVisible, setSearchVisible] = useState(false);
  const [categoriesVisible, setCategoriesVisible] = useState(false);
  const perPage = 9;

  // Enhanced Scroll effect with direction detection
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setScrolled(currentScrollY > 100);
      setShowScrollTop(currentScrollY > 500);
      
      // Detect scroll direction
      if (currentScrollY > lastScrollY) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }
      setLastScrollY(currentScrollY);
      
      // Hero visibility for parallax
      setHeroVisible(currentScrollY < 600);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Intersection Observer for section animations
  useEffect(() => {
    const observerOptions = { threshold: 0.2, rootMargin: '0px' };
    
    const searchObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setSearchVisible(true);
      });
    }, observerOptions);
    
    const categoriesObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setCategoriesVisible(true);
      });
    }, observerOptions);

    const searchSection = document.getElementById('search-section');
    const categoriesSection = document.getElementById('categories-section');
    
    if (searchSection) searchObserver.observe(searchSection);
    if (categoriesSection) categoriesObserver.observe(categoriesSection);

    return () => {
      searchObserver.disconnect();
      categoriesObserver.disconnect();
    };
  }, [loading]);

  // Intersection Observer for card animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleCards(prev => [...new Set([...prev, index])]);
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, [loading, query, location, sortBy, page, category]);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    // Get current user ID
    try {
      const userRaw = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      if (userRaw) {
        const user = JSON.parse(userRaw);
        setCurrentUserId(user?.id || null);
      }
    } catch {}
    
    fetch(`${API_BASE_URL}/products?t=${Date.now()}`, {
      cache: 'no-store',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
    .then(res => {
      if (res.ok) return res.json();
      throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
    })
    .then(data => {
      console.log('Fetched products:', data);
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received from server');
      }

      const mappedProducts = data.map((item: any) => {
        // Get seller name from vendeur field or farmer relation
        const sellerName = item.vendeur || (item.farmer ? item.farmer.name : null);
        
        return {
          id: item.id,
          name: item.title,
          price: `${item.price} MAD`,
          location: item.location || item.farmer?.address || 'Non spécifié',
          image: item.imageUrl ? `${API_BASE_URL}/uploads/${item.imageUrl}` : '',
          description: item.description,
          seller: sellerName || 'Vendeur',
          contact: item.phoneNumber || item.farmer?.phoneNumber,
          userId: item.farmerId || item.farmer?.id,
          createdAt: item.createdAt,
        };
      });
      
      mappedProducts.sort((a: any, b: any) => b.id - a.id);
      setProducts(mappedProducts);
      setLoading(false);
    })
    .catch(err => {
      console.error('Error fetching products:', err);
      setError(err.message);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    let items: Product[] = [...products];
    
    // Filter out current user's own products - they should only appear in "Mes Produits" page
    if (currentUserId !== null) {
      items = items.filter(p => p.userId !== currentUserId);
    }
    
    if (query) items = items.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
    if (location) items = items.filter(p => p.location.toLowerCase().includes(location.toLowerCase()));

    if (sortBy === 'price-asc') items = [...items].sort((a, b) => parseFloat(a.price || '0' as any) - parseFloat(b.price || '0' as any));
    if (sortBy === 'price-desc') items = [...items].sort((a, b) => parseFloat(b.price || '0' as any) - parseFloat(a.price || '0' as any));

    return items;
  }, [products, query, location, sortBy, category, currentUserId]);

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const visible = filtered.slice((page - 1) * perPage, page * perPage);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const clearFilters = useCallback(() => {
    setQuery('');
    setLocation('');
    setSortBy('newest');
    setCategory('all');
    setPage(1);
  }, []);

  const hasActiveFilters = query || location || sortBy !== 'newest' || category !== 'all';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Section - Premium Design with Parallax */}
      <section className="relative overflow-hidden">
        {/* Background Image with Parallax */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-100"
          style={{ 
            backgroundImage: `url('/images/1.jpg')`,
            transform: `translateY(${scrollY * 0.5}px) scale(${1 + scrollY * 0.0005})`,
          }}
        />
        
        {/* Gradient Overlay on top of image */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/85 via-green-800/80 to-teal-900/85">
          {/* Animated gradient orbs with scroll effect */}
          <div 
            className="absolute top-0 -left-40 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl animate-pulse transition-transform duration-300"
            style={{ transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.05}px)` }}
          />
          <div 
            className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-3xl animate-pulse transition-transform duration-300" 
            style={{ animationDelay: '1s', transform: `translate(-${scrollY * 0.08}px, -${scrollY * 0.04}px)` }}
          />
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-3xl transition-transform duration-300"
            style={{ transform: `translate(-50%, -50%) scale(${1 + scrollY * 0.001})` }}
          />
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative">
          {/* Top Navigation Bar - with padding for fixed header */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28">
            <div className="flex items-center justify-between">
              {/* Badge */}
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-medium text-white">Marketplace Premium</span>
              </div>

            </div>
          </div>

          {/* Hero Content with fade on scroll */}
          <div 
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-32 transition-all duration-300"
            style={{ 
              opacity: Math.max(0, 1 - scrollY / 400),
              transform: `translateY(${scrollY * 0.3}px)`,
            }}
          >
            <div className="text-center max-w-4xl mx-auto">
              {/* Main Title */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Découvrez les meilleurs
                <span className="block mt-2 bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400 bg-clip-text text-transparent">
                  produits agricoles
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-emerald-100/80 mb-10 max-w-2xl mx-auto">
                Connectez-vous directement avec les agriculteurs locaux et accédez à des produits frais, 
                de qualité et au meilleur prix.
              </p>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                {stats.map((stat, i) => (
                  <div 
                    key={i}
                    className="group px-6 py-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg group-hover:scale-110 transition-transform">
                        <stat.icon className="w-5 h-5 text-emerald-300" />
                      </div>
                      <div className="text-left">
                        <div className="text-xl font-bold text-white">{stat.value}</div>
                        <div className="text-xs text-emerald-200/70">{stat.label}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Search Section with scroll animation */}
      <section id="search-section" className="relative -mt-20 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`bg-white rounded-3xl shadow-2xl shadow-gray-900/10 border border-gray-100 p-6 md:p-8 transition-all duration-700 ${
            isSearchFocused ? 'ring-2 ring-emerald-500/50 shadow-emerald-500/10' : ''
          } ${searchVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Main Search Bar */}
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className={`h-5 w-5 transition-colors duration-200 ${isSearchFocused ? 'text-emerald-500' : 'text-gray-400'}`} />
                </div>
                <input
                  value={query}
                  onChange={e => { setQuery(e.target.value); setPage(1); }}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder="Rechercher des produits frais..."
                  className="block w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent text-gray-900 placeholder-gray-500 rounded-2xl focus:bg-white focus:border-emerald-500 focus:ring-0 transition-all duration-200 text-lg"
                />
                {query && (
                  <button 
                    onClick={() => setQuery('')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>

              {/* Location Input */}
              <div className="lg:w-64 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  value={location}
                  onChange={e => { setLocation(e.target.value); setPage(1); }}
                  placeholder="Localisation..."
                  className="block w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent text-gray-900 placeholder-gray-500 rounded-2xl focus:bg-white focus:border-emerald-500 focus:ring-0 transition-all duration-200"
                />
              </div>

              {/* Search Button */}
              <button className="lg:w-auto px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 flex items-center justify-center gap-2">
                <Search className="w-5 h-5" />
                <span>Rechercher</span>
              </button>
            </div>

            {/* Quick Filters Row */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-gray-500">Tendances:</span>
              {['Tomates Bio', 'Olives', 'Agrumes', 'Dattes'].map((term, i) => (
                <button
                  key={i}
                  onClick={() => { setQuery(term); setPage(1); }}
                  className="px-4 py-2 bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2"
                >
                  <TrendingUp className="w-3 h-3" />
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills with staggered animation */}
      <section id="categories-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat, index) => {
            const isActive = category === cat.id;
            const IconComponent = typeof cat.icon === 'string' ? null : cat.icon;
            
            return (
              <button
                key={cat.id}
                onClick={() => { setCategory(cat.id); setPage(1); }}
                className={`group flex items-center gap-2 px-5 py-3 rounded-full font-medium transition-all duration-500 whitespace-nowrap ${
                  isActive
                    ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:shadow-md'
                } ${categoriesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                {IconComponent ? (
                  <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                ) : (
                  <span className="text-lg">{cat.icon as string}</span>
                )}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Results Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Produits disponibles
            </h2>
            <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
              {total} résultats
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 cursor-pointer transition-all text-sm font-medium"
              >
                <option value="newest">Plus récents</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronLeft className="w-4 h-4 text-gray-400 rotate-[-90deg]" />
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <LayoutList className="w-5 h-5" />
              </button>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all text-sm font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                Réinitialiser
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {loading ? (
          /* Premium Skeleton Loading */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                <div className="h-56 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 animate-pulse relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-shimmer" />
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex justify-between">
                    <div className="h-6 bg-gray-100 rounded-lg w-3/4 animate-pulse" />
                    <div className="h-6 bg-emerald-100 rounded-full w-16 animate-pulse" />
                  </div>
                  <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-100 rounded w-full animate-pulse" />
                    <div className="h-3 bg-gray-100 rounded w-4/5 animate-pulse" />
                  </div>
                  <div className="pt-4 flex gap-2">
                    <div className="h-11 bg-gray-100 rounded-xl flex-1 animate-pulse" />
                    <div className="h-11 bg-emerald-100 rounded-xl flex-1 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          /* Error State */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
              <X className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Erreur de chargement</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-all duration-200 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Réessayer
            </button>
          </div>
        ) : visible.length > 0 ? (
          /* Products Grid */
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1 max-w-3xl mx-auto'
          }`}>
            {visible.map((p, idx) => (
              <div
                key={p.id}
                data-index={idx}
                className={`product-card transition-all duration-700 ${
                  visibleCards.includes(idx)
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-8 scale-95'
                }`}
                style={{ transitionDelay: `${idx * 80}ms` }}
              >
                <ProductCard {...p} isOwner={currentUserId !== null && p.userId === currentUserId} />
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 bg-gradient-to-br from-gray-50 to-white rounded-3xl border-2 border-dashed border-gray-200 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mb-6">
              <Search className="w-12 h-12 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Aucun produit trouvé</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              Aucun produit ne correspond à vos critères. Essayez de modifier vos filtres ou explorez d'autres catégories.
            </p>
            <button 
              onClick={clearFilters}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg shadow-emerald-500/25 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Réinitialiser les filtres
            </button>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && pages > 1 && (
          <div className="mt-16 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => { setPage(p => Math.max(1, p - 1)); scrollToTop(); }} 
                disabled={page === 1} 
                className="p-3 rounded-xl border-2 border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: pages }).map((_, i) => {
                  const p = i + 1;
                  if (p === 1 || p === pages || (p >= page - 1 && p <= page + 1)) {
                    return (
                      <button
                        key={p}
                        onClick={() => { setPage(p); scrollToTop(); }}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center font-semibold transition-all duration-200 ${
                          page === p 
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30' 
                            : 'bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  }
                  if (p === page - 2 || p === page + 2) {
                    return <span key={p} className="px-2 text-gray-400">•••</span>;
                  }
                  return null;
                })}
              </div>

              <button 
                onClick={() => { setPage(p => Math.min(pages, p + 1)); scrollToTop(); }} 
                disabled={page === pages} 
                className="p-3 rounded-xl border-2 border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>
            
            <p className="text-sm text-gray-500">
              Page <span className="font-semibold text-gray-900">{page}</span> sur <span className="font-semibold text-gray-900">{pages}</span>
            </p>
          </div>
        )}
      </section>

      {/* Scroll to Top Button with bounce effect */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 p-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-500 z-50 group ${
          showScrollTop ? 'opacity-100 translate-y-0 animate-bounce-slow' : 'opacity-0 translate-y-16 pointer-events-none'
        }`}
        aria-label="Retour en haut"
      >
        <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
      </button>

      {/* Scroll Progress Indicator */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 z-[100] transition-all duration-100"
        style={{ 
          width: `${Math.min(100, (scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100)}%`,
          opacity: scrollY > 100 ? 1 : 0 
        }}
      />

      {/* Scroll Direction Indicator */}
      <div 
        className={`fixed left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg transition-all duration-300 z-50 ${
          scrollY > 300 ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className={`transition-transform duration-300 ${scrollDirection === 'up' ? 'rotate-0' : 'rotate-180'}`}>
          <ArrowUp className="w-4 h-4 text-emerald-600" />
        </div>
      </div>

      {/* Mobile Sell Button */}
      <Link
        href="/products/create"
        className="fixed bottom-8 left-8 sm:hidden p-4 bg-white text-emerald-600 rounded-2xl shadow-2xl border-2 border-emerald-200 hover:border-emerald-400 transition-all duration-300 z-50"
      >
        <span className="text-2xl font-bold">+</span>
      </Link>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}