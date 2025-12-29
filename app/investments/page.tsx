// app/investments/page.tsx

'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import InvestmentsClient from './InvestmentsClient';

export default function InvestmentsPage() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                setUser(null);
            }
        }
    }, []);

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
                {/* Hero Section */}
                <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-transparent to-teal-400/10 blur-3xl"></div>
                    <div className="relative max-w-7xl mx-auto">
                        <div className="text-center mb-12">
                            <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-emerald-900 via-green-800 to-teal-900 bg-clip-text text-transparent mb-6">
                                Louez des Terres Agricoles
                            </h1>
                            
                            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed">
                                Les propriétaires terriens gagnent des revenus passifs. Les cultivateurs trouvent les terres parfaites pour leur saison de culture.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
                                <Link 
                                    href="/investments/create" 
                                    className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg hover:from-emerald-700 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <span>🌱</span>
                                    <span>Publier une Terre</span>
                                </Link>
                                {user && (
                                    <>
                                        <Link 
                                            href="/investments/my-lands" 
                                            className="px-8 py-4 border-2 border-emerald-600 text-emerald-700 rounded-xl font-semibold hover:bg-emerald-50 transition-all duration-300 flex items-center justify-center gap-2"
                                        >
                                            <span>🏠</span>
                                            <span>Mes Terres Publiées</span>
                                        </Link>
                                        <Link 
                                            href="/investments/mine" 
                                            className="px-8 py-4 border-2 border-teal-600 text-teal-700 rounded-xl font-semibold hover:bg-teal-50 transition-all duration-300 flex items-center justify-center gap-2"
                                        >
                                            <span>🚜</span>
                                            <span>Mes Locations</span>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-emerald-200/50 shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-4xl font-bold text-emerald-600 mb-2">500+</div>
                        <p className="text-gray-700 font-medium">Terres Disponibles</p>
                        <p className="text-sm text-gray-500 mt-1">Dans toute la Tunisie</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-green-200/50 shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-4xl font-bold text-green-600 mb-2">2,500+</div>
                        <p className="text-gray-700 font-medium">Cultivateurs Actifs</p>
                        <p className="text-sm text-gray-500 mt-1">Faisant confiance à notre plateforme</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-teal-200/50 shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-4xl font-bold text-teal-600 mb-2">₺5M+</div>
                        <p className="text-gray-700 font-medium">Revenus Générés</p>
                        <p className="text-sm text-gray-500 mt-1">Par les propriétaires terriens</p>
                    </div>
                </section>

                {/* Listings Section */}
                <section className="max-w-7xl mx-auto px-4 pb-20">
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">Explorez les Terres</h2>
                        <p className="text-gray-600">Filtrez par région, prix, taille et accès à l'eau</p>
                    </div>
                    <InvestmentsClient />
                </section>
            </main>
            <Footer />
        </>
    );
}
