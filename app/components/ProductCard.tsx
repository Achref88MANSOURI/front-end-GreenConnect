import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, User, Calendar, ArrowRight, ShoppingBag, Heart, Eye, Sparkles } from 'lucide-react';
import type { Product } from '../data/products';
import { API_BASE_URL } from '../../src/api-config';

const truncate = (s?: string, n = 100) => (s && s.length > n ? s.slice(0, n) + '…' : s || '');

const formatDate = (iso?: string) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return iso;
  }
};

export default function ProductCard({ id, name, price, location, image, description, seller, createdAt, contact, userId }: Product) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(() => {
    if (typeof window === 'undefined') return false;
    const favs = localStorage.getItem('favorites');
    return favs ? JSON.parse(favs).includes(id) : false;
  });
  const [isAdding, setIsAdding] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const favRaw = localStorage.getItem('favorites');
      const favs: number[] = favRaw ? JSON.parse(favRaw) : [];
      const idx = favs.indexOf(id);
      if (idx >= 0) {
        favs.splice(idx, 1);
        setIsFavorite(false);
      } else {
        favs.push(id);
        setIsFavorite(true);
      }
      localStorage.setItem('favorites', JSON.stringify(favs));
    } catch (e) {
      console.error('Favorite toggle error', e);
    }
  };

  const addToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (token) {
      try {
        const res = await fetch(`${API_BASE_URL}/cart/items`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ productId: id, quantity: 1 })
        });
        if (res.ok) {
          setTimeout(() => setIsAdding(false), 500);
          return;
        }
      } catch (e) {
        console.error('Failed to add to cart via API', e);
      }
    }

    try {
      const existing = typeof window !== 'undefined' ? localStorage.getItem('cart') : null;
      const cart = existing ? JSON.parse(existing) : [];
      const priceNumber = parseFloat(String(price).replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;
      const imageUrl = image || '';
      const idx = cart.findIndex((it: any) => it.id === id);
      if (idx >= 0) {
        cart[idx].quantity = (cart[idx].quantity || 1) + 1;
      } else {
        cart.push({ id, name, price: priceNumber, quantity: 1, imageUrl });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error('Failed to add to cart', e);
    }
    
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <article 
      className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 flex flex-col h-full transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
        {image ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={image} 
              alt={name} 
              className={`w-full h-full object-cover transition-all duration-700 ${
                isHovered ? 'scale-110 brightness-105' : 'scale-100 brightness-100'
              }`}
            />
            {/* Gradient overlay on hover */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`} />
          </>
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center text-gray-400 bg-gradient-to-br from-gray-50 to-gray-100">
            <Sparkles className="w-10 h-10 mb-2 opacity-50" />
            <span className="text-sm font-medium">Image non disponible</span>
          </div>
        )}
        
        {/* Price Badge */}
        <div className="absolute top-4 left-4 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg">
          <span className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            {price}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          className={`absolute top-4 right-4 p-3 rounded-2xl transition-all duration-300 ${
            isFavorite 
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' 
              : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-rose-500 shadow-lg'
          }`}
        >
          <Heart className={`w-5 h-5 transition-transform ${isFavorite ? 'fill-current scale-110' : ''}`} />
        </button>

        {/* Quick View Button - appears on hover */}
        <Link
          href={`/products/${id}`}
          className={`absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-5 py-2.5 bg-white/95 backdrop-blur-sm rounded-full text-gray-900 font-medium shadow-lg transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <Eye className="w-4 h-4" />
          Aperçu rapide
        </Link>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-emerald-600 transition-colors duration-300 mb-2">
          {name}
        </h3>

        {/* Meta Info */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-full">
            <MapPin className="w-3 h-3 text-emerald-500" />
            <span className="line-clamp-1 font-medium">{location}</span>
          </div>
          {createdAt && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-full">
              <Calendar className="w-3 h-3 text-blue-500" />
              <span className="font-medium">{formatDate(createdAt)}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow leading-relaxed">
          {truncate(description, 100)}
        </p>

        {/* Seller Info */}
        <div className="pt-4 border-t border-gray-100 mt-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-emerald-500/20">
                {seller?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-900">{seller}</span>
                {userId && (
                  <Link 
                    href={`/users/${userId}`} 
                    className="block text-xs text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
                  >
                    Voir profil
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Link 
              href={`/products/${id}`} 
              className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 text-sm font-semibold group/btn"
            >
              Détails
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
            <button 
              onClick={addToCart}
              disabled={isAdding}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                isAdding
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40'
              }`}
            >
              {isAdding ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Ajouté!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  Ajouter
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Subtle border glow effect on hover */}
      <div className={`absolute inset-0 rounded-3xl border-2 transition-all duration-500 pointer-events-none ${
        isHovered ? 'border-emerald-500/30' : 'border-transparent'
      }`} />
    </article>
  );
}
