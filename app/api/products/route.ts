import { NextResponse } from "next/server";

// ⚠️ Données temporaires en mémoire (remplacées plus tard par une vraie DB)
let products = [
  { id: 1, title: "Lampe LED Eco", price: 30 },
  { id: 2, title: "Chargeur Solaire", price: 60 }
];

// ==============================
// GET → Récupérer tous les produits
// ==============================
export async function GET() {
  return NextResponse.json(products, { status: 200 });
}

// ==============================
// POST → Ajouter un produit
// ==============================
export async function POST(request: Request) {
  try {
    // 1. Lire les données envoyées par le frontend
    const body = await request.json();
    const { title, price } = body;

    // 2. Vérification simple
    if (!title || !price) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    // 3. Créer le nouveau produit
    const newProduct = {
      id: Date.now(), // identifiant unique simple
      title,
      price
    };

    // 4. Ajouter à la liste
    products.push(newProduct);

    // 5. Réponse
    return NextResponse.json(
      { message: "Product created", product: newProduct },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 500 }
    );
  }
}
