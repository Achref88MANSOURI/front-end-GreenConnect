import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Protected from "./Protected";
import { ToastProvider } from "./components/ToastProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GreenConnect | Plateforme Agricole Tunisienne",
  description: "Plateforme numérique tunisienne pour un marché agricole équitable et connecté. Écosystème digital inclusif valorisant la production locale et l'innovation.",
  keywords: ["agriculture", "tunisie", "marketplace", "agri-tech", "logistique", "investissement", "greenconnect"],
  openGraph: {
    title: "GreenConnect | Plateforme Agricole Tunisienne",
    description: "Écosystème digital inclusif pour l'agriculture tunisienne.",
    type: "website",
    locale: "fr_TN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastProvider>
          <Protected>
            {children}
          </Protected>
        </ToastProvider>
      </body>
    </html>
  );
}
