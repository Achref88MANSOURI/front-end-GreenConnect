/* eslint-disable react/no-unescaped-entities */
// components/TestimonialCard.tsx
import React from 'react';

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
}

export default function TestimonialCard({ quote, author, role }: TestimonialCardProps) {
  return (
    <div className="p-8 bg-white rounded-lg shadow-xl border-t-4 border-green-500">
        <blockquote className="italic text-xl text-gray-700 mb-4">
            "**{quote}**"
        </blockquote>
        <div className="mt-6 border-t pt-4">
            <p className="font-bold text-green-700">{author}</p>
            <p className="text-sm text-gray-500">{role}</p>
        </div>
    </div>
  );
}