/* eslint-disable @typescript-eslint/no-explicit-any */
// app/equipment/bookings/sent/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { API_BASE_URL } from '@/src/api-config';
import { Send, ArrowLeft, AlertCircle, Clock, Calendar, MapPin, CheckCircle, XCircle, X, Eye } from 'lucide-react';

interface Booking {
    id: number;
    startDate: string;
    endDate: string;
    status: 'pending' | 'approved' | 'rejected' | 'canceled';
    equipment: {
        id: number;
        name: string;
        pricePerDay: number;
        location: string;
        images?: string[];
        category: string;
    };
}

export default function SentBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

    useEffect(() => {
        fetchMyBookings();
    }, []);

    const fetchMyBookings = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Vous devez être connecté');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/booking/mine`, {
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

    const getStatusMessage = (status: string) => {
        switch (status) {
            case 'pending':
                return 'Votre demande est en cours d\'examen par le propriétaire.';
            case 'approved':
                return 'Félicitations ! Votre réservation a été acceptée.';
            case 'rejected':
                return 'Désolé, votre demande a été refusée par le propriétaire.';
            case 'canceled':
                return 'Cette réservation a été annulée.';
            default:
                return '';
        }
    };

    const categoryIcons: { [key: string]: string } = {
        'Tractor': '🚜',
        'Harvester': '🌾',
        'Planter': '🌱',
        'Irrigation': '💧',
        'Sprayer': '💨',
        'Trailer': '🛣️',
        'Other': '⚙️'
    };

    const filteredBookings = filter === 'all' 
        ? bookings 
        : bookings.filter(b => b.status === filter);

    const pendingCount = bookings.filter(b => b.status === 'pending').length;
    const approvedCount = bookings.filter(b => b.status === 'approved').length;

    if (loading) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-purple-50/30 py-12">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="flex items-center justify-center min-h-[40vh]">
                            <div className="text-center">
                                <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-gray-600">Chargement de vos réservations...</p>
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
            <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-purple-50/30 py-12">
                <div className="max-w-6xl mx-auto px-4">
                    {/* Header */}
                    <div className="mb-8">
                        <Link href="/equipment/browse" className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors mb-4">
                            <ArrowLeft className="w-4 h-4" />
                            Retour au catalogue
                        </Link>
                        
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                                    <Send className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-black text-gray-900">Mes Réservations</h1>
                                    <p className="text-gray-600">Vos demandes de location d'équipements</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                {pendingCount > 0 && (
                                    <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 border border-yellow-300 rounded-xl">
                                        <Clock className="w-4 h-4 text-yellow-700" />
                                        <span className="font-bold text-yellow-800">{pendingCount} en attente</span>
                                    </div>
                                )}
                                {approvedCount > 0 && (
                                    <div className="flex items-center gap-2 px-4 py-2 bg-green-100 border border-green-300 rounded-xl">
                                        <CheckCircle className="w-4 h-4 text-green-700" />
                                        <span className="font-bold text-green-800">{approvedCount} confirmée{approvedCount > 1 ? 's' : ''}</span>
                                    </div>
                                )}
                            </div>
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
                                        ? 'bg-purple-500 text-white shadow-lg'
                                        : 'bg-white text-gray-700 border border-gray-200 hover:border-purple-300'
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
                                <Send className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Aucune réservation</h3>
                            <p className="text-gray-600 mb-6">Vous n'avez pas encore fait de demande de réservation.</p>
                            <Link href="/equipment/browse" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-600 text-white font-bold rounded-xl hover:from-purple-600 hover:to-violet-700 transition-all">
                                Parcourir les équipements
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {filteredBookings.map((booking) => {
                                const days = calculateDays(booking.startDate, booking.endDate);
                                const totalPrice = days * booking.equipment.pricePerDay;
                                
                                return (
                                    <div key={booking.id} className={`bg-white rounded-2xl shadow-lg border-2 overflow-hidden transition-all ${
                                        booking.status === 'approved' ? 'border-green-200' :
                                        booking.status === 'rejected' ? 'border-red-200' :
                                        booking.status === 'pending' ? 'border-yellow-200' :
                                        'border-gray-100'
                                    }`}>
                                        <div className="flex flex-col md:flex-row">
                                            {/* Equipment image/icon */}
                                            <div className="md:w-48 h-32 md:h-auto bg-gradient-to-br from-purple-50 to-violet-50 flex items-center justify-center">
                                                {booking.equipment.images && booking.equipment.images.length > 0 ? (
                                                    <img
                                                        src={`${API_BASE_URL}${booking.equipment.images[0]}`}
                                                        alt={booking.equipment.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-5xl">{categoryIcons[booking.equipment.category] || '🚜'}</span>
                                                )}
                                            </div>
                                            
                                            {/* Booking details */}
                                            <div className="flex-1 p-6">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 text-lg">{booking.equipment.name}</h3>
                                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                                            <MapPin className="w-4 h-4" />
                                                            {booking.equipment.location}
                                                        </div>
                                                    </div>
                                                    {getStatusBadge(booking.status)}
                                                </div>
                                                
                                                {/* Status message */}
                                                <p className={`text-sm mb-4 p-3 rounded-xl ${
                                                    booking.status === 'approved' ? 'bg-green-50 text-green-700' :
                                                    booking.status === 'rejected' ? 'bg-red-50 text-red-700' :
                                                    booking.status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                                                    'bg-gray-50 text-gray-700'
                                                }`}>
                                                    {getStatusMessage(booking.status)}
                                                </p>
                                                
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl">
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-1">Date début</p>
                                                        <p className="font-semibold text-gray-900 flex items-center gap-1">
                                                            <Calendar className="w-4 h-4 text-purple-500" />
                                                            {formatDate(booking.startDate)}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-1">Date fin</p>
                                                        <p className="font-semibold text-gray-900 flex items-center gap-1">
                                                            <Calendar className="w-4 h-4 text-purple-500" />
                                                            {formatDate(booking.endDate)}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-1">Durée</p>
                                                        <p className="font-semibold text-gray-900">{days} jour{days > 1 ? 's' : ''}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-1">Total</p>
                                                        <p className="font-black text-purple-600 text-lg">{totalPrice} TND</p>
                                                    </div>
                                                </div>
                                                
                                                {/* View equipment link */}
                                                <div className="mt-4 pt-4 border-t border-gray-100">
                                                    <Link 
                                                        href={`/equipment/${booking.equipment.id}`}
                                                        className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        Voir l'équipement
                                                    </Link>
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
