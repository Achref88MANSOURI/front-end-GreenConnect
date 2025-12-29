"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../../src/api-config';

export default function EditProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form states
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
        
        // Initialize form with local data first
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a local preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const token = user.access_token || localStorage.getItem('token');
      const updateData = {
        name,
        phoneNumber: phone,
        address,
        avatarUrl: photoPreview // Sending Base64 image string
      };

      // 1. Try to update Backend
      if (token) {
        try {
          const res = await fetch(`${API_BASE_URL}/users/profile`, {
            method: 'PATCH',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updateData)
          });
          
          if (!res.ok) {
             console.warn("Backend update failed, updating local only.");
             throw new Error("Failed to update profile on server");
          }
          
          // Get updated data from response
          const serverUpdatedData = await res.json();
          
          // Update local storage with server response
          const updatedUser = {
            ...user,
            ...serverUpdatedData
          };
          
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setUser(updatedUser);
          
          // Notify other components (Header) that user data changed
          window.dispatchEvent(new Event('storage'));
          
          setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
          
          // Redirect back to profile view after successful save
          setTimeout(() => {
            router.push('/profile');
          }, 1000);

        } catch (err) {
          console.warn("Backend connection failed.", err);
          setMessage({ type: 'error', text: 'Erreur lors de la mise à jour du profil sur le serveur.' });
        }
      } else {
         setMessage({ type: 'error', text: 'Vous devez être connecté pour modifier votre profil.' });
      }

    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur inattendue.' });
    } finally {
      setSaving(false);
    }
  };

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
            <label 
              htmlFor="photo-upload" 
              className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-100 transition"
              title="Changer la photo"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input id="photo-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-white">{name}</h1>
          <p className="text-green-100">{email}</p>
        </div>

        {/* Form Section */}
        <div className="px-8 py-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Modifier mon profil</h2>
          
          {message.text && (
            <div className={`mb-6 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-4 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            {/* Role Display (Read-only) */}
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
               <input
                 type="text"
                 value={role}
                 disabled
                 className="w-full px-4 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed capitalize"
               />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <button
                type="button"
                onClick={() => router.push('/profile')}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition shadow-md disabled:opacity-70 flex items-center"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enregistrement...
                  </>
                ) : 'Enregistrer les modifications'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
