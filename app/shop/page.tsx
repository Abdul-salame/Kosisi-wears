import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopClient } from "./ShopClient";

export const metadata: Metadata = {
  title: "Shop All — Kosisi Wears",
  description: "Browse the full Kosisi collection: jerseys, hoodies, sweatshirts, varsity jackets, uniforms, kaftans and caps. Filter by size, color and price.",
  openGraph: {
    title: "Shop — Kosisi Wears",
    description: "The full Kosisi collection with advanced filters, sort and quick view.",
  },
};

export default function Page() {
  return (
    <Suspense>
      <ShopClient />
    </Suspense>
  );
}
