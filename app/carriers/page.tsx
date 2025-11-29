// app/carriers/page.tsx

import Link from 'next/link';
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Données fictives pour les cartes de transporteurs
const dummyCarriers = [
  { id: 1, name: 'Transport Rapide Nord', vehicle: 'Camion plateau (12 tonnes)', rate: '150 TND/trajet', location: 'Béja', status: 'Disponible' },
  { id: 2, name: 'Logistique du Sud', vehicle: 'Camion frigorifique (5 tonnes)', rate: '220 TND/trajet', location: 'Sfax', status: 'Disponible' },
  { id: 3, name: 'Micro Fret Express', vehicle: 'Fourgonnette (1.5 tonne)', rate: '80 TND/trajet', location: 'Tunis', status: 'En Course' },
  { id: 4, name: 'Agri Route Pro', vehicle: 'Camion benne (18 tonnes)', rate: '300 TND/trajet', location: 'Kairouan', status: 'Disponible' },
];

// Composant réutilisable pour une carte de transporteur
const CarrierCard: React.FC<typeof dummyCarriers[0]> = ({ name, vehicle, rate, location, status }) => (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden border border-beige-200">
        <div className="h-40 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
            [Icône de {vehicle}] 
        </div>
        <div className="p-4">
            <h3 className="text-xl font-extrabold text-green-800 line-clamp-1">{name}</h3>
            <p className="text-sm font-semibold text-gray-700 mt-1">{vehicle}</p>
            <p className="text-lg font-bold text-green-600 mt-2">{rate} (Est.)</p>
            <p className="text-sm text-gray-500 mt-1">📍 {location}</p>
            
            <div className={`mt-3 text-sm font-semibold ${status === 'Disponible' ? 'text-green-500' : 'text-red-500'}`}>
                Statut: {status}
            </div>
            
            <Link href={`/carriers/${name.toLowerCase().replace(/ /g, '-')}`} 
                  className={`mt-4 block text-center py-2 rounded-lg font-bold transition ${status === 'Disponible' ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}>
                {status === 'Disponible' ? 'Réserver ce Transport' : 'Indisponible'}
            </Link>
        </div>
    </div>
);


// Composant principal de la page Transporteurs
export default function CarriersPage() {
  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-10 bg-white">
        
        {/* En-tête & Section CTA */}
        <div className="flex justify-between items-center border-b pb-4 mb-8">
            <h1 className="text-4xl font-extrabold text-green-900">
                Tawssel : Transporteurs Disponibles
            </h1>
            <Link 
                href="/carriers/propose" // Lien vers la page de proposition de service
                className="bg-green-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-md"
            >
                ➕ Proposer un Service de Transport
            </Link>
        </div>

        {/* Contenu Principal: Filtres + Grille de Transporteurs */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* 1. Barre Latérale de Filtrage */}
            <aside className="lg:col-span-1 bg-beige-50 p-6 rounded-xl border border-beige-200">
                <h2 className="text-xl font-bold mb-4 text-green-800">Filtrer les Transporteurs</h2>
                <div className="space-y-4 text-gray-700">
                    <div className="pt-2 border-t border-beige-200">
                        <label className="font-semibold block mb-2">Région de Départ</label>
                        <select className="w-full p-2 border rounded-md">
                            <option>Toutes les régions</option>
                            <option>Tunis</option>
                            <option>Sfax</option>
                            <option>Béja</option>
                            <option>Kairouan</option>
                        </select>
                    </div>
                    
                    <div className="pt-2 border-t border-beige-200">
                        <label className="font-semibold block mb-2">Type de Véhicule</label>
                        <select className="w-full p-2 border rounded-md">
                            <option>Tous types</option>
                            <option>Camion frigorifique</option>
                            <option>Camion plateau</option>
                            <option>Fourgonnette</option>
                        </select>
                    </div>

                    <div className="pt-2 border-t border-beige-200">
                        <label className="font-semibold block mb-2">Capacité Min. (tonnes)</label>
                        <input type="number" placeholder="5" className="w-full p-2 border rounded-md" min="1" />
                    </div>
                </div>
            </aside>
            
            {/* 2. Grille des Transporteurs */}
            <section className="lg:col-span-3">
                <p className="text-gray-600 mb-4">Affichage de 1 - {dummyCarriers.length} de {dummyCarriers.length} transporteurs</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {/* Rendu des cartes de transporteurs */}
                    {dummyCarriers.map(item => (
                        <CarrierCard key={item.id} {...item} />
                    ))}
                </div>
            </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
