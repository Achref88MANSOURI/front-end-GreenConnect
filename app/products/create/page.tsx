'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreateProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    vendeur: '',
    location: '',
    phoneNumber: '',
    category: 'Vegetables',
    image: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Support either 'token' or legacy 'access_token' keys
      const token = typeof window !== 'undefined'
        ? (localStorage.getItem('token') || localStorage.getItem('access_token'))
        : null;
      if (!token) {
        throw new Error('You must be logged in to create a product.');
      }
      // Basic client-side validation aligned with backend DTO
      const phoneRegex = /^\+?[0-9\s-]{7,15}$/;
      if (!phoneRegex.test(formData.phoneNumber)) {
        throw new Error('Invalid phone number format. Use e.g., +216 20 000 000');
      }
      if (!formData.location) {
        throw new Error('Location is required');
      }

      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', formData.price);
      if (formData.vendeur) data.append('vendeur', formData.vendeur);
      data.append('location', formData.location);
      data.append('phoneNumber', formData.phoneNumber);
      // Note: 'category' is not in the backend DTO, so we might skip it or add it if the backend is updated.
      // data.append('category', formData.category); 
      
      if (formData.image) {
        data.append('file', formData.image);
      }

      // Include JWT if backend requires authentication
      const response = await fetch('http://localhost:5000/products/upload', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: data,
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        throw new Error(`Failed to create product: ${response.status} ${response.statusText} ${errText}`);
      }

      const result = await response.json();
      console.log('Product created:', result);

      alert('Product uploaded successfully!');
      router.push('/marketplace');
    } catch (error) {
      console.error('Error creating product:', error);
      const msg = String(error);
      if (msg.includes('401')) {
        alert('Unauthorized. Please login again.');
        router.push('/login');
      } else {
        alert(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Post a New Product</h1>
          <p className="mt-2 text-gray-600">Share your harvest with the community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              name="title"
              id="title"
              required
              className="mt-1 block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
              placeholder="e.g., Organic Tomatoes"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          {/* Price & Contact Row */}
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (MAD)</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">MAD</span>
                </div>
                <input
                  type="number"
                  name="price"
                  id="price"
                  required
                  className="focus:ring-green-500 focus:border-green-500 block w-full pl-12 sm:text-sm border-gray-300 rounded-md py-3"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                id="phoneNumber"
                required
                className="mt-1 block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                placeholder="e.g., +216 20 000 000"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
          </div>
          {/* Seller & Location */}
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div>
              <label htmlFor="vendeur" className="block text-sm font-medium text-gray-700">Seller (Vendeur)</label>
              <input
                type="text"
                name="vendeur"
                id="vendeur"
                className="mt-1 block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                placeholder="e.g., Oasis Agro"
                value={formData.vendeur}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                id="location"
                required
                className="mt-1 block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                placeholder="e.g., Sfax"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          </div>

         

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="mt-1 block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
              placeholder="Describe your product..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Image</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-green-500 transition-colors">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                  >
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                {formData.image && (
                  <p className="text-sm text-green-600 font-semibold mt-2">
                    Selected: {formData.image.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-4">
            <Link
              href="/marketplace"
              className="px-6 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-8 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Posting...' : 'Post Product'}
            </button>
            {!isLoading && typeof window !== 'undefined' && !(localStorage.getItem('token') || localStorage.getItem('access_token')) && (
              <p className="text-sm text-red-600">You must be logged in to post a product.</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
