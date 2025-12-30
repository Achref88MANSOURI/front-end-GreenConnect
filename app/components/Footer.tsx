/* eslint-disable react/no-unescaped-entities */
// app/components/Footer.tsx

import Link from 'next/link';
import React from 'react';
import NewsletterForm from './NewsletterForm';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-t from-green-900 via-green-800 to-green-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand + Short */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-green-900 font-bold">GC</div>
            <div>
              <h3 className="text-2xl font-extrabold">GreenConnect</h3>
              <p className="text-sm text-green-200">Lier les acteurs de l'agriculture tunisienne.</p>
            </div>
          </div>

          <p className="text-sm text-green-100">Connectez, vendez et investissez localement. Platforme pour la croissance durable.</p>

          <div className="flex items-center space-x-3">
            <a href="mailto:support@greenconnect.tn" className="text-sm text-green-200 hover:underline">support@greenconnect.tn</a>
            <span className="text-green-600">•</span>
            <a href="tel:+21620000000" className="text-sm text-green-200 hover:underline">+216 20 000 000</a>
          </div>

          <div className="flex items-center space-x-3 mt-4">
            {/* Social icons (inline SVG) */}
            <a href="#" aria-label="Twitter" className="p-2 rounded-md bg-green-800 hover:bg-green-700 transition">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 19c7.333 0 11.333-6.333 11.333-11.833 0-.18 0-.36-.012-.539A8.182 8.182 0 0 0 20 5.5a8.05 8.05 0 0 1-2.357.646 4.06 4.06 0 0 0 1.778-2.24 8.112 8.112 0 0 1-2.57.98A4.06 4.06 0 0 0 10.5 8.5c0 .318.036.627.104.922A11.523 11.523 0 0 1 4.5 6.5a4.03 4.03 0 0 0-.55 2.042c0 1.41.72 2.655 1.817 3.38a4.03 4.03 0 0 1-1.84-.506v.05c0 1.97 1.37 3.613 3.183 3.99a4.07 4.07 0 0 1-1.835.07c.517 1.58 2.02 2.727 3.795 2.76A8.166 8.166 0 0 1 4 18.5 11.5 11.5 0 0 0 8 19z"/></svg>
            </a>
            <a href="#" aria-label="Facebook" className="p-2 rounded-md bg-green-800 hover:bg-green-700 transition">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.88v-6.99H7.898v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.63.772-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.99C18.343 21.128 22 16.991 22 12z"/></svg>
            </a>
            <a href="#" aria-label="LinkedIn" className="p-2 rounded-md bg-green-800 hover:bg-green-700 transition">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v14H0V8zm7.5 0h4.5v2h.06c.63-1.2 2.17-2.46 4.43-2.46C22.5 7.54 24 9.98 24 13.72V22h-5v-7.02c0-1.67-.03-3.82-2.33-3.82-2.33 0-2.69 1.82-2.69 3.7V22H7.5V8z"/></svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-1">
          <h4 className="font-bold text-lg mb-4 text-green-200">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/marketplace" className="hover:underline">Souk-Moussel</Link></li>
            <li><Link href="/investments" className="hover:underline">Faza’et-Ard</Link></li>
            <li><Link href="/carriers" className="hover:underline">Tawssel</Link></li>
            <li><Link href="/about" className="hover:underline">About</Link></li>
          </ul>
        </div>

        {/* Newsletter / CTA */}
        <div className="md:col-span-2">
          <h4 className="font-bold text-lg mb-4 text-green-200">Restez informé</h4>
          <p className="text-sm text-green-100 mb-4">Recevez des mises à jour sur les marchés, les opportunités d'investissement et les nouvelles fonctionnalités.</p>
          {/* NewsletterForm is a Client Component to handle event handlers */}
          <NewsletterForm />

          <div className="mt-6 text-sm text-green-200">Trusted by <span className="font-bold text-white">300+</span> farmers & partners</div>
        </div>
      </div>

      <div className="border-t border-green-800/60 mt-6">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between text-sm text-green-200">
          <div>© {new Date().getFullYear()} GreenConnect — Tous droits réservés.</div>
          <div className="flex items-center space-x-4 mt-3 md:mt-0">
            <Link href="/privacy" className="hover:underline">Privacy</Link>
            <Link href="/terms" className="hover:underline">Terms</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;