"use client";

// cart.jsx
// Page Panier unifiée (Single File) - Contient tout le code nécessaire pour l'affichage du panier, 
// y compris les composants Header, Footer et CartClient pour éviter les erreurs d'import.

import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../src/api-config';

// --- Composant Header Factice (Simulé) ---
const Header = () => (
    <header className="bg-green-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <a href="/marketplace" className="text-2xl font-bold tracking-tight">Souk-Moussel</a>
            <nav className="space-x-4 flex items-center">
                <a href="/marketplace" className="hover:text-green-200 transition">Catalogue</a>
                <a href="/panier" className="bg-green-600 px-3 py-1 rounded-full flex items-center space-x-1 hover:bg-green-700 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.258A4 4 0 007 9h10a1 1 0 00.894-1.447l.5-1a1 1 0 00-.094-.652l-.9-.9A3 3 0 0015 6H7a3 3 0 00-3.712 3.712l-.305 1.258A1 1 0 013 11H2a1 1 0 100 2h1a1 1 0 00.78-.37l1.247-1.739A5 5 0 019 10h7a1 1 0 011 1v1a1 1 0 102 0v-1a3 3 0 00-2.894-2.953l-.5-1a1 1 0 00-.91-.047H7a5 5 0 00-4.99 4.98L2 15a1 1 0 100 2h1a1 1 0 100-2h-.22l.305-1.258A1 1 0 003 13h1a1 1 0 100-2H3.78l-.305-1.258A4 4 0 007 5h9a1 1 0 00.91-.047l.5-1a1 1 0 00.094-.652l-.9-.9A3 3 0 0015 3H7a3 3 0 00-3.712 3.712l-.305 1.258A1 1 0 013 7H2a1 1 0 100 2h1a1 1 0 00.78-.37l1.247-1.739A5 5 0 019 6h7a1 1 0 011 1v1a1 1 0 102 0v-1a3 3 0 00-2.894-2.953l-.5-1A1 1 0 0016 3H7a3 3 0 00-3.712 3.712l-.305 1.258A1 1 0 013 7H2z" />
                    </svg>
                    <span>Panier</span>
                </a>
            </nav>
        </div>
    </header>
);

// --- Composant Footer Factice (Simulé) ---
const Footer = () => (
    <footer className="bg-gray-800 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm">
            © {new Date().getFullYear()} Souk-Moussel. Artisanat Authentique.
        </div>
    </footer>
);

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
            <div className="text-center py-20 bg-white rounded-xl shadow-2xl border border-green-200">
                <p className="text-3xl font-extrabold text-green-900 mb-4">🛒 Votre Panier est Vide</p>
                <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                    {message || "Il semble que vous n'ayez pas encore ajouté de produits artisanaux authentiques de Souk-Moussel !"}
                </p>
                <a 
                    href="/marketplace" 
                    className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-lg transform hover:scale-[1.05]"
                >
                    Commencer à Acheter
                </a>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Message de notification */}
            {message && (
                <div className="lg:col-span-3 mb-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow" role="alert">
                    <p className="font-bold">Information</p>
                    <p>{message}</p>
                </div>
            )}
            
            {/* Liste des Articles (Colonnes 1 et 2) */}
            <div className="lg:col-span-2 space-y-6">
                <h2 className="text-2xl font-extrabold text-gray-800 border-b pb-3">Récapitulatif des Articles</h2>
                {cartItems.map(item => (
                    <div 
                        key={item.id} 
                        className="flex items-center bg-white p-4 rounded-xl shadow-lg transition hover:shadow-xl border border-gray-100"
                    >
                        <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            onError={placeholderError}
                            className="w-24 h-24 object-cover rounded-lg mr-6 flex-shrink-0 border" 
                        />
                        
                        <div className="flex-grow min-w-0">
                            <h3 className="text-xl font-semibold text-green-800 truncate">{item.name}</h3>
                            <p className="text-gray-600 font-medium mt-1">${item.price.toFixed(2)} / unité</p>
                        </div>

                        <div className="flex items-center space-x-4 mx-6">
                            <label htmlFor={`quantity-${item.id}`} className="sr-only">Quantité</label>
                            <input 
                                id={`quantity-${item.id}`}
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                                className="w-16 p-2 border border-gray-300 rounded-lg text-center font-medium focus:border-green-500 focus:ring-1 focus:ring-green-500 transition"
                            />
                            <p className="text-xl font-bold text-gray-900 w-24 text-right hidden sm:block">
                                ${((item.price * item.quantity).toFixed(2)).replace('.', ',')}
                            </p>
                        </div>
                        
                        <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-500 hover:text-red-700 transition p-2 rounded-full ml-4 flex-shrink-0"
                            aria-label={`Supprimer ${item.name}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>

            {/* Sommaire de la Commande (Colonne 3) */}
            <div className="lg:col-span-1">
                <div className="sticky top-10 bg-white p-6 rounded-xl shadow-2xl border border-green-200">
                    <h2 className="text-2xl font-extrabold text-green-900 mb-6 border-b pb-3">Sommaire de la Commande</h2>
                    
                    <div className="space-y-3 text-lg">
                        <div className="flex justify-between">
                            <span className="text-gray-700">Sous-total ({cartItems.length} articles):</span>
                            <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between border-b pb-3">
                            <span className="text-gray-700">Livraison:</span>
                            <span className={`font-semibold ${shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                                {shipping === 0 ? 'GRATUITE' : `$${shipping.toFixed(2)}`}
                            </span>
                        </div>
                        
                        <div className="flex justify-between pt-4 text-2xl font-extrabold text-green-900">
                            <span>Total:</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>

                    <p className="text-sm text-center text-gray-500 mt-4 mb-6">
                        Total estimé (Taxes calculées au paiement).
                    </p>

                    <button
                        onClick={handleCheckout}
                        disabled={isCheckingOut || cartItems.length === 0}
                        className="w-full bg-green-700 text-white text-xl font-bold py-3 rounded-lg hover:bg-green-800 transition transform hover:scale-[1.01] shadow-xl disabled:opacity-50 flex items-center justify-center space-x-2"
                    >
                        {isCheckingOut ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Traitement...</span>
                            </>
                        ) : (
                            <span>Procéder au Paiement</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}


// --- Main Page Component ---
export default function CartPage() {
  return (
    <div className="font-inter">
      <Header />
      
      {/* min-h-[80vh] ensures the footer stays at the bottom */}
      <main className="max-w-7xl mx-auto px-4 py-12 min-h-[80vh] bg-gray-50">
        
        {/* Header Section (using a regular <a> tag instead of <Link> for compatibility) */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-10">
          <h1 className="text-4xl font-extrabold text-green-900 mb-4 sm:mb-0">
            Votre Panier d'Achats
          </h1>
          
          <a 
            href="/marketplace"
            className="text-green-600 font-semibold hover:text-green-700 transition flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Continuer vos achats
          </a>
        </div>

        {/* Main Content: client-side cart management and summary */}
        <div className="">
          <CartClient />
        </div>
        
      </main>
      
      <Footer />
    </div>
  );
}