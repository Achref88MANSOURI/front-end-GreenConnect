// app/marketplace/page.tsx

import Link from 'next/link';
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MarketplaceClient from '../components/MarketplaceClient';


// Marketplace Page Component
export default function MarketplacePage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        {/* Header & CTA Section - Fixed on scroll with premium design */}
        <div className="sticky top-[72px] z-40 bg-gradient-to-r from-white via-emerald-50/50 to-white backdrop-blur-xl shadow-lg shadow-emerald-900/5 border-b border-emerald-100/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex justify-between items-center">
              {/* Title with icon */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/30">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 11-4 0v-4m-5 4a2 2 0 11-4 0" />
                  </svg>
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
              <div className="flex items-center gap-3">
                {/* Cart Button */}
                <Link 
                  href="/Panier"
                  className="group relative overflow-hidden bg-white border-2 border-emerald-500 text-emerald-600 px-4 sm:px-5 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 flex items-center gap-2"
                >
                  <img src="/images/about.png" alt="" className="w-5 h-5" />
                  <span className="hidden sm:inline">Panier</span>
                </Link>

                {/* Post New Product Button */}
                <Link 
                  href="/products/create"
                  className="group relative overflow-hidden bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white px-5 sm:px-6 py-3 rounded-xl font-semibold hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 flex items-center gap-2"
                >
                  {/* Shine effect */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  
                  <img src="/images/about.png" alt="" className="w-5 h-5 relative z-10" />
                  <span className="hidden sm:inline relative z-10">Post New Product</span>
                  <span className="sm:hidden text-xl font-bold relative z-10">+</span>
                  
                  {/* Arrow icon on hover */}
                  <svg className="hidden sm:block w-4 h-4 relative z-10 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
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