// app/about/page.tsx

import Link from 'next/link';
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-green-700 text-white py-16 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-extrabold mb-4">A Propos d&apos;AgriConnect</h1>
            <p className="text-xl opacity-90">
              La plateforme revolutionnaire qui transforme l&apos;agriculture tunisienne grace a la technologie.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Notre Mission</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-green-600 text-4xl mb-4">🌱</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Durabilite</h3>
                <p className="text-gray-600">
                  Promouvoir des pratiques agricoles durables et respectueuses de l&apos;environnement.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-green-600 text-4xl mb-4">💼</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Efficacité</h3>
                <p className="text-gray-600">
                  Optimiser la chaîne de valeur agricole avec des outils numériques innovants.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-green-600 text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Communauté</h3>
                <p className="text-gray-600">
                  Connecter les agriculteurs, investisseurs et logisticiens pour créer une économie collaborative.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Notre Vision</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              AgriConnect aspire a etre le coeur numerique de l&apos;agriculture tunisienne. Nous croyons que 
              la technologie peut donner aux agriculteurs les moyens de maximiser leurs rendements, 
              reduire les pertes post-recolte, et acceder a des marches justes.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Grace a nos trois piliers — Souk-Moussel (marketplace), Faza&apos;et-Ard (investissement) et 
              Tawssel (logistique) — nous cretons un ecosysteme integre ou chaque acteur du secteur 
              agricole peut prosperer.
            </p>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Nos Valeurs</h2>
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Transparence</h3>
                <p className="text-gray-600">Nous croyons en une communication claire et honnête avec tous nos utilisateurs.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Innovation</h3>
                <p className="text-gray-600">Nous investissons continuellement dans les technologies qui revolutionnent l&apos;agriculture.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Équité</h3>
                <p className="text-gray-600">Notre plateforme crée des opportunités égales pour tous les agriculteurs, indépendamment de leur taille.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Responsabilité Sociale</h3>
                <p className="text-gray-600">Nous nous engageons à soutenir les communautés rurales et le développement durable.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-green-700 text-white text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-extrabold mb-4">Pret a Rejoindre la Revolution?</h2>
            <p className="text-xl opacity-90 mb-8">Explorez nos services et commencez votre voyage aujourd&apos;hui.</p>
            <Link 
              href="/register" 
              className="inline-block bg-yellow-400 text-green-900 px-8 py-4 text-lg font-bold rounded-lg hover:bg-yellow-500 transition duration-300"
            >
              Inscrivez-vous Maintenant
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
