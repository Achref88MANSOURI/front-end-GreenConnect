import { TrendingUp, ShieldCheck, Leaf } from 'lucide-react';

export const modulesData = [
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

export const featuresData = [
  { 
    icon: TrendingUp,
    title: 'Transparence des Prix', 
    description: 'Accédez à des données de marché en temps réel pour des décisions de vente et d\'achat éclairées.',
  },
  { 
    icon: ShieldCheck,
    title: 'Fiabilité et Sécurité', 
    description: 'Système d\'évaluation pour assurer des transactions sécurisées et des partenariats de confiance.',
  },
  { 
    icon: Leaf,
    title: 'Durabilité Locale', 
    description: 'Soutenez l\'agriculture locale en réduisant les chaînes d\'approvisionnement et l\'empreinte carbone.',
  },
];

export const testimonialsData = [
  {
    quote: "GreenConnect a transformé la façon dont nous vendons nos récoltes. Nous avons réduit nos coûts logistiques de 20%!",
    author: "Fatma B.",
    role: "Agricultrice à Béja",
  },
  {
    quote: "J'ai pu investir dans de nouvelles technologies grâce à une opportunité partagée sur Faza'et-Ard. Un véritable coup de pouce pour mon exploitation.",
    author: "Ahmed Z.",
    role: "Agri-entrepreneur",
  },
];
