"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Scale, X, Star, Check, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/site/EmptyState";
import { products, variantStock } from "@/lib/products";
import { formatPrice, useStore } from "@/lib/store";
import { useCompare, toggleCompare, clearCompare } from "@/lib/compare";
import { cn } from "@/lib/utils";

export function PageClient() {
  const ids = useCompare();
  const { addToCart } = useStore();
  const items = ids.map((id) => products.find((p) => p.id === id)).filter(Boolean) as typeof products;

  if (items.length === 0) {
    return (
      <div className="container-luxury py-16">
        <EmptyState icon={Scale} eyebrow="Compare" title="Nothing to compare yet" description="Add up to four pieces from the shop and weigh them side by side — price, fabric, sizing and availability.">
          <Link href="/shop" className="bg-primary px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-primary-foreground hover:bg-gold hover:text-gold-foreground">Browse the collection</Link>
        </EmptyState>
      </div>
    );
  }

  const rows: { label: string; render: (p: (typeof products)[number]) => ReactNode }[] = [
    { label: "Price", render: (p) => <span className="font-display text-lg">{formatPrice(p.price)}</span> },
    { label: "Was", render: (p) => (p.compareAt ? <span className="line-through text-muted-foreground">{formatPrice(p.compareAt)}</span> : <Minus className="h-4 w-4 text-muted-foreground" />) },
    { label: "Category", render: (p) => p.category },
    { label: "Rating", render: (p) => <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-gold text-gold" />{p.rating} ({p.reviews})</span> },
    { label: "Sizes", render: (p) => p.sizes.join(" · ") },
    { label: "Colours", render: (p) => (
      <span className="flex gap-1">{p.colors.map((c) => <span key={c.name} title={c.name} className="h-4 w-4 rounded-full border border-border" style={{ backgroundColor: c.hex }} />)}</span>
    ) },
    { label: "Availability", render: (p) => p.inStock
      ? <span className="inline-flex items-center gap-1 text-gold"><Check className="h-4 w-4" />In stock ({variantStock(p, p.sizes[0], p.colors[0].name)} in {p.sizes[0]})</span>
      : <span className="text-destructive">Sold out</span> },
  ];

  return (
    <div className="container-luxury py-12">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Compare</p>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl">Side by side</h1>
          <p className="mt-2 text-sm text-muted-foreground">{items.length} of 4 pieces selected</p>
        </div>
        <Button variant="outline" className="rounded-none text-[11px] uppercase tracking-[0.2em]" onClick={clearCompare}>Clear all</Button>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr>
              <th className="w-32" />
              {items.map((p) => (
                <th key={p.id} className="p-3 align-top text-left">
                  <div className="relative">
                    <button onClick={() => toggleCompare(p.id)} aria-label="Remove" className="absolute right-1 top-1 grid h-7 w-7 place-items-center rounded-full bg-background/90 hover:bg-background"><X className="h-3.5 w-3.5" /></button>
                    <Link href={`/product/${p.slug}`}>
                      <img src={p.images[0]} alt={p.name} className="aspect-[4/5] w-full object-cover bg-secondary" />
                      <span className="mt-3 block font-display text-lg hover:text-gold">{p.name}</span>
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm">
            {rows.map((r, i) => (
              <tr key={r.label} className={cn("border-t border-border", i % 2 === 1 && "bg-secondary/30")}>
                <td className="p-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{r.label}</td>
                {items.map((p) => <td key={p.id} className="p-3 align-middle">{r.render(p)}</td>)}
              </tr>
            ))}
            <tr className="border-t border-border">
              <td />
              {items.map((p) => (
                <td key={p.id} className="p-3">
                  <Button disabled={!p.inStock} onClick={() => addToCart(p, p.sizes[0], p.colors[0].name)} className="h-11 w-full rounded-none text-[11px] uppercase tracking-[0.2em]">
                    {p.inStock ? "Add to bag" : "Sold out"}
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
