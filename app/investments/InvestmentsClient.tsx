"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_BASE_URL } from '../../src/api-config';

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  targetAmount: number;
  currentAmount: number;
  minimumInvestment: number;
  expectedROI: number;
  duration: number;
  status: string;
  images?: string[];
  owner: {
    id: number;
    name: string;
  };
}

export default function InvestmentsClient() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    fetch(`${API_BASE_URL}/investments/projects`)
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Failed to fetch projects');
      })
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredProjects = projects.filter(p => {
    if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (locationFilter && !p.location?.toLowerCase().includes(locationFilter.toLowerCase())) return false;
    if (categoryFilter && categoryFilter !== 'All' && p.category !== categoryFilter) return false;
    return true;
  });

  const calculateProgress = (raised: number, needed: number) => {
    return Math.min(100, Math.round((raised / needed) * 100));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-xl text-gray-800">Chargement des projets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Erreur: {error}
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar Filters */}
      <aside className="lg:col-span-1 bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h2 className="text-lg font-bold text-green-800 mb-4">Filtres</h2>
        <div className="space-y-4 text-gray-700">
          <div>
            <label className="block text-sm font-medium mb-2">Recherche</label>
            <input
              placeholder="Rechercher des projets"
              className="w-full p-2 border rounded-md placeholder-gray-600 text-gray-900"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Localisation</label>
            <input
              placeholder="ex: Sfax"
              className="w-full p-2 border rounded-md placeholder-gray-600 text-gray-900"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Catégorie</label>
            <select
              className="w-full p-2 border rounded-md"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">Toutes</option>
              <option value="Olives & Trees">Oliviers & Arbres</option>
              <option value="Greenhouse">Serre</option>
              <option value="Cold Storage">Stockage frigorifique</option>
              <option value="Renewables">Énergies renouvelables</option>
              <option value="Irrigation">Irrigation</option>
              <option value="Equipment">Équipement</option>
            </select>
          </div>
        </div>
      </aside>

      {/* Projects Grid */}
      <section className="lg:col-span-3">
        <div className="mb-4 text-gray-800">
          Affichage de {filteredProjects.length} projet{filteredProjects.length !== 1 ? 's' : ''}
        </div>
        {filteredProjects.length === 0 ? (
          <div className="text-center py-10 text-gray-700">
            Aucun projet ne correspond à vos critères.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => {
              const progress = calculateProgress(project.currentAmount, project.targetAmount);
              return (
                <div
                  key={project.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition border border-gray-200 overflow-hidden"
                >
                  <div className="h-40 bg-gradient-to-r from-green-100 to-gray-50 flex items-center justify-center text-green-700 font-semibold text-lg p-4 text-center">
                    {project.images && project.images.length > 0 ? (
                      <img
                        src={project.images[0]}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-sm">{project.title}</span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-green-800 truncate">{project.title}</h3>
                    <p className="text-sm text-gray-800 mt-1 line-clamp-2">
                      {project.description}
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <div className="text-xs text-gray-700">Objectif</div>
                        <div className="text-sm font-semibold text-green-700">
                          {project.targetAmount.toLocaleString()} TND
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-700">Min</div>
                        <div className="text-sm font-semibold">
                          {project.minimumInvestment.toLocaleString()} TND
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-700">ROI</div>
                        <div className="text-sm font-semibold text-green-700">
                          {project.expectedROI}%
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-700 mt-1">
                        Financé {progress}% • {project.location || 'Tunisie'}
                      </div>
                    </div>

                    <div className="mt-4 flex gap-3">
                      <Link
                        href={`/investments/${project.id}`}
                        className="flex-1 text-center py-2 rounded-md border border-green-600 text-green-600 hover:bg-green-50 text-sm font-semibold"
                      >
                        Voir Détails
                      </Link>
                      {project.status === 'active' && (
                        <Link
                          href={`/investments/${project.id}#invest`}
                          className="flex-1 text-center py-2 rounded-md bg-green-600 text-white hover:bg-green-700 text-sm font-semibold"
                        >
                          Investir
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </section>
  );
}
