/* eslint-disable @typescript-eslint/no-explicit-any */
// app/equipment/bookings/received/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { API_BASE_URL } from '@/src/api-config';
import { Inbox, ArrowLeft, AlertCircle, Check, X, Clock, Calendar, User, MapPin, CheckCircle, XCircle, Loader2, Phone, ExternalLink } from 'lucide-react';

interface Booking {
    id: number;
    startDate: string;
    endDate: string;
    status: 'pending' | 'approved' | 'rejected' | 'canceled';
    phoneNumber?: string;
    equipment: {
        id: number;
        name: string;
        pricePerDay: number;
        location: string;
        images?: string[];
        category: string;
    };
    user: {
        id: number;
        name: string;
        email: string;
        phoneNumber?: string;
    };
}

export default function ReceivedBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [processingId, setProcessingId] = useState<number | null>(null);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

    useEffect(() => {
        fetchReceivedBookings();
    }, []);

    const fetchReceivedBookings = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Vous devez être connecté');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/booking/received`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Erreur lors du chargement des réservations');
            }

            const data = await response.json();
            setBookings(data);
        } catch (err: any) {
            setError(err.message || 'Erreur lors du chargement');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (bookingId: number, status: 'approved' | 'rejected') => {
        setProcessingId(bookingId);
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${API_BASE_URL}/booking/${bookingId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour');
            }

            // If rejected, remove from list entirely
            if (status === 'rejected') {
                setBookings(bookings.filter(b => b.id !== bookingId));
            } else {
                // Update local state for approved
                setBookings(bookings.map(b => 
                    b.id === bookingId ? { ...b, status } : b
                ));
            }
        } catch (err: any) {
            alert(err.message || 'Erreur lors de la mise à jour');
        } finally {
            setProcessingId(null);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const calculateDays = (start: string, end: string) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-200">
                        <Clock className="w-3 h-3" />
                        En attente
                    </span>
                );
            case 'approved':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                        <CheckCircle className="w-3 h-3" />
                        Approuvée
                    </span>
                );
            case 'rejected':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                        <XCircle className="w-3 h-3" />
                        Refusée
                    </span>
                );
            case 'canceled':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800 border border-gray-200">
                        <X className="w-3 h-3" />
                        Annulée
                    </span>
                );
            default:
                return null;
        }
    };

    const filteredBookings = filter === 'all' 
        ? bookings 
        : bookings.filter(b => b.status === filter);

    const pendingCount = bookings.filter(b => b.status === 'pending').length;

    if (loading) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-orange-50/30 py-12">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="flex items-center justify-center min-h-[40vh]">
                            <div className="text-center">
                                <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-gray-600">Chargement des réservations...</p>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-orange-50/30 py-12">
                <div className="max-w-6xl mx-auto px-4">
                    {/* Header */}
                    <div className="mb-8">
                        <Link href="/equipment/browse" className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors mb-4">
                            <ArrowLeft className="w-4 h-4" />
                            Retour au catalogue
                        </Link>
                        
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                                    <Inbox className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-black text-gray-900">Réservations Reçues</h1>
                                    <p className="text-gray-600">Demandes de location pour vos équipements</p>
                                </div>
                            </div>
                            
                            {pendingCount > 0 && (
                                <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 border border-yellow-300 rounded-xl">
                                    <Clock className="w-5 h-5 text-yellow-700" />
                                    <span className="font-bold text-yellow-800">{pendingCount} en attente</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {[
                            { value: 'all', label: 'Toutes', count: bookings.length },
                            { value: 'pending', label: 'En attente', count: bookings.filter(b => b.status === 'pending').length },
                            { value: 'approved', label: 'Approuvées', count: bookings.filter(b => b.status === 'approved').length },
                            { value: 'rejected', label: 'Refusées', count: bookings.filter(b => b.status === 'rejected').length },
                        ].map((f) => (
                            <button
                                key={f.value}
                                onClick={() => setFilter(f.value as any)}
                                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                                    filter === f.value
                                        ? 'bg-orange-500 text-white shadow-lg'
                                        : 'bg-white text-gray-700 border border-gray-200 hover:border-orange-300'
                                }`}
                            >
                                {f.label} ({f.count})
                            </button>
                        ))}
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3">
                            <AlertCircle className="w-5 h-5" />
                            {error}
                        </div>
                    )}

                    {filteredBookings.length === 0 ? (
                        <div className="bg-white rounded-3xl border-2 border-dashed border-gray-300 p-12 text-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                                <Inbox className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Aucune réservation</h3>
                            <p className="text-gray-600">Vous n'avez pas encore reçu de demandes de réservation.</p>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {filteredBookings.map((booking) => {
                                const days = calculateDays(booking.startDate, booking.endDate);
                                const totalPrice = days * booking.equipment.pricePerDay;
                                
                                return (
                                    <div key={booking.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                        <div className="flex flex-col lg:flex-row">
                                            {/* Equipment info */}
                                            <div className="lg:w-80 p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-b lg:border-b-0 lg:border-r border-gray-100">
                                                <h3 className="font-bold text-gray-900 text-lg mb-2">{booking.equipment.name}</h3>
                                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                                                    <MapPin className="w-4 h-4" />
                                                    {booking.equipment.location}
                                                </div>
                                                <div className="text-2xl font-black text-orange-600">
                                                    {booking.equipment.pricePerDay} TND
                                                    <span className="text-sm font-normal text-gray-500">/jour</span>
                                                </div>
                                            </div>
                                            
                                            {/* Booking details */}
                                            <div className="flex-1 p-6">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white font-bold">
                                                                {booking.user.name.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-gray-900">{booking.user.name}</p>
                                                                <p className="text-sm text-gray-500">{booking.user.email}</p>
                                                                {(booking.phoneNumber || booking.user.phoneNumber) && (
                                                                    <p className="text-sm text-green-600 flex items-center gap-1">
                                                                        <Phone className="w-3 h-3" />
                                                                        {booking.phoneNumber || booking.user.phoneNumber}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <Link
                                                            href={`/users/${booking.user.id}`}
                                                            className="inline-flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 font-medium"
                                                        >
                                                            <ExternalLink className="w-3 h-3" />
                                                            Voir le profil
                                                        </Link>
                                                    </div>
                                                    {getStatusBadge(booking.status)}
                                                </div>
                                                
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-xl">
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-1">Date début</p>
                                                        <p className="font-semibold text-gray-900 flex items-center gap-1">
                                                            <Calendar className="w-4 h-4 text-orange-500" />
                                                            {formatDate(booking.startDate)}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-1">Date fin</p>
                                                        <p className="font-semibold text-gray-900 flex items-center gap-1">
                                                            <Calendar className="w-4 h-4 text-orange-500" />
                                                            {formatDate(booking.endDate)}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-1">Durée</p>
                                                        <p className="font-semibold text-gray-900">{days} jour{days > 1 ? 's' : ''}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-1">Total</p>
                                                        <p className="font-black text-orange-600 text-lg">{totalPrice} TND</p>
                                                    </div>
                                                </div>
                                                
                                                {/* Actions for pending bookings */}
                                                {booking.status === 'pending' && (
                                                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                                        <button
                                                            onClick={() => handleUpdateStatus(booking.id, 'approved')}
                                                            disabled={processingId === booking.id}
                                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 shadow-lg hover:shadow-xl"
                                                        >
                                                            {processingId === booking.id ? (
                                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                            ) : (
                                                                <Check className="w-5 h-5" />
                                                            )}
                                                            Accepter
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateStatus(booking.id, 'rejected')}
                                                            disabled={processingId === booking.id}
                                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold rounded-xl hover:from-red-600 hover:to-rose-700 transition-all disabled:opacity-50 shadow-lg hover:shadow-xl"
                                                        >
                                                            {processingId === booking.id ? (
                                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                            ) : (
                                                                <X className="w-5 h-5" />
                                                            )}
                                                            Refuser
                                                        </button>
                                                    </div>
                                                )}
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
