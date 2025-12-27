"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import type { Product } from '../../data/products';
import { 
  MapPin, 
  User, 
  Phone, 
  Calendar, 
  ShieldCheck, 
  ShoppingCart, 
  ArrowLeft, 
  Trash2, 
  Edit, 
  Share2, 
  Heart, 
  Package, 
  AlertCircle 
} from 'lucide-react';

type Props = {
  params: { id: string };
};

export default function ProductDetailsPage({ params }: Props) {
  const routeParams = useParams();
  const router = useRouter();
  
  const [id, setId] = useState<number | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // NOTE: Ownership should be checked securely on the server or via token decoding
  const [isOwner, setIsOwner] = useState(false); 
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Safely extract ID from params
    if (routeParams?.id) {
      const rawId = Array.isArray(routeParams.id) ? routeParams.id[0] : routeParams.id;
      const parsedId = Number(rawId);
      if (Number.isFinite(parsedId)) {
        setId(parsedId);
      } else {
        setError('Identifiant de produit invalide');
        setLoading(false);
      }
    }
  }, [routeParams]);

  useEffect(() => {
    if (id === null) return;

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') || localStorage.getItem('access_token') : null;
    
    // Fetch product details
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
        // Helper to construct image URL safely
        const getImageUrl = (path: string) => {
          if (!path) return '';
          if (path.startsWith('http')) return path;
          const cleanPath = path.replace(/\\/g, '/');
          if (cleanPath.startsWith('/uploads/') || cleanPath.startsWith('uploads/')) {
             return `http://localhost:5000/${cleanPath.replace(/^\/?/, '')}`;
          }
          return `http://localhost:5000/uploads/${cleanPath}`;
        };

        const mapped: Product = {
          id: item.id,
          name: item.title,
          price: `${item.price} MAD`,
          location: item.location || item.farmer?.address || 'Tunisia',
          image: getImageUrl(item.imageUrl || item.image),
          description: item.description,
          seller: item.vendeur || item.farmer?.name || undefined,
          contact: item.phoneNumber,
          userId: item.farmerId || item.farmer?.id,
          createdAt: item.createdAt,
          // Map other fields
          stock: item.stock,
          unit: item.unit,
          // Formats date nicely if available, otherwise keeps raw value
          harvestDate: item.harvestDate ? new Date(item.harvestDate).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' }) : undefined, 
          certifications: item.certifications
        };
        setProduct(mapped);
        setLoading(false);
        
        // Simple ownership check: Assume owner if a token exists for this demo
        if (token) setIsOwner(true); 

        // Load favorite state from localStorage
        try {
          const favRaw = typeof window !== 'undefined' ? localStorage.getItem('favorites') : null;
          const favs = favRaw ? JSON.parse(favRaw) : [];
          setIsFavorite(Array.isArray(favs) && favs.includes(mapped.id));
        } catch {}
      })
      .catch(e => {
        console.error(e);
        setError(e.message);
        setLoading(false);
      });
  }, [id]);

  const addToCart = () => {
    if (!product) return;
    try {
      const raw = localStorage.getItem('cart');
      const cart = raw ? JSON.parse(raw) : [];
      // Robust price parsing for MAD currency
      const priceNumber = parseFloat(String(product.price).replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;
      const idx = cart.findIndex((it: any) => it.id === product.id);
      if (idx >= 0) {
        cart[idx].quantity = (cart[idx].quantity || 1) + 1;
      } else {
        cart.push({ id: product.id, name: product.name, price: priceNumber, quantity: 1, imageUrl: product.image || '' });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('storage'));
      alert('Produit ajouté au panier avec succès !');
    } catch (e) {
      alert("Impossible d'ajouter au panier");
    }
  };

  const handleDelete = async () => {
    if (!product) return;
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.')) return;
    
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
      
      alert('Produit supprimé avec succès.');
      router.push('/marketplace');
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Erreur lors de la suppression');
    }
  };

  const toggleFavorite = () => {
    if (!product) return;
    try {
      const favRaw = typeof window !== 'undefined' ? localStorage.getItem('favorites') : null;
      const favs: number[] = favRaw ? JSON.parse(favRaw) : [];
      const idx = favs.indexOf(product.id);
      if (idx >= 0) {
        favs.splice(idx, 1);
        setIsFavorite(false);
        alert('Retiré des favoris');
      } else {
        favs.push(product.id);
        setIsFavorite(true);
        alert('Ajouté aux favoris');
      }
      localStorage.setItem('favorites', JSON.stringify(favs));
    } catch (e) {
      console.error('Favorite toggle error', e);
      alert('Impossible de mettre à jour les favoris');
    }
  };

  const shareProduct = async () => {
    if (!product) return;
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const title = `Découvrez: ${product.name}`;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
      } else {
        await navigator.clipboard.writeText(url);
        alert('Lien copié dans le presse-papiers');
      }
    } catch (e) {
      console.error('Share failed', e);
      alert('Partage non disponible');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            <p className="text-gray-500 animate-pulse font-medium">Chargement du produit...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow flex items-center justify-center p-6">
          <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Produit introuvable</h2>
            <p className="text-gray-500 mb-8">{error || "Le produit demandé n'existe pas ou a été retiré."}</p>
            <Link 
              href="/marketplace" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition duration-300 shadow-lg shadow-emerald-500/30 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour au catalogue
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* 🌿 Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-10">
            <Link href="/marketplace" className="hover:text-emerald-600 transition flex items-center gap-1 font-medium">
              <ArrowLeft className="w-4 h-4" />
              Marketplace
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-semibold truncate max-w-[200px]">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            
            {/* 🖼️ Left Column: Image/Media */}
            <div className="w-full lg:sticky lg:top-28">
              <div className="relative aspect-[4/3] bg-white rounded-[2rem] overflow-hidden shadow-xl border border-gray-100 group">
                {product.image ? (
                  <Image 
                    src={product.image} 
                    alt={product.name} 
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    priority
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                    <div className="text-center">
                      <Package className="w-16 h-16 mx-auto mb-2 opacity-50" />
                      <span className="font-medium">Aucune image disponible</span>
                    </div>
                  </div>
                )}
                <div className="absolute top-4 right-4 flex gap-3">
                  <button onClick={toggleFavorite} className={`p-3 bg-white/70 backdrop-blur rounded-full shadow-lg hover:bg-white transition duration-300 transform hover:scale-105 ${isFavorite ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}>
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                  <button onClick={shareProduct} className="p-3 bg-white/70 backdrop-blur rounded-full shadow-lg hover:bg-white transition duration-300 text-gray-600 hover:text-blue-500 transform hover:scale-105">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* 📝 Right Column: Details & Actions */}
            <div className="w-full">
              <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl border border-gray-100">
                
                {/* Product Title and Price Block */}
                <div className="flex flex-col sm:flex-row items-start justify-between mb-8 pb-4 border-b border-gray-100">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2 leading-tight">
                        {product.name}
                    </h1>
                    <div className="flex items-center gap-2 text-gray-500 text-lg">
                      <MapPin className="w-5 h-5 text-emerald-600" />
                      <span className="font-medium">{product.location}</span>
                    </div>
                  </div>
                  <div className="text-right mt-4 sm:mt-0">
                    <p className="text-4xl font-extrabold text-emerald-600">{product.price}</p>
                    {product.unit && <p className="text-md text-gray-500">/{product.unit}</p>}
                  </div>
                </div>

                {/* Description */}
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Description du produit</h2>
                <div className="text-gray-600 leading-relaxed mb-10 text-base space-y-4">
                  {product.description ? (
                    product.description.split('\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))
                  ) : (
                    <p className="italic text-gray-400">Aucune description détaillée fournie pour ce produit.</p>
                  )}
                </div>

                {/* Info Grid - Modern Cards */}
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Détails de l'offre</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                  
                  {/* Seller Info */}
                  {product.seller && (
                    <div className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl transition duration-200 hover:shadow-md hover:border-emerald-200">
                      <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 flex-shrink-0">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Vendeur</p>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 text-base">{product.seller}</span>
                          {product.userId && (
                            <Link href={`/users/${product.userId}`} className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline transition">
                              (Profil)
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Harvest Date */}
                  {product.harvestDate && (
                    <div className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl transition duration-200 hover:shadow-md hover:border-orange-200">
                      <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 flex-shrink-0">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Date de Récolte</p>
                        <p className="font-bold text-gray-900 text-base">{product.harvestDate}</p>
                      </div>
                    </div>
                  )}

                  {/* Stock */}
                  {product.stock !== undefined && (
                    <div className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl transition duration-200 hover:shadow-md hover:border-blue-200">
                      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0">
                        <Package className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Stock Disponible</p>
                        <p className="font-bold text-gray-900 text-base">{product.stock} {product.unit}</p>
                      </div>
                    </div>
                  )}

                  {/* Certifications */}
                  {product.certifications && product.certifications.length > 0 && (
                    <div className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl transition duration-200 hover:shadow-md hover:border-purple-200">
                      <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 flex-shrink-0">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Certifications</p>
                        <p className="font-bold text-gray-900 text-base line-clamp-2">{product.certifications.join(', ')}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Main Actions */}
                <div className="mt-auto space-y-3 pt-6 border-t border-gray-100">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={addToCart}
                      disabled={product.stock !== undefined && product.stock <= 0}
                      className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-lg transition duration-300 transform shadow-lg 
                        ${product.stock !== undefined && product.stock <= 0
                          ? 'bg-gray-400 text-gray-700 cursor-not-allowed shadow-none'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/30 hover:scale-[1.01] active:scale-100'
                        }`}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {product.stock !== undefined && product.stock <= 0 ? 'Stock épuisé' : 'Ajouter au panier'}
                    </button>
                    
                    {product.contact && (
                      <a 
                        href={`tel:${product.contact}`}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-emerald-500 text-emerald-600 rounded-xl hover:bg-emerald-50 transition duration-300 font-bold text-lg shadow-sm"
                      >
                        <Phone className="w-5 h-5" />
                        Contacter
                      </a>
                    )}
                  </div>

                  {/* Owner Actions */}
                  {isOwner && (
                    <div className="pt-6 mt-6 border-t border-gray-100 flex gap-4 justify-end">
                      <Link 
                        href={`/products/${product.id}/edit`}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-amber-700 bg-amber-100 rounded-lg hover:bg-amber-200 transition duration-300 transform hover:scale-[1.02]"
                      >
                        <Edit className="w-4 h-4" />
                        Modifier
                      </Link>
                      <button
                        onClick={handleDelete}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition duration-300 transform hover:scale-[1.02]"
                      >
                        <Trash2 className="w-4 h-4" />
                        Supprimer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}