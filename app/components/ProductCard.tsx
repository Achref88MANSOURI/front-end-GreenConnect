import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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

export default function ProductCard({ id, name, price, location, image, description, seller, createdAt, contact }: Product) {
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
    <article className="bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100">
      <div className="relative h-52 bg-gray-100">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-500">No image</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-green-800 line-clamp-2">{name}</h3>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xl font-extrabold text-green-600">{price}</p>
          <p className="text-sm text-gray-500">📍 {location}</p>
        </div>

        {createdAt && (
          <p className="text-xs text-gray-500 mt-1">Ajouté le {formatDate(createdAt)}</p>
        )}

        {seller && <p className="text-sm text-gray-600 mt-2">Vendeur: <span className="font-medium text-gray-800">{seller}</span></p>}
        {contact && <p className="text-sm text-gray-600">☎ {contact}</p>}

        <p className="text-sm text-gray-700 mt-3">{truncate(description, 120)}</p>

        <div className="mt-4 flex gap-2">
          <Link href={`/products/${id}`} className="flex-1 text-center py-2 bg-beige-100 text-green-700 rounded-lg hover:bg-beige-200 transition">Voir</Link>
          <button onClick={addToCart} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Ajouter au panier</button>
        </div>
      </div>
    </article>
  );
}
