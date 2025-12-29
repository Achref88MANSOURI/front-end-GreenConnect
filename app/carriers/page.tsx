// app/carriers/page.tsx

import Link from 'next/link';
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CarriersClient from './CarriersClient';

// Composant principal de la page Transporteurs
export default function CarriersPage() {
  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 pt-24 pb-10 bg-white">
        
        {/* En-tête & Section CTA */}
        <div className="flex justify-between items-center border-b pb-4 mb-8">
            <h1 className="text-4xl font-extrabold text-green-900">
                Tawssel : Transporteurs Disponibles
            </h1>
            <Link 
                href="/carriers/register"
                className="bg-green-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-md"
            >
                ➕ Devenir Transporteur
            </Link>
        </div>

        {/* Shortcuts */}
        <div className="flex gap-4 mb-8">
          <Link
            href="/deliveries"
            className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200"
          >
            Mes Livraisons
          </Link>
          <Link
            href="/deliveries/book"
            className="bg-green-50 text-green-800 px-4 py-2 rounded-lg hover:bg-green-100"
          >
            Réserver un transport
          </Link>
        </div>

        {/* Contenu Principal */}
        <section className="mt-8">
          <CarriersClient />
        </section>
      </main>
      <Footer />
    </>
  );
}
