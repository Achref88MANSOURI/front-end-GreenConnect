// app/contact/page.tsx

import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-20">
        {/* Hero Section */}
        <section className="bg-green-700 text-white py-16 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-extrabold mb-4">Contactez-Nous</h1>
            <p className="text-xl opacity-90">
              Nous sommes la pour vous aider. N&apos;hesitez pas a nous poser vos questions.
            </p>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-16 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-50 p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Envoyez-nous un Message</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                  <input 
                    type="text" 
                    placeholder="Votre nom" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    placeholder="Votre email" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sujet</label>
                  <input 
                    type="text" 
                    placeholder="Sujet de votre message" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea 
                    placeholder="Votre message..." 
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-green-600 text-white py-2 rounded-md font-bold hover:bg-green-700 transition"
                >
                  Envoyer
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Contact Info Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Autres Moyens de Nous Joindre</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-green-600 text-4xl mb-4">📞</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Telephone</h3>
                <p className="text-gray-600">+216 25 123 456</p>
              </div>
              <div className="text-center">
                <div className="text-green-600 text-4xl mb-4">📧</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600">support@agriconnect.tn</p>
              </div>
              <div className="text-center">
                <div className="text-green-600 text-4xl mb-4">📍</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Adresse</h3>
                <p className="text-gray-600">Tunis, Tunisie</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Questions Frequemment Posees</h2>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Comment puis-je creer un compte?</h3>
                <p className="text-gray-600">
                  Cliquez sur le bouton &quot;Inscription&quot; sur la page d&apos;accueil et remplissez les informations demandees.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Y a-t-il des frais pour l&apos;utilisation de la plateforme?</h3>
                <p className="text-gray-600">
                  Notre plateforme offre des services gratuits avec des options premium additionnelles. Consultez nos conditions pour plus de details.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Comment puis-je seller un produit?</h3>
                <p className="text-gray-600">
                  Une fois connecte, allez a la section &quot;Creer un Produit&quot; et remplissez les details de votre produit agricole.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
