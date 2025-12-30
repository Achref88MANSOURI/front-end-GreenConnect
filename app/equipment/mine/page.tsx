/* eslint-disable @typescript-eslint/no-explicit-any */
// app/equipment/mine/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ConfirmModal from '../../components/ConfirmModal';
import { useToast } from '../../components/ToastProvider';
import { API_BASE_URL } from '@/src/api-config';
import { Package, Plus, Edit, Trash2, MapPin, ArrowLeft, AlertCircle, Check, X, Eye } from 'lucide-react';

interface Equipment {
    id: number;
    name: string;
    description: string;
    category: string;
    pricePerDay: number;
    location: string;
    availability: boolean;
    images?: string[];
}

export default function MyEquipmentPage() {
    const { addToast } = useToast();
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [equipmentToDelete, setEquipmentToDelete] = useState<number | null>(null);

    useEffect(() => {
        fetchMyEquipment();
    }, []);

    const fetchMyEquipment = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Vous devez être connecté pour voir vos équipements');
            setLoading(false);
            return;
        }

        try {
            // Get current user
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                setError('Utilisateur non trouvé');
                setLoading(false);
                return;
            }
            const user = JSON.parse(userStr);

            // Fetch all equipment and filter by owner
            const response = await fetch(`${API_BASE_URL}/equipment`);
            if (!response.ok) {
                throw new Error('Erreur lors du chargement des équipements');
            }
            const data = await response.json();
            const myEquipment = data.filter((eq: any) => eq.owner?.id === user.id);
            setEquipment(myEquipment);
        } catch (err: any) {
            setError(err.message || 'Erreur lors du chargement');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        setEquipmentToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!equipmentToDelete) return;
        
        setDeletingId(equipmentToDelete);
        const token = localStorage.getItem('token');
        
        try {
            const response = await fetch(`${API_BASE_URL}/equipment/${equipmentToDelete}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            if (!response.ok) {
                throw new Error('Erreur lors de la suppression');
            }
            
            setEquipment(equipment.filter(eq => eq.id !== equipmentToDelete));
        } catch (err: any) {
            addToast(err.message || 'Erreur lors de la suppression', 'error');
        } finally {
            setDeletingId(null);
        }
    };

    const categoryTranslations: { [key: string]: string } = {
        'Tractor': 'Tracteur',
        'Harvester': 'Moissonneuse',
        'Planter': 'Planteuse',
        'Irrigation': 'Irrigation',
        'Sprayer': 'Pulvérisateur',
        'Trailer': 'Remorque',
        'Other': 'Autre'
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

    if (loading) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/30 py-12">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="flex items-center justify-center min-h-[40vh]">
                            <div className="text-center">
                                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-gray-600">Chargement de vos équipements...</p>
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
            <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/30 py-12">
                <div className="max-w-6xl mx-auto px-4">
                    {/* Header */}
                    <div className="mb-8">
                        <Link href="/equipment/browse" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-4">
                            <ArrowLeft className="w-4 h-4" />
                            Retour au catalogue
                        </Link>
                        
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                                    <Package className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-black text-gray-900">Mes Équipements</h1>
                                    <p className="text-gray-600">Gérez vos équipements en location</p>
                                </div>
                            </div>
                            
                            <Link href="/equipment/create" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                                <Plus className="w-5 h-5" />
                                Ajouter un équipement
                            </Link>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3">
                            <AlertCircle className="w-5 h-5" />
                            {error}
                        </div>
                    )}

                    {equipment.length === 0 ? (
                        <div className="bg-white rounded-3xl border-2 border-dashed border-gray-300 p-12 text-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                                <Package className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Aucun équipement</h3>
                            <p className="text-gray-600 mb-6">Vous n'avez pas encore ajouté d'équipement à la plateforme.</p>
                            <Link href="/equipment/create" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all">
                                <Plus className="w-5 h-5" />
                                Ajouter mon premier équipement
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {equipment.map((eq) => (
                                <div key={eq.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 overflow-hidden">
                                    <div className="flex flex-col md:flex-row">
                                        {/* Image */}
                                        <div className="md:w-64 h-48 md:h-auto bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center relative">
                                            {eq.images && eq.images.length > 0 ? (
                                                <img
                                                    src={`${API_BASE_URL}${eq.images[0]}`}
                                                    alt={eq.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-6xl">{categoryIcons[eq.category] || '🚜'}</span>
                                            )}
                                            
                                            {/* Status badge */}
                                            <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                                                eq.availability 
                                                    ? 'bg-green-500 text-white' 
                                                    : 'bg-gray-100 text-gray-600'
                                            }`}>
                                                {eq.availability ? (
                                                    <>
                                                        <Check className="w-3 h-3" />
                                                        Disponible
                                                    </>
                                                ) : (
                                                    <>
                                                        <X className="w-3 h-3" />
                                                        Indisponible
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* Content */}
                                        <div className="flex-1 p-6">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-lg">{categoryIcons[eq.category] || '⚙️'}</span>
                                                        <span className="text-sm text-gray-500 font-medium">{categoryTranslations[eq.category] || eq.category}</span>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-gray-900">{eq.name}</h3>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-2xl font-black text-blue-600">{eq.pricePerDay} TND</span>
                                                    <span className="text-gray-500 text-sm block">/jour</span>
                                                </div>
                                            </div>
                                            
                                            <p className="text-gray-600 mb-4 line-clamp-2">{eq.description}</p>
                                            
                                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4" />
                                                    {eq.location}
                                                </span>
                                            </div>
                                            
                                            {/* Actions */}
                                            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                                <Link href={`/equipment/${eq.id}`} className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 font-medium transition-colors">
                                                    <Eye className="w-4 h-4" />
                                                    Voir
                                                </Link>
                                                <Link href={`/equipment/${eq.id}/edit`} className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-xl text-blue-700 font-medium transition-colors">
                                                    <Edit className="w-4 h-4" />
                                                    Modifier
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(eq.id)}
                                                    disabled={deletingId === eq.id}
                                                    className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-xl text-red-700 font-medium transition-colors disabled:opacity-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    {deletingId === eq.id ? 'Suppression...' : 'Supprimer'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />

            {/* Confirmation Modal */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setEquipmentToDelete(null);
                }}
                onConfirm={confirmDelete}
                title="Supprimer l'équipement"
                message="Êtes-vous sûr de vouloir supprimer cet équipement ? Cette action est irréversible."
                confirmText="Supprimer"
                cancelText="Annuler"
                isDangerous={true}
            />
        </>
    );
}
