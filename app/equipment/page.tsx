// app/equipment/page.tsx
// This page shows Faza'et-Ard (Equipment Sharing & Investment)

import Link from 'next/link';
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function EquipmentPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-green-700 text-white py-16 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-extrabold mb-4">Faza&apos;et-Ard</h1>
            <p className="text-xl opacity-90">
              Partagez l&apos;equipement agricole et explorez les opportunites d&apos;investissement
            </p>
          </div>
        </section>

        {/* Equipment Sharing Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Partage d&apos;Equipement</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-green-700 mb-4">Offrir de l&apos;Equipement</h3>
                <p className="text-gray-600 mb-4">
                  Avez-vous du materiel agricole inutilise? Mettez-le a disposition d&apos;autres agriculteurs et generez des revenus supplementaires.
                </p>
                <Link 
                  href="/equipment/create"
                  className="block w-full bg-green-600 text-white py-2 rounded-md font-bold hover:bg-green-700 transition text-center"
                >
                  Lister mon Equipement
                </Link>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-green-700 mb-4">Louer de l&apos;Equipement</h3>
                <p className="text-gray-600 mb-4">
                  Trouvez l&apos;equipement dont vous avez besoin a des tarifs competitifs sans avoir a investir dans l&apos;achat.
                </p>
                <Link 
                  href="/equipment/browse"
                  className="block w-full bg-green-600 text-white py-2 rounded-md font-bold hover:bg-green-700 transition text-center"
                >
                  Parcourir l&apos;Equipement
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Investment Opportunities Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Opportunites d&apos;Investissement</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8 text-center">
              Investissez dans des projets agricoles durables et generez des rendements attractifs tout en soutenant le secteur agricole tunisien.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-bold text-green-700 mb-2">Projets Verifies</h3>
                <p className="text-gray-600">
                  Tous les projets sont verifies et evalues par notre equipe d&apos;experts agricoles.
                </p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-bold text-green-700 mb-2">Transparence Totale</h3>
                <p className="text-gray-600">
                  Suivez votre investissement en temps reel avec des rapports detailles.
                </p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-bold text-green-700 mb-2">Rendements Attractifs</h3>
                <p className="text-gray-600">
                  Gagnez des rendements competitifs en soutenant l&apos;agriculture durable.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Projets en Vedette</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Extension de Vergers d&apos;Olives</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Agrandir une exploitation d&apos;olives existante avec irrigation par goutte-a-goutte moderne.
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>Montant Necessaire:</strong> 120,000 TND</p>
                  <p><strong>Rendement Estime:</strong> 12% / an</p>
                  <p><strong>Location:</strong> Sfax</p>
                </div>
                <button className="w-full mt-4 bg-green-600 text-white py-2 rounded-md font-bold hover:bg-green-700 transition">
                  En Savoir Plus
                </button>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Serre Automatisee pour Legumes</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Serre automatisee pour la culture de legumes a haut rendement tout au long de l&apos;annee.
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>Montant Necessaire:</strong> 60,000 TND</p>
                  <p><strong>Rendement Estime:</strong> 14% / an</p>
                  <p><strong>Location:</strong> Nabeul</p>
                </div>
                <button className="w-full mt-4 bg-green-600 text-white py-2 rounded-md font-bold hover:bg-green-700 transition">
                  En Savoir Plus
                </button>
              </div>
            </div>
            <div className="text-center mt-8">
              <Link 
                href="/investments" 
                className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition"
              >
                Voir Tous les Projets
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
