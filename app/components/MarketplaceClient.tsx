/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-no-undef */
"use client";

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { API_BASE_URL } from '../../src/api-config';
import { ShoppingCart, Search, MapPin, SlidersHorizontal, PackageX, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../data/products';
import ProductCard from './ProductCard';

export default function MarketplaceClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const perPage = 9;

  useEffect(() => {
    // Add timestamp to prevent caching
    {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
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

        // Map backend entity to frontend model
        const mappedProducts = data.map((item: any) => ({
          id: item.id,
          name: item.title, // Map title to name
          price: `${item.price} MAD`, // Format price from numeric
          location: item.location || item.farmer?.address || 'Tunisia',
          image: item.imageUrl ? `${API_BASE_URL}/uploads/${item.imageUrl}` : '', // Construct image URL
          description: item.description,
          // Prefer explicit vendeur, else farmer.name fallback
          seller: item.vendeur || item.farmer?.name || 'Inconnu',
          contact: item.phoneNumber,
          userId: item.farmerId || item.farmer?.id, // expose foreign key for profile linking (backend field remains farmer)
          createdAt: item.createdAt, // Pass through for display
        }));
        // Sort by newest first (assuming higher ID is newer or use createdAt)
        mappedProducts.sort((a: any, b: any) => b.id - a.id);
        
        setProducts(mappedProducts);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setError(err.message);
        setLoading(false);
      });
    }
  }, []);

  const filtered = useMemo(() => {
    // Start from a copy to avoid mutating original products state when sorting
    let items: Product[] = [...products];
    if (query) items = items.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
    if (location) items = items.filter(p => p.location.toLowerCase().includes(location.toLowerCase()));

    if (sortBy === 'price-asc') items = [...items].sort((a, b) => parseFloat(a.price || '0' as any) - parseFloat(b.price || '0' as any));
    if (sortBy === 'price-desc') items = [...items].sort((a, b) => parseFloat(b.price || '0' as any) - parseFloat(a.price || '0' as any));

    return items;
  }, [products, query, location, sortBy]);

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const visible = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Hero Section */}
      <div className="relative bg-[#0A3F2F] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A3F2F]/90"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Marché <span className="text-emerald-400">GreenConnect</span>
              </h1>
              <p className="text-lg text-gray-700 max-w-xl">
                La plateforme premium pour les échanges agricoles professionnels. 
                Qualité garantie, traçabilité assurée et connexions directes.
              </p>
            </div>
            <div className="flex gap-3">
              <Link 
                href="/Panier" 
                className="flex items-center gap-2 px-5 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition-all group"
              >
                <ShoppingCart className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Mon Panier</span>
              </Link>
              <Link 
                href="/favorites" 
                className="flex items-center gap-2 px-5 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition-all group"
              >
                <span className="font-medium">❤️ Favoris</span>
              </Link>
              <Link 
                href="/products/create" 
                className="flex items-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5"
              >
                <span>+ Vendre un produit</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-4 md:p-6 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search */}
            <div className="md:col-span-5 relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
              </div>
              <input
                value={query}
                onChange={e => { setQuery(e.target.value); setPage(1); }}
                placeholder="Que recherchez-vous ?"
                className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border-transparent text-gray-900 placeholder-gray-700 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
              />
            </div>

            {/* Location */}
            <div className="md:col-span-4 relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
              </div>
              <input
                value={location}
                onChange={e => { setLocation(e.target.value); setPage(1); }}
                placeholder="Lieu (ex: Sfax)"
                className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border-transparent text-gray-900 placeholder-gray-700 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
              />
            </div>

            {/* Sort & Reset */}
            <div className="md:col-span-3 flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SlidersHorizontal className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="block w-full pl-10 pr-8 py-3.5 bg-gray-50 border-transparent text-gray-700 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 appearance-none cursor-pointer transition-all"
                >
                  <option value="newest">Récents</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                </select>
              </div>
              <button
                onClick={() => { setQuery(''); setLocation(''); setSortBy('newest'); setPage(1); }}
                className="px-4 py-3.5 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 hover:text-gray-900 transition-colors font-medium"
                title="Réinitialiser les filtres"
              >
                ↺
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="h-56 bg-gray-100 rounded-xl animate-pulse" />
                <div className="mt-4 h-6 bg-gray-100 rounded w-3/4 animate-pulse" />
                <div className="mt-2 h-4 bg-gray-100 rounded w-1/2 animate-pulse" />
                <div className="mt-6 h-10 bg-gray-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <PackageX className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Erreur de chargement</h3>
            <p className="text-gray-800 max-w-md mx-auto">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-6 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
            >
              Réessayer
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Résultats <span className="text-gray-600 font-normal text-lg ml-2">({total} produits)</span>
              </h2>
            </div>

            {visible.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {visible.map(p => (
                  <ProductCard key={p.id} {...p} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-gray-200 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <Search className="w-10 h-10 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun résultat trouvé</h3>
                <p className="text-gray-800 max-w-md mx-auto mb-8">
                  Nous n'avons trouvé aucun produit correspondant à vos critères. Essayez de modifier vos filtres ou votre recherche.
                </p>
                <button 
                  onClick={() => { setQuery(''); setLocation(''); }}
                  className="px-6 py-2.5 bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-700 transition shadow-lg shadow-emerald-500/20"
                >
                  Tout effacer
                </button>
              </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div className="mt-16 flex items-center justify-center gap-4">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))} 
                  disabled={page === 1} 
                  className="p-3 rounded-full border border-gray-200 hover:bg-white hover:shadow-md disabled:opacity-30 disabled:hover:shadow-none transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: pages }).map((_, i) => {
                    const p = i + 1;
                    // Show first, last, and current range
                    if (p === 1 || p === pages || (p >= page - 1 && p <= page + 1)) {
                      return (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all ${
                            page === p 
                              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 scale-110' 
                              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
                          }`}
                        >
                          {p}
                        </button>
                      );
                    }
                    if (p === page - 2 || p === page + 2) {
                      return <span key={p} className="text-gray-300">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button 
                  onClick={() => setPage(p => Math.min(pages, p + 1))} 
                  disabled={page === pages} 
                  className="p-3 rounded-full border border-gray-200 hover:bg-white hover:shadow-md disabled:opacity-30 disabled:hover:shadow-none transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
