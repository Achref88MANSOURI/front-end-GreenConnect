// app/about/page.tsx
'use client';

import Link from 'next/link';
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AboutPage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Auto-play prevented, will show static background
      });
    }
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-20 overflow-hidden">
        {/* Hero Section with Video Background */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* Video Background */}
          <div className="absolute inset-0 z-0">
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="https://cdn.pixabay.com/video/2022/11/09/137716-769943237_large.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
          </div>

          {/* Animated Circles */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.1 }}
            transition={{ duration: 1.5 }}
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full border-4 border-green-400"
          />
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.1 }}
            transition={{ duration: 1.5, delay: 0.3 }}
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full border-4 border-yellow-400"
          />

          {/* Hero Content */}
          <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
            {/* Animated Logo */}
            <motion.div
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="mb-8 flex justify-center"
            >
              <div className="relative">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-yellow-400 to-green-400 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                  <div className="relative bg-white rounded-3xl p-4 shadow-2xl">
                    <img 
                      src="/images/logo-full.jpg" 
                      alt="GreenConnect Logo" 
                      className="h-32 md:h-48 w-auto object-contain"
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-7xl font-extrabold text-white mb-6 drop-shadow-2xl"
            >
              À Propos de GreenConnect
            </motion.h1>
            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-2xl text-gray-100 max-w-3xl mx-auto drop-shadow-lg"
            >
              La plateforme révolutionnaire qui transforme l&apos;agriculture tunisienne grâce à la technologie
            </motion.p>
          </div>
        </section>

        {/* Mission Section with Circular Design */}
        <section className="py-24 px-4 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-5xl font-extrabold text-gray-900 mb-16 text-center"
            >
              Notre Mission
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-12 relative">
              {/* Connecting Lines */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-green-200 via-green-400 to-green-200 -translate-y-1/2 z-0"></div>

              {[
                {
                  icon: '🌱',
                  title: 'Durabilité',
                  desc: 'Promouvoir des pratiques agricoles durables et respectueuses de l\'environnement.',
                  color: 'from-green-400 to-emerald-600',
                  delay: 0
                },
                {
                  icon: '💼',
                  title: 'Efficacité',
                  desc: 'Optimiser la chaîne de valeur agricole avec des outils numériques innovants.',
                  color: 'from-blue-400 to-cyan-600',
                  delay: 0.2
                },
                {
                  icon: '🤝',
                  title: 'Communauté',
                  desc: 'Connecter les agriculteurs, investisseurs et logisticiens pour créer une économie collaborative.',
                  color: 'from-purple-400 to-pink-600',
                  delay: 0.4
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: item.delay }}
                  viewport={{ once: true }}
                  className="relative z-10"
                >
                  <div className="flex flex-col items-center">
                    <div className={`w-48 h-48 rounded-full bg-gradient-to-br ${item.color} shadow-2xl flex items-center justify-center mb-6 transform hover:scale-110 transition-transform duration-300`}>
                      <span className="text-7xl">{item.icon}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-gray-600 text-center leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Vision Section with Circular Pattern */}
        <section className="py-24 px-4 bg-gradient-to-r from-green-600 to-emerald-700 relative overflow-hidden">
          {/* Decorative Circles */}
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-white/10 blur-3xl"></div>

          <div className="max-w-6xl mx-auto relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-5xl font-extrabold text-white mb-8">Notre Vision</h2>
                <p className="text-lg text-gray-100 leading-relaxed mb-6">
                  AgriConnect aspire à être le cœur numérique de l&apos;agriculture tunisienne. Nous croyons que 
                  la technologie peut donner aux agriculteurs les moyens de maximiser leurs rendements, 
                  réduire les pertes post-récolte, et accéder à des marchés justes.
                </p>
                <p className="text-lg text-gray-100 leading-relaxed">
                  Grâce à nos trois piliers — Souk-Moussel (marketplace), Faza&apos;et-Ard (investissement) et 
                  Tawssel (logistique) — nous créons un écosystème intégré où chaque acteur du secteur 
                  agricole peut prospérer.
                </p>
              </motion.div>

              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="flex items-center justify-center"
              >
                <div className="relative w-80 h-80">
                  {/* Rotating rings around logo */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-4 border-dashed border-yellow-400/50"
                  ></motion.div>
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-8 rounded-full border-4 border-dotted border-white/30"
                  ></motion.div>
                  
                  {/* Logo in center */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="relative"
                    >
                      <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-50"></div>
                      <div className="relative bg-white rounded-full p-6 shadow-2xl">
                        <img 
                          src="/images/logo-full.jpg" 
                          alt="GreenConnect" 
                          className="h-40 w-40 object-contain"
                        />
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Floating badges */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-green-900 px-4 py-2 rounded-full font-bold text-sm shadow-lg"
                  >
                    3 Piliers
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section with Modern Cards */}
        <section className="py-24 px-4 bg-gray-900 text-white relative overflow-hidden">
          {/* Animated Background Circles */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.05, 0.1, 0.05]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-green-500"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.05, 0.1, 0.05]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-yellow-500"
          />

          <div className="max-w-6xl mx-auto relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-5xl font-extrabold mb-16 text-center"
            >
              Nos Valeurs
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                { title: 'Transparence', desc: 'Nous croyons en une communication claire et honnête avec tous nos utilisateurs.', gradient: 'from-blue-500 to-purple-600' },
                { title: 'Innovation', desc: 'Nous investissons continuellement dans les technologies qui révolutionnent l\'agriculture.', gradient: 'from-green-500 to-teal-600' },
                { title: 'Équité', desc: 'Notre plateforme crée des opportunités égales pour tous les agriculteurs, indépendamment de leur taille.', gradient: 'from-orange-500 to-red-600' },
                { title: 'Responsabilité Sociale', desc: 'Nous nous engageons à soutenir les communautés rurales et le développement durable.', gradient: 'from-pink-500 to-rose-600' }
              ].map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className="relative group"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300`}></div>
                  <div className="relative bg-gray-800/90 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 hover:border-gray-500 transition-all duration-300">
                    <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{value.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white text-center relative overflow-hidden">
          <motion.div
            animate={{
              rotate: 360
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0 opacity-20"
          >
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-64 h-64 rounded-full border-2 border-white"
                style={{
                  top: `${20 + i * 10}%`,
                  left: `${10 + i * 15}%`,
                }}
              />
            ))}
          </motion.div>

          <div className="max-w-4xl mx-auto relative z-10">
            <motion.h2
              initial={{ scale: 0.5, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-5xl font-extrabold mb-6 drop-shadow-lg"
            >
              Prêt à Rejoindre la Révolution?
            </motion.h2>
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-2xl mb-10 drop-shadow"
            >
              Explorez nos services et commencez votre voyage aujourd&apos;hui
            </motion.p>
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Link 
                href="/register" 
                className="inline-block bg-gray-900 text-white px-12 py-5 text-xl font-bold rounded-full hover:bg-gray-800 transition duration-300 shadow-2xl transform hover:scale-110"
              >
                Inscrivez-vous Maintenant
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
