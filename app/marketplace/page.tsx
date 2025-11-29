// app/marketplace/page.tsx

import Link from 'next/link';
import React from 'react';
import Header from '../components/Header'; // Assuming import from parent directory
import Footer from '../components/Footer'; // Assuming import from parent directory
import MarketplaceClient from '../components/MarketplaceClient';


// Marketplace Page Component
export default function MarketplacePage() {
  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-10 bg-white">
        
        {/* Header & CTA Section */}
        <div className="flex justify-between items-center border-b pb-4 mb-8">
            <h1 className="text-4xl font-extrabold text-green-900">
                Souk-Moussel Catalogue
            </h1>
            <Link 
                href="/products/create" // Links to the "Create Product" page
                className="bg-green-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-md"
            >
                ➕ Post New Product
            </Link>
        </div>

        {/* Main Content: client-side searchable/filterable product grid */}
        <div className="">
          <MarketplaceClient />
        </div>
      </main>
      <Footer />
    </>
  );
}