import type { Metadata } from "next";
import { PageClient } from "./HomeClient";

export const metadata: Metadata = {
  title: "Kosisi — Luxury Sportswear & Streetwear Atelier",
  description: "Discover Kosisi: jerseys, hoodies, varsity jackets and more. Premium sportswear crafted in limited runs, finished with signature gold detailing.",
  openGraph: {
    title: "Kosisi — Luxury Sportswear Atelier",
    description: "Premium jerseys, hoodies, varsity jackets and caps — crafted in limited runs.",
  },
};

export default function Page() {
  return <PageClient />;
}
