"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { API_BASE_URL } from '../../../src/api-config';
import { 
  ShoppingBag, ArrowLeft, Package, Clock, CheckCircle2, XCircle, 
  Phone, User, MapPin, MessageSquare, Loader2, AlertCircle,
  ChevronDown, ChevronUp, Check, X
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
  createdAt: string;
  product: {
    id: number;
    title: string;
    price: number;
    imageUrl: string;
  };
  buyer: {
    id: number;
    name: string;
    email: string;
    phoneNumber?: string;
  };
}

export default function ReceivedRequestsPage() {
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [respondingId, setRespondingId] = useState<number | null>(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');

  const fetchRequests = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Vous devez être connecté');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/purchase-requests/received`, {
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

  const handleAccept = async (id: number) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/purchase-requests/${id}/accept`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sellerResponse: responseMessage }),
      });

      if (!res.ok) throw new Error('Erreur lors de l\'acceptation');

      setRespondingId(null);
      setResponseMessage('');
      fetchRequests();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleReject = async (id: number) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/purchase-requests/${id}/reject`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sellerResponse: responseMessage }),
      });

      if (!res.ok) throw new Error('Erreur lors du refus');

      setRespondingId(null);
      setResponseMessage('');
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

  const filteredRequests = requests.filter(r => filter === 'all' || r.status === filter);
  const pendingCount = requests.filter(r => r.status === 'pending').length;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-white to-slate-50">
        <Header />
        <main className="flex-grow flex items-center justify-center pt-20">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
            <p className="text-gray-600 font-medium">Chargement des demandes...</p>
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <Link 
                href="/marketplace" 
                className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour au Catalogue
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Demandes Reçues</h1>
              <p className="text-gray-600 mt-1">Gérez les demandes d'achat pour vos produits</p>
            </div>
            
            {pendingCount > 0 && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-xl font-semibold">
                <Clock className="w-5 h-5" />
                {pendingCount} demande{pendingCount > 1 ? 's' : ''} en attente
              </div>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {(['all', 'pending', 'accepted', 'rejected'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl font-medium transition whitespace-nowrap ${
                  filter === f
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f === 'all' && 'Toutes'}
                {f === 'pending' && 'En attente'}
                {f === 'accepted' && 'Acceptées'}
                {f === 'rejected' && 'Refusées'}
                {f !== 'all' && (
                  <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                    {requests.filter(r => r.status === f).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {filteredRequests.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl shadow-lg border border-gray-100">
              <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Package className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Aucune demande</h2>
              <p className="text-gray-600 mb-6">
                {filter === 'all' 
                  ? "Vous n'avez pas encore reçu de demande d'achat"
                  : `Aucune demande ${filter === 'pending' ? 'en attente' : filter === 'accepted' ? 'acceptée' : 'refusée'}`
                }
              </p>
              <Link
                href="/products/mine"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-semibold"
              >
                Voir mes produits
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className={`bg-white rounded-2xl shadow-lg border overflow-hidden ${
                    request.status === 'pending' ? 'border-amber-200' : 'border-gray-100'
                  }`}
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
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <User className="w-3 h-3" />
                              Acheteur: <span className="font-medium text-gray-700">{request.buyerName}</span>
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

                        {/* Buyer Contact Info */}
                        <div className="mt-3 flex flex-wrap gap-3 text-sm">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full text-gray-600">
                            <Phone className="w-3 h-3" />
                            {request.buyerPhone}
                          </span>
                          {request.buyer.email && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full text-gray-600">
                              {request.buyer.email}
                            </span>
                          )}
                        </div>
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
                              onClick={() => {
                                setRespondingId(request.id);
                                setExpandedId(request.id);
                              }}
                              className="p-2 bg-emerald-100 text-emerald-600 hover:bg-emerald-200 rounded-lg transition"
                              title="Accepter"
                            >
                              <Check className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Voulez-vous refuser cette demande ?')) {
                                  handleReject(request.id);
                                }
                              }}
                              className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition"
                              title="Refuser"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedId === request.id && (
                    <div className="px-6 pb-6 pt-2 border-t border-gray-100 bg-gray-50">
                      {/* Buyer Details */}
                      <h4 className="font-semibold text-gray-900 mb-3">Informations de l'acheteur</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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

                      {/* Response Form for pending requests */}
                      {request.status === 'pending' && respondingId === request.id && (
                        <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200">
                          <h4 className="font-semibold text-gray-900 mb-3">Répondre à la demande</h4>
                          <textarea
                            value={responseMessage}
                            onChange={(e) => setResponseMessage(e.target.value)}
                            placeholder="Message optionnel pour l'acheteur..."
                            rows={2}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 mb-3"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAccept(request.id)}
                              className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-medium flex items-center justify-center gap-2"
                            >
                              <Check className="w-4 h-4" />
                              Accepter
                            </button>
                            <button
                              onClick={() => handleReject(request.id)}
                              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-medium flex items-center justify-center gap-2"
                            >
                              <X className="w-4 h-4" />
                              Refuser
                            </button>
                            <button
                              onClick={() => {
                                setRespondingId(null);
                                setResponseMessage('');
                              }}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-medium"
                            >
                              Annuler
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Show response if already responded */}
                      {request.sellerResponse && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                          <p className="text-sm text-blue-700">
                            <strong>Votre réponse:</strong> {request.sellerResponse}
                          </p>
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
