"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, MapPin, Shield, Calendar, ShoppingBag, Plus, Star, Package, User, CheckCircle2, Sparkles } from 'lucide-react';

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
    return new Date(iso).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
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

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        {/* Background */}
        <div className="fixed inset-0 z-0">
          <Image src="/images/1.jpg" alt="Background" fill className="object-cover" priority unoptimized />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 via-green-900/85 to-teal-900/90" />
        </div>
        
        <div className="relative z-10 text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500/30" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-400 animate-spin" />
          </div>
          <p className="text-white/80 font-medium">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Background */}
        <div className="fixed inset-0 z-0">
          <Image src="/images/1.jpg" alt="Background" fill className="object-cover" priority unoptimized />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 via-green-900/85 to-teal-900/90" />
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-red-500 via-orange-500 to-red-500" />
            <div className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Profil indisponible</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <p className="text-xs text-gray-500 mb-6">Le backend ne fournit pas encore l'endpoint public du profil.</p>
              <Link 
                href="/marketplace" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour au marketplace
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No user found
  if (!user) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <div className="fixed inset-0 z-0">
          <Image src="/images/1.jpg" alt="Background" fill className="object-cover" priority unoptimized />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 via-green-900/85 to-teal-900/90" />
        </div>
        <div className="relative z-10 text-center text-white">
          <p className="text-xl">Aucun profil trouvé.</p>
          <Link href="/marketplace" className="mt-4 inline-block text-emerald-300 underline">Retour au marketplace</Link>
        </div>
      </div>
    );
  }

  const displayName = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Utilisateur';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

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
        <div className="max-w-4xl mx-auto">
          
          {/* Back Navigation */}
          <Link 
            href="/marketplace" 
            className="group inline-flex items-center gap-2 px-5 py-2.5 mb-8 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Retour au Marketplace</span>
          </Link>

          {/* Profile Card */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50">
            {/* Header Banner */}
            <div className="relative h-48 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600">
              <div className="absolute inset-0 bg-[url('/images/1.jpg')] bg-cover bg-center opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              
              {/* Badge */}
              <div className="absolute top-4 right-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span className="text-white text-sm font-medium">Vendeur Vérifié</span>
                </div>
              </div>
            </div>

            {/* Avatar Section */}
            <div className="relative px-8 pb-8">
              <div className="absolute -top-16 left-8">
                <div className="relative">
                  {user.avatarUrl ? (
                    <img 
                      src={`http://localhost:5000/uploads/${user.avatarUrl}`} 
                      alt="Avatar" 
                      className="w-32 h-32 object-cover rounded-2xl border-4 border-white shadow-2xl" 
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl border-4 border-white shadow-2xl flex items-center justify-center">
                      <span className="text-4xl font-bold text-white">{initials}</span>
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center border-2 border-white shadow-lg">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="pt-20">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                  <div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2">{displayName}</h1>
                    
                    {user.role && (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100 rounded-full mb-4">
                        <Shield className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm font-semibold text-emerald-700 capitalize">{user.role}</span>
                      </div>
                    )}

                    {/* Contact Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                      {user.email && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Mail className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Email</p>
                            <p className="text-sm text-gray-900 font-semibold">{user.email}</p>
                          </div>
                        </div>
                      )}
                      
                      {user.phoneNumber && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Phone className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Téléphone</p>
                            <p className="text-sm text-gray-900 font-semibold">{user.phoneNumber}</p>
                          </div>
                        </div>
                      )}
                      
                      {user.address && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                          <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-rose-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Adresse</p>
                            <p className="text-sm text-gray-900 font-semibold">{user.address}</p>
                          </div>
                        </div>
                      )}
                      
                      {user.createdAt && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Membre depuis</p>
                            <p className="text-sm text-gray-900 font-semibold">{formatDate(user.createdAt)}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="flex flex-row md:flex-col gap-3">
                    <div className="flex-1 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 text-center">
                      <div className="w-10 h-10 mx-auto bg-emerald-100 rounded-xl flex items-center justify-center mb-2">
                        <Package className="w-5 h-5 text-emerald-600" />
                      </div>
                      <p className="text-2xl font-black text-emerald-700">--</p>
                      <p className="text-xs text-gray-600 font-medium">Produits</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-100">
                  <Link 
                    href="/marketplace" 
                    className="group relative flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white rounded-2xl font-bold hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 transition-all duration-300 shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.02] overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <ShoppingBag className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">Voir les produits</span>
                  </Link>
                  
                  <Link 
                    href="/products/create" 
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-emerald-500 text-emerald-600 rounded-2xl font-bold hover:bg-emerald-50 transition-all duration-300"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Publier un produit</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg text-center hover:scale-105 transition-transform">
              <div className="w-12 h-12 mx-auto bg-emerald-100 rounded-xl flex items-center justify-center mb-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Profil Vérifié</span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg text-center hover:scale-105 transition-transform">
              <div className="w-12 h-12 mx-auto bg-blue-100 rounded-xl flex items-center justify-center mb-2">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Vendeur Fiable</span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg text-center hover:scale-105 transition-transform">
              <div className="w-12 h-12 mx-auto bg-amber-100 rounded-xl flex items-center justify-center mb-2">
                <Star className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Top Vendeur</span>
            </div>
          </div>

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
