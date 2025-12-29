// app/equipment/page.tsx
// This page shows Faza'et-Ard (Equipment Sharing & Investment)

'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { Zap, TrendingUp, Shield, ChevronRight, Leaf, Award, Wrench } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function EquipmentPage() {
  const [activeTab, setActiveTab] = useState<'equipment' | 'investment'>('equipment');

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-20">
        {/* Hero Section with Tab Navigation */}
        <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 text-white py-20 px-4">
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
          </div>

          <div className="relative max-w-6xl mx-auto z-10">
            {/* Title */}
            <div className="text-center mb-12">
              <h1 className="text-6xl md:text-7xl font-black mb-4">
                Faza<span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">'et-Ard</span>
              </h1>
              <p className="text-xl text-green-100 max-w-2xl mx-auto">
                Plateforme Unifiée pour le Partage d'Équipements et l'Investissement Agricole
              </p>
            </div>

            {/* Tab Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => setActiveTab('equipment')}
                className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center gap-3 ${
                  activeTab === 'equipment'
                    ? 'bg-white text-green-700 shadow-2xl scale-105'
                    : 'bg-white/20 text-white border-2 border-white/50 hover:bg-white/30'
                }`}
              >
                <Wrench className="w-6 h-6" />
                Équipements
              </button>
              <button
                onClick={() => setActiveTab('investment')}
                className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center gap-3 ${
                  activeTab === 'investment'
                    ? 'bg-white text-green-700 shadow-2xl scale-105'
                    : 'bg-white/20 text-white border-2 border-white/50 hover:bg-white/30'
                }`}
              >
                <TrendingUp className="w-6 h-6" />
                Investissements
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 md:gap-8">
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-yellow-300">500+</p>
                <p className="text-green-100 text-sm md:text-base">Matériels Actifs</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-yellow-300">1200+</p>
                <p className="text-green-100 text-sm md:text-base">Utilisateurs</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-yellow-300">2.5M+</p>
                <p className="text-green-100 text-sm md:text-base">TND Investis</p>
              </div>
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <div className="max-w-6xl mx-auto px-4 py-20">
          {/* Equipment Section */}
          {activeTab === 'equipment' && (
            <div className="animate-fadeIn space-y-16">
              {/* Equipment Header */}
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Partage d'Équipement Agricole</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Optimisez vos ressources en partageant l'équipement avec d'autres agriculteurs. Générez des revenus ou économisez sur vos acquisitions.
                </p>
              </div>

              {/* Equipment Cards */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Offer Equipment */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                  <div className="relative bg-white border-2 border-gray-100 p-8 rounded-2xl hover:border-green-400 transition-all hover:shadow-xl">
                    <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                      <Zap className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Proposer du Matériel</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Avez-vous du matériel inutilisé? Mettez-le à disposition et générez des revenus supplémentaires sans effort.
                    </p>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center gap-2 text-gray-700">
                        <span className="text-green-500">✓</span> Inscription gratuite et simple
                      </li>
                      <li className="flex items-center gap-2 text-gray-700">
                        <span className="text-green-500">✓</span> Assurance complète incluse
                      </li>
                      <li className="flex items-center gap-2 text-gray-700">
                        <span className="text-green-500">✓</span> Paiements sécurisés automatiques
                      </li>
                    </ul>
                    <Link 
                      href="/equipment/create"
                      className="inline-block w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition text-center"
                    >
                      Lister mon Équipement
                    </Link>
                  </div>
                </div>

                {/* Rent Equipment */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                  <div className="relative bg-white border-2 border-gray-100 p-8 rounded-2xl hover:border-blue-400 transition-all hover:shadow-xl">
                    <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                      <Leaf className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Louer du Matériel</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Trouvez tout l'équipement dont vous avez besoin à des tarifs compétitifs, sans investissement initial.
                    </p>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center gap-2 text-gray-700">
                        <span className="text-blue-500">✓</span> Large sélection de matériels
                      </li>
                      <li className="flex items-center gap-2 text-gray-700">
                        <span className="text-blue-500">✓</span> Prix transparents et compétitifs
                      </li>
                      <li className="flex items-center gap-2 text-gray-700">
                        <span className="text-blue-500">✓</span> Support technique 24/7
                      </li>
                    </ul>
                    <Link 
                      href="/equipment/browse"
                      className="inline-block w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition text-center"
                    >
                      Parcourir le Matériel
                    </Link>
                  </div>
                </div>
              </div>

              {/* Equipment Features */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Pourquoi Choisir Faza'et-Ard?</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-green-700">💰 Économies Réelles</p>
                    <p className="text-gray-600">Réduisez vos coûts opérationnels jusqu'à 60% en partageant l'équipement</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-green-700">🔒 Sécurité Garantie</p>
                    <p className="text-gray-600">Assurance complète et vérification des utilisateurs pour votre tranquillité</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-green-700">📱 Plateforme Simple</p>
                    <p className="text-gray-600">Interface intuitive pour gérer vos locations et réservations</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Investment Section */}
          {activeTab === 'investment' && (
            <div className="animate-fadeIn space-y-16">
              {/* Investment Header */}
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Opportunités d'Investissement</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Investissez dans des projets agricoles vérifiés et générateurs de rendements attractifs. Impact réel, transparence totale.
                </p>
              </div>

              {/* Investment Benefits */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 p-8 rounded-2xl">
                  <div className="w-12 h-12 bg-purple-200 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-purple-700" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Projets Vérifiés</h4>
                  <p className="text-gray-600">Tous les projets sont évalués par nos experts agricoles</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 p-8 rounded-2xl">
                  <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-blue-700" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Rendements Attractifs</h4>
                  <p className="text-gray-600">12% à 18% de rendement annuel en moyenne</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 p-8 rounded-2xl">
                  <div className="w-12 h-12 bg-orange-200 rounded-lg flex items-center justify-center mb-4">
                    <Award className="w-6 h-6 text-orange-700" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Transparence Totale</h4>
                  <p className="text-gray-600">Suivi en temps réel avec rapports détaillés</p>
                </div>
              </div>

              {/* Featured Projects */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-8">Projets en Vedette</h3>
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  {/* Project 1 */}
                  <div className="group bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 p-8 rounded-2xl hover:shadow-xl transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-xl font-bold text-gray-900">Extension Vergers d'Olives</h4>
                        <p className="text-sm text-orange-600 font-semibold mt-1">📍 Sfax</p>
                      </div>
                      <span className="text-3xl">🌳</span>
                    </div>
                    <p className="text-gray-700 mb-6">
                      Agrandir une exploitation d'olives avec irrigation goutte-à-goutte moderne.
                    </p>
                    <div className="space-y-3 mb-6 bg-white/60 p-4 rounded-xl">
                      <p className="font-semibold text-gray-900">💰 120,000 TND</p>
                      <p className="font-semibold text-green-600">📈 12% / an</p>
                      <div className="w-full bg-gray-300 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '75%'}}></div>
                      </div>
                      <p className="text-xs text-gray-600">75% financé</p>
                    </div>
                    <button className="w-full bg-orange-600 text-white py-2 rounded-lg font-bold hover:bg-orange-700 transition">
                      Investir
                    </button>
                  </div>

                  {/* Project 2 */}
                  <div className="group bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 p-8 rounded-2xl hover:shadow-xl transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-xl font-bold text-gray-900">Serre Automatisée Légumes</h4>
                        <p className="text-sm text-green-600 font-semibold mt-1">📍 Nabeul</p>
                      </div>
                      <span className="text-3xl">🌱</span>
                    </div>
                    <p className="text-gray-700 mb-6">
                      Serre haute performance pour légumes toute l'année avec rendement optimal.
                    </p>
                    <div className="space-y-3 mb-6 bg-white/60 p-4 rounded-xl">
                      <p className="font-semibold text-gray-900">💰 60,000 TND</p>
                      <p className="font-semibold text-green-600">📈 14% / an</p>
                      <div className="w-full bg-gray-300 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '45%'}}></div>
                      </div>
                      <p className="text-xs text-gray-600">45% financé</p>
                    </div>
                    <button className="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition">
                      Investir
                    </button>
                  </div>
                </div>

                {/* See All CTA */}
                <div className="text-center">
                  <Link 
                    href="/investments" 
                    className="inline-flex items-center gap-2 px-12 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-green-500/50 transition-all transform hover:scale-105"
                  >
                    <span>🚀 Voir Tous les Projets</span>
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-20 px-4 mt-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Prêt à Commencer?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Rejoignez des milliers d'agriculteurs qui transforment le secteur agricole tunisien
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setActiveTab('equipment')}
                className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <Wrench className="w-5 h-5" /> Partager du Matériel
              </button>
              <button
                onClick={() => setActiveTab('investment')}
                className="px-8 py-3 bg-yellow-500 text-slate-900 rounded-xl font-bold hover:bg-yellow-400 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <TrendingUp className="w-5 h-5" /> Découvrir les Investissements
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </>
  );
}
