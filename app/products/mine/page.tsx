"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { API_BASE_URL } from '../../../src/api-config';
import { useToast } from '../../components/ToastProvider';
import { 
  Package, Plus, Edit, Trash2, Eye, ArrowLeft, Phone, MapPin,
  Loader2, AlertCircle, ShoppingBag, Calendar, DollarSign
} from 'lucide-react';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  location: string;
  phoneNumber: string;
  vendeur: string;
  createdAt: string;
}

export default function MyProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [confirmingId, setConfirmingId] = useState<number | null>(null);
  const { addToast } = useToast();

  const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Vous devez être connecté');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/products/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Erreur lors du chargement');

      const data = await res.json();
      setProducts(data);

      // Fetch pending requests count
      try {
        const reqRes = await fetch(`${API_BASE_URL}/purchase-requests/received`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (reqRes.ok) {
          const requests = await reqRes.json();
          setPendingRequestsCount(requests.filter((r: any) => r.status === 'pending').length);
        }
      } catch {}
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirmingId !== id) {
      setConfirmingId(id);
      addToast('Cliquez encore pour confirmer la suppression', 'info');
      setTimeout(() => setConfirmingId(prev => (prev === id ? null : prev)), 2500);
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Erreur lors de la suppression');

      setProducts(prev => prev.filter(p => p.id !== id));
      addToast('Produit supprimé', 'success');
    } catch (err: any) {
      addToast(err.message, 'error');
    } finally {
      setConfirmingId(null);
    }
  };

  const getImageUrl = (path: string) => {
    if (!path) return '/images/placeholder.jpg';
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}/uploads/${path}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-white to-slate-50">
        <Header />
        <main className="flex-grow flex items-center justify-center pt-20">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
            <p className="text-gray-600 font-medium">Chargement de vos produits...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <Header />
      
      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <Link 
                href="/marketplace" 
                className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour au Marketplace
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Mes Produits</h1>
              <p className="text-gray-600 mt-1">Gérez vos produits en vente</p>
            </div>
            
            <div className="flex gap-3">
              {pendingRequestsCount > 0 && (
                <Link
                  href="/purchase-requests/received"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-xl hover:bg-amber-200 transition font-medium"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {pendingRequestsCount} demande{pendingRequestsCount > 1 ? 's' : ''} en attente
                </Link>
              )}
              <Link
                href="/purchase-requests/received"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium"
              >
                <ShoppingBag className="w-5 h-5" />
                Demandes reçues
              </Link>
              <Link
                href="/products/create"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-medium"
              >
                <Plus className="w-5 h-5" />
                Ajouter un produit
              </Link>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {products.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl shadow-lg border border-gray-100">
              <div className="w-20 h-20 mx-auto mb-6 bg-emerald-100 rounded-full flex items-center justify-center">
                <Package className="w-10 h-10 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Aucun produit</h2>
              <p className="text-gray-600 mb-6">Vous n'avez pas encore publié de produit à vendre</p>
              <Link
                href="/products/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-semibold"
              >
                <Plus className="w-5 h-5" />
                Publier un produit
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow group"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                    <img
                      src={getImageUrl(product.imageUrl)}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Badge "Mon Produit" */}
                    <div className="absolute top-3 left-3 px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">
                      Mon Produit
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                      {product.title}
                    </h3>
                    
                    <p className="text-2xl font-black text-emerald-600 mb-3">
                      {Number(product.price).toFixed(2)} MAD
                    </p>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      {product.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{product.location}</span>
                        </div>
                      )}
                      {product.phoneNumber && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{product.phoneNumber}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{new Date(product.createdAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        href={`/products/${product.id}`}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        Voir
                      </Link>
                      <Link
                        href={`/products/${product.id}/edit`}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-amber-100 text-amber-700 rounded-xl hover:bg-amber-200 transition font-medium text-sm"
                      >
                        <Edit className="w-4 h-4" />
                        Modifier
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="px-3 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
