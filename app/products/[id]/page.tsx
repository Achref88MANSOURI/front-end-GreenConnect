"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import type { Product } from '../../data/products';
import { useToast } from '../../components/ToastProvider';
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
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const { addToast } = useToast();

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

        // Get seller name from vendeur field or farmer relation
        const sellerName = item.vendeur || (item.farmer ? item.farmer.name : null);
        
        const mapped: Product = {
          id: item.id,
          name: item.title,
          price: `${item.price} MAD`,
          location: item.location || item.farmer?.address || 'Non spécifié',
          image: getImageUrl(item.imageUrl || item.image),
          description: item.description,
          seller: sellerName || 'Vendeur',
          contact: item.phoneNumber || item.farmer?.phoneNumber,
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
        
        // Proper ownership check: compare logged-in user ID with product owner ID
        try {
          const userRaw = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
          if (userRaw) {
            const currentUser = JSON.parse(userRaw);
            const productOwnerId = item.farmerId || item.farmer?.id;
            setIsOwner(currentUser?.id === productOwnerId);
          } else {
            setIsOwner(false);
          }
        } catch {
          setIsOwner(false);
        }

        // Load favorite state from localStorage
        try {
          const favRaw = typeof window !== 'undefined' ? localStorage.getItem('favorites') : null;
          const favs = favRaw ? JSON.parse(favRaw) : [];
          setIsFavorite(Array.isArray(favs) && favs.includes(mapped.id));
        } catch {}

        // Check if product is already in cart
        try {
          const cartRaw = typeof window !== 'undefined' ? localStorage.getItem('cart') : null;
          const cart = cartRaw ? JSON.parse(cartRaw) : [];
          const isInCart = Array.isArray(cart) && cart.some((item: any) => item.id === mapped.id);
          setIsAddedToCart(isInCart);
        } catch {}
      })
      .catch(e => {
        console.error(e);
        setError(e.message);
        setLoading(false);
      });
  }, [id]);

  const addToCart = () => {
    if (!product || isAddedToCart) return;
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
      setIsAddedToCart(true);
    } catch (e) {
      addToast("Impossible d'ajouter au panier", 'error');
    }
  };

  const handleDelete = async () => {
    if (!product) return;
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      addToast('Cliquez encore pour confirmer la suppression', 'info');
      setTimeout(() => setConfirmingDelete(false), 2500);
      return;
    }
    
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      if (!token) {
        addToast('Vous devez être connecté pour supprimer un produit.', 'error');
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
      
      addToast('Produit supprimé avec succès.', 'success');
      router.push('/marketplace');
    } catch (err: any) {
      console.error(err);
      addToast(err.message || 'Erreur lors de la suppression', 'error');
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
        addToast('Retiré des favoris', 'success');
      } else {
        favs.push(product.id);
        setIsFavorite(true);
        addToast('Ajouté aux favoris', 'success');
      }
      localStorage.setItem('favorites', JSON.stringify(favs));
    } catch (e) {
      console.error('Favorite toggle error', e);
      addToast('Impossible de mettre à jour les favoris', 'error');
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
        addToast('Lien copié dans le presse-papiers', 'success');
      }
    } catch (e) {
      console.error('Share failed', e);
      addToast('Partage non disponible', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-white to-slate-50">
        <Header />
        <main className="flex-grow flex items-center justify-center pt-20">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-600 border-t-transparent absolute inset-0"></div>
            </div>
            <div className="text-center">
              <p className="text-gray-700 font-semibold text-lg">Chargement du produit</p>
              <p className="text-gray-400 text-sm">Veuillez patienter...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-white to-slate-50">
        <Header />
        <main className="flex-grow flex items-center justify-center p-6 pt-24">
          <div className="bg-white p-12 rounded-3xl shadow-2xl max-w-md w-full text-center border border-gray-100 relative overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500" />
            
            <div className="w-20 h-20 bg-gradient-to-br from-red-50 to-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-100">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Produit introuvable</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">{error || "Le produit demandé n'existe pas ou a été retiré du catalogue."}</p>
            <Link 
              href="/marketplace" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg shadow-emerald-500/30 font-semibold group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Retour au catalogue
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <Header />
      
      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* 🌿 Premium Breadcrumb */}
          <nav className="flex items-center gap-3 text-sm mb-10">
            <Link href="/marketplace" className="group flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all duration-300">
              <ArrowLeft className="w-4 h-4 text-gray-500 group-hover:text-emerald-600 group-hover:-translate-x-1 transition-all" />
              <span className="text-gray-600 group-hover:text-emerald-600 font-medium">Marketplace</span>
            </Link>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-full border border-emerald-100">
              <Package className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700 font-semibold truncate max-w-[200px]">{product.name}</span>
            </div>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            
            {/* 🖼️ Left Column: Image Gallery */}
            <div className="w-full lg:sticky lg:top-28 space-y-4">
              <div className="relative aspect-[4/3] bg-white rounded-3xl overflow-hidden shadow-2xl shadow-gray-200/60 border border-gray-100 group">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                
                {product.image ? (
                  <Image 
                    src={product.image} 
                    alt={product.name} 
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    priority
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                        <Package className="w-10 h-10 text-gray-300" />
                      </div>
                      <span className="font-medium text-gray-400">Aucune image disponible</span>
                    </div>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2 z-20">
                  <button 
                    onClick={toggleFavorite} 
                    className={`group/btn p-3.5 bg-white/95 backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 ${isFavorite ? 'ring-2 ring-red-400' : ''}`}
                  >
                    <Heart className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500 group-hover/btn:text-red-500'}`} />
                  </button>
                  <button 
                    onClick={shareProduct} 
                    className="group/btn p-3.5 bg-white/95 backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                  >
                    <Share2 className="w-5 h-5 text-gray-500 group-hover/btn:text-blue-500 transition-colors" />
                  </button>
                </div>

                {/* Stock Badge */}
                {product.stock !== undefined && (
                  <div className={`absolute bottom-4 left-4 px-4 py-2 rounded-full text-sm font-bold shadow-lg z-20 backdrop-blur-sm ${
                    product.stock > 10 
                      ? 'bg-emerald-500/90 text-white' 
                      : product.stock > 0 
                        ? 'bg-amber-500/90 text-white' 
                        : 'bg-red-500/90 text-white'
                  }`}>
                    {product.stock > 0 ? `${product.stock} ${product.unit || 'unités'} en stock` : 'Rupture de stock'}
                  </div>
                )}
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mb-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  </div>
                  <span className="text-xs text-gray-600 font-medium text-center">Qualité Garantie</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-2">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-xs text-gray-600 font-medium text-center">Livraison Rapide</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-2">
                    <Phone className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-xs text-gray-600 font-medium text-center">Support 24/7</span>
                </div>
              </div>
            </div>

            {/* 📝 Right Column: Product Info */}
            <div className="w-full">
              <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl shadow-gray-200/60 border border-gray-100 relative overflow-hidden">
                {/* Decorative Top Bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500" />
                
                {/* Product Header */}
                <div className="flex flex-col sm:flex-row items-start justify-between mb-8 pb-6 border-b border-gray-100 pt-2">
                  <div className="flex-1">
                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wide">
                        Produit Frais
                      </span>
                      {product.certifications && product.certifications.length > 0 && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold uppercase tracking-wide">
                          Certifié
                        </span>
                      )}
                    </div>
                    
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 leading-tight">
                      {product.name}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                        <span className="font-medium text-gray-700 text-sm">{product.location}</span>
                      </div>
                      {product.seller && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full">
                          <User className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-gray-700 text-sm">{product.seller}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Price Box */}
                  <div className="mt-4 sm:mt-0 sm:ml-6">
                    <div className="px-6 py-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
                      <p className="text-3xl md:text-4xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        {product.price}
                      </p>
                      {product.unit && <p className="text-sm text-emerald-600 font-medium text-center mt-1">par {product.unit}</p>}
                    </div>
                  </div>
                </div>

                {/* Description Section */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <Package className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Description</h2>
                  </div>
                  <div className="text-gray-600 leading-relaxed text-base space-y-3 pl-[52px]">
                    {product.description ? (
                      product.description.split('\n').map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                      ))
                    ) : (
                      <p className="italic text-gray-400 bg-gray-50 p-4 rounded-xl">Aucune description fournie.</p>
                    )}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Détails</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-[52px]">
                    {/* Seller / Owner */}
                    {(product.seller || product.userId) && (
                      <div className="group flex items-center gap-4 p-4 bg-gradient-to-br from-white to-emerald-50/30 border border-gray-100 rounded-2xl hover:shadow-lg hover:border-emerald-200 hover:-translate-y-0.5 transition-all duration-300">
                        <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:scale-105 transition-transform">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Propriétaire</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-gray-900">{product.seller || 'Vendeur'}</span>
                            {product.userId && (
                              <Link href={`/users/${product.userId}`} className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded-full hover:bg-emerald-200 transition font-medium">
                                Voir profil
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Harvest Date */}
                    {product.harvestDate && (
                      <div className="group flex items-center gap-4 p-4 bg-gradient-to-br from-white to-orange-50/30 border border-gray-100 rounded-2xl hover:shadow-lg hover:border-orange-200 hover:-translate-y-0.5 transition-all duration-300">
                        <div className="w-11 h-11 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200 group-hover:scale-105 transition-transform">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Récolte</p>
                          <p className="font-bold text-gray-900">{product.harvestDate}</p>
                        </div>
                      </div>
                    )}

                    {/* Stock */}
                    {product.stock !== undefined && (
                      <div className="group flex items-center gap-4 p-4 bg-gradient-to-br from-white to-blue-50/30 border border-gray-100 rounded-2xl hover:shadow-lg hover:border-blue-200 hover:-translate-y-0.5 transition-all duration-300">
                        <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
                          <Package className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Stock</p>
                          <p className="font-bold text-gray-900">{product.stock} {product.unit}</p>
                        </div>
                      </div>
                    )}

                    {/* Certifications */}
                    {product.certifications && product.certifications.length > 0 && (
                      <div className="group flex items-center gap-4 p-4 bg-gradient-to-br from-white to-purple-50/30 border border-gray-100 rounded-2xl hover:shadow-lg hover:border-purple-200 hover:-translate-y-0.5 transition-all duration-300">
                        <div className="w-11 h-11 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200 group-hover:scale-105 transition-transform">
                          <ShieldCheck className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Certifications</p>
                          <p className="font-bold text-gray-900 line-clamp-1">{product.certifications.join(', ')}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons - Only show for non-owners */}
                {!isOwner && (
                  <div className="space-y-4 pt-6 border-t border-gray-100">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={addToCart}
                        disabled={(product.stock !== undefined && product.stock <= 0) || isAddedToCart}
                        className={`group relative flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 overflow-hidden
                          ${isAddedToCart
                            ? 'bg-emerald-100 text-emerald-700 cursor-default border-2 border-emerald-300'
                            : product.stock !== undefined && product.stock <= 0
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : 'bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-100'
                          }`}
                      >
                        {!isAddedToCart && <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />}
                        <ShoppingCart className="w-5 h-5 relative z-10" />
                        <span className="relative z-10">
                          {isAddedToCart 
                            ? '✓ Ajouté au panier' 
                            : product.stock !== undefined && product.stock <= 0 
                              ? 'Stock épuisé' 
                              : 'Ajouter au panier'}
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Owner Actions */}
                {isOwner && (
                    <div className="pt-6 mt-4 border-t border-dashed border-gray-200 flex flex-wrap gap-3 justify-center">
                      <Link 
                        href={`/products/${product.id}/edit`}
                        className="group flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 hover:border-amber-300 transition-all duration-300"
                      >
                        <Edit className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                        Modifier
                      </Link>
                      <button
                        onClick={handleDelete}
                        className="group flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-red-700 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 hover:border-red-300 transition-all duration-300"
                      >
                        <Trash2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                        Supprimer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        
      </main>

      <Footer />
    </div>
  );
}