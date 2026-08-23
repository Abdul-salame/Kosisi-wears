import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/products";
import { ProductClient } from "./ProductClient";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = getProduct(id);
  if (!p) {
    return { title: "Product not found — Kosisi Wears" };
  }
  return {
    title: `${p.name} — Kosisi Wears`,
    description: p.description,
    openGraph: {
      title: `${p.name} — Kosisi Wears`,
      description: p.description,
      images: [p.images[0]],
    },
    twitter: {
      images: [p.images[0]],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();
  return <ProductClient product={product} />;
}
