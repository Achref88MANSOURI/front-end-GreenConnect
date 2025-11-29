"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

export default function EditProductPage() {
  const { id } = useParams() as { id?: string };
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    image: null as File | null,
    imageUrl: '',
  });

  useEffect(() => {
    const numId = Number(id);
    if (!Number.isFinite(numId)) {
      setError('Identifiant de produit invalide');
      setLoading(false);
      return;
    }
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') || localStorage.getItem('access_token') : null;
    fetch(`http://localhost:5000/products/${encodeURIComponent(String(numId))}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      cache: 'no-store',
    })
      .then(async res => {
        if (res.ok) return res.json();
        const text = await res.text().catch(() => '');
        throw new Error(`Failed to fetch product: ${res.status} ${res.statusText} ${text}`);
      })
      .then(item => {
        setForm(f => ({
          ...f,
          title: item.title || '',
          description: item.description || '',
          price: String(item.price ?? ''),
          imageUrl: item.imageUrl ? `http://localhost:5000/uploads/${item.imageUrl}` : '',
        }));
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, [id]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm(prev => ({ ...prev, image: file }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const numId = Number(id);
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      if (!token) {
        alert('Vous devez être connecté pour modifier un produit.');
        router.push('/login');
        return;
      }

      // Build payload aligned with UpdateProductDto (partial of CreateProductDto)
      const payload = {
        title: form.title,
        description: form.description,
        price: Number(form.price),
      };

      const res = await fetch(`http://localhost:5000/products/${encodeURIComponent(String(numId))}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(`Échec de la mise à jour: ${res.status} ${res.statusText} ${txt}`);
      }

      alert('Produit mis à jour');
      router.push(`/products/${numId}`);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Erreur lors de la mise à jour');
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="max-w-4xl mx-auto p-6">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="max-w-4xl mx-auto p-6">
          <p className="text-red-600">{error}</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Modifier le produit</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Titre</label>
            <input name="title" value={form.title} onChange={onChange} className="mt-1 w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea name="description" value={form.description} onChange={onChange} className="mt-1 w-full border rounded p-2" rows={4} />
          </div>
          <div>
            <label className="block text-sm font-medium">Prix</label>
            <input type="number" name="price" value={form.price} onChange={onChange} className="mt-1 w-full border rounded p-2" />
          </div>

          <div>
            <label className="block text-sm font-medium">Image (optionnel)</label>
            <input type="file" accept="image/*" onChange={onFile} />
            {form.imageUrl && (
              <div className="mt-2">
                <img src={form.imageUrl} alt="image actuelle" className="h-24 object-cover rounded" />
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-4">
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Enregistrer</button>
            <button type="button" onClick={() => router.back()} className="px-4 py-2 border rounded">Annuler</button>
          </div>
        </form>
      </main>
      <Footer />
    </>
  );
}
