"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { API_BASE_URL } from '../../src/api-config';
import { 
  ShoppingCart, ArrowLeft, Trash2, Plus, Minus, Package, Truck, ShieldCheck, 
  Send, CheckCircle2, X, User, Phone, MapPin, MessageSquare, Loader2, ShoppingBag,
  AlertCircle, ExternalLink
} from 'lucide-react';

interface CartItem {
  id: number | string;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  seller?: string;
  sellerId?: number;
}

interface PurchaseRequestForm {
  buyerName: string;
  buyerPhone: string;
  buyerAddress: string;
  buyerMessage: string;
}

function CartClient() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CartItem | null>(null);
  const [requestQuantity, setRequestQuantity] = useState(1);
  const [isSending, setIsSending] = useState(false);
  const [form, setForm] = useState<PurchaseRequestForm>({
    buyerName: '',
    buyerPhone: '',
    buyerAddress: '',
    buyerMessage: '',
  });

  // Load cart items
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    // Get user info for pre-filling form
    try {
      const userRaw = localStorage.getItem('user');
      if (userRaw) {
        const user = JSON.parse(userRaw);
        setForm(prev => ({
          ...prev,
          buyerName: user.name || '',
          buyerPhone: user.phoneNumber || '',
          buyerAddress: user.address || '',
        }));
      }
    } catch {}
    
    if (token) {
      fetch(`${API_BASE_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data && data.items) {
          const mapped = data.items.map((item: any) => ({
            id: item.id,
            productId: item.product.id,
            name: item.product.title,
            price: Number(item.product.price),
            quantity: item.quantity,
            imageUrl: item.product.imageUrl ? `${API_BASE_URL}/uploads/${item.product.imageUrl}` : '',
            seller: item.product.vendeur || item.product.farmer?.name,
            sellerId: item.product.farmerId || item.product.farmer?.id,
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
        const items = raw ? JSON.parse(raw) : [];
        setCartItems(items.map((item: any) => ({
          ...item,
          productId: item.id,
        })));
      } catch {}
      setLoading(false);
    }
  }, []);

  // Sync localStorage for non-logged users
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token && cartItems.length > 0) {
      try {
        localStorage.setItem('cart', JSON.stringify(cartItems));
      } catch {}
    }
  }, [cartItems]);

  const handleUpdateQuantity = async (id: string | number, newQuantity: number) => {
    if (newQuantity <= 0) {
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
  };

  const showMessageFunc = (msg: string, type: 'success' | 'error') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const openPurchaseModal = (item: CartItem) => {
    setSelectedItem(item);
    setRequestQuantity(item.quantity);
    setShowModal(true);
  };

  const handleSendRequest = async () => {
    if (!selectedItem) return;
    
    const token = localStorage.getItem('token');
    if (!token) {
      showMessageFunc('Vous devez être connecté pour envoyer une demande', 'error');
      return;
    }

    if (!form.buyerName || !form.buyerPhone) {
      showMessageFunc('Veuillez remplir votre nom et téléphone', 'error');
      return;
    }

    setIsSending(true);
    
    try {
      const res = await fetch(`${API_BASE_URL}/purchase-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: selectedItem.productId,
          quantity: requestQuantity,
          buyerName: form.buyerName,
          buyerPhone: form.buyerPhone,
          buyerAddress: form.buyerAddress,
          buyerMessage: form.buyerMessage,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Erreur lors de l\'envoi');
      }

      // Remove item from cart after successful request
      await handleRemoveItem(selectedItem.id);
      
      setShowModal(false);
      setSelectedItem(null);
      showMessageFunc('Demande d\'achat envoyée avec succès! Le vendeur sera notifié.', 'success');
    } catch (err: any) {
      showMessageFunc(err.message || 'Erreur lors de l\'envoi de la demande', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const getImageUrl = (path: string) => {
    if (!path) return 'https://placehold.co/100x100/60a5fa/ffffff?text=Product';
    if (path.startsWith('http')) return path;
    return path;
  };

  const placeholderError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = "https://placehold.co/100x100/60a5fa/ffffff?text=Product";
  };

  if (loading) {
    return (
      <div className="text-center py-16 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
          <p className="text-gray-600 font-medium">Chargement du panier...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <>
        {message && (
          <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 ${
            messageType === 'success' 
              ? 'bg-emerald-50/90 border border-emerald-200 text-emerald-700'
              : 'bg-red-50/90 border border-red-200 text-red-700'
          }`}>
            {messageType === 'success' ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <p className="font-medium">{message}</p>
          </div>
        )}
        
        <div className="text-center py-16 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500" />
          
          <div className="relative px-6">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-16 h-16 text-emerald-500" />
            </div>
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-emerald-700 via-green-700 to-teal-700 bg-clip-text text-transparent mb-4">
              Votre Panier est Vide
            </h2>
            <p className="text-gray-600 mb-6 max-w-lg mx-auto">
              Découvrez nos produits agricoles frais et envoyez des demandes d'achat aux vendeurs !
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/marketplace" 
                className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 transition-all duration-300 shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <ShoppingCart className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Explorer le Marketplace</span>
              </Link>
              
              <Link 
                href="/purchase-requests" 
                className="inline-flex items-center gap-2 bg-white text-emerald-700 px-6 py-4 rounded-2xl font-bold border-2 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Mes Demandes d'Achat</span>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 ${
          messageType === 'success' 
            ? 'bg-emerald-50/90 backdrop-blur-sm border border-emerald-200 text-emerald-700'
            : 'bg-red-50/90 backdrop-blur-sm border border-red-200 text-red-700'
        }`}>
          {messageType === 'success' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <p className="font-medium">{message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
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
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Image */}
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-lg flex-shrink-0 border-2 border-gray-100 group-hover:border-emerald-200 transition-colors">
                      <img 
                        src={getImageUrl(item.imageUrl)} 
                        alt={item.name} 
                        onError={placeholderError}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-grow min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link 
                            href={`/products/${item.productId}`}
                            className="text-lg font-bold text-gray-900 hover:text-emerald-600 transition line-clamp-1"
                          >
                            {item.name}
                          </Link>
                          {item.seller && (
                            <p className="text-sm text-gray-500 mt-1">
                              Vendeur: <span className="font-medium text-gray-700">{item.seller}</span>
                            </p>
                          )}
                          <p className="text-emerald-600 font-semibold mt-1">{item.price.toFixed(2)} MAD / unité</p>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                          title="Supprimer"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-4 gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 bg-gray-100 hover:bg-emerald-100 rounded-lg flex items-center justify-center text-gray-600 hover:text-emerald-600 transition-all"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <input 
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

                        <p className="text-xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                          {(item.price * item.quantity).toFixed(2)} MAD
                        </p>
                      </div>

                      {/* Send Request Button */}
                      <button
                        onClick={() => openPurchaseModal(item)}
                        className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition font-bold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40"
                      >
                        <Send className="w-5 h-5" />
                        Envoyer une demande d'achat
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
              <span className="text-sm font-medium text-gray-700">Transaction Sécurisée</span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-center">
              <div className="w-12 h-12 mx-auto bg-blue-100 rounded-xl flex items-center justify-center mb-2">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Contact Direct</span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-center">
              <div className="w-12 h-12 mx-auto bg-purple-100 rounded-xl flex items-center justify-center mb-2">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Produits Frais</span>
            </div>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500" />
            
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-extrabold text-gray-900">Résumé</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Sous-total ({cartItems.length} articles)</span>
                  <span className="font-bold text-gray-900">{subtotal.toFixed(2)} MAD</span>
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <p className="text-sm text-blue-700">
                      <strong>Comment ça marche ?</strong><br />
                      Pour chaque produit, envoyez une demande d'achat au vendeur. Celui-ci vous contactera pour confirmer la transaction.
                    </p>
                  </div>
                </div>
              </div>

              {/* Link to requests */}
              <Link
                href="/purchase-requests"
                className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-100 text-emerald-700 rounded-xl hover:bg-emerald-200 transition font-bold"
              >
                <ShoppingBag className="w-5 h-5" />
                Mes Demandes Envoyées
                <ExternalLink className="w-4 h-4" />
              </Link>

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

      {/* Purchase Request Modal */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-300">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Send className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Demande d'achat</h2>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Product Info */}
              <div className="flex gap-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0 shadow-md">
                  <img
                    src={getImageUrl(selectedItem.imageUrl)}
                    alt={selectedItem.name}
                    onError={placeholderError}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{selectedItem.name}</h3>
                  <p className="text-emerald-600 font-bold text-lg">{selectedItem.price.toFixed(2)} MAD / unité</p>
                  {selectedItem.seller && (
                    <p className="text-sm text-gray-500 mt-1">Vendeur: {selectedItem.seller}</p>
                  )}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Quantité souhaitée
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setRequestQuantity(Math.max(1, requestQuantity - 1))}
                    className="w-12 h-12 flex items-center justify-center bg-gray-100 hover:bg-emerald-100 rounded-xl transition text-gray-700 hover:text-emerald-700"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={requestQuantity}
                    onChange={(e) => setRequestQuantity(parseInt(e.target.value) || 1)}
                    className="w-24 h-12 text-center border-2 border-gray-200 rounded-xl font-bold text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <button
                    onClick={() => setRequestQuantity(requestQuantity + 1)}
                    className="w-12 h-12 flex items-center justify-center bg-gray-100 hover:bg-emerald-100 rounded-xl transition text-gray-700 hover:text-emerald-700"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  <div className="flex-1 text-right">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-2xl font-black text-emerald-600">
                      {(selectedItem.price * requestQuantity).toFixed(2)} MAD
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <User className="w-4 h-4 text-emerald-600" />
                    Votre nom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.buyerName}
                    onChange={(e) => setForm({ ...form, buyerName: e.target.value })}
                    placeholder="Votre nom complet"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <Phone className="w-4 h-4 text-emerald-600" />
                    Numéro de téléphone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={form.buyerPhone}
                    onChange={(e) => setForm({ ...form, buyerPhone: e.target.value })}
                    placeholder="+212 6XX XXX XXX"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    Adresse <span className="text-gray-400 font-normal">(optionnel)</span>
                  </label>
                  <input
                    type="text"
                    value={form.buyerAddress}
                    onChange={(e) => setForm({ ...form, buyerAddress: e.target.value })}
                    placeholder="Votre adresse de livraison"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    Message au vendeur <span className="text-gray-400 font-normal">(optionnel)</span>
                  </label>
                  <textarea
                    value={form.buyerMessage}
                    onChange={(e) => setForm({ ...form, buyerMessage: e.target.value })}
                    placeholder="Informations supplémentaires pour le vendeur..."
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition resize-none"
                  />
                </div>
              </div>

              {/* Info Note */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-sm text-amber-800">
                  <strong>📞 Note importante:</strong> Après l'envoi, le vendeur recevra une notification. 
                  S'il accepte votre demande, vous recevrez son numéro de téléphone pour finaliser l'achat.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6 rounded-b-3xl">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-bold"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSendRequest}
                  disabled={isSending || !form.buyerName || !form.buyerPhone}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Envoi...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Envoyer la demande
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
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
              Envoyez des demandes d'achat aux vendeurs pour vos produits préférés
            </p>
          </div>

          {/* Quick Link to Sent Requests */}
          <div className="flex justify-center mb-8">
            <Link 
              href="/purchase-requests"
              className="group inline-flex items-center gap-3 px-6 py-3 bg-white/15 backdrop-blur-md rounded-2xl border border-white/25 text-white hover:bg-white/25 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="font-semibold">Voir mes demandes envoyées</span>
              <svg className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
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
