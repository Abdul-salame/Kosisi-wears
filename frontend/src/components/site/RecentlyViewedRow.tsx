"use client";

import Link from "next/link";
import { useRecentlyViewed, clearRecentlyViewed } from "@/lib/recently-viewed";
import { products } from "@/lib/products";
import { formatPrice } from "@/lib/store";

export function RecentlyViewedRow({
  title = "Recently viewed",
  eyebrow = "Pick up where you left off",
  limit = 6,
  excludeId,
  className = "",
}: { title?: string; eyebrow?: string; limit?: number; excludeId?: string; className?: string }) {
  const ids = useRecentlyViewed();
  const items = ids
    .filter((id) => id !== excludeId)
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean)
    .slice(0, limit) as typeof products;

  if (items.length === 0) return null;

  return (
    <section className={className}>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold">{eyebrow}</p>
          <h2 className="mt-2 font-display text-2xl sm:text-4xl">{title}</h2>
        </div>
        <button onClick={clearRecentlyViewed} className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-gold">Clear</button>
      </div>
      <div className="grid grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-4 lg:grid-cols-6">
        {items.map((p) => (
          <Link key={p.id} href={`/product/${p.slug}`} className="group">
            <div className="aspect-[4/5] overflow-hidden bg-secondary">
              <img src={p.images[0]} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <p className="mt-3 truncate font-display text-sm group-hover:text-gold">{p.name}</p>
            <p className="text-xs text-muted-foreground">{formatPrice(p.price)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
