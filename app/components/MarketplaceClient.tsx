"use client";

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';
import { type Product } from '../data/products';

export default function MarketplaceClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const perPage = 9;

  useEffect(() => {
    // Add timestamp to prevent caching
    {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      fetch(`http://localhost:5000/products?t=${Date.now()}`, {
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
          image: item.imageUrl ? `http://localhost:5000/uploads/${item.imageUrl}` : '', // Construct image URL
          description: item.description,
          seller: item.vendeur || (item.farmer ? `${item.farmer.firstName} ${item.farmer.lastName}` : 'Unknown'),
          contact: item.phoneNumber,
          category: 'Vegetables', // Default category as it's missing in backend
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
    if (category && category !== 'All Categories') items = items.filter(p => (p as any).category === category);

    if (sortBy === 'price-asc') items = [...items].sort((a, b) => parseFloat(a.price || '0' as any) - parseFloat(b.price || '0' as any));
    if (sortBy === 'price-desc') items = [...items].sort((a, b) => parseFloat(b.price || '0' as any) - parseFloat(a.price || '0' as any));

    return items;
  }, [products, query, location, category, sortBy]);

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const visible = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3 w-full md:w-2/3">
          <input value={query} onChange={e => { setQuery(e.target.value); setPage(1); }} placeholder="Rechercher un produit, ex: dattes" className="flex-1 px-4 py-2 border rounded-md" />
          <input value={location} onChange={e => { setLocation(e.target.value); setPage(1); }} placeholder="Gouvernorat (ex: Sfax)" className="w-44 px-3 py-2 border rounded-md" />
        </div>

        <div className="flex items-center gap-3">
          <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }} className="px-3 py-2 border rounded-md">
            <option>All Categories</option>
            <option>Fruits & Vegetables</option>
            <option>Grains & Cereals</option>
            <option>Livestock & Poultry</option>
            <option>Fertilizers & Chemicals</option>
          </select>

          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="px-3 py-2 border rounded-md">
            <option value="newest">Trier: Récents</option>
            <option value="price-asc">Prix: bas → haut</option>
            <option value="price-desc">Prix: haut → bas</option>
          </select>

          {/* Cart / Panier link */}
          <Link href="/Panier" className="ml-2 px-3 py-2 bg-green-600 text-white rounded-md flex items-center gap-2 hover:bg-green-700">
            <span aria-hidden>🛒</span>
            <span className="text-sm">Panier</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-600 bg-red-50 rounded-lg border border-red-200">
          <p className="font-bold">Erreur de chargement</p>
          <p>{error}</p>
          <p className="text-sm mt-2 text-gray-600">Vérifiez que le backend tourne sur le port 5000.</p>
        </div>
      ) : (
        <>
          <div className="text-sm text-gray-600 mb-4">Affichage { (page - 1) * perPage + 1 } - { Math.min(page * perPage, total) } sur {total} résultats</div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {visible.map(p => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>

          {total === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-xl font-semibold mb-2">Aucun produit trouvé</p>
              <p className="mb-6 text-center max-w-md">Il semble qu'il n'y ait pas encore de produits disponibles ou que la base de données ait été réinitialisée.</p>
              <Link 
                href="/products/create" 
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm"
              >
                Publier le premier produit
              </Link>
            </div>
          )}

          <div className="mt-6 flex items-center justify-center gap-3">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-2 border rounded-md">Préc</button>
            <span className="text-sm">Page {page} / {pages}</span>
            <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="px-3 py-2 border rounded-md">Suiv</button>
          </div>
        </>
      )}
    </div>
  );
}
