// components/ModuleCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

interface ModuleCardProps {
  title: string;
  description: string;
  // Nouvelles props pour l'image
  image: string; 
  alt: string; 
  ctaLink: string;
}

export default function ModuleCard({ title, description, image, alt, ctaLink }: ModuleCardProps) {
  return (
    <div className="group bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-500 ease-in-out transform hover:-translate-y-1 border-t-4 border-green-500">
      {/* Rendu de l'image du module avec effet de zoom au survol */}
      <div className="mb-6 mx-auto">
        {/* Fixed-size image to ensure uniform dimensions across cards */}
        {/* Using explicit width/height makes Next/Image render at same box size */}
        <div className="w-70 h-50 mx-auto overflow-hidden rounded-lg">
          <Image
            src={image}
            alt={alt}
            width={128}
            height={128}
            className="w-full h-full object-contain transition-transform duration-500 ease-in-out transform group-hover:scale-110"
          />
        </div>
      </div>

      {/* Centrage des textes pour correspondre à l'image centrée */}
      <h3 className="text-2xl font-bold mb-3 text-green-800 text-center">
        {title}
      </h3>
      <p className="text-gray-600 mb-6 text-center">
        {description}
      </p>
      <div className="text-center"> {/* Centrage du bouton CTA */}
        <Link 
          href={ctaLink} 
          className="inline-flex items-center text-green-600 font-semibold hover:text-green-800 transition duration-300"
        >
          Découvrir {title.split(' ')[0]} 
          <span className="ml-2">→</span>
        </Link>
      </div>
    </div>
  );
}