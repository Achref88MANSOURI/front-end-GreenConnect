// app/marketplace/page.tsx
"use client";

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MarketplaceClient from '../components/MarketplaceClient';
import { ShoppingCart, Package, Plus, Inbox, Store, ArrowRight } from 'lucide-react';


// Marketplace Page Component
export default function MarketplacePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <>
      <Header />
      <main className="bg-white">
        {/* Header & CTA Section - Fixed on scroll with premium design */}
        <div className="sticky top-[72px] z-40 bg-gradient-to-r from-white via-emerald-50/50 to-white backdrop-blur-xl shadow-lg shadow-emerald-900/5 border-b border-emerald-100/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex flex-col gap-4">
              {/* Top Row: Title and Main Actions */}
              <div className="flex justify-between items-center">
                {/* Title with icon */}
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/30">
                    <Store className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-emerald-800 via-green-700 to-teal-700 bg-clip-text text-transparent">
                      Souk-Moussel
                    </h1>
                    <p className="hidden sm:block text-xs text-emerald-600/70 font-medium tracking-wide">
                      CATALOGUE AGRICOLE PREMIUM
                    </p>
                  </div>
                </div>
                
                {/* Action Buttons with enhanced design */}
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Cart Button */}
                  <Link 
                    href="/Panier"
                    className="group relative overflow-hidden bg-white border-2 border-emerald-500 text-emerald-600 px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 flex items-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span className="hidden sm:inline">Panier</span>
                  </Link>

                  {/* Post New Product Button */}
                  <Link 
                    href="/products/create"
                    className="group relative overflow-hidden bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 flex items-center gap-2"
                  >
                    {/* Shine effect */}
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    
                    <Plus className="w-5 h-5 relative z-10" />
                    <span className="hidden sm:inline relative z-10">Publier un Produit</span>
                    
                    {/* Arrow icon on hover */}
                    <ArrowRight className="hidden sm:block w-4 h-4 relative z-10 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </Link>
                </div>
              </div>

              {/* Bottom Row: Quick Links for logged-in users */}
              {isLoggedIn && (
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  {/* My Products Button */}
                  <Link 
                    href="/products/mine"
                    className="group flex items-center gap-2 px-3 sm:px-4 py-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg hover:bg-amber-100 hover:border-amber-300 transition-all font-medium text-sm"
                  >
                    <Package className="w-4 h-4" />
                    <span>Mes Produits</span>
                  </Link>

                  {/* Received Requests Button */}
                  <Link 
                    href="/purchase-requests/received"
                    className="group flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all font-medium text-sm"
                  >
                    <Inbox className="w-4 h-4" />
                    <span>Demandes Reçues</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          {/* Decorative bottom gradient line */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />
        </div>
        
        {/* Main Content: client-side searchable/filterable product grid with scroll effects */}
        <MarketplaceClient />
      </main>
      <Footer />
    </>
  );
}