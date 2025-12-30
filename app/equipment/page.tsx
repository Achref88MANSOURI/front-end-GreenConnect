// app/equipment/page.tsx
// This page shows Faza'et-Ard (Equipment Sharing & Investment)

'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Zap, TrendingUp, Shield, ChevronRight, Leaf, Award, Wrench, Star, Sparkles, Users, ChevronDown, Clock, Target, ArrowRight, Check, CheckCircle, Play, Volume2, VolumeX } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { API_BASE_URL } from '@/src/api-config';

interface InvestmentProject {
  id: number;
  title: string;
  description: string;
  location: string;
  totalValue: number;
  expectedReturn: number;
  status: string;
  fundedPercentage?: number;
}

export default function EquipmentPage() {
  const [activeTab, setActiveTab] = useState<'equipment' | 'investment'>('equipment');
  const [projects, setProjects] = useState<InvestmentProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/investments/lands`);
        if (res.ok) {
          const data = await res.json();
          // Filter only available or leased projects, limit to 2
          const filtered = data
            .filter((p: InvestmentProject) => p.status === 'available' || p.status === 'leased')
            .slice(0, 2);
          setProjects(filtered);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 bg-gradient-to-b from-slate-50 via-white to-green-50/30">
        {/* ========== ULTRA PREMIUM HERO WITH VIDEO BACKGROUND ========== */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Video Background */}
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="absolute w-full h-full object-cover scale-105"
            >
              <source src="/video1.mp4" type="video/mp4" />
            </video>
            {/* Dark overlay with gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
            {/* Green tint overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-transparent to-teal-900/40"></div>
          </div>

          {/* Animated overlay elements */}
          <div className="absolute inset-0 z-[1]">
            {/* Floating orbs */}
            <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-500/20 rounded-full blur-[100px] animate-float"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-teal-500/15 rounded-full blur-[120px] animate-float-delayed"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-green-400/10 rounded-full blur-[80px] animate-pulse-slow"></div>
            
            {/* Floating particles */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/30 rounded-full animate-float-particle"
                style={{
                  left: `${10 + (i * 8)}%`,
                  top: `${20 + (i % 4) * 20}%`,
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: `${4 + (i % 3)}s`
                }}
              />
            ))}
            
            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
          </div>

          {/* Mute/Unmute Button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="absolute bottom-8 right-8 z-30 p-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 group"
          >
            {isMuted ? (
              <VolumeX className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            ) : (
              <Volume2 className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            )}
          </button>

          {/* Main Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 text-center">
            {/* Premium badge with glow */}
            <div className="flex justify-center mb-8">
              <div className="group inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/30 shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:shadow-[0_0_60px_rgba(16,185,129,0.5)] transition-all duration-500">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.8)]" />
                  ))}
                </div>
                <div className="w-px h-6 bg-white/30"></div>
                <span className="text-sm font-bold text-white tracking-wide">PLATEFORME #1 EN TUNISIE</span>
              </div>
            </div>

            {/* Epic Title */}
            <div className="mb-10 animate-title-slide">
              <h1 className="text-7xl md:text-9xl font-black mb-6 tracking-tight">
                <span className="block text-white drop-shadow-[0_4px_30px_rgba(255,255,255,0.3)] mb-2">FAZA</span>
                <span className="block relative">
                  <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent blur-2xl opacity-50">&apos;ET-ARD</span>
                  <span className="relative bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-400 bg-clip-text text-transparent animate-gradient-x drop-shadow-[0_4px_30px_rgba(250,204,21,0.4)]">&apos;ET-ARD</span>
                </span>
              </h1>
              <p className="text-xl md:text-3xl text-white/90 max-w-4xl mx-auto leading-relaxed font-light">
                La Plateforme Révolutionnaire pour le 
                <span className="font-bold text-emerald-400"> Partage d&apos;Équipements </span>
                et l&apos;
                <span className="font-bold text-yellow-400">Investissement Agricole</span>
              </p>
            </div>

            {/* Premium Tab Navigation */}
            <div className="flex justify-center mb-16">
              <div className="inline-flex p-2 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
                <button
                  onClick={() => setActiveTab('equipment')}
                  className={`group px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-500 flex items-center justify-center gap-4 ${
                    activeTab === 'equipment'
                      ? 'bg-white text-emerald-700 shadow-[0_10px_40px_-10px_rgba(255,255,255,0.5)] scale-105'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className={`p-3 rounded-xl transition-all duration-300 ${activeTab === 'equipment' ? 'bg-gradient-to-br from-emerald-400 to-green-600 shadow-lg' : 'bg-white/20'}`}>
                    <Wrench className={`w-6 h-6 ${activeTab === 'equipment' ? 'text-white' : 'text-white'}`} />
                  </div>
                  <span>Équipements</span>
                </button>
                <button
                  onClick={() => setActiveTab('investment')}
                  className={`group px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-500 flex items-center justify-center gap-4 ${
                    activeTab === 'investment'
                      ? 'bg-white text-emerald-700 shadow-[0_10px_40px_-10px_rgba(255,255,255,0.5)] scale-105'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className={`p-3 rounded-xl transition-all duration-300 ${activeTab === 'investment' ? 'bg-gradient-to-br from-yellow-400 to-orange-600 shadow-lg' : 'bg-white/20'}`}>
                    <TrendingUp className={`w-6 h-6 ${activeTab === 'investment' ? 'text-white' : 'text-white'}`} />
                  </div>
                  <span>Investissements</span>
                </button>
              </div>
            </div>

            {/* Stats Grid - Ultra Premium */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { icon: Zap, value: '500+', label: 'Équipements', gradient: 'from-yellow-400 to-orange-500', glow: 'rgba(250,204,21,0.4)' },
                { icon: Users, value: '1,200+', label: 'Utilisateurs', gradient: 'from-blue-400 to-cyan-500', glow: 'rgba(59,130,246,0.4)' },
                { icon: TrendingUp, value: '2.5M', label: 'TND Investis', gradient: 'from-emerald-400 to-green-500', glow: 'rgba(16,185,129,0.4)' },
                { icon: Award, value: '98%', label: 'Satisfaction', gradient: 'from-purple-400 to-pink-500', glow: 'rgba(168,85,247,0.4)' },
              ].map((stat, index) => (
                <div 
                  key={index} 
                  className="group relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center hover:bg-white/20 transition-all duration-500 hover:scale-110 hover:-translate-y-2"
                  style={{ boxShadow: `0 20px 60px -20px ${stat.glow}` }}
                >
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className={`relative w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-4xl font-black text-white mb-1">{stat.value}</p>
                  <p className="text-sm text-white/70 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-scroll-indicator">
              <div className="flex flex-col items-center gap-2 text-white/60">
                <span className="text-xs font-medium tracking-widest uppercase">Découvrir</span>
                <ChevronDown className="w-8 h-8" />
              </div>
            </div>
          </div>

          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-50 to-transparent z-[2]"></div>
        </section>

        {/* ========== CONTENT SECTIONS ========== */}
        <div className="relative z-10">
          {/* ========== EQUIPMENT SECTION WITH IMAGE BACKGROUND ========== */}
          {activeTab === 'equipment' && (
            <div className="animate-fadeIn">
              {/* Full-width Hero Banner with Image */}
              <div className="relative overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src="/images/1.jpg" 
                    alt="Agricultural equipment" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/90 via-green-800/85 to-slate-900/95"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3),transparent_60%)]"></div>
                </div>
                
                {/* Animated particles */}
                <div className="absolute inset-0 overflow-hidden z-[1]">
                  {[...Array(15)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-emerald-400/30 rounded-full animate-float-particle"
                      style={{
                        left: `${5 + (i * 6.5)}%`,
                        top: `${10 + (i % 5) * 18}%`,
                        animationDelay: `${i * 0.3}s`,
                        animationDuration: `${4 + (i % 3)}s`
                      }}
                    />
                  ))}
                </div>
                
                {/* Grid overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] z-[1]"></div>

                {/* Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 py-24">
                  {/* Ultra Premium Section Header */}
                  <div className="text-center mb-16 relative">
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-6 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg">
                        <Wrench className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-sm font-bold text-white tracking-wide uppercase">Partage d&apos;Équipement</span>
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black text-white mb-6">
                      Équipement{' '}
                      <span className="relative">
                        <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent blur-2xl opacity-60">Agricole</span>
                        <span className="relative bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">Agricole</span>
                      </span>
                    </h2>
                    <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                      Optimisez vos ressources en partageant l&apos;équipement avec d&apos;autres agriculteurs. 
                      <span className="font-semibold text-emerald-300"> Générez des revenus</span> ou 
                      <span className="font-semibold text-cyan-300"> économisez sur vos acquisitions</span>.
                    </p>
                  </div>

                  {/* Ultra Premium Equipment Cards - Glass Morphism */}
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Offer Equipment Card */}
                    <div className="group relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-60 transition-all duration-700"></div>
                      <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-10 hover:bg-white/15 hover:border-white/30 transition-all duration-500 overflow-hidden">
                        {/* Decorative glow */}
                        <div className="absolute top-0 right-0 w-60 h-60 bg-emerald-400/20 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-teal-400/20 rounded-full blur-3xl"></div>
                        
                        {/* Icon with Glow */}
                        <div className="relative mb-8">
                          <div className="absolute inset-0 bg-emerald-400 rounded-3xl blur-3xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                          <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                            <Zap className="w-10 h-10 text-white" />
                          </div>
                        </div>
                        
                        <h3 className="text-3xl font-black text-white mb-4">Proposer du Matériel</h3>
                        <p className="text-white/70 mb-8 text-lg leading-relaxed">
                          Avez-vous du matériel inutilisé? Mettez-le à disposition et générez des revenus supplémentaires sans effort.
                        </p>
                        
                        {/* Premium Feature List */}
                        <ul className="space-y-4 mb-8">
                          {[
                            { text: 'Inscription gratuite et simple', icon: CheckCircle },
                            { text: 'Assurance complète incluse', icon: Shield },
                            { text: 'Paiements sécurisés automatiques', icon: Sparkles }
                          ].map((item, idx) => (
                            <li key={idx} className="flex items-center gap-4 group/item">
                              <div className="w-11 h-11 bg-emerald-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-emerald-400/30 group-hover/item:bg-emerald-500/30 transition-all duration-300">
                                <item.icon className="w-5 h-5 text-emerald-300" />
                              </div>
                              <span className="text-white/90 font-medium text-lg">{item.text}</span>
                            </li>
                          ))}
                        </ul>
                        
                        <Link 
                          href="/equipment/create"
                          className="group/btn relative inline-flex w-full items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white py-5 px-8 rounded-2xl font-bold text-lg overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_-10px_rgba(16,185,129,0.7)]"
                        >
                          <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></span>
                          <span className="relative flex items-center gap-3">
                            Lister mon Équipement
                            <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform duration-300" />
                          </span>
                        </Link>
                      </div>
                    </div>

                    {/* Rent Equipment Card */}
                    <div className="group relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-60 transition-all duration-700"></div>
                      <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-10 hover:bg-white/15 hover:border-white/30 transition-all duration-500 overflow-hidden">
                        {/* Decorative glow */}
                        <div className="absolute top-0 right-0 w-60 h-60 bg-blue-400/20 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-400/20 rounded-full blur-3xl"></div>
                        
                        {/* Icon with Glow */}
                        <div className="relative mb-8">
                          <div className="absolute inset-0 bg-blue-400 rounded-3xl blur-3xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                          <div className="relative w-20 h-20 bg-gradient-to-br from-blue-400 via-cyan-500 to-teal-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/50 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                            <Leaf className="w-10 h-10 text-white" />
                          </div>
                        </div>
                        
                        <h3 className="text-3xl font-black text-white mb-4">Louer du Matériel</h3>
                        <p className="text-white/70 mb-8 text-lg leading-relaxed">
                          Trouvez tout l&apos;équipement dont vous avez besoin à des tarifs compétitifs, sans investissement initial.
                        </p>
                        
                        {/* Premium Feature List */}
                        <ul className="space-y-4 mb-8">
                          {[
                            { text: 'Large sélection de matériels', icon: Target },
                            { text: 'Prix transparents et compétitifs', icon: TrendingUp },
                            { text: 'Support technique 24/7', icon: Clock }
                          ].map((item, idx) => (
                            <li key={idx} className="flex items-center gap-4 group/item">
                              <div className="w-11 h-11 bg-blue-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-blue-400/30 group-hover/item:bg-blue-500/30 transition-all duration-300">
                                <item.icon className="w-5 h-5 text-cyan-300" />
                              </div>
                              <span className="text-white/90 font-medium text-lg">{item.text}</span>
                            </li>
                          ))}
                        </ul>
                        
                        <Link 
                          href="/equipment/browse"
                          className="group/btn relative inline-flex w-full items-center justify-center gap-3 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 text-white py-5 px-8 rounded-2xl font-bold text-lg overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_-10px_rgba(59,130,246,0.7)]"
                        >
                          <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></span>
                          <span className="relative flex items-center gap-3">
                            Parcourir le Matériel
                            <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform duration-300" />
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Section with Light Background */}
              <div className="bg-gradient-to-b from-slate-50 to-white py-20">
                <div className="max-w-7xl mx-auto px-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                      { value: '500+', label: 'Équipements', icon: Wrench, color: 'emerald' },
                      { value: '1,200+', label: 'Utilisateurs', icon: Users, color: 'blue' },
                      { value: '60%', label: "d'Économies", icon: TrendingUp, color: 'green' },
                      { value: '98%', label: 'Satisfaction', icon: Award, color: 'yellow' },
                    ].map((stat, i) => (
                      <div key={i} className="group text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100">
                        <div className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-${stat.color}-100 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <stat.icon className={`w-7 h-7 text-${stat.color}-600`} />
                        </div>
                        <p className="text-3xl font-black text-gray-900">{stat.value}</p>
                        <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Why Choose - Ultra Premium Glass Cards with Image Background */}
              <div className="relative rounded-[2.5rem] overflow-hidden">
                {/* Image Background */}
                <div className="absolute inset-0">
                  <img 
                    src="/images/1.jpg" 
                    alt="Agriculture background" 
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay gradients for readability */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 via-green-800/85 to-teal-900/90"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.3),transparent_50%)]"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.3),transparent_50%)]"></div>
                </div>
                
                {/* Animated particles over image */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-emerald-400/40 rounded-full animate-float-particle"
                      style={{
                        left: `${10 + (i * 12)}%`,
                        top: `${15 + (i % 3) * 25}%`,
                        animationDelay: `${i * 0.4}s`,
                      }}
                    />
                  ))}
                </div>
                
                <div className="relative p-12 border border-emerald-400/20">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/40">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl md:text-4xl font-black text-white">Pourquoi Choisir Faza&apos;et-Ard?</h3>
                      <p className="text-emerald-300/80 mt-1">La plateforme de confiance pour l&apos;agriculture tunisienne</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      { icon: '💰', title: 'Économies Réelles', desc: 'Réduisez vos coûts opérationnels jusqu\'à 60% en partageant l\'équipement', gradient: 'from-yellow-400 to-orange-500', glow: 'shadow-yellow-500/30' },
                      { icon: '🔒', title: 'Sécurité Garantie', desc: 'Assurance complète et vérification des utilisateurs pour votre tranquillité', gradient: 'from-emerald-400 to-green-500', glow: 'shadow-emerald-500/30' },
                      { icon: '📱', title: 'Plateforme Simple', desc: 'Interface intuitive pour gérer vos locations et réservations', gradient: 'from-blue-400 to-cyan-500', glow: 'shadow-blue-500/30' },
                    ].map((item, i) => (
                      <div key={i} className="group bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl">
                        <div className={`w-18 h-18 rounded-2xl bg-gradient-to-r ${item.gradient} flex items-center justify-center text-4xl mb-6 shadow-xl ${item.glow} group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 p-4`}>
                          {item.icon}
                        </div>
                        <h4 className="text-xl font-bold text-white mb-3">{item.title}</h4>
                        <p className="text-white/70 leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========== INVESTMENT SECTION WITH IMAGE BACKGROUND ========== */}
          {activeTab === 'investment' && (
            <div className="animate-fadeIn">
              {/* Full-width Hero Banner with Image */}
              <div className="relative overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src="/images/2.jpg" 
                    alt="Agricultural investment" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-purple-900/90 via-indigo-900/85 to-slate-900/95"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.3),transparent_60%)]"></div>
                </div>
                
                {/* Animated particles */}
                <div className="absolute inset-0 overflow-hidden z-[1]">
                  {[...Array(15)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-purple-400/30 rounded-full animate-float-particle"
                      style={{
                        left: `${5 + (i * 6.5)}%`,
                        top: `${10 + (i % 5) * 18}%`,
                        animationDelay: `${i * 0.3}s`,
                        animationDuration: `${4 + (i % 3)}s`
                      }}
                    />
                  ))}
                </div>
                
                {/* Grid overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] z-[1]"></div>

                {/* Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 py-24">
                  {/* Premium Section Header */}
                  <div className="text-center mb-16 relative">
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-6 shadow-[0_0_40px_rgba(168,85,247,0.3)]">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-sm font-bold text-white tracking-wide uppercase">Investissement Agricole</span>
                      <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black text-white mb-6">
                      Opportunités{' '}
                      <span className="relative">
                        <span className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent blur-2xl opacity-60">d&apos;Investissement</span>
                        <span className="relative bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">d&apos;Investissement</span>
                      </span>
                    </h2>
                    <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                      Investissez dans des projets agricoles vérifiés et générateurs de rendements attractifs. 
                      <span className="font-semibold text-purple-300">Impact réel</span>, 
                      <span className="font-semibold text-pink-300">transparence totale</span>.
                    </p>
                  </div>

                  {/* Premium Investment Benefits - Glass Cards */}
                  <div className="grid md:grid-cols-3 gap-6 mb-16">
                    {[
                      { icon: Shield, title: 'Projets Vérifiés', desc: 'Tous les projets sont évalués par nos experts agricoles', gradient: 'from-purple-400 to-pink-500', glow: 'purple' },
                      { icon: TrendingUp, title: 'Rendements Attractifs', desc: '12% à 18% de rendement annuel en moyenne', gradient: 'from-blue-400 to-cyan-500', glow: 'blue' },
                      { icon: Award, title: 'Transparence Totale', desc: 'Suivi en temps réel avec rapports détaillés', gradient: 'from-orange-400 to-yellow-500', glow: 'orange' },
                    ].map((item, i) => (
                      <div key={i} className="group bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl hover:bg-white/15 hover:border-white/30 transition-all duration-500 hover:-translate-y-2">
                        <div className={`w-16 h-16 bg-gradient-to-r ${item.gradient} rounded-xl flex items-center justify-center mb-5 shadow-xl shadow-${item.glow}-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all`}>
                          <item.icon className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-white mb-3">{item.title}</h4>
                        <p className="text-white/70 leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>

              {/* Featured Projects - Premium Dynamic */}
              <div>
                <div className="flex items-center justify-center mb-10">
                  <h3 className="text-3xl font-bold text-white flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/30">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    Projets en Vedette
                  </h3>
                </div>
                
                {loading ? (
                  <div className="text-center py-16 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
                    <div className="relative w-16 h-16 mx-auto mb-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-ping opacity-20"></div>
                      <div className="absolute inset-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full animate-pulse"></div>
                      <div className="absolute inset-4 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <p className="text-white/70 font-medium">Chargement des projets...</p>
                  </div>
                ) : projects.length === 0 ? (
                  <div className="text-center py-16 bg-white/10 backdrop-blur-xl rounded-2xl border-2 border-dashed border-white/30">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500/30 to-pink-500/30 backdrop-blur rounded-full mx-auto mb-6 flex items-center justify-center">
                      <span className="text-4xl">🌾</span>
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-2">Aucun projet disponible</h4>
                    <p className="text-white/60 mb-6 max-w-md mx-auto">Soyez le premier à publier un terrain agricole et commencez à recevoir des investissements!</p>
                    <Link 
                      href="/investments/create"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-bold hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/30"
                    >
                      <Sparkles className="w-5 h-5" />
                      Publier un Terrain
                    </Link>
                  </div>
                ) : (
                  <div className={`grid gap-8 mb-8 ${projects.length === 1 ? 'max-w-2xl mx-auto' : 'md:grid-cols-2'}`}>
                    {projects.map((project, index) => {
                      const colors = index % 2 === 0 
                        ? { 
                            bg: 'from-orange-500/20 to-red-500/20', 
                            border: 'border-orange-400/30', 
                            accent: 'text-orange-300', 
                            gradient: 'from-orange-500 to-red-600',
                            progressBg: 'from-orange-400 to-red-500',
                            emoji: '🌳' 
                          }
                        : { 
                            bg: 'from-emerald-500/20 to-green-500/20', 
                            border: 'border-emerald-400/30', 
                            accent: 'text-emerald-300', 
                            gradient: 'from-emerald-500 to-green-600',
                            progressBg: 'from-emerald-400 to-green-500',
                            emoji: '🌱' 
                          };
                      
                      return (
                        <div key={project.id} className={`group bg-gradient-to-br ${colors.bg} backdrop-blur-xl border ${colors.border} rounded-2xl hover:shadow-2xl transition-all duration-300 overflow-hidden`}>
                          {/* Colored header */}
                          <div className={`h-2 bg-gradient-to-r ${colors.gradient}`}></div>
                          
                          <div className="p-8">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h4 className="text-xl font-bold text-white group-hover:text-white transition-colors">{project.title}</h4>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors.accent} bg-white/10 border ${colors.border}`}>
                                    📍 {project.location}
                                  </span>
                                  {project.fundedPercentage !== undefined && project.fundedPercentage >= 50 && (
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold text-green-300 bg-green-500/20 border border-green-400/30">
                                      🔥 Populaire
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="w-14 h-14 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform border border-white/20">
                                <span className="text-3xl">{colors.emoji}</span>
                              </div>
                            </div>
                            
                            <p className="text-white/70 mb-6 line-clamp-2 leading-relaxed">{project.description}</p>
                            
                            {/* Stats grid */}
                            <div className="grid grid-cols-3 gap-3 mb-6">
                              <div className="bg-white/10 backdrop-blur p-3 rounded-xl text-center border border-white/10">
                                <Target className="w-4 h-4 mx-auto mb-1 text-white/50" />
                                <p className="text-xs text-white/50">Objectif</p>
                                <p className="font-bold text-white text-sm">{project.totalValue?.toLocaleString()} TND</p>
                              </div>
                              <div className="bg-white/10 backdrop-blur p-3 rounded-xl text-center border border-white/10">
                                <TrendingUp className="w-4 h-4 mx-auto mb-1 text-green-400" />
                                <p className="text-xs text-white/50">Rendement</p>
                                <p className="font-bold text-green-400 text-sm">{project.expectedReturn}%/an</p>
                              </div>
                              <div className="bg-white/10 backdrop-blur p-3 rounded-xl text-center border border-white/10">
                                <Clock className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                                <p className="text-xs text-white/50">Durée</p>
                                <p className="font-bold text-white text-sm">12 mois</p>
                              </div>
                            </div>
                            
                            {/* Progress bar */}
                            {project.fundedPercentage !== undefined && (
                              <div className="mb-6">
                                <div className="flex justify-between text-sm mb-2">
                                  <span className="text-white/60">Progression</span>
                                  <span className="font-bold text-white">{project.fundedPercentage}%</span>
                                </div>
                                <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                                  <div 
                                    className={`bg-gradient-to-r ${colors.progressBg} h-3 rounded-full transition-all duration-1000`} 
                                    style={{width: `${project.fundedPercentage}%`}}
                                  ></div>
                                </div>
                              </div>
                            )}
                            
                            <Link 
                              href={`/investments/${project.id}`}
                              className={`group/btn flex items-center justify-center gap-2 w-full bg-gradient-to-r ${colors.gradient} text-white py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:shadow-${colors.gradient.includes('orange') ? 'orange' : 'emerald'}-500/30`}
                            >
                              Investir Maintenant
                              <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* See All CTA - Premium */}
                <div className="text-center mt-12">
                  <Link 
                    href="/investments" 
                    className="group inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40 transition-all transform hover:scale-105"
                  >
                    <Sparkles className="w-6 h-6" />
                    Voir Tous les Projets
                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
                </div>
              </div>

              {/* Trust Section - Outside the image background */}
              <div className="bg-gradient-to-b from-slate-50 to-white py-20">
                <div className="max-w-7xl mx-auto px-4">
                  <div className="bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 rounded-3xl p-12 text-white overflow-hidden relative">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl"></div>
                    
                    <div className="relative z-10">
                      <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-4">
                          <Users className="w-4 h-4 text-purple-400" />
                          <span className="text-sm font-semibold text-white/80">Communauté</span>
                        </div>
                        <h3 className="text-3xl font-bold mb-2">Ils Nous Font Confiance</h3>
                        <p className="text-white/60">Des milliers d&apos;agriculteurs et investisseurs tunisiens</p>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                          { value: '2.5M+', label: 'TND Investis', icon: TrendingUp, color: 'text-green-400' },
                          { value: '150+', label: 'Projets Financés', icon: Target, color: 'text-blue-400' },
                          { value: '98%', label: 'Satisfaction', icon: Award, color: 'text-yellow-400' },
                          { value: '15%', label: 'Rendement Moyen', icon: Sparkles, color: 'text-purple-400' },
                        ].map((stat, i) => (
                          <div key={i} className="group text-center p-6 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all hover:-translate-y-1">
                            <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color} group-hover:scale-110 transition-transform`} />
                            <p className={`text-4xl font-black ${stat.color}`}>{stat.value}</p>
                            <p className="text-sm text-white/60 mt-1">{stat.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========== PREMIUM CTA SECTION WITH IMAGE BACKGROUND ========== */}
        <section className="relative overflow-hidden py-28 px-4">
          {/* Image Background */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/images/2.jpg" 
              alt="Agriculture field" 
              className="w-full h-full object-cover scale-105"
            />
            {/* Dark overlay with gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-gray-900/90 to-slate-800/95"></div>
            {/* Colored overlays for depth */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/30 via-transparent to-teal-900/30"></div>
          </div>
          
          {/* Multi-layer animated background */}
          <div className="absolute inset-0 z-[1]">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl"></div>
            
            {/* Floating particles */}
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-emerald-400/40 rounded-full animate-float-particle"
                style={{
                  left: `${5 + (i * 10)}%`,
                  top: `${10 + (i % 5) * 18}%`,
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: `${3 + (i % 3)}s`
                }}
              />
            ))}
            
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          </div>

          <div className="relative max-w-4xl mx-auto text-center z-10">
            {/* Premium badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-semibold text-white/90">Rejoignez +1000 agriculteurs</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
              Prêt à <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent animate-gradient-x">Commencer</span>?
            </h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Rejoignez des milliers d&apos;agriculteurs qui transforment le secteur agricole tunisien
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-10">
              <div className="text-center">
                <p className="text-3xl font-black text-white">500+</p>
                <p className="text-sm text-gray-400">Équipements</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-black text-green-400">98%</p>
                <p className="text-sm text-gray-400">Satisfaction</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-black text-white">24/7</p>
                <p className="text-sm text-gray-400">Support</p>
              </div>
            </div>

            

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-gray-500">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span className="text-sm">Paiements sécurisés</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span className="text-sm">Certifié ISO</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span className="text-sm">Communauté vérifiée</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      
      {/* ========== PREMIUM ANIMATIONS ========== */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-5deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        @keyframes float-particle {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100px) translateX(20px); opacity: 0; }
        }
        @keyframes scroll-indicator {
          0%, 100% { transform: translateY(0); opacity: 0.6; }
          50% { transform: translateY(10px); opacity: 1; }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes title-slide {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-float-particle { animation: float-particle 4s ease-out infinite; }
        .animate-scroll-indicator { animation: scroll-indicator 2s ease-in-out infinite; }
        .animate-gradient-x { 
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        .animate-title-slide { animation: title-slide 0.8s ease-out; }
      `}</style>
    </>
  );
}
