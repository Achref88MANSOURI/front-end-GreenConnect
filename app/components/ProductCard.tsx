import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, User, Calendar, ArrowRight, ShoppingBag } from 'lucide-react';
import type { Product } from '../data/products';

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
  const addToCart = () => {
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
      alert('Produit ajouté au panier');
    } catch (e) {
      console.error('Failed to add to cart', e);
      alert('Impossible d\'ajouter au panier');
    }
  };

  return (
    <article className="group bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden bg-gray-100">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-400 bg-gray-50">
            <span className="text-sm font-medium">Image non disponible</span>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-emerald-700 shadow-sm">
          {price}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-emerald-600 transition-colors">
            {name}
          </h3>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span className="line-clamp-1">{location}</span>
          </div>
          {createdAt && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(createdAt)}</span>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow">
          {truncate(description, 100)}
        </p>

        <div className="pt-4 border-t border-gray-50 mt-auto space-y-3">
          {/* Seller Info */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-gray-600">
              <User className="w-3.5 h-3.5 text-gray-400" />
              <span className="font-medium text-gray-900">{seller}</span>
            </div>
            {userId && (
              <Link href={`/users/${userId}`} className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline">
                Voir profil
              </Link>
            )}
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Link 
              href={`/products/${id}`} 
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors text-sm font-medium group/btn"
            >
              Détails
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>
            <button 
              onClick={addToCart} 
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors text-sm font-medium shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
            >
              <ShoppingBag className="w-4 h-4" />
              Ajouter
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
