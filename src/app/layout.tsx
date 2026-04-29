import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Indescent Nails — Prothésiste ongulaire",
    template: "%s · Indescent Nails",
  },
  description:
    "Indescent Nails — Prise de rendez-vous en ligne pour vos prestations ongulaires. Pose, nail art, déposes et suppléments dans un univers calme et raffiné.",
  openGraph: {
    title: "Indescent Nails",
    description:
      "Réservez votre prochain rendez-vous chez Indescent Nails — pose, nail art, déposes.",
    locale: "fr_FR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        {children}
        <Toaster
          position="top-center"
          richColors
          toastOptions={{
            style: { fontFamily: "var(--font-inter)" },
          }}
        />
      </body>
    </html>
  );
}
