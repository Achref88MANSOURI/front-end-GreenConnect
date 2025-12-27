"use client";
import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { API_BASE_URL } from "../../src/api-config";
import ProductCard from "../components/ProductCard";
import type { Product } from "../data/products";

export default function FavoritesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("favorites") : null;
      const favs = raw ? JSON.parse(raw) : [];
      setFavorites(Array.isArray(favs) ? favs : []);
    } catch {
      setFavorites([]);
    }
  }, []);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") || localStorage.getItem("access_token") : null;
    fetch(`${API_BASE_URL}/products?t=${Date.now()}`, {
      cache: "no-store",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
      .then(async (res) => {
        if (res.ok) return res.json();
        const text = await res.text().catch(() => "");
        throw new Error(`Failed to fetch products: ${res.status} ${res.statusText} ${text}`);
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error("Invalid data format");
        const mapped: Product[] = data.map((item: any) => ({
          id: item.id,
          name: item.title,
          price: `${item.price} MAD`,
          location: item.location || item.farmer?.address || "Tunisia",
          image: item.imageUrl ? `${API_BASE_URL}/uploads/${item.imageUrl}` : "",
          description: item.description,
          seller: item.vendeur || item.farmer?.name || "Inconnu",
          contact: item.phoneNumber,
          userId: item.farmerId || item.farmer?.id,
          createdAt: item.createdAt,
        }));
        setProducts(mapped);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  const visible = useMemo(() => {
    if (!favorites.length) return [];
    const favSet = new Set(favorites);
    return products.filter((p) => favSet.has(p.id));
  }, [products, favorites]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Mes Favoris</h1>
        {loading ? (
          <p className="text-gray-600">Chargement des favoris…</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : visible.length === 0 ? (
          <div className="bg-white rounded-xl p-8 border border-gray-100 text-center">
            <p className="text-gray-700">Aucun favori pour le moment.</p>
            <p className="text-gray-500 mt-1">Cliquez sur le cœur sur une fiche produit pour l'ajouter aux favoris.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {visible.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
