"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import type { Product } from '../../data/products';

type Props = {
  params: { id: string };
};

export default function ProductDetailsPage({ params }: Props) {
  // In client components, prefer useParams() over props
  const routeParams = useParams() as { id?: string };
  const idStr = routeParams?.id ?? (typeof window !== 'undefined' ? window.location.pathname.split('/').pop() || '' : '');
  const id = Number(idStr);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isFinite(id)) {
      setError('Identifiant de produit invalide');
      setLoading(false);
      return;
    }
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') || localStorage.getItem('access_token') : null;
    fetch(`http://localhost:5000/products/${encodeURIComponent(String(id))}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      cache: 'no-store',
    })
      .then(async res => {
        if (res.ok) return res.json();
        const text = await res.text().catch(() => '');
        throw new Error(`Failed to fetch product: ${res.status} ${res.statusText} ${text}`);
      })
      .then(item => {
        const mapped: Product = {
          id: item.id,
          name: item.title,
          price: `${item.price} MAD`,
          location: item.location || item.farmer?.address || 'Tunisia',
          image: item.imageUrl ? `http://localhost:5000/uploads/${item.imageUrl}` : '',
          description: item.description,
          seller: item.vendeur || item.farmer?.name || undefined,
          contact: item.phoneNumber,
          userId: item.farmerId || item.farmer?.id,
          createdAt: item.createdAt,
        };
        setProduct(mapped);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="max-w-4xl mx-auto p-6">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <main className="max-w-4xl mx-auto p-6">
          <h2 className="text-2xl font-bold">Produit introuvable</h2>
          <p className="mt-4">{error || "Le produit demandé n'existe pas."}</p>
          <Link href="/marketplace" className="mt-4 inline-block text-green-600 underline">Retour au catalogue</Link>
        </main>
        <Footer />
      </>
    );
  }

  // Affichage détaillé produit
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-gray-100 h-64 flex items-center justify-center">
            {product.image ? (
              <img src={product.image} alt={product.name} className="max-h-64 object-cover" />
            ) : (
              <div className="text-gray-500">No image</div>
            )}
          </div>
          <div className="md:col-span-2">
            <h1 className="text-3xl font-extrabold text-green-900">{product.name}</h1>
            <p className="text-2xl text-green-600 font-bold mt-2">{product.price}</p>
            <p className="text-sm text-gray-600 mt-1">📍 {product.location}</p>
            <p className="mt-4 text-gray-700">{product.description ?? 'Aucune description fournie.'}</p>
            <div className="mt-6 flex flex-col gap-2">
              {product.seller && (
                <p>
                  <strong>Vendeur :</strong> {product.seller}
                  {product.userId && (
                    <Link href={`/users/${product.userId}`} className="ml-2 text-green-700 underline text-sm">Voir profil</Link>
                  )}
                </p>
              )}
              {product.contact && (
                <p><strong>Contact :</strong> <a href={`tel:${product.contact}`} className="text-green-700 underline">{product.contact}</a></p>
              )}
              {product.stock !== undefined && product.unit && (
                <p><strong>Stock disponible :</strong> {product.stock} {product.unit}</p>
              )}
              {product.harvestDate && <p><strong>Date de récolte :</strong> {product.harvestDate}</p>}
              {product.certifications && (
                <p><strong>Certifications :</strong> {product.certifications.join(', ')}</p>
              )}
            </div>
            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => {
                  try {
                    const raw = localStorage.getItem('cart');
                    const cart = raw ? JSON.parse(raw) : [];
                    const priceNumber = parseFloat(String(product.price).replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;
                    const idx = cart.findIndex((it: any) => it.id === product.id);
                    if (idx >= 0) {
                      cart[idx].quantity = (cart[idx].quantity || 1) + 1;
                    } else {
                      cart.push({ id: product.id, name: product.name, price: priceNumber, quantity: 1, imageUrl: product.image || '' });
                    }
                    localStorage.setItem('cart', JSON.stringify(cart));
                    window.dispatchEvent(new Event('storage'));
                    alert('Produit ajouté au panier');
                  } catch (e) {
                    alert("Impossible d'ajouter au panier");
                  }
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Ajouter au panier
              </button>
              <button
                onClick={async () => {
                  if (!confirm('Supprimer ce produit ? Cette action est définitive.')) return;
                  try {
                    const token = localStorage.getItem('token') || localStorage.getItem('access_token');
                    if (!token) {
                      alert('Vous devez être connecté pour supprimer un produit.');
                      return;
                    }
                    const res = await fetch(`http://localhost:5000/products/${encodeURIComponent(String(product.id))}`, {
                      method: 'DELETE',
                      headers: { Authorization: `Bearer ${token}` },
                    });
                    if (!res.ok) {
                      const txt = await res.text().catch(() => '');
                      throw new Error(`Échec de la suppression: ${res.status} ${res.statusText} ${txt}`);
                    }
                    alert('Produit supprimé.');
                    window.location.href = '/marketplace';
                  } catch (err: any) {
                    console.error(err);
                    alert(err.message || 'Erreur lors de la suppression');
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Supprimer
              </button>
              <Link href={`/products/${product.id}/edit`} className="px-4 py-2 bg-yellow-500 text-white rounded-lg">Modifier</Link>
              <Link href="/marketplace" className="px-4 py-2 border border-gray-200 rounded-lg">Retour au catalogue</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
