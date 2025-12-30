/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { API_BASE_URL } from '../../src/api-config';
import { 
  Bell, CheckCircle, XCircle, Truck, Package, 
  Clock, ArrowRight, Sparkles, Trash2, Check,
  AlertCircle, RefreshCw
} from 'lucide-react';

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  relatedId?: number;
  relatedType?: string;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Vous devez être connecté pour voir vos notifications.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Erreur lors du chargement des notifications');
      
      const data = await res.json();
      setNotifications(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setActionLoading(id);
    try {
      const res = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setNotifications(prev => 
          prev.map(n => n.id === id ? { ...n, isRead: true } : n)
        );
      }
    } catch (err) {
      console.error('Error marking as read', err);
    } finally {
      setActionLoading(null);
    }
  };

  const markAllAsRead = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/notifications/mark-all-read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      }
    } catch (err) {
      console.error('Error marking all as read', err);
    }
  };

  const deleteNotification = async (id: number) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setActionLoading(id);
    try {
      const res = await fetch(`${API_BASE_URL}/notifications/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }
    } catch (err) {
      console.error('Error deleting notification', err);
    } finally {
      setActionLoading(null);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'RESERVATION_ACCEPTED':
      case 'PURCHASE_REQUEST_ACCEPTED':
      case 'LEASE_APPROVED':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'RESERVATION_REJECTED':
      case 'PURCHASE_REQUEST_REJECTED':
      case 'LEASE_REJECTED':
      case 'booking_rejected':
        return <XCircle className="w-6 h-6 text-red-500" />;
      case 'NEW_RESERVATION':
      case 'LEASE_REQUEST':
        return <Package className="w-6 h-6 text-blue-500" />;
      case 'NEW_PURCHASE_REQUEST':
        return <Package className="w-6 h-6 text-orange-500" />;
      case 'DELIVERY_STATUS':
        return <Truck className="w-6 h-6 text-orange-500" />;
      case 'booking_request':
        return <Package className="w-6 h-6 text-blue-500" />;
      case 'booking_approved':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      default:
        return <Bell className="w-6 h-6 text-gray-500" />;
    }
  };

  const getNotificationLink = (notification: Notification) => {
    // Pour les demandes de réservation d'équipement (propriétaire), aller vers réservations reçues
    if (notification.type === 'booking_request') {
      return `/equipment/bookings/received`;
    }
    // Pour les réservations d'équipement acceptées/refusées (demandeur), aller vers réservations envoyées
    if (notification.type === 'booking_approved' || notification.type === 'booking_rejected') {
      return `/equipment/bookings/sent`;
    }
    // Pour les nouvelles réservations (transporteur), aller vers la page des réservations reçues
    if (notification.type === 'NEW_RESERVATION') {
      return `/deliveries?tab=received`;
    }
    // Pour les nouvelles demandes d'achat (vendeur), aller vers les demandes reçues
    if (notification.type === 'NEW_PURCHASE_REQUEST') {
      return `/purchase-requests/received`;
    }
    // Pour les demandes d'achat acceptées/refusées (acheteur), aller vers mes demandes envoyées
    if (notification.type === 'PURCHASE_REQUEST_ACCEPTED' || notification.type === 'PURCHASE_REQUEST_REJECTED') {
      return `/purchase-requests`;
    }
    // Pour les nouvelles demandes de location de terre (propriétaire), aller vers les réservations reçues
    if (notification.type === 'LEASE_REQUEST') {
      return `/investments/my-lands`;
    }
    // Pour les demandes de location acceptées/refusées (locataire), aller vers mes demandes de location
    if (notification.type === 'LEASE_APPROVED' || notification.type === 'LEASE_REJECTED') {
      return `/investments/mine`;
    }
    // Pour les autres notifications liées aux livraisons (client), aller vers mes réservations
    if (notification.relatedType === 'delivery' && notification.relatedId) {
      return `/deliveries`;
    }
    if (notification.relatedType === 'carrier' && notification.relatedId) {
      return `/carriers/${notification.relatedId}`;
    }
    return null;
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-green-50/30">
        {/* Hero Section */}
        <section className="relative overflow-hidden text-white pt-24 pb-32 px-4">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-green-800 via-emerald-700 to-teal-800"></div>
            <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>
          </div>

          <div className="relative max-w-4xl mx-auto z-10 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/15 backdrop-blur-xl border border-white/30 mb-6">
              <Bell className="w-5 h-5 text-green-300" />
              <span className="text-sm font-bold text-white">Centre de Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                  {unreadCount} non lues
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-black mb-4">
              <span className="block text-white drop-shadow-2xl">Vos</span>
              <span className="block bg-gradient-to-r from-green-300 via-emerald-300 to-teal-400 bg-clip-text text-transparent">
                Notifications
              </span>
            </h1>
            <p className="text-lg text-green-100/90 max-w-xl mx-auto">
              Suivez toutes les mises à jour de vos réservations et activités
            </p>
          </div>

          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" className="w-full h-16 fill-slate-50">
              <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,69.3C960,85,1056,107,1152,106.7C1248,107,1344,85,1392,74.7L1440,64L1440,120L0,120Z"></path>
            </svg>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto px-4 -mt-12 relative z-20 pb-20">
          {/* Actions Bar */}
          {notifications.length > 0 && (
            <div className="flex items-center justify-between mb-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Bell className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{notifications.length} notifications</p>
                  <p className="text-sm text-gray-500">{unreadCount} non lues</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={fetchNotifications}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                  title="Rafraîchir"
                >
                  <RefreshCw className="w-5 h-5 text-gray-600" />
                </button>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg font-semibold hover:bg-green-100 transition-all text-sm"
                  >
                    <Check className="w-4 h-4" />
                    Tout marquer comme lu
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-ping opacity-20"></div>
                <div className="absolute inset-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full animate-pulse"></div>
                <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                  <Bell className="w-8 h-8 text-green-600 animate-pulse" />
                </div>
              </div>
              <p className="text-lg font-semibold text-gray-700">Chargement des notifications...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Erreur</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all"
              >
                Se connecter
              </Link>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && notifications.length === 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Bell className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Aucune notification</h3>
              <p className="text-gray-600 mb-6">
                Vous n&apos;avez pas encore de notifications. Elles apparaîtront ici lorsque vos réservations seront mises à jour.
              </p>
              <Link
                href="/carriers"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all"
              >
                <Truck className="w-5 h-5" />
                Voir les transporteurs
              </Link>
            </div>
          )}

          {/* Notifications List */}
          {!loading && !error && notifications.length > 0 && (
            <div className="space-y-4">
              {notifications.map((notification) => {
                const link = getNotificationLink(notification);
                
                return (
                  <div
                    key={notification.id}
                    className={`bg-white rounded-xl shadow-lg border-2 transition-all overflow-hidden ${
                      notification.isRead 
                        ? 'border-gray-100 opacity-75' 
                        : 'border-green-200 bg-green-50/30'
                    }`}
                  >
                    <div className="p-5">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          notification.isRead ? 'bg-gray-100' : 'bg-green-100'
                        }`}>
                          {getNotificationIcon(notification.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className={`font-bold ${notification.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                                {notification.title}
                              </h3>
                              <p className={`text-sm mt-1 ${notification.isRead ? 'text-gray-500' : 'text-gray-600'}`}>
                                {notification.message}
                              </p>
                            </div>
                            {!notification.isRead && (
                              <span className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0 animate-pulse"></span>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Clock className="w-4 h-4" />
                              <span>{new Date(notification.createdAt).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              {!notification.isRead && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  disabled={actionLoading === notification.id}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                  title="Marquer comme lu"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              )}
                              
                              <button
                                onClick={() => deleteNotification(notification.id)}
                                disabled={actionLoading === notification.id}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                title="Supprimer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>

                              {link && (
                                <Link
                                  href={link}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg font-semibold hover:bg-green-200 transition-all text-sm"
                                >
                                  Voir
                                  <ArrowRight className="w-4 h-4" />
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
