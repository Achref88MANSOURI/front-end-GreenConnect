import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { products } from '../../data/products';

type Props = {
  params: { id: string };
};

export default function ProductDetailsPage({ params }: Props) {
  const id = parseInt(params.id, 10);
  const product = products.find(p => p.id === id);

  // Produit non trouve
  if (!product) {
    return (
      <>
        <Header />
        <main className="max-w-4xl mx-auto p-6">
          <h2 className="text-2xl font-bold">Produit introuvable</h2>
          <p className="mt-4">Le produit demande n&apos;existe pas.</p>
          <Link href="/marketplace" className="mt-4 inline-block text-green-600 underline">Retour au catalogue</Link>
        </main>
        <Footer />
      </>
    );
  }

  // Affichage detaille produit
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-gray-100 h-64 flex items-center justify-center">
            {product.image ? (
              <Image src={product.image} alt={product.name} width={256} height={256} className="max-h-64 object-cover" />
            ) : (
              <div className="text-gray-500">No image</div>
            )}
          </div>
          <div className="md:col-span-2">
            <h1 className="text-3xl font-extrabold text-green-900">{product.name}</h1>
            <p className="text-2xl text-green-600 font-bold mt-2">{product.price}</p>
            <p className="text-sm text-gray-600 mt-1">📍 {product.location}</p>
            <p className="mt-4 text-gray-700">{product.description ?? 'Aucune description fournie.'}</p>
            <div className="mt-6 flex flex-col gap-2">
              {product.seller && <p><strong>Vendeur :</strong> {product.seller}</p>}
              {product.contact && (
                <p><strong>Contact :</strong> <a href={`tel:${product.contact}`} className="text-green-700 underline">{product.contact}</a></p>
              )}
              {product.stock !== undefined && product.unit && (
                <p><strong>Stock disponible :</strong> {product.stock} {product.unit}</p>
              )}
              {product.harvestDate && <p><strong>Date de recolte :</strong> {product.harvestDate}</p>}
              {product.certifications && (
                <p><strong>Certifications :</strong> {product.certifications.join(', ')}</p>
              )}
            </div>
            <div className="mt-6 flex space-x-3">
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg">Contact Seller</button>
              <Link href="/marketplace" className="px-4 py-2 border border-gray-200 rounded-lg">Retour au catalogue</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
