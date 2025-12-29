"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { API_BASE_URL } from '../../src/api-config';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Display states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    // Load user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        
        // Initialize display with local data first
        setName(userData.name || '');
        setEmail(userData.email || '');
        setPhone(userData.phoneNumber || '');
        setAddress(userData.address || '');
        setRole(userData.role || '');
        setPhotoPreview(userData.avatarUrl || null);

        // Fetch fresh data from server using the profile endpoint
        const token = userData.access_token || localStorage.getItem('token');

        if (token) {
          fetch(`${API_BASE_URL}/users/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
            .then(res => {
              if (res.ok) return res.json();
              throw new Error('Failed to fetch');
            })
            .then(serverData => {
              // Update state with server data
              setName(serverData.name || '');
              setPhone(serverData.phoneNumber || '');
              setAddress(serverData.address || '');
              setRole(serverData.role || '');
              if (serverData.avatarUrl) setPhotoPreview(serverData.avatarUrl);
              
              // Update local storage to keep it fresh (preserve token)
              const mergedUser = { ...userData, ...serverData };
              localStorage.setItem('user', JSON.stringify(mergedUser));
              setUser(mergedUser);
            })
            .catch(err => console.log("Could not fetch fresh data from server, using local cache.", err));
        }

      } catch (e) {
        console.error("Error parsing user data", e);
      }
    } else {
      router.push('/login');
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-green-700 px-8 py-10 text-center">
          <div className="relative inline-block">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden mx-auto flex items-center justify-center">
              {photoPreview ? (
                <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-gray-400">
                  {name ? name.charAt(0).toUpperCase() : 'U'}
                </span>
              )}
            </div>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-white">{name}</h1>
          <p className="text-green-100">{email}</p>
        </div>

        {/* Info Section */}
        <div className="px-8 py-8">
          <div className="flex justify-between items-center mb-6 border-b pb-2">
            <h2 className="text-xl font-semibold text-gray-800">Mon Profil</h2>
            <Link 
              href="/profile/edit" 
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition shadow-sm text-sm font-medium flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Modifier
            </Link>
          </div>
          <div className="flex flex-wrap gap-3 mb-6">
            <Link 
              href="/investments/mine" 
              className="px-4 py-2 border border-green-600 text-green-700 rounded-md hover:bg-green-50 transition text-sm font-medium"
            >
              📈 Mes Investissements
            </Link>
            <Link 
              href="/deliveries" 
              className="px-4 py-2 border border-green-600 text-green-700 rounded-md hover:bg-green-50 transition text-sm font-medium"
            >
              🚚 Mes Livraisons
            </Link>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Nom complet</label>
                <div className="text-gray-900 font-medium text-lg">{name || '-'}</div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                <div className="text-gray-900 font-medium text-lg">{email || '-'}</div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Téléphone</label>
                <div className="text-gray-900 font-medium text-lg">{phone || '-'}</div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Adresse</label>
                <div className="text-gray-900 font-medium text-lg">{address || '-'}</div>
              </div>
            </div>

            {/* Role Display */}
            <div>
               <label className="block text-sm font-medium text-gray-500 mb-1">Rôle</label>
               <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 capitalize">
                 {role || 'Utilisateur'}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
