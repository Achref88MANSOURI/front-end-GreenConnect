// components/FeatureHighlight.tsx
import React from 'react';

interface FeatureHighlightProps {
  icon: string;
  title: string;
  description: string;
}

export default function FeatureHighlight({ icon, title, description }: FeatureHighlightProps) {
  return (
    <div className="p-6 bg-green-50 rounded-xl shadow-md transition duration-300 text-center">
        <div className="text-5xl mb-4">{icon}</div>
        <h3 className="text-2xl font-bold mb-3 text-green-800">{title}</h3>
        <p className="text-gray-700">{description}</p>
    </div>
  );
}