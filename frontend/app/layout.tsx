import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/site/AppProviders";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kosisi — Luxury Sportswear Atelier",
  description:
    "Kosisi crafts luxury sportswear — jerseys, hoodies, varsity jackets and more — in limited runs, finished with signature gold detailing.",
  authors: [{ name: "Kosisi Wears" }],
  icons: { icon: "/favicon.png" },
  openGraph: {
    title: "Kosisi — Luxury Sportswear Atelier",
    description: "Luxury sportswear cut for the modern icon. Designed in-house, crafted in limited runs.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${playfair.variable} ${inter.variable}`}>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
