// app/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import Header from './components/Header'; // Assurez-vous d'avoir ce composant
import Footer from './components/Footer'; // Assurez-vous d'avoir ce composant
import ModuleCard from './components/ModuleCard'; // Le composant ModuleCard corrigé
import TestimonialCard from './components/TestimonialCard'; // Assurez-vous d'avoir ce composant
import React from 'react';

// --- PLACEHOLDERS POUR LES ICÔNES (Supposons qu'ils sont des composants SVG) ---
// Ces composants doivent exister dans './components/icons/FeatureIcons'
const PriceTransparencyIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22h20L12 2zm1 14h-2v-2h2v2zm0-4h-2V8h2v4z"/></svg>;
const SecurityCheckIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 15.5l-3.5-3.5 1.5-1.5 2 2 4-4 1.5 1.5-5.5 5.5z"/></svg>;
const LocalSustainabilityIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.75L7.75 14.5l1.41-1.41L11 15.93l4.84-4.84 1.41 1.41-6.25 6.25z"/></svg>;


// --- DATA FOR CORE MODULES ---
const modulesData = [
  { 
    title: "Souk-Moussel (Marketplace)", 
    description: "Achetez et vendez des produits agricoles frais et des fournitures. Connectez-vous directement avec les acheteurs et les vendeurs, sans intermédiaires inutiles.", 
    image: "/images/module-marketplace.png", 
    alt: "Icône de marché et panier",
    ctaLink: "/marketplace" 
  },
  { 
    title: "Faza’et-Ard (Partage & Investissement)", 
    description: "Partagez l'équipement agricole inutilisé et explorez de nouvelles opportunités d'investissement durables dans le secteur agricole tunisien.", 
    image: "/images/module-investment.png", 
    alt: "Icône de tracteur et partage",
    ctaLink: "/investments" 
  },
  { 
    title: "Tawssel (Logistique)", 
    description: "Simplifiez la logistique en trouvant des transporteurs de confiance, en optimisant les itinéraires et en suivant vos envois en temps réel.", 
    image: "/images/module-logistics.png", 
    alt: "Icône de camion et logistique",
    ctaLink: "/carriers" 
  },
];

// --- DATA FOR FEATURES/BENEFITS ---
const featuresData = [
  { 
    icon: PriceTransparencyIcon,
    title: 'Transparence des Prix', 
    description: 'Accédez à des données de marché en temps réel pour des décisions de vente et d\'achat éclairées.',
  },
  { 
    icon: SecurityCheckIcon,
    title: 'Fiabilité et Sécurité', 
    description: 'Système d\'évaluation pour assurer des transactions sécurisées et des partenariats de confiance.',
  },
  { 
    icon: LocalSustainabilityIcon,
    title: 'Durabilité Locale', 
    description: 'Soutenez l\'agriculture locale en réduisant les chaînes d\'approvisionnement et l\'empreinte carbone.',
  },
];

// --- DATA FOR TESTIMONIALS ---
const testimonialsData = [
  {
    quote: "AgriConnect a transformé la façon dont nous vendons nos récoltes. Nous avons réduit nos coûts logistiques de 20%!",
    author: "Fatma B.",
    role: "Agricultrice à Béja",
  },
  {
    quote: "J'ai pu investir dans de nouvelles technologies grâce à une opportunité partagée sur Faza'et-Ard. Un véritable coup de pouce pour mon exploitation.",
    author: "Ahmed Z.",
    role: "Agri-entrepreneur",
  },
];


