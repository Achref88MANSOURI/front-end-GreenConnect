/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/investments/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { API_BASE_URL } from '@/src/api-config';

interface InvestmentProject {
    id: number;
    title: string;
    description: string;
    targetAmount: number;
    currentAmount: number;
    minimumInvestment: number;
    expectedROI: number;
    duration: number;
    category: string;
    location: string;
    status: string;
    images?: string[];
    owner: {
        id: number;
        name: string;
        email: string;
    };
    createdAt: string;
}

interface Investment {
    id: number;
    amount: number;
    investor: {
        id: number;
        name: string;
    };
    createdAt: string;
}

export default function InvestmentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [project, setProject] = useState<InvestmentProject | null>(null);
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [investmentAmount, setInvestmentAmount] = useState('');
    const [investLoading, setInvestLoading] = useState(false);
    const [investError, setInvestError] = useState('');
    const [investSuccess, setInvestSuccess] = useState('');
    const [showCelebration, setShowCelebration] = useState(false);

    useEffect(() => {
        fetchProjectDetails();
    }, [id]);

    const fetchProjectDetails = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/investments/projects/${id}`);
            if (!response.ok) {
                throw new Error('Projet non trouvé');
            }
            const data = await response.json();
            setProject(data);

            // Fetch investments for this project
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const invResponse = await fetch(`${API_BASE_URL}/investments/projects/${id}/investments`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    if (invResponse.ok) {
                        const invData = await invResponse.json();
                        setInvestments(invData);
                    }
                } catch (err) {
                    // Silently fail if investments can't be fetched
                }
            }
        } catch (err: any) {
            setError(err.message || 'Erreur lors du chargement du projet');
        } finally {
            setLoading(false);
        }
    };

    const handleInvest = async (e: React.FormEvent) => {
        e.preventDefault();
        setInvestLoading(true);
        setInvestError('');
        setInvestSuccess('');

        const token = localStorage.getItem('token');
        if (!token) {
            setInvestError('Vous devez être connecté pour investir');
            setInvestLoading(false);
            router.push('/login');
            return;
        }

        const amount = parseFloat(investmentAmount);
        if (isNaN(amount) || amount < (project?.minimumInvestment || 0)) {
            setInvestError(`Le montant minimum d'investissement est ${project?.minimumInvestment} TND`);
            setInvestLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/investments/invest`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    projectId: parseInt(id),
                    amount: amount,
                }),
            });

            if (!response.ok) {
                let serverMsg = 'Erreur lors de l\'investissement';
                try {
                    const errorData = await response.json();
                    serverMsg = errorData?.message || serverMsg;
                } catch {
                    const text = await response.text();
                    if (text) serverMsg = text;
                }
                throw new Error(serverMsg);
            }

            const investment = await response.json();
            setInvestSuccess('Investissement réalisé avec succès!');
            setShowCelebration(true);
            setInvestmentAmount('');
            
            // Refresh project details
            setTimeout(() => {
                fetchProjectDetails();
                setInvestSuccess('');
                setShowCelebration(false);
            }, 2000);
        } catch (err: any) {
            setInvestError(err.message || 'Erreur lors de l\'investissement');
        } finally {
            setInvestLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <main className="max-w-7xl mx-auto px-4 pt-24 pb-12">
                    <p className="text-center text-gray-800">Chargement...</p>
                </main>
                <Footer />
            </>
        );
    }

    if (error || !project) {
        return (
            <>
                <Header />
                <main className="max-w-7xl mx-auto px-4 pt-24 pb-12">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700 text-center">
                        {error || 'Projet non trouvé'}
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    const progress = (project.currentAmount / project.targetAmount) * 100;
    const remainingAmount = project.targetAmount - project.currentAmount;

    return (
        <>
            <Header />
            <main className="max-w-7xl mx-auto px-4 pt-24 pb-12">
                                {showCelebration && (
                                    <div className="fixed inset-0 z-50 pointer-events-none">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-xl border border-green-200">
                                                <div className="text-3xl">🎉</div>
                                                <div className="mt-2 text-green-800 font-bold text-lg text-center">Merci pour votre investissement !</div>
                                                <div className="mt-1 text-gray-800 text-sm text-center">Votre contribution aide à faire avancer l'agriculture durable.</div>
                                            </div>
                                        </div>
                                        {/* simple confetti */}
                                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                                            {[...Array(20)].map((_, i) => (
                                                <span key={i} className="absolute confetti">🎊</span>
                                            ))}
                                        </div>
                                        <style jsx>{`
                                            .confetti {
                                                animation: fall 2s ease-in infinite;
                                                left: ${Math.random() * 100}%;
                                                top: -10%;
                                                font-size: 22px;
                                            }
                                            @keyframes fall {
                                                0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
                                                20% { opacity: 1; }
                                                100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
                                            }
                                        `}</style>
                                    </div>
                                )}
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="mb-6 text-green-600 hover:text-green-700 font-semibold flex items-center gap-2"
                >
                    ← Retour aux projets
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            {/* Image Gallery */}
                            {project.images && project.images.length > 0 ? (
                                <div className="h-96 bg-gradient-to-r from-green-100 to-gray-100 flex items-center justify-center">
                                    <img 
                                        src={project.images[0]} 
                                        alt={project.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="h-96 bg-gradient-to-r from-green-100 to-gray-100 flex items-center justify-center text-green-700 text-xl font-semibold">
                                    {project.title}
                                </div>
                            )}

                            <div className="p-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h1 className="text-3xl font-extrabold text-green-900">
                                        {project.title}
                                    </h1>
                                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                        project.status === 'active' ? 'bg-green-100 text-green-700' :
                                        project.status === 'funded' ? 'bg-blue-100 text-blue-700' :
                                        'bg-gray-100 text-gray-700'
                                    }`}>
                                        {project.status === 'active' ? 'Actif' : 
                                         project.status === 'funded' ? 'Financé' : 
                                         'Fermé'}
                                    </span>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-gray-800 mb-6">
                                    <span>📍 {project.location}</span>
                                    <span>•</span>
                                    <span>🏷️ {project.category}</span>
                                    <span>•</span>
                                    <span>⏱️ {project.duration} mois</span>
                                </div>

                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-semibold text-gray-700">
                                            Progression du financement
                                        </span>
                                        <span className="text-sm font-bold text-green-700">
                                            {progress.toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                        <div 
                                            className="bg-green-600 h-4 rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min(progress, 100)}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-2 text-sm text-gray-800">
                                        <span>{project.currentAmount.toLocaleString()} TND collectés</span>
                                        <span>{project.targetAmount.toLocaleString()} TND objectif</span>
                                    </div>
                                </div>

                                <div className="prose max-w-none">
                                    <h2 className="text-xl font-bold text-green-800 mb-3">Description du Projet</h2>
                                    <p className="text-gray-700 whitespace-pre-line">{project.description}</p>
                                </div>

                                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-green-50 rounded-lg p-4 text-center">
                                        <div className="text-sm text-gray-800">ROI Attendu</div>
                                        <div className="text-2xl font-bold text-green-700">{project.expectedROI}%</div>
                                    </div>
                                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                                        <div className="text-sm text-gray-800">Inv. Minimum</div>
                                        <div className="text-2xl font-bold text-blue-700">{project.minimumInvestment.toLocaleString()}</div>
                                    </div>
                                    <div className="bg-purple-50 rounded-lg p-4 text-center">
                                        <div className="text-sm text-gray-800">Restant</div>
                                        <div className="text-2xl font-bold text-purple-700">{remainingAmount.toLocaleString()}</div>
                                    </div>
                                    <div className="bg-orange-50 rounded-lg p-4 text-center">
                                        <div className="text-sm text-gray-800">Investisseurs</div>
                                        <div className="text-2xl font-bold text-orange-700">{investments.length}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Investments */}
                        {investments.length > 0 && (
                            <div className="bg-white rounded-xl shadow-md p-8">
                                <h2 className="text-xl font-bold text-green-800 mb-4">Investissements Récents</h2>
                                <div className="space-y-3">
                                    {investments.slice(0, 5).map((inv) => (
                                        <div key={inv.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <div className="font-semibold text-gray-800">{inv.investor.name}</div>
                                                <div className="text-sm text-gray-500">
                                                    {new Date(inv.createdAt).toLocaleDateString('fr-FR')}
                                                </div>
                                            </div>
                                            <div className="text-lg font-bold text-green-700">
                                                {inv.amount.toLocaleString()} TND
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar - Investment Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                            <h2 className="text-2xl font-bold text-green-800 mb-4">Investir</h2>

                            {project.status !== 'active' ? (
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-800 text-center">
                                    Ce projet n&apos;accepte plus d&apos;investissements
                                </div>
                            ) : (
                                <>
                                    {investError && (
                                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                            {investError}
                                        </div>
                                    )}

                                    {investSuccess && (
                                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                                            {investSuccess}
                                        </div>
                                    )}

                                    <form onSubmit={handleInvest} className="space-y-4">
                                        <div>
                                            <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-2">
                                                Montant (TND)
                                            </label>
                                            <input
                                                type="number"
                                                id="amount"
                                                value={investmentAmount}
                                                onChange={(e) => setInvestmentAmount(e.target.value)}
                                                min={project.minimumInvestment}
                                                step="100"
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-600 text-gray-900"
                                                placeholder={`Min: ${project.minimumInvestment}`}
                                            />
                                            <p className="mt-2 text-sm text-gray-700">
                                                Minimum: {project.minimumInvestment.toLocaleString()} TND
                                            </p>
                                        </div>

                                        {investmentAmount && parseFloat(investmentAmount) >= project.minimumInvestment && (
                                            <div className="bg-green-50 rounded-lg p-4 space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-800">Investissement:</span>
                                                    <span className="font-semibold text-gray-800">
                                                        {parseFloat(investmentAmount).toLocaleString()} TND
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-800">ROI estimé ({project.expectedROI}%):</span>
                                                    <span className="font-bold text-green-700">
                                                        {(parseFloat(investmentAmount) * (project.expectedROI / 100)).toLocaleString()} TND
                                                    </span>
                                                </div>
                                                <div className="flex justify-between pt-2 border-t border-green-200">
                                                    <span className="text-gray-700 font-semibold">Retour total estimé:</span>
                                                    <span className="font-bold text-green-700">
                                                        {(parseFloat(investmentAmount) * (1 + project.expectedROI / 100)).toLocaleString()} TND
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={investLoading || remainingAmount === 0}
                                            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition shadow-md"
                                        >
                                            {investLoading ? 'Traitement...' : remainingAmount === 0 ? 'Objectif Atteint' : 'Investir Maintenant'}
                                        </button>

                                        <p className="text-xs text-gray-700 text-center">
                                            En investissant, vous acceptez nos conditions d&apos;utilisation
                                        </p>
                                    </form>

                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <h3 className="font-semibold text-gray-800 mb-3">À propos du propriétaire</h3>
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-xl">
                                                {project.owner.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-800">{project.owner.name}</div>
                                                <div className="text-sm text-gray-700">{project.owner.email}</div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
