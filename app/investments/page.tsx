// app/investments/page.tsx

import Link from 'next/link';
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import InvestmentsClient from './InvestmentsClient';

export default function InvestmentsPage() {
    return (
        <>
            <Header />
            <main className="max-w-7xl mx-auto px-4 pt-24 pb-12">
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-extrabold text-green-900">
                                Faza&apos;et-Ard : Investissements Agricoles
                            </h1>
                            <p className="mt-2 text-gray-600">
                                Soutenez des projets agricoles tunisiens et obtenez des retours prévisibles.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link 
                                href="/investments/create" 
                                className="px-5 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition shadow-md"
                            >
                                ➕ Créer un Projet
                            </Link>
                            <Link 
                                href="/investments/mine" 
                                className="px-5 py-3 border border-green-600 text-green-700 rounded-lg font-semibold hover:bg-green-50 transition"
                            >
                                📈 Mes Investissements
                            </Link>
                        </div>
                    </div>
                </div>

                <InvestmentsClient />
            </main>
            <Footer />
        </>
    );
}