// --- HOMEPAGE COMPONENT ---
export default function HomePage() {
  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-white">
        
        {/* 1. Hero Section */}
        <section 
          className="relative h-[75vh] flex items-center bg-gray-900 overflow-hidden"
        >
          <Image
            src="/images/agriculture-tech-hero.jpg" 
            alt="Agriculture moderne tunisienne et technologie"
            fill 
            style={{ objectFit: 'cover' }}
            priority 
            className="transition-all duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-green-900 opacity-60"></div> 
          
          <div className="relative z-10 p-8 max-w-6xl mx-auto text-white text-left">
            <span className="text-md font-semibold text-green-300 uppercase tracking-widest mb-3 block">
                AgriConnect : L'avenir de l'Agri-Tech en Tunisie
            </span>
            <h1 className="text-6xl md:text-7xl font-extrabold mb-6 leading-tight">
              Devenez l'acteur de la <span className="text-green-400">Révolution Agricole</span> Tunisienne
            </h1>
            <p className="text-xl md:text-2xl mb-10 font-light max-w-2xl">
              Votre plateforme tout-en-un pour optimiser votre production, sécuriser vos transactions et investir durablement.
            </p>
            <Link 
              href="/signup" 
              className="inline-block bg-white text-green-700 px-10 py-4 text-lg font-bold rounded-lg hover:bg-gray-100 transition duration-300 shadow-2xl mr-4"
            >
              Démarrer Gratuitement &rarr;
            </Link>
             <Link 
              href="/about" 
              className="inline-block text-white border-2 border-white px-10 py-4 text-lg font-semibold rounded-lg hover:bg-white hover:text-green-700 transition duration-300"
            >
              Notre Mission
            </Link>
          </div>
        </section>

---

        {/* 2. Core Modules Section (Piliers de Croissance) avec image de fond */}
        <section className="relative py-24 px-4">
          {/* Background image placé en arrière-plan */}
          <img
            src="/images/image1.png"
            alt="Décor arrière-plan"
            className="absolute inset-0 w-full h-full object-cover opacity-30" 
          />

          <div className="max-w-7xl mx-auto relative z-10">
            <h2 className="text-4xl font-extrabold text-center mb-4 text-gray-900">
              Trois Piliers pour Votre Succès
            </h2>
            <p className="text-xl text-center text-gray-600 mb-16">
              Chaque module est conçu pour répondre aux défis spécifiques de l'agriculture locale.
            </p>
            <div className="grid lg:grid-cols-3 gap-10">
              {modulesData.map((module) => (
                <ModuleCard 
                  key={module.title} 
                  title={module.title} 
                  description={module.description} 
                  image={module.image} 
                  alt={module.alt}
                  ctaLink={module.ctaLink} 
                />
              ))}
            </div>
          </div>
        </section>

---

        {/* --- Separateur visuel --- */}
        <hr className="my-0 border-t border-gray-200 max-w-6xl mx-auto" />

        {/* 3. Features/Benefits Section (Affichage des icônes centré) */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-extrabold text-center mb-16 text-gray-900">
              Pourquoi choisir AgriConnect ?
            </h2>
            <div className="grid md:grid-cols-3 gap-12 text-center">
        {featuresData.map((feature) => {
          // Rend l'icône SVG
          const Icon = feature.icon;
          return (
            <div key={feature.title} className="p-6 bg-green-50 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
              {/* Le conteneur d'icône est centré via mx-auto */}
              <div className="w-24 h-24 mx-auto mb-4 text-green-700">
                <Icon className="w-24 h-24" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-green-800">{feature.title}</h3>
              <p className="text-gray-700">{feature.description}</p>
            </div>
          );
        })}
            </div>
          </div>
        </section>

---

        {/* 4. Statistics / Callout Section */}
        <section className="py-20 px-4 bg-green-700 text-white">
            <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-4xl font-extrabold mb-10">
                    Notre Impact en Chiffres
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="p-4">
                        <p className="text-5xl font-bold text-green-300">300+</p>
                        <p className="text-lg mt-2">Agriculteurs inscrits</p>
                    </div>
                    <div className="p-4">
                        <p className="text-5xl font-bold text-green-300">1.2M DT</p>
                        <p className="text-lg mt-2">Volume de transactions géré</p>
                    </div>
                    <div className="p-4">
                        <p className="text-5xl font-bold text-green-300">95%</p>
                        <p className="text-lg mt-2">Satisfaction des utilisateurs</p>
                    </div>
                </div>
            </div>
        </section>

---

        {/* 5. Testimonials Section avec image de fond */}
        <section className="relative py-24 px-4 bg-gray-50"> 
            
            {/* L'image de fond */}
            <img
              src="/images/image.png"
              alt="Décor arrière-plan témoignages"
              className="absolute inset-0 w-full h-full object-cover opacity-10" 
            />

            <div className="max-w-6xl mx-auto relative z-10">
                <h2 className="text-4xl font-extrabold text-center mb-16 text-gray-900">
                    Ce que disent nos utilisateurs
                </h2>
                <div className="grid md:grid-cols-2 gap-10">
                    {testimonialsData.map((testimonial, index) => (
                        <div key={index} className="p-8 bg-white rounded-lg shadow-xl border-t-4 border-green-500">
                            <blockquote className="italic text-xl text-gray-700 mb-4">
                                "{testimonial.quote}"
                            </blockquote>
                            <p className="font-bold text-green-700">{testimonial.author}</p>
                            <p className="text-sm text-gray-500">{testimonial.role}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

---

        {/* 6. Final Call to Action Section avec image de fond */}
        <section className="py-20 px-4">
          <div className="relative">
            <img
              src="/images/image.png"
              alt="Décor arrière-plan CTA"
              className="absolute inset-0 w-full h-full object-cover opacity-25"
            />

            <div className="max-w-4xl mx-auto text-center relative z-10 bg-green-800/80 rounded-xl p-8">
              <h2 className="text-4xl font-extrabold text-white mb-4">
                Prêt à Transformer Votre Exploitation ?
              </h2>
              <p className="text-xl text-green-200 mb-8">
                Rejoignez des centaines d'agriculteurs et d'investisseurs qui optimisent déjà leur potentiel avec AgriConnect.
              </p>
              <Link 
                href="/register" 
                className="inline-block bg-yellow-400 text-green-900 px-12 py-4 text-xl font-bold rounded-full hover:bg-yellow-500 transition duration-300 shadow-xl"
              >
                Inscrivez-vous Maintenant !
              </Link>
            </div>
          </div>
        </section>
        
      </main>
      
      <Footer />
    </>
  );
}