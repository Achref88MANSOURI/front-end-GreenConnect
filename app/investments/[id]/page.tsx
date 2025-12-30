/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { API_BASE_URL } from '@/src/api-config';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useToast } from '../../components/ToastProvider';

interface Land {
  availableFrom: any;
  id: number;
  title: string;
  description: string;
  location: string;
  targetAmount: number;
  currentAmount: number;
  minimumInvestment: number;
  expectedROI: number;
  duration: number;
  fundingDeadline: string;
  images: string[];
  status: string;
  owner: {
    id: number;
    name: string;
    email: string;
    avatarUrl?: string;
  };
}

export default function LandDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [land, setLand] = useState<Land | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [leaseForm, setLeaseForm] = useState({
    seasonStartDate: '',
    customDurationMonths: '',
    farmingPlan: '',
  });
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [showLeaseForm, setShowLeaseForm] = useState(false);
  const [myLeaseStatus, setMyLeaseStatus] = useState<string | null>(null);
  const [notifiedStatus, setNotifiedStatus] = useState<string | null>(null);
  const { addToast } = useToast();

  const landId = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    // decode JWT to get current user id if logged in and reuse token for requests
    let token: string | null = null;
    try {
      token = localStorage.getItem('token');
      if (token) {
        const payloadPart = token.split('.')[1];
        const decoded = JSON.parse(atob(payloadPart));
        if (decoded && typeof decoded.sub === 'number') {
          setCurrentUserId(decoded.sub);
        }
      }
    } catch {
      token = null;
    }

    const fetchLand = async () => {
      if (!landId) {
        setError('No land ID provided');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/investments/lands/${landId}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to load land details');
        }
        const data = await response.json();
        setLand(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading land');
      } finally {
        setLoading(false);
      }
    };

    const fetchMyLease = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${API_BASE_URL}/investments/my-investments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        const mine = Array.isArray(data) ? data.find((inv: any) => String(inv?.project?.id) === String(landId)) : null;
        if (mine?.status) {
          setMyLeaseStatus(mine.status);
        }
      } catch {
        // silently ignore
      }
    };

    fetchLand();
    fetchMyLease();
  }, [landId]);

  // Surface status changes as toasts for the requester
  useEffect(() => {
    if (!myLeaseStatus || notifiedStatus === myLeaseStatus) return;
    if (myLeaseStatus === 'APPROVED') addToast('Votre demande a été approuvée 🎉', 'success');
    else if (myLeaseStatus === 'REJECTED') addToast('Votre demande a été refusée', 'error');
    else if (myLeaseStatus === 'ACTIVE') addToast('Votre demande est en cours de traitement', 'info');
    setNotifiedStatus(myLeaseStatus);
  }, [myLeaseStatus, notifiedStatus, addToast]);

  const handleLeaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/investments/lease-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectId: landId,
          seasonStartDate: leaseForm.seasonStartDate,
          customDurationMonths: parseInt(leaseForm.customDurationMonths),
          farmingPlan: leaseForm.farmingPlan,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit lease request');
      
      setMyLeaseStatus('ACTIVE');
      setNotifiedStatus('ACTIVE');
      setShowLeaseForm(false);
      addToast('Demande de location envoyée avec succès', 'success');
      setLeaseForm({ seasonStartDate: '', customDurationMonths: '', farmingPlan: '' });
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Erreur lors de la soumission de la demande', 'error');
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full mb-4"
            />
            <p className="text-green-700 font-semibold">Chargement des détails...</p>
          </motion.div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !land) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
          <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Erreur</h1>
            <p className="text-gray-600">{error || 'Terre non trouvée'}</p>
            <button
              onClick={() => router.back()}
              className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
            >
              Retour
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const areaHectares = land.targetAmount;
  const leasePrice = land.currentAmount;
  const minMonths = land.minimumInvestment;
  const maxMonths = land.expectedROI;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-emerald-50 pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-green-700 font-bold border-2 border-green-200 hover:bg-green-50 hover:scale-105 transition-all duration-300 shadow-md"
          >
            <span className="text-xl">←</span>
            <span>Retour</span>
          </motion.button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Images & Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl overflow-hidden shadow-lg"
              >
                {land.images && land.images.length > 0 ? (
                  <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 5000 }}
                    className="h-80 md:h-96"
                  >
                    {land.images.map((img, idx) => (
                      <SwiperSlide key={idx}>
                        <div className="relative w-full h-full">
                          <Image
                            src={img?.startsWith('http') ? img : `${API_BASE_URL}${img}`}
                            alt={`${land.title} - Image ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  <div className="h-80 bg-slate-100 flex items-center justify-center">
                    <div className="text-7xl">🌾</div>
                  </div>
                )}
              </motion.div>

              {/* Title & Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                      {land.title}
                    </h1>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <span>📍</span>
                      <span className="font-medium">{land.location}</span>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-lg font-semibold text-sm border-2 ${
                      land.status === 'available' ? 'bg-emerald-100/80 text-emerald-800 border-emerald-400' : 
                      land.status === 'reserved' ? 'bg-amber-100/80 text-amber-800 border-amber-400' :
                      land.status === 'leased' ? 'bg-blue-100/80 text-blue-800 border-blue-400' :
                      'bg-slate-100/80 text-slate-800 border-slate-400'
                    }`}
                  >
                    {land.status === 'available' ? '✓ Disponible' : 
                     land.status === 'reserved' ? '⏳ Réservée' : 
                     land.status === 'leased' ? '✓ Louée' : '✗ Indisponible'}
                  </div>
                </div>
                
                <p className="text-slate-600 leading-relaxed">{land.description}</p>
              </motion.div>

              {/* Key Metrics Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-3"
              >
                {[
                  { icon: '🏞️', label: 'Surface', value: `${areaHectares} ha`, color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
                  { icon: '💰', label: 'Prix/Mois', value: `${leasePrice.toLocaleString()} TND`, color: 'bg-blue-50 border-blue-200 text-blue-700' },
                  { icon: '📅', label: 'Durée Min', value: `${minMonths} mois`, color: 'bg-purple-50 border-purple-200 text-purple-700' },
                  { icon: '⏱️', label: 'Durée Max', value: `${maxMonths} mois`, color: 'bg-orange-50 border-orange-200 text-orange-700' }
                ].map((metric, idx) => (
                  <div
                    key={idx}
                    className={`${metric.color} border rounded-lg p-4`}
                  >
                    <div className="text-2xl mb-1">{metric.icon}</div>
                    <p className="text-xs opacity-80 mb-1">{metric.label}</p>
                    <p className="text-lg font-bold">{metric.value}</p>
                  </div>
                ))}
              </motion.div>

              {/* Availability Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span>📅</span>
                  <span>Disponibilité</span>
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <p className="text-xs text-slate-600 mb-1.5 font-medium">Date de Début</p>
                    <p className="text-base font-bold text-slate-900">
                      {land.availableFrom ? new Date(land.availableFrom).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Non spécifié'}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <p className="text-xs text-slate-600 mb-1.5 font-medium">Date de Fin</p>
                    <p className="text-base font-bold text-slate-900">
                      {land.fundingDeadline ? new Date(land.fundingDeadline).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Non spécifié'}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Sticky Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Lease Request Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl p-6 shadow-lg border border-slate-200"
                >
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <span>🚜</span>
                    <span>Location</span>
                  </h3>

                  {currentUserId === land.owner.id ? (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <p className="text-emerald-700 font-medium text-sm flex items-center gap-2">
                        <span>👤</span>
                        <span>C'est votre annonce</span>
                      </p>
                    </div>
                  ) : myLeaseStatus ? (
                    <div className={`p-4 rounded-lg border flex items-start gap-3 ${
                      myLeaseStatus === 'APPROVED'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : myLeaseStatus === 'ACTIVE'
                        ? 'bg-amber-50 border-amber-200 text-amber-800'
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}>
                      <span>{myLeaseStatus === 'APPROVED' ? '✅' : myLeaseStatus === 'ACTIVE' ? '⏳' : '✗'}</span>
                      <div className="text-sm font-medium">
                        {myLeaseStatus === 'APPROVED' && 'Votre demande est acceptée. Contactez le propriétaire pour finaliser.'}
                        {myLeaseStatus === 'ACTIVE' && 'Votre demande est en cours de traitement.'}
                        {myLeaseStatus === 'REJECTED' && 'Votre demande a été refusée.'}
                      </div>
                    </div>
                  ) : land.status !== 'available' ? (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-amber-700 font-medium text-sm flex items-center gap-2">
                        <span>⏳</span>
                        <span>Terre non disponible</span>
                      </p>
                    </div>
                  ) : !showLeaseForm ? (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowLeaseForm(true)}
                      className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
                    >
                      Demander une Location
                    </motion.button>
                  ) : (
                    <motion.form
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      onSubmit={handleLeaseSubmit}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">
                          Date de Début
                        </label>
                        <input
                          type="date"
                          required
                          value={leaseForm.seasonStartDate}
                          onChange={(e) => setLeaseForm({ ...leaseForm, seasonStartDate: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border-2 border-green-200 focus:ring-4 focus:ring-green-200 focus:border-green-500 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">
                          Durée (mois)
                        </label>
                        <input
                          type="number"
                          required
                          min={minMonths}
                          max={maxMonths}
                          value={leaseForm.customDurationMonths}
                          onChange={(e) => setLeaseForm({ ...leaseForm, customDurationMonths: e.target.value })}
                          placeholder={`Entre ${minMonths} et ${maxMonths} mois`}
                          className="w-full px-4 py-3 rounded-xl border-2 border-green-200 focus:ring-4 focus:ring-green-200 focus:border-green-500 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">
                          Plan d'Exploitation
                        </label>
                        <textarea
                          value={leaseForm.farmingPlan}
                          onChange={(e) => setLeaseForm({ ...leaseForm, farmingPlan: e.target.value })}
                          placeholder="Décrivez votre plan de culture..."
                          className="w-full px-4 py-3 rounded-xl border-2 border-green-200 focus:ring-4 focus:ring-green-200 focus:border-green-500 outline-none transition-all resize-none"
                          rows={4}
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="submit"
                          className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:shadow-xl transition-all"
                        >
                          Envoyer
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowLeaseForm(false)}
                          className="px-6 py-3 border-2 border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-all"
                        >
                          Annuler
                        </button>
                      </div>
                    </motion.form>
                  )}
                </motion.div>

                {/* Owner Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-8 shadow-2xl text-white"
                >
                  <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <span>👨‍🌾</span>
                    <span>Propriétaire</span>
                  </h4>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center font-bold text-2xl text-green-600 shadow-xl">
                        {land.owner.name.charAt(0)}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <p className="font-bold text-lg">{land.owner.name}</p>
                      <p className="text-green-100 text-sm">{land.owner.email}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-3 bg-white text-green-700 font-bold rounded-xl hover:bg-green-50 transition-all shadow-lg"
                  >
                    Contacter le Propriétaire
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
