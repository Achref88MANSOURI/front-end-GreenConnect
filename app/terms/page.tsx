// app/terms/page.tsx

import Link from 'next/link';
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Conditions d&apos;Utilisation</h1>
          
          <div className="prose prose-green max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptation des Conditions</h2>
              <p className="text-gray-700 leading-relaxed">
                En utilisant AgriConnect, vous acceptez les presentes conditions d&apos;utilisation dans leur totalite. Si vous n&apos;acceptez pas ces conditions, veuillez cesser d&apos;utiliser la plateforme.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Utilisation de la Plateforme</h2>
              <p className="text-gray-700 leading-relaxed">
                Vous vous engagez a utiliser AgriConnect uniquement a des fins legales et conformes a nos conditions. Vous ne devez pas :
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mt-4">
                <li>Telecharger ou distribuer du contenu protege par droit d&apos;auteur</li>
                <li>Utiliser la plateforme pour du harcelement ou du spam</li>
                <li>Tenter d&apos;acceder a des donnees non autorisees</li>
                <li>Transmettre des virus ou logiciels malveillants</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Comptes Utilisateur</h2>
              <p className="text-gray-700 leading-relaxed">
                Vous etes responsable du maintien de la confidentialite de vos identifiants de connexion et de toute activite effectuee sous votre compte. AgriConnect ne peut pas etre tenue responsable des acces non autorise a votre compte.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Contenu Utilisateur</h2>
              <p className="text-gray-700 leading-relaxed">
                En telechargent du contenu sur AgriConnect, vous accordez une licence mondiale a AgriConnect pour utiliser, copier, modifier et distribuer ce contenu. Vous garantissez que vous possedez tous les droits necessaires sur le contenu soumis.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Limitation de Responsabilite</h2>
              <p className="text-gray-700 leading-relaxed">
                AgriConnect n&apos;est pas responsable des dommages indirects, accidentels ou consequentiels resultant de votre utilisation de la plateforme. Notre responsabilite totale ne depassera pas le montant que vous avez paye pour utiliser la plateforme.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Modification des Conditions</h2>
              <p className="text-gray-700 leading-relaxed">
                AgriConnect se reserve le droit de modifier ces conditions a tout moment. Les modifications entreront en vigueur des leur publication sur la plateforme. Votre utilisation continue de la plateforme apres les modifications constitue votre acceptation des nouvelles conditions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Resiliation</h2>
              <p className="text-gray-700 leading-relaxed">
                AgriConnect peut resilier votre compte a tout moment, pour quelque raison que ce soit, sans preavisation. Vous pouvez egalement resilier votre compte a tout moment en contactant notre support.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Loi Applicable</h2>
              <p className="text-gray-700 leading-relaxed">
                Ces conditions sont regies par les lois de la Tunisie. Tout litige decoulant de ces conditions sera soumis aux tribunaux competents de Tunis.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contactez-Nous</h2>
              <p className="text-gray-700 leading-relaxed">
                Si vous avez des questions concernant ces conditions, veuillez nous contacter a <strong>support@agriconnect.tn</strong>
              </p>
            </section>
          </div>

          <div className="mt-8 text-center">
            <Link 
              href="/" 
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition"
            >
              Retour a l&apos;Accueil
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
