'use client'; // Obligatoire pour les animations

/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'; // Import de Framer Motion
import { ReactLenis } from 'lenis/react';
import Header from './components/Header';
import Footer from './components/Footer';
import ModuleCard from './components/ModuleCard';
import { modulesData, featuresData, testimonialsData } from './data/home-content';

// List of photos in your /images/ folder
const heroImages = [
  "/images/1.jpg",
  "/images/2.jpg",
  "/images/3.jpg",
  "/images/4.jpg",
  "/images/5.jpg"
];



// Configuration des animations (Fade Up)
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

// Configuration pour l'apparition successive (stagger)
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
};

export default function HomePage() {
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const stats = [
    { number: "500+", label: "Agriculteurs Connectés", icon: "👨‍🌾" },
    { number: "2M DT", label: "Transactions Mensuelles", icon: "💰" },
    { number: "98%", label: "Taux de Satisfaction", icon: "⭐" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <ReactLenis root>
      <motion.div
        className="fixed top-0 left-0 right-0 h-2 bg-green-500 origin-left z-[100]"
        style={{ scaleX }}
      />
      <Header />
      
      <main className="min-h-screen bg-white overflow-hidden pt-20">
        
        {/* 1. Hero Section */}
        <section className="relative min-h-screen flex items-center bg-gray-900 overflow-hidden">
      {/* Background Image Slider with Enhanced Overlays */}
      <div className="absolute inset-0 w-full h-full z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentHeroIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.8, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={heroImages[currentHeroIndex]} 
              alt="Agriculture Moderne en Tunisie"
              fill
              priority
              className="object-cover"
              quality={90}
            />
            {/* Multi-layer gradient overlays for depth */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-green-900/75 to-gray-900/60 z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent z-10" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Animated Geometric Pattern Overlay */}
      <div className="absolute inset-0 z-10 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Floating Particles Effect */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-green-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Main Content Container */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
          className="max-w-4xl"
        >
          {/* Premium Badge */}
          <motion.div variants={fadeInUp} className="mb-8">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-md border border-green-400/40 rounded-full shadow-2xl">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-green-300 font-bold text-sm tracking-wider uppercase">
                Plateforme N°1 Agri-Tech en Tunisie
              </span>
            </div>
          </motion.div>

          {/* Main Headline with Advanced Typography */}
          <motion.h1 
            variants={fadeInUp}
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black mb-8 leading-[1.05] text-white"
          >
            <span className="block mb-2">Transformez Votre</span>
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-green-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent animate-gradient">
                Agriculture
              </span>
              {/* Animated underline */}
              <motion.span
                className="absolute -bottom-2 left-0 right-0 h-4 bg-gradient-to-r from-green-400/40 to-emerald-400/40 blur-lg"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1, duration: 1, ease: "easeOut" }}
              />
              <motion.span
                className="absolute -bottom-1 left-0 right-0 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
              />
            </span>
            <span className="block mt-2">en Plateforme Digitale</span>
          </motion.h1>

          {/* Enhanced Subtitle */}
          <motion.p 
            variants={fadeInUp}
            className="text-xl sm:text-2xl lg:text-3xl mb-10 font-light text-gray-200 leading-relaxed max-w-3xl"
          >
            Connectez-vous à un{' '}
            <span className="text-green-300 font-semibold">écosystème complet</span>
            {' '}pour acheter, vendre, louer du matériel agricole et optimiser votre logistique avec des transporteurs certifiés.
          </motion.p>

          {/* Enhanced CTA Buttons */}
          <motion.div 
            variants={fadeInUp}
            className="flex flex-wrap gap-5 mb-16"
          >
            <Link href="/register">
              <button className="group relative px-10 py-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg rounded-2xl overflow-hidden shadow-2xl hover:shadow-green-500/50 transition-all duration-300 hover:-translate-y-1 hover:scale-105">
                <span className="relative z-10 flex items-center gap-3">
                  <span>Démarrer Gratuitement</span>
                  <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              </button>
            </Link>

            <button className="group relative px-10 py-5 bg-white/10 backdrop-blur-xl text-white font-bold text-lg rounded-2xl border-2 border-white/40 hover:bg-white/20 hover:border-white/60 transition-all duration-300 hover:scale-105 shadow-2xl">
              <span className="flex items-center gap-3">
                <svg className="w-7 h-7 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                </svg>
                <span>Voir la Démo</span>
              </span>
            </button>
          </motion.div>

          {/* Enhanced Stats Section */}
          <motion.div 
            variants={fadeInUp}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-white/20"
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="group relative"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
                  <div className="text-4xl mb-3">{stat.icon}</div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-black text-white group-hover:text-green-400 transition-colors duration-300">
                      {stat.number}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 font-medium">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust Badges */}
          <motion.div 
            variants={fadeInUp}
            className="flex flex-wrap items-center gap-8 mt-12 pt-8 border-t border-white/10"
          >
            <div className="flex items-center gap-2 text-gray-300">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Paiement Sécurisé</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Support 24/7</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Garantie Qualité</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Enhanced Image Indicators */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-30 flex gap-3">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentHeroIndex(index)}
            className={`group relative transition-all duration-300 ${
              index === currentHeroIndex ? 'w-12' : 'w-3'
            }`}
            aria-label={`Aller à l'image ${index + 1}`}
          >
            <div className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentHeroIndex 
                ? 'bg-gradient-to-r from-green-400 to-emerald-400' 
                : 'bg-white/40 group-hover:bg-white/60'
            }`} />
            {index === currentHeroIndex && (
              <motion.div
                className="absolute inset-0 bg-green-400/50 rounded-full blur-md"
                layoutId="activeIndicator"
                transition={{ duration: 0.3 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-10 right-10 z-30 hidden lg:flex flex-col items-center gap-3"
      >
        <span className="text-xs font-bold uppercase tracking-widest text-white/70 rotate-90 origin-center mb-10">
          Scroll
        </span>
        <div className="relative w-7 h-12 border-2 border-white/40 rounded-full flex items-start justify-center p-2 group hover:border-white/70 transition-colors">
          <motion.div
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 bg-white rounded-full"
          />
        </div>
      </motion.div>

      {/* Decorative Floating Orbs */}
      <motion.div
        animate={{ 
          y: [0, -30, 0],
          rotate: [0, 10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-20 w-32 h-32 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl z-10 hidden xl:block"
      />
      <motion.div
        animate={{ 
          y: [0, 30, 0],
          rotate: [0, -10, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-gradient-to-br from-teal-400/20 to-green-400/20 rounded-full blur-3xl z-10 hidden xl:block"
      />
    </section>

        {/* 2. Core Modules Section - Avec Vidéo et animation au scroll */}
        <section className="relative py-24 px-4 overflow-hidden bg-black">
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0 opacity-100">
            <source src="/video1.mp4" type="video/mp4" />
          </video>

          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-extrabold mb-4 text-white drop-shadow-lg">
                Trois Piliers pour Votre Succès
              </h2>
              <p className="text-xl text-gray-200 drop-shadow-md">
                Chaque module est conçu pour répondre aux défis spécifiques de l'agriculture locale.
              </p>
            </motion.div>
            
            <motion.div 
              className="grid lg:grid-cols-3 gap-10"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={staggerContainer}
            >
              {modulesData.map((module) => (
                <motion.div key={module.title} variants={fadeInUp}>
                  <ModuleCard 
                    title={module.title} 
                    description={module.description} 
                    image={module.image} 
                    alt={module.alt}
                    ctaLink={module.ctaLink} 
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <hr className="my-0 border-t border-gray-200 max-w-6xl mx-auto" />

        {/* 3. Features Section */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.h2 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-4xl font-extrabold text-center mb-16 text-gray-900"
            >
              Pourquoi choisir GreenConnect ?
            </motion.h2>
            
            <motion.div 
              className="grid md:grid-cols-3 gap-12 text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainer}
            >
              {featuresData.map((feature) => {
                const Icon = feature.icon;
                return (
                  <motion.div key={feature.title} variants={fadeInUp} className="p-6 bg-green-50 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
                    <div className="w-24 h-24 mx-auto mb-4 text-green-700">
                      <Icon className="w-24 h-24" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-green-800">{feature.title}</h3>
                    <p className="text-gray-700">{feature.description}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

   

        {/* 5. Testimonials Section */}
        <section className="relative py-24 px-4 bg-gray-50 overflow-hidden"> 
            <div className="absolute inset-0 w-full h-full z-0 opacity-70">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonialIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full"
                >
                  <Image
                    src={heroImages[currentTestimonialIndex]} 
                    alt="Décor"
                    fill
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="max-w-6xl mx-auto relative z-10">
                <motion.h2 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                  className="text-4xl font-extrabold text-center mb-16 text-gray-900"
                >
                    Ce que disent nos utilisateurs
                </motion.h2>
                <div className="grid md:grid-cols-2 gap-10">
                    {testimonialsData.map((testimonial, index) => (
                        <motion.div 
                          key={index} 
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.2 }}
                          className="p-8 bg-white rounded-lg shadow-xl border-t-4 border-green-500"
                        >
                            <blockquote className="italic text-xl text-gray-700 mb-4">"{testimonial.quote}"</blockquote>
                            <p className="font-bold text-green-700">{testimonial.author}</p>
                            <p className="text-sm text-gray-500">{testimonial.role}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>

        {/* 6. Final Call to Action Section */}
        <section className="py-20 px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-xl"
          >
            <img src="/images/image.png" alt="Décor" className="absolute inset-0 w-full h-full object-cover opacity-25" />
            <div className="max-w-4xl mx-auto text-center relative z-10 bg-green-800/80 rounded-xl p-12">
              <h2 className="text-4xl font-extrabold text-white mb-4">Prêt à Transformer Votre Exploitation ?</h2>
              <p className="text-xl text-green-200 mb-8">Rejoignez des centaines d'agriculteurs et d'investisseurs qui optimisent déjà leur potentiel avec GreenConnect.</p>
              <Link href="/register" className="inline-block bg-yellow-400 text-green-900 px-12 py-4 text-xl font-bold rounded-full hover:bg-yellow-500 transition duration-300 shadow-xl">
                Inscrivez-vous Maintenant !
              </Link>
            </div>
          </motion.div>
        </section>
        
      </main>
      
      <Footer />
    </ReactLenis>
  );
}