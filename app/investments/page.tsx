/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/investments/page.tsx
'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import InvestmentsClient from './InvestmentsClient';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
    },
  },
};

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

    const features = [
        { icon: '🌾', title: 'Sélection Premium', desc: 'Des terres vérifiées et de haute qualité' },
        { icon: '💰', title: 'Tarifs Transparents', desc: 'Pas de frais cachés, prix justes' },
        { icon: '🔒', title: 'Sécurisé', desc: 'Transactions et données protégées' },
        { icon: '⚡', title: 'Rapide', desc: 'Processus location simple et rapide' }
    ];

    const stats = [
        { number: '2,450+', label: 'Terres disponibles' },
        { number: '15K+', label: 'Agriculteurs actifs' },
        { number: '98%', label: 'Satisfaction client' }
    ];

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-900 to-slate-900">
                {/* Animated Background Elements */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full blur-3xl"
                  />
                </div>

                {/* Hero Section */}
                <section className="relative px-4 py-24 sm:px-6 lg:px-8 pt-32">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="text-center mb-20"
                        >
                            <motion.div
                                variants={itemVariants}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/50 rounded-full backdrop-blur-xl mb-8"
                            >
                                <span className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></span>
                                <span className="text-emerald-300 text-sm font-semibold">🌱 Révolution Agricole</span>
                            </motion.div>

                            <motion.h1
                                variants={itemVariants}
                                className="text-6xl md:text-7xl font-black bg-gradient-to-r from-emerald-300 via-teal-300 to-green-300 bg-clip-text text-transparent mb-6 leading-tight"
                            >
                                Louez des Terres<br />de Rêve
                            </motion.h1>
                            
                            <motion.p
                                variants={itemVariants}
                                className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed"
                            >
                                Connectez-vous avec les meilleures terres agricoles. Cultiver n'a jamais été aussi simple et sécurisé.
                            </motion.p>

                            <motion.div
                                variants={itemVariants}
                                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                            >
                                <Link 
                                    href="/investments/create" 
                                    className="group px-10 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 flex items-center gap-2 hover:-translate-y-1"
                                >
                                    <span className="group-hover:scale-125 transition-transform">➕</span>
                                    <span>Publier une Terre</span>
                                </Link>
                                
                                {user && (
                                    <>
                                        <Link 
                                            href="/investments/my-lands" 
                                            className="px-10 py-4 bg-white/10 backdrop-blur-xl border-2 border-emerald-400/50 text-emerald-300 rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
                                        >
                                            <span>🏞️</span>
                                            <span>Mes Terres</span>
                                        </Link>
                                        <Link 
                                            href="/investments/mine" 
                                            className="px-10 py-4 bg-white/10 backdrop-blur-xl border-2 border-teal-400/50 text-teal-300 rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
                                        >
                                            <span>🚜</span>
                                            <span>Mes Locations</span>
                                        </Link>
                                    </>
                                )}
                            </motion.div>
                        </motion.div>

                        {/* Stats Section */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
                        >
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    className="relative group"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl group-hover:blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                                    <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center hover:border-emerald-400/50 transition-all duration-300">
                                        <div className="text-5xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent mb-2">{stat.number}</div>
                                        <div className="text-gray-400 font-medium">{stat.label}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Features Grid */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                        >
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    whileHover={{ translateY: -8 }}
                                    className="group relative"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/40 to-teal-600/40 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:blur-2xl"></div>
                                    <div className="relative bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-emerald-400/50 transition-all duration-300">
                                        <div className="text-5xl mb-4">{feature.icon}</div>
                                        <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                                        <p className="text-gray-400">{feature.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Listings Section */}
                <section className="relative px-4 py-20 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-5xl font-black bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent mb-4">
                                Explorez les Meilleures Terres
                            </h2>
                            <p className="text-gray-400 text-lg">Des centaines de propriétés vérifiées vous attendent</p>
                        </motion.div>
                        <InvestmentsClient />
                    </div>
                </section>

                {/* CTA Section */}
                <section className="relative px-4 py-20 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-all duration-300"></div>
                            <div className="relative bg-gradient-to-r from-emerald-600/80 to-teal-600/80 backdrop-blur-xl border border-white/20 rounded-3xl p-12 text-center">
                                <h2 className="text-4xl font-black text-white mb-6">Prêt à Démarrer?</h2>
                                <p className="text-white/90 text-lg mb-8">Rejoignez des milliers d'agriculteurs qui font confiance à notre plateforme</p>
                                <Link 
                                    href={user ? "/investments/create" : "/login"}
                                    className="inline-block px-10 py-4 bg-white text-emerald-600 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                                >
                                    {user ? "Publier Maintenant" : "Se Connecter"}
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
