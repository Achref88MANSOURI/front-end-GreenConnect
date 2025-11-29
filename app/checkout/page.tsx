"use client";

// checkout.jsx
// Page Passer Commande unifiée (Single File)

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

// --- Composant Header Factice (Simulé) ---
const Header = () => (
    <header className="bg-green-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <a href="/marketplace" className="text-2xl font-bold tracking-tight">Souk-Moussel</a>
            <nav className="space-x-4 flex items-center">
                <a href="/marketplace" className="hover:text-green-200 transition">Catalogue</a>
                <a href="/cart" className="bg-green-600 px-3 py-1 rounded-full flex items-center space-x-1 hover:bg-green-700 transition">
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

// Define a type for a cart item
interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

// Données factices du panier (Simulant l'état après la page /cart)
const DUMMY_CART_ITEMS: CartItem[] = [
    { id: 'p1', name: 'Huile d\'Olive Artisanale', price: 25.00, quantity: 2 },
    { id: 'p2', name: 'Pot de Miel Bio', price: 15.50, quantity: 1 },
    { id: 'p3', name: 'Panier Tressé à la Main', price: 45.00, quantity: 1 },
];

// État initial des informations de commande
const initialOrderState = {
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'France',
    paymentMethod: 'card', // 'card' or 'paypal'
};

export default function CheckoutPage() {
    const router = useRouter();
    const [cartItems] = useState<CartItem[]>(DUMMY_CART_ITEMS);
    const [formData, setFormData] = useState(initialOrderState);
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Calculs de la commande (Subtotal, Shipping, Total)
    const { subtotal, shipping, total } = useMemo(() => {
        const sub = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const ship = sub > 80 ? 0 : 8.50; // Nouvelle règle de livraison simulée
        const tot = sub + ship;
        return { subtotal: sub, shipping: ship, total: tot };
    }, [cartItems]);


    // Validation des champs
    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.firstName) newErrors.firstName = 'Le prénom est requis.';
        if (!formData.lastName) newErrors.lastName = 'Le nom est requis.';
        if (!formData.address) newErrors.address = 'L\'adresse est requise.';
        if (!formData.city) newErrors.city = 'La ville est requise.';
        if (!formData.zipCode) newErrors.zipCode = 'Le code postal est requis.';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Gestion de la soumission du formulaire
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setOrderSuccess(false);

        if (!validate()) {
            return;
        }

        setIsProcessing(true);

        // Simulation de l'appel API de paiement
        setTimeout(() => {
            // Generate a simple order id for demo purposes
            const orderId = `CMD-${Date.now()}`;
            console.log('Commande soumise:', { orderId, ...formData, total: total.toFixed(2) });
            setIsProcessing(false);
            setOrderSuccess(true);
            setFormData(initialOrderState); // Réinitialiser le formulaire
            // Redirect to the order confirmation page with the generated id
            router.push(`/commande/${orderId}`);
        }, 1500);
    };

    // Mise à jour des données du formulaire
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Effacer l'erreur dès que l'utilisateur commence à taper
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };
    
    // Si le panier est vide (seulement pour la démo, car on utilise des données factices)
    if (cartItems.length === 0 && !orderSuccess) {
         return (
            <div className="font-inter">
                <Header />
                <main className="max-w-7xl mx-auto px-4 py-12 min-h-[80vh] bg-gray-50">
                    <div className="text-center py-20 bg-white rounded-xl shadow-2xl border border-green-200">
                        <p className="text-3xl font-extrabold text-green-900 mb-4">Panier Vide</p>
                        <p className="text-gray-600 mb-8 max-w-lg mx-auto">Veuillez retourner au panier pour ajouter des articles.</p>
                        <a 
                            href="/cart" 
                            className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-lg transform hover:scale-[1.05]"
                        >
                            Retour au Panier
                        </a>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }
    
    // Écran de Succès
    if (orderSuccess) {
        return (
            <div className="font-inter">
                <Header />
                <main className="max-w-7xl mx-auto px-4 py-12 min-h-[80vh] bg-gray-50">
                    <div className="text-center py-20 bg-white rounded-xl shadow-2xl border border-green-200">
                        <svg className="mx-auto h-20 w-20 text-green-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <h1 className="text-4xl font-extrabold text-green-900 mb-4">Commande Confirmée!</h1>
                        <p className="text-xl text-gray-700 mb-8 max-w-lg mx-auto">
                            Merci de votre achat. Votre commande sera traitée sous peu.
                        </p>
                        <a 
                            href="/marketplace" 
                            className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-lg transform hover:scale-[1.05]"
                        >
                            Retourner au Catalogue
                        </a>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="font-inter">
            <Header />
            <main className="max-w-7xl mx-auto px-4 py-12 min-h-[80vh] bg-gray-50">
                
                <h1 className="text-4xl font-extrabold text-green-900 border-b pb-4 mb-10">
                    Finaliser la Commande
                </h1>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    
                    {/* Colonne 1 & 2: Formulaire d'Adresse et de Paiement */}
                    <div className="lg:col-span-2 space-y-8 p-6 bg-white rounded-xl shadow-2xl border border-gray-100">
                        
                        {/* 1. Adresse de Livraison */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">1. Adresse de Livraison</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Prénom</label>
                                    <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange}
                                        className={`mt-1 block w-full rounded-lg border p-3 shadow-sm focus:ring-green-500 focus:border-green-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`} />
                                    {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Nom</label>
                                    <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange}
                                        className={`mt-1 block w-full rounded-lg border p-3 shadow-sm focus:ring-green-500 focus:border-green-500 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`} />
                                    {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                                </div>
                            </div>

                            <div className="mt-4">
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Adresse Complète</label>
                                <input type="text" id="address" name="address" value={formData.address} onChange={handleChange}
                                    className={`mt-1 block w-full rounded-lg border p-3 shadow-sm focus:ring-green-500 focus:border-green-500 ${errors.address ? 'border-red-500' : 'border-gray-300'}`} />
                                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">Ville</label>
                                    <input type="text" id="city" name="city" value={formData.city} onChange={handleChange}
                                        className={`mt-1 block w-full rounded-lg border p-3 shadow-sm focus:ring-green-500 focus:border-green-500 ${errors.city ? 'border-red-500' : 'border-gray-300'}`} />
                                    {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                                </div>
                                <div>
                                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">Code Postal</label>
                                    <input type="text" id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange}
                                        className={`mt-1 block w-full rounded-lg border p-3 shadow-sm focus:ring-green-500 focus:border-green-500 ${errors.zipCode ? 'border-red-500' : 'border-gray-300'}`} />
                                    {errors.zipCode && <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>}
                                </div>
                                <div>
                                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">Pays</label>
                                    <select id="country" name="country" value={formData.country} onChange={handleChange}
                                        className="mt-1 block w-full rounded-lg border p-3 shadow-sm focus:ring-green-500 focus:border-green-500 border-gray-300 bg-white">
                                        <option>France</option>
                                        <option>Belgique</option>
                                        <option>Suisse</option>
                                        <option>Autres</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        {/* 2. Mode de Paiement */}
                        <section className="mt-8 pt-6 border-t border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">2. Mode de Paiement</h2>
                            
                            <div className="space-y-4">
                                {/* Option Carte Bancaire */}
                                <label className="flex items-center p-4 bg-gray-50 rounded-lg border cursor-pointer has-[:checked]:border-green-500 has-[:checked]:bg-green-50 transition">
                                    <input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === 'card'} onChange={handleChange} className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500" />
                                    <span className="ml-3 text-lg font-medium text-gray-800">Carte Bancaire (Visa, MasterCard, Amex)</span>
                                    <div className="ml-auto flex space-x-2">
                                        
                                    </div>
                                </label>

                                {/* Option PayPal */}
                                <label className="flex items-center p-4 bg-gray-50 rounded-lg border cursor-pointer has-[:checked]:border-green-500 has-[:checked]:bg-green-50 transition">
                                    <input type="radio" name="paymentMethod" value="paypal" checked={formData.paymentMethod === 'paypal'} onChange={handleChange} className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500" />
                                    <span className="ml-3 text-lg font-medium text-gray-800">PayPal</span>
                                    <div className="ml-auto">
                                        
                                    </div>
                                </label>
                            </div>

                            {/* Simulation d'entrée de carte si 'card' est sélectionné */}
                            {formData.paymentMethod === 'card' && (
                                <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-white shadow-inner space-y-4">
                                    <p className="font-semibold text-sm text-gray-600">Simuler la saisie de la carte :</p>
                                    <div>
                                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Numéro de Carte</label>
                                        <input type="text" id="cardNumber" placeholder="XXXX XXXX XXXX XXXX" className="mt-1 block w-full rounded-lg border p-3 shadow-sm focus:ring-green-500 focus:border-green-500 border-gray-300" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">Date d'Expiration (MM/AA)</label>
                                            <input type="text" id="expiryDate" placeholder="01/26" className="mt-1 block w-full rounded-lg border p-3 shadow-sm focus:ring-green-500 focus:border-green-500 border-gray-300" />
                                        </div>
                                        <div>
                                            <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">CVV</label>
                                            <input type="text" id="cvv" placeholder="123" className="mt-1 block w-full rounded-lg border p-3 shadow-sm focus:ring-green-500 focus:border-green-500 border-gray-300" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Colonne 3: Récapitulatif de la Commande */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-10 bg-white p-6 rounded-xl shadow-2xl border border-green-200">
                            <h2 className="text-2xl font-extrabold text-green-900 mb-6 border-b pb-3">Votre Commande</h2>

                            {/* Détail des articles */}
                            <div className="space-y-3 pb-4 border-b">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex justify-between text-sm text-gray-600">
                                        <span className="truncate">{item.name} (x{item.quantity})</span>
                                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Sommaire des coûts */}
                            <div className="space-y-3 text-lg mt-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-700">Sous-total:</span>
                                    <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between border-b pb-3">
                                    <span className="text-gray-700">Livraison:</span>
                                    <span className={`font-semibold ${shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                                        {shipping === 0 ? 'GRATUITE' : `$${shipping.toFixed(2)}`}
                                    </span>
                                </div>
                                
                                <div className="flex justify-between pt-4 text-2xl font-extrabold text-green-900">
                                    <span>Total (TTC):</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>
                            
                            <p className="text-xs text-gray-500 mt-2">Livraison gratuite pour les commandes supérieures à $80.00.</p>

                            {/* Bouton de Paiement Final */}
                            <button
                                type="submit"
                                disabled={isProcessing || cartItems.length === 0}
                                className="w-full mt-6 bg-green-700 text-white text-xl font-bold py-3 rounded-lg hover:bg-green-800 transition transform hover:scale-[1.01] shadow-xl disabled:opacity-50 flex items-center justify-center space-x-2"
                            >
                                {isProcessing ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Traitement du Paiement...</span>
                                    </>
                                ) : (
                                    <span>Payer ${total.toFixed(2)}</span>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </main>
            <Footer />
        </div>
    );
}