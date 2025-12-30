'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../../src/api-config';
import { ArrowLeft, Package, DollarSign, Phone, User, MapPin, FileText, ImagePlus, Upload, Sparkles, CheckCircle2, Leaf, ShieldCheck } from 'lucide-react';

export default function CreateProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    vendeur: '',
    location: '',
    phoneNumber: '',
    category: 'Vegetables',
    image: null as File | null,
  });
  const [currentUserName, setCurrentUserName] = useState<string>('');

  // On mount, derive vendeur from stored user info
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      if (raw) {
        const user = JSON.parse(raw);
        const name: string = user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim();
        if (name) {
          setCurrentUserName(name);
          setFormData(prev => ({ ...prev, vendeur: name }));
        }
      }
    } catch (e) {
      console.warn('Failed to derive user name for vendeur', e);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData(prev => ({ ...prev, image: e.dataTransfer.files[0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Support either 'token' or legacy 'access_token' keys
      const token = typeof window !== 'undefined'
        ? (localStorage.getItem('token') || localStorage.getItem('access_token'))
        : null;
      if (!token) {
        throw new Error('You must be logged in to create a product.');
      }
      // Basic client-side validation aligned with backend DTO
      const phoneRegex = /^\+?[0-9\s-]{7,15}$/;
      if (!phoneRegex.test(formData.phoneNumber)) {
        throw new Error('Invalid phone number format. Use e.g., +216 20 000 000');
      }
      if (!formData.location) {
        throw new Error('Location is required');
      }

      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', formData.price);
      // Force vendeur to authenticated user's name regardless of form input
      const vendeurFinal = currentUserName || formData.vendeur;
      if (vendeurFinal) data.append('vendeur', vendeurFinal);
      data.append('location', formData.location);
      data.append('phoneNumber', formData.phoneNumber);
      // Note: 'category' is not in the backend DTO, so we might skip it or add it if the backend is updated.
      // data.append('category', formData.category); 
      
      if (formData.image) {
        data.append('file', formData.image);
      }

      // Include JWT if backend requires authentication
      const response = await fetch(`${API_BASE_URL}/products/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: data,
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        throw new Error(`Failed to create product: ${response.status} ${response.statusText} ${errText}`);
      }

      const result = await response.json();
      console.log('Product created:', result);

      alert('Product uploaded successfully!');
      router.push('/marketplace');
    } catch (error) {
      console.error('Error creating product:', error);
      const msg = String(error);
      if (msg.includes('401')) {
        alert('Unauthorized. Please login again.');
        router.push('/login');
      } else {
        alert(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate form completion
  const completedFields = [
    formData.title,
    formData.price,
    formData.phoneNumber,
    formData.location,
    formData.description,
    formData.image
  ].filter(Boolean).length;
  const totalFields = 6;
  const completionPercent = Math.round((completedFields / totalFields) * 100);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Parallax Effect */}
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

          {/* Header Section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 backdrop-blur-sm rounded-full border border-emerald-400/30 mb-6">
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span className="text-emerald-200 text-sm font-medium">Nouvelle Annonce</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Publiez Votre <span className="bg-gradient-to-r from-emerald-300 via-green-300 to-teal-300 bg-clip-text text-transparent">Produit</span>
            </h1>
            <p className="text-lg text-white/70 max-w-xl mx-auto">
              Partagez vos récoltes avec la communauté et connectez-vous avec des acheteurs locaux
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white/80">Progression du formulaire</span>
              <span className="text-sm font-bold text-emerald-300">{completionPercent}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
              <div 
                className="h-full bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>

          {/* Main Form Card */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/20 overflow-hidden border border-white/50">
            {/* Decorative Top Bar */}
            <div className="h-2 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500" />
            
            <div className="p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Product Name - Featured Field */}
                <div className="relative group">
                  <label htmlFor="title" className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                      <Package className="w-4 h-4 text-white" />
                    </div>
                    <span>Nom du Produit</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    onFocus={() => setFocusedField('title')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-5 py-4 rounded-2xl border-2 text-gray-900 text-lg font-medium placeholder-gray-400 transition-all duration-300 ${
                      focusedField === 'title' 
                        ? 'border-emerald-500 ring-4 ring-emerald-500/20 shadow-lg' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder="ex: Tomates Bio Premium"
                    value={formData.title}
                    onChange={handleChange}
                  />
                  {formData.title && (
                    <CheckCircle2 className="absolute right-4 top-12 w-5 h-5 text-emerald-500" />
                  )}
                </div>

                {/* Price & Phone Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Price */}
                  <div className="relative group">
                    <label htmlFor="price" className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-white" />
                      </div>
                      <span>Prix (MAD)</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="price"
                        id="price"
                        required
                        onFocus={() => setFocusedField('price')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-5 py-4 pl-16 rounded-2xl border-2 text-gray-900 text-lg font-medium placeholder-gray-400 transition-all duration-300 ${
                          focusedField === 'price' 
                            ? 'border-amber-500 ring-4 ring-amber-500/20 shadow-lg' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        placeholder="0.00"
                        value={formData.price}
                        onChange={handleChange}
                      />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-amber-100 rounded-lg">
                        <span className="text-amber-700 font-bold text-sm">MAD</span>
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="relative group">
                    <label htmlFor="phoneNumber" className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                        <Phone className="w-4 h-4 text-white" />
                      </div>
                      <span>Téléphone</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="phoneNumber"
                      id="phoneNumber"
                      required
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full px-5 py-4 rounded-2xl border-2 text-gray-900 text-lg font-medium placeholder-gray-400 transition-all duration-300 ${
                        focusedField === 'phone' 
                          ? 'border-blue-500 ring-4 ring-blue-500/20 shadow-lg' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      placeholder="+216 20 000 000"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Seller & Location Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Seller */}
                  <div className="relative">
                    <label htmlFor="vendeur" className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span>Vendeur</span>
                    </label>
                    <input
                      type="text"
                      name="vendeur"
                      id="vendeur"
                      readOnly
                      className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 text-gray-700 text-lg font-medium cursor-not-allowed"
                      placeholder="Nom automatique"
                      value={formData.vendeur}
                    />
                    {!currentUserName && (
                      <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        Connectez-vous pour associer votre nom
                      </p>
                    )}
                    {currentUserName && (
                      <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Identifié en tant que {currentUserName}
                      </p>
                    )}
                  </div>

                  {/* Location */}
                  <div className="relative group">
                    <label htmlFor="location" className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-red-500 rounded-lg flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-white" />
                      </div>
                      <span>Localisation</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="location"
                      id="location"
                      required
                      onFocus={() => setFocusedField('location')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full px-5 py-4 rounded-2xl border-2 text-gray-900 text-lg font-medium placeholder-gray-400 transition-all duration-300 ${
                        focusedField === 'location' 
                          ? 'border-rose-500 ring-4 ring-rose-500/20 shadow-lg' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      placeholder="ex: Sfax, Tunisie"
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="relative group">
                  <label htmlFor="description" className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    <span>Description</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    onFocus={() => setFocusedField('description')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-5 py-4 rounded-2xl border-2 text-gray-900 text-base placeholder-gray-400 transition-all duration-300 resize-none ${
                      focusedField === 'description' 
                        ? 'border-cyan-500 ring-4 ring-cyan-500/20 shadow-lg' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder="Décrivez votre produit en détail: qualité, origine, méthode de culture..."
                    value={formData.description}
                    onChange={handleChange}
                  />
                  <div className="absolute bottom-4 right-4 text-xs text-gray-400">
                    {formData.description.length} caractères
                  </div>
                </div>

                {/* Image Upload - Premium Design */}
                <div className="relative">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <ImagePlus className="w-4 h-4 text-white" />
                    </div>
                    <span>Image du Produit</span>
                  </label>
                  <div 
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden ${
                      dragActive 
                        ? 'border-violet-500 bg-violet-50 scale-[1.02]' 
                        : formData.image 
                          ? 'border-emerald-400 bg-emerald-50' 
                          : 'border-gray-300 hover:border-violet-400 hover:bg-gray-50'
                    }`}
                  >
                    <div className="px-8 py-10">
                      <div className="text-center">
                        {formData.image ? (
                          <div className="space-y-4">
                            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                              <CheckCircle2 className="w-10 h-10 text-white" />
                            </div>
                            <div>
                              <p className="text-lg font-bold text-emerald-700">Image sélectionnée!</p>
                              <p className="text-emerald-600 font-medium">{formData.image.name}</p>
                              <p className="text-sm text-gray-500 mt-1">
                                {(formData.image.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, image: null }))}
                              className="text-sm text-red-600 hover:text-red-700 font-medium"
                            >
                              Supprimer et choisir une autre
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                              <Upload className="w-10 h-10 text-gray-400" />
                            </div>
                            <div>
                              <label
                                htmlFor="file-upload"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold rounded-xl cursor-pointer hover:from-violet-700 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105"
                              >
                                <ImagePlus className="w-5 h-5" />
                                Choisir une image
                                <input 
                                  id="file-upload" 
                                  name="file-upload" 
                                  type="file" 
                                  className="sr-only" 
                                  onChange={handleImageChange} 
                                  accept="image/*" 
                                />
                              </label>
                              <p className="text-gray-500 mt-3">ou glissez-déposez ici</p>
                            </div>
                            <p className="text-xs text-gray-400">PNG, JPG, GIF jusqu'à 10MB</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-4 py-6 border-t border-gray-100">
                  <div className="flex flex-col items-center text-center p-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mb-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className="text-xs font-medium text-gray-600">Sécurisé</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-2">
                      <Leaf className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-xs font-medium text-gray-600">Éco-responsable</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-2">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="text-xs font-medium text-gray-600">Premium</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-100">
                  <Link
                    href="/marketplace"
                    className="w-full sm:w-auto px-8 py-4 border-2 border-gray-200 rounded-2xl text-gray-700 font-bold hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 text-center"
                  >
                    Annuler
                  </Link>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`group relative w-full sm:w-auto px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 overflow-hidden ${
                      isLoading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105'
                    }`}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <span className="relative flex items-center justify-center gap-2">
                      {isLoading ? (
                        <>
                          <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Publication en cours...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          Publier le Produit
                        </>
                      )}
                    </span>
                  </button>
                </div>

                {/* Login Warning */}
                {!isLoading && typeof window !== 'undefined' && !(localStorage.getItem('token') || localStorage.getItem('access_token')) && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="w-5 h-5 text-red-600" />
                    </div>
                    <p className="text-sm text-red-700 font-medium">
                      Vous devez être connecté pour publier un produit.{' '}
                      <Link href="/login" className="underline hover:no-underline">Se connecter</Link>
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Footer Text */}
          <p className="text-center text-white/50 text-sm mt-8">
            En publiant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité
          </p>
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
