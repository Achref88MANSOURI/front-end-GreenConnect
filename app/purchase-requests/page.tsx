"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { API_BASE_URL } from '../../src/api-config';
import { 
  ShoppingBag, ArrowLeft, Package, Clock, CheckCircle2, XCircle, 
  Phone, User, MapPin, Edit, Trash2, MessageSquare, Send,
  Loader2, AlertCircle, Eye, ChevronDown, ChevronUp
} from 'lucide-react';

interface PurchaseRequest {
  id: number;
  productId: number;
  quantity: number;
  totalPrice: number;
  buyerName: string;
  buyerPhone: string;
  buyerAddress: string;
  buyerMessage: string;
  status: 'pending' | 'accepted' | 'rejected';
  sellerResponse?: string;
  sellerPhone?: string;
  createdAt: string;
  product: {
    id: number;
    title: string;
    price: number;
    imageUrl: string;
    phoneNumber?: string;
  };
  seller: {
    id: number;
    name: string;
    phoneNumber?: string;
  };
}

export default function MyPurchaseRequestsPage() {
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    quantity: 1,
    buyerName: '',
    buyerPhone: '',
    buyerAddress: '',
    buyerMessage: '',
  });

  const fetchRequests = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Vous devez être connecté');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/purchase-requests/my-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Erreur lors du chargement');

      const data = await res.json();
      setRequests(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Voulez-vous vraiment annuler cette demande ?')) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/purchase-requests/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Erreur lors de la suppression');

      setRequests(prev => prev.filter(r => r.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const startEdit = (request: PurchaseRequest) => {
    setEditingId(request.id);
    setEditForm({
      quantity: request.quantity,
      buyerName: request.buyerName,
      buyerPhone: request.buyerPhone,
      buyerAddress: request.buyerAddress || '',
      buyerMessage: request.buyerMessage || '',
    });
  };

  const handleUpdate = async (id: number) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/purchase-requests/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      if (!res.ok) throw new Error('Erreur lors de la modification');

      setEditingId(null);
      fetchRequests();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold">
            <Clock className="w-4 h-4" />
            En attente
          </span>
        );
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            Acceptée
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
            <XCircle className="w-4 h-4" />
            Refusée
          </span>
        );
      default:
        return null;
    }
  };

  const getImageUrl = (path: string) => {
    if (!path) return '/images/placeholder.jpg';
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}/uploads/${path}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-white to-slate-50">
        <Header />
        <main className="flex-grow flex items-center justify-center pt-20">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
            <p className="text-gray-600 font-medium">Chargement de vos demandes...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <Header />
      
      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link 
                href="/Panier" 
                className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour au Panier
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Mes Demandes d'Achat</h1>
              <p className="text-gray-600 mt-1">Suivez l'état de vos demandes d'achat</p>
            </div>
            <Link
              href="/Panier"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-medium"
            >
              <ShoppingBag className="w-5 h-5" />
              Mon Panier
            </Link>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {requests.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl shadow-lg border border-gray-100">
              <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Aucune demande</h2>
              <p className="text-gray-600 mb-6">Vous n'avez pas encore envoyé de demande d'achat</p>
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-semibold"
              >
                Explorer le Marketplace
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                >
                  {/* Main Content */}
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Product Image */}
                      <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                        <img
                          src={getImageUrl(request.product.imageUrl)}
                          alt={request.product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-grow min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <Link 
                              href={`/products/${request.productId}`}
                              className="text-lg font-bold text-gray-900 hover:text-emerald-600 transition"
                            >
                              {request.product.title}
                            </Link>
                            <p className="text-sm text-gray-500">
                              Vendeur: {request.seller.name}
                            </p>
                          </div>
                          {getStatusBadge(request.status)}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <span className="font-medium">
                            Quantité: <span className="text-gray-900">{request.quantity}</span>
                          </span>
                          <span className="font-medium">
                            Total: <span className="text-emerald-600 font-bold">{Number(request.totalPrice).toFixed(2)} MAD</span>
                          </span>
                          <span className="text-gray-400">
                            {new Date(request.createdAt).toLocaleDateString('fr-FR')}
                          </span>
                        </div>

                        {/* Show seller phone if accepted */}
                        {request.status === 'accepted' && request.sellerPhone && (
                          <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                            <p className="text-sm font-semibold text-emerald-800 flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              Contactez le vendeur: {request.sellerPhone}
                            </p>
                          </div>
                        )}

                        {/* Show rejection reason */}
                        {request.status === 'rejected' && request.sellerResponse && (
                          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                            <p className="text-sm text-red-700">
                              <strong>Motif:</strong> {request.sellerResponse}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => setExpandedId(expandedId === request.id ? null : request.id)}
                          className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                        >
                          {expandedId === request.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                        
                        {request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => startEdit(request)}
                              className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition"
                              title="Modifier"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(request.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Annuler"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedId === request.id && (
                    <div className="px-6 pb-6 pt-2 border-t border-gray-100 bg-gray-50">
                      {editingId === request.id ? (
                        /* Edit Form */
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-900">Modifier la demande</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
                              <input
                                type="number"
                                min="1"
                                value={editForm.quantity}
                                onChange={(e) => setEditForm({ ...editForm, quantity: parseInt(e.target.value) || 1 })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Votre nom</label>
                              <input
                                type="text"
                                value={editForm.buyerName}
                                onChange={(e) => setEditForm({ ...editForm, buyerName: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                              <input
                                type="tel"
                                value={editForm.buyerPhone}
                                onChange={(e) => setEditForm({ ...editForm, buyerPhone: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                              <input
                                type="text"
                                value={editForm.buyerAddress}
                                onChange={(e) => setEditForm({ ...editForm, buyerAddress: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                            <textarea
                              value={editForm.buyerMessage}
                              onChange={(e) => setEditForm({ ...editForm, buyerMessage: e.target.value })}
                              rows={2}
                              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdate(request.id)}
                              className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-medium"
                            >
                              Enregistrer
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-medium"
                            >
                              Annuler
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* View Details */
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <User className="w-4 h-4" />
                            <span className="font-medium">Nom:</span> {request.buyerName}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span className="font-medium">Téléphone:</span> {request.buyerPhone}
                          </div>
                          {request.buyerAddress && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span className="font-medium">Adresse:</span> {request.buyerAddress}
                            </div>
                          )}
                          {request.buyerMessage && (
                            <div className="flex items-start gap-2 text-gray-600 md:col-span-2">
                              <MessageSquare className="w-4 h-4 mt-0.5" />
                              <span><span className="font-medium">Message:</span> {request.buyerMessage}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
