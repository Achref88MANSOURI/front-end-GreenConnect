export type Product = {
  id: number;
  name: string;
  price: string;
  location: string;
  image: string;
  description?: string;
  // Optional extended fields
  seller?: string;
  contact?: string; // phone or email
  stock?: number; // available quantity
  unit?: string; // unit for stock (e.g., kg, ton)
  harvestDate?: string; // ISO date or month/year
  certifications?: string[];
  createdAt?: string; // ISO datetime from backend
};

export const products: Product[] = [
  {
    id: 1,
    name: 'Premium Tunisian Dates (Deglet Nour)',
    price: '8 TND/kg',
    location: 'Tozeur',
    image: '/images/dates.jpg',
    description: 'High-quality hand-picked Deglet Nour dates from the oases of Tozeur. Carefully cleaned and sorted for premium grade. Suitable for retail and export; stored in climate-controlled facilities to preserve freshness.',
    seller: 'Oasis Agro Exports',
    contact: '+216 20 000 000 / sales@oasisagro.tn',
    stock: 1200,
    unit: 'kg',
    harvestDate: '2025-09',
    certifications: ['ISO 22000', 'Organic (in conversion)']
  },
  {
    id: 2,
    name: 'Organic Extra Virgin Olive Oil',
    price: '25 TND/Liter',
    location: 'Sfax',
    image: '/images/olive_oil.jpg',
    description: 'Cold-pressed extra virgin olive oil from Sfax region, certified organic.'
  },
  {
    id: 3,
    name: 'Fresh Tomatoes (Bulk Order)',
    price: '0.8 TND/kg',
    location: 'Cap Bon',
    image: '/images/tomatoes.jpg',
    description: 'Seasonal tomatoes available for bulk orders. Quality and freshness guaranteed.'
  },
  {
    id: 4,
    name: 'Certified Seed Potatoes',
    price: '500 TND/ton',
    location: 'Bizerte',
    image: '/images/potatoes.jpg',
    description: 'Certified seed potatoes for planting, high germination rate.'
  },
];

export default products;
