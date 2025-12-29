"use client";

// cart.jsx
// Page Panier unifiée (Single File) - Contient tout le code nécessaire pour l'affichage du panier, 
// y compris les composants Header, Footer et CartClient pour éviter les erreurs d'import.

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { API_BASE_URL } from '../../src/api-config';
import { ShoppingCart, ArrowLeft, Trash2, Plus, Minus, Package, Truck, ShieldCheck, CreditCard, Sparkles, Gift, CheckCircle2 } from 'lucide-react';

// --- CartClient Component ---

// Define a type for a cart item
interface CartItem {
    id: number | string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
}

function CartClient() {
        // Hydrate from localStorage
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
            fetch(`${API_BASE_URL}/cart`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => res.json())
            .then(data => {
                if (data && data.items) {
                    const mapped = data.items.map((item: any) => ({
                        id: item.id,
                        name: item.product.title,
                        price: Number(item.product.price),
                        quantity: item.quantity,
                        imageUrl: item.product.imageUrl ? `${API_BASE_URL}/uploads/${item.product.imageUrl}` : ''
                    }));
                    setCartItems(mapped);
                }
                setLoading(false);
            })
            .catch(e => {
                console.error(e);
                setLoading(false);
            });
        } else {
            try {
                const raw = localStorage.getItem('cart');
                setCartItems(raw ? JSON.parse(raw) : []);
            } catch {}
            setLoading(false);
        }
    }, []);

    // Keep localStorage in sync (only if not logged in)
    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) {
            try {
                localStorage.setItem('cart', JSON.stringify(cartItems));
            } catch {}
        }
    }, [cartItems]);
    const [isCheckingOut, setIsCheckingOut] = useState(false); 
    const [message, setMessage] = useState('');

    // Calcul du sous-total
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 100 ? 0 : 10.00; // Livraison gratuite au-dessus de $100
    const total = subtotal + shipping;

    // Mise à jour de la quantité
    const handleUpdateQuantity = async (id: string | number, newQuantity: number) => {
        if (newQuantity <= 0 || isNaN(newQuantity)) {
            handleRemoveItem(id);
            return;
        }
        
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
            try {
                await fetch(`${API_BASE_URL}/cart/items/${id}`, {
                    method: 'PATCH',
                    headers: { 
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}` 
                    },
                    body: JSON.stringify({ quantity: newQuantity })
                });
            } catch(e) { console.error(e); }
        }

        setCartItems(prev => prev.map(item => 
            item.id === id ? { ...item, quantity: newQuantity } : item
        ));
    };

    // Suppression d'un article
    const handleRemoveItem = async (id: string | number) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
            try {
                await fetch(`${API_BASE_URL}/cart/items/${id}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch(e) { console.error(e); }
        }

        setCartItems(prev => prev.filter(item => item.id !== id));
        setMessage(`Article supprimé du panier.`);
        setTimeout(() => setMessage(''), 3000);
    };

    // Simulation de la procédure de paiement
    const handleCheckout = async () => {
        setIsCheckingOut(true);
        setMessage('');
        
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
            try {
                const res = await fetch(`${API_BASE_URL}/orders/checkout`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    setMessage("Commande réussie ! Merci pour votre commande.");
                    setCartItems([]);
                } else {
                    setMessage("Erreur lors de la commande.");
                }
            } catch(e) {
                console.error(e);
                setMessage("Erreur de connexion.");
            }
            setIsCheckingOut(false);
            return;
        }

        setTimeout(() => {
            console.log('Initiation du paiement ! Total: $' + total.toFixed(2));
            setIsCheckingOut(false);
            setMessage("Paiement simulé réussi ! Merci pour votre commande.");
            setCartItems([]); // Vider le panier après le paiement simulé
        }, 2000);
    };
    
    // Fallback pour les images si l'URL ne fonctionne pas
    const placeholderError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = "https://placehold.co/100x100/60a5fa/ffffff?text=Product";
    };


    if (cartItems.length === 0) {
        return (
            <div className="text-center py-16 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 relative overflow-hidden">
                {/* Decorative gradient line */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500" />
                
                <div className="relative">
                    <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
                        <ShoppingCart className="w-16 h-16 text-emerald-500" />
                    </div>
                    <p className="text-3xl font-extrabold bg-gradient-to-r from-emerald-700 via-green-700 to-teal-700 bg-clip-text text-transparent mb-4">
                        Votre Panier est Vide
                    </p>
                    <p className="text-gray-600 mb-8 max-w-lg mx-auto px-4">
                        {message || "Découvrez nos produits agricoles frais et authentiques de Souk-Moussel !"}
                    </p>
                    <Link 
                        href="/marketplace" 
                        className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 transition-all duration-300 shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 overflow-hidden"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        <ShoppingCart className="w-5 h-5 relative z-10" />
                        <span className="relative z-10">Commencer à Acheter</span>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Message de notification */}
            {message && (
                <div className="lg:col-span-3 mb-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl shadow-lg flex items-center gap-3" role="alert">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <p className="font-bold">Information</p>
                        <p>{message}</p>
                    </div>
                </div>
            )}
            
            {/* Liste des Articles (Colonnes 1 et 2) */}
            <div className="lg:col-span-2 space-y-4">
                <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                <Package className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-extrabold text-white">Vos Articles</h2>
                                <p className="text-emerald-100 text-sm">{cartItems.length} produit{cartItems.length > 1 ? 's' : ''} dans votre panier</p>
                            </div>
                        </div>
                    </div>

                    {/* Items List */}
                    <div className="divide-y divide-gray-100">
                        {cartItems.map((item, index) => (
                            <div 
                                key={item.id} 
                                className="group p-6 hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-transparent transition-all duration-300"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="flex items-center gap-6">
                                    {/* Image */}
                                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-lg flex-shrink-0 border-2 border-gray-100 group-hover:border-emerald-200 transition-colors">
                                        <img 
                                            src={item.imageUrl} 
                                            alt={item.name} 
                                            onError={placeholderError}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                        />
                                    </div>
                                    
                                    {/* Product Info */}
                                    <div className="flex-grow min-w-0">
                                        <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-emerald-700 transition-colors">{item.name}</h3>
                                        <p className="text-emerald-600 font-semibold mt-1">{item.price.toFixed(2)} MAD / unité</p>
                                        
                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-3 mt-3">
                                            <button 
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                className="w-8 h-8 bg-gray-100 hover:bg-emerald-100 rounded-lg flex items-center justify-center text-gray-600 hover:text-emerald-600 transition-all"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <input 
                                                id={`quantity-${item.id}`}
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                                                className="w-16 py-2 border-2 border-gray-200 rounded-xl text-center font-bold focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-gray-900"
                                            />
                                            <button 
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-8 bg-gray-100 hover:bg-emerald-100 rounded-lg flex items-center justify-center text-gray-600 hover:text-emerald-600 transition-all"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Price & Delete */}
                                    <div className="text-right flex flex-col items-end gap-3">
                                        <p className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                            {(item.price * item.quantity).toFixed(2)} MAD
                                        </p>
                                        <button
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="group/btn p-2.5 bg-red-50 hover:bg-red-100 rounded-xl text-red-500 hover:text-red-600 transition-all duration-300"
                                            aria-label={`Supprimer ${item.name}`}
                                        >
                                            <Trash2 className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-center">
                        <div className="w-12 h-12 mx-auto bg-emerald-100 rounded-xl flex items-center justify-center mb-2">
                            <ShieldCheck className="w-6 h-6 text-emerald-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Paiement Sécurisé</span>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-center">
                        <div className="w-12 h-12 mx-auto bg-blue-100 rounded-xl flex items-center justify-center mb-2">
                            <Truck className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Livraison Rapide</span>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-center">
                        <div className="w-12 h-12 mx-auto bg-purple-100 rounded-xl flex items-center justify-center mb-2">
                            <Gift className="w-6 h-6 text-purple-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Qualité Garantie</span>
                    </div>
                </div>
            </div>

            {/* Sommaire de la Commande (Colonne 3) */}
            <div className="lg:col-span-1">
                <div className="sticky top-28 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
                    {/* Header */}
                    <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500" />
                    
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                                <CreditCard className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-xl font-extrabold text-gray-900">Sommaire</h2>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Sous-total ({cartItems.length} articles)</span>
                                <span className="font-bold text-gray-900">{subtotal.toFixed(2)} MAD</span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                                <span className="text-gray-600">Livraison</span>
                                <span className={`font-bold ${shipping === 0 ? 'text-emerald-600' : 'text-gray-900'}`}>
                                    {shipping === 0 ? (
                                        <span className="flex items-center gap-1">
                                            <Sparkles className="w-4 h-4" />
                                            GRATUITE
                                        </span>
                                    ) : `${shipping.toFixed(2)} MAD`}
                                </span>
                            </div>
                            
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-xl font-bold text-gray-900">Total</span>
                                <span className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                    {total.toFixed(2)} MAD
                                </span>
                            </div>
                        </div>

                        {shipping > 0 && (
                            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                                <p className="text-sm text-amber-700 font-medium text-center">
                                    🚚 Plus que <span className="font-bold">{(100 - subtotal).toFixed(2)} MAD</span> pour la livraison gratuite !
                                </p>
                            </div>
                        )}

                        <p className="text-xs text-center text-gray-500 mt-4 mb-6">
                            Taxes incluses. Frais de livraison calculés à la commande.
                        </p>

                        <button
                            onClick={handleCheckout}
                            disabled={isCheckingOut || cartItems.length === 0}
                            className="group relative w-full bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white text-lg font-bold py-4 rounded-2xl hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 transition-all duration-300 shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                            {isCheckingOut ? (
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Traitement...
                                </span>
                            ) : (
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    <CreditCard className="w-5 h-5" />
                                    Procéder au Paiement
                                </span>
                            )}
                        </button>

                        {/* Continue Shopping Link */}
                        <Link 
                            href="/marketplace"
                            className="mt-4 w-full flex items-center justify-center gap-2 py-3 text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Continuer vos achats
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}


// --- Main Page Component ---
export default function CartPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/1.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 via-green-900/85 to-teal-900/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-teal-500/20 via-transparent to-transparent" />
      </div>

      {/* Animated Floating Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Back Navigation */}
          <Link 
            href="/marketplace" 
            className="group inline-flex items-center gap-2 px-5 py-2.5 mb-8 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Retour au Marketplace</span>
          </Link>

          {/* Header Section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 backdrop-blur-sm rounded-full border border-emerald-400/30 mb-6">
              <ShoppingCart className="w-4 h-4 text-emerald-300" />
              <span className="text-emerald-200 text-sm font-medium">Votre Panier</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Panier <span className="bg-gradient-to-r from-emerald-300 via-green-300 to-teal-300 bg-clip-text text-transparent">d'Achats</span>
            </h1>
            <p className="text-lg text-white/70 max-w-xl mx-auto">
              Finalisez votre commande de produits agricoles frais
            </p>
          </div>

          {/* Cart Content */}
          <CartClient />
          
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}