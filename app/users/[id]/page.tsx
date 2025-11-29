"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';

interface UserProfile {
  id: number;
  name?: string; // single name field from backend
  firstName?: string; // optional legacy fields
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  avatarUrl?: string;
  role?: string;
  createdAt?: string;
}

const formatDate = (iso?: string) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return iso || '';
  }
};

export default function PublicUserProfilePage() {
  const params = useParams() as { id?: string };
  const idStr = params?.id || '';
  const id = Number(idStr);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!Number.isFinite(id)) {
        setError('Identifiant utilisateur invalide');
        setLoading(false);
        return;
      }
      try {
          const token = typeof window !== 'undefined' ? localStorage.getItem('token') || localStorage.getItem('access_token') : null;
          const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

          // Try primary users route first
          let res = await fetch(`http://localhost:5000/users/${encodeURIComponent(String(id))}`, { headers, cache: 'no-store' });
          if (res.ok) {
            const data = await res.json();
            setUser(data);
            setLoading(false);
            return;
          }

          // If users endpoint is not available, fall back to scanning products
          // for an embedded farmer object (many product responses include farmer:{...}).
          const prodRes = await fetch(`http://localhost:5000/products?t=${Date.now()}`, { headers, cache: 'no-store' });
          if (!prodRes.ok) {
            const txt = await prodRes.text().catch(() => '');
            throw new Error(`Échec récupération produits pour fallback: ${prodRes.status} ${prodRes.statusText} ${txt}`);
          }
          const products = await prodRes.json();
          if (!Array.isArray(products)) throw new Error('Format inattendu des produits pour fallback');

          // Find a user object embedded as 'farmer' with matching id
          const embeddedUser = products
            .map((it: any) => it.farmer)
            .find((f: any) => f && Number(f.id) === Number(id));

          if (embeddedUser) {
            setUser(embeddedUser);
            setLoading(false);
            return;
          }

          // If not found, surface the original users error (if any) or a generic message
          const text = await res.text().catch(() => '');
          throw new Error(`Échec récupération utilisateur: ${res.status} ${res.statusText} ${text}`);
        } catch (e: any) {
          setError(e.message);
          setLoading(false);
        }
    };
    run();
  }, [id]);

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto p-6">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700" />
          </div>
        ) : error ? (
          <div className="text-center text-red-600 bg-red-50 p-6 rounded">
            <p className="font-bold mb-2">Profil indisponible</p>
            <p className="text-sm">{error}</p>
            <p className="text-xs text-gray-600 mt-2">Le backend ne fournit pas encore l'endpoint public du profil. Essayez l'affichage depuis la fiche produit ou demandez l'ajout de <code>GET /users/:id</code> ou <code>GET /farmers/:id</code>.</p>
            <Link href="/marketplace" className="mt-4 inline-block text-green-700 underline">Retour au marketplace</Link>
          </div>
        ) : user ? (
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-green-800 mb-2">Profil du vendeur</h1>
            {user.avatarUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={`http://localhost:5000/uploads/${user.avatarUrl}`} alt="Avatar" className="h-24 w-24 object-cover rounded-full mb-4 border" />
            )}
            <p className="text-lg font-semibold">
              {user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Utilisateur'}
            </p>
            {user.email && <p className="text-sm text-gray-700 mt-1">📧 {user.email}</p>}
            {user.phoneNumber && <p className="text-sm text-gray-700">☎ {user.phoneNumber}</p>}
            {user.address && <p className="text-sm text-gray-700">📍 {user.address}</p>}
            {user.role && <p className="text-sm text-gray-700">🎭 Rôle: {user.role}</p>}
            {user.createdAt && <p className="text-xs text-gray-500 mt-2">Inscrit le {formatDate(user.createdAt)}</p>}
            <div className="mt-6 flex gap-3">
              <Link href="/marketplace" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Voir produits</Link>
              <Link href={`/products/create`} className="px-4 py-2 border rounded">Publier un produit</Link>
            </div>
          </div>
        ) : (
          <p>Aucun profil trouvé.</p>
        )}
      </main>
      <Footer />
    </>
  );
}
