"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Star, Eye, Scale } from "lucide-react";
import { useState } from "react";
import { formatPrice, useStore } from "@/lib/store";
import { productBadges, type Product } from "@/lib/products";
import { toggleCompare, useCompare } from "@/lib/compare";
import { cn } from "@/lib/utils";
import { QuickView } from "./QuickView";

export function ProductCard({ product, view = "grid" }: { product: Product; view?: "grid" | "list" }) {
  const { toggleWishlist, inWishlist, addToCart } = useStore();
  const wished = inWishlist(product.id);
  const compare = useCompare();
  const comparing = compare.includes(product.id);
  const badges = productBadges(product);
  const [qv, setQv] = useState(false);

  if (view === "list") {
    return (
      <div className="group grid grid-cols-[140px_minmax(0,1fr)] sm:grid-cols-[220px_minmax(0,1fr)] gap-6 border-b border-border pb-6">
        <Link href={`/product/${product.slug}`} className="relative aspect-4/5 overflow-hidden bg-secondary">
          <img src={product.images[0]} alt={product.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </Link>
        <div className="flex flex-col justify-between min-w-0">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{product.category}</p>
            <Link href={`/product/${product.slug}`} className="mt-1 block font-display text-xl truncate hover:text-gold">{product.name}</Link>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="h-3.5 w-3.5 fill-gold text-gold" />{product.rating} · {product.reviews} reviews
            </div>
            <p className="mt-3 text-sm text-muted-foreground line-clamp-2 max-w-lg">{product.description}</p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-lg">{formatPrice(product.price)}</span>
              {product.compareAt && <span className="text-sm text-muted-foreground line-through">{formatPrice(product.compareAt)}</span>}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setQv(true)} className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-gold">Quick View</button>
              <button onClick={() => toggleCompare(product.id)} className={cn("text-[11px] uppercase tracking-[0.2em] hover:text-gold", comparing ? "text-gold" : "text-muted-foreground")}>Compare</button>
              <button
                onClick={() => addToCart(product, product.sizes[0], product.colors[0].name)}
                className="text-[11px] uppercase tracking-[0.2em] border-b border-foreground pb-0.5 hover:text-gold hover:border-gold"
              >
                Add to Bag
              </button>
            </div>
          </div>
        </div>
        <QuickView product={product} open={qv} onOpenChange={setQv} />
      </div>
    );
  }

  return (
    <div className="group relative">
      <div className="relative aspect-4/5 overflow-hidden bg-secondary">
      <Link href={`/product/${product.slug}`} className="block absolute inset-0">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover:opacity-0 group-hover:scale-105"
        />
        <img
          src={product.images[1]}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        />
      </Link>
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {badges.map((b) => (
            <span key={b} className={cn(
              "text-[10px] uppercase tracking-[0.2em] px-2 py-1",
              b === "Sale" && "bg-destructive text-destructive-foreground",
              b === "Out of Stock" && "bg-muted text-muted-foreground",
              b === "Limited Edition" && "bg-gold text-gold-foreground",
              (b === "New" || b === "Best Seller") && "bg-background/90 text-foreground",
            )}>{b}</span>
          ))}
        </div>
        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <button
            onClick={() => toggleWishlist(product.id)}
            aria-label="Wishlist"
            className="h-9 w-9 grid place-items-center rounded-full bg-background/90 hover:bg-background transition-colors"
          >
            <Heart className={cn("h-4 w-4", wished && "fill-gold text-gold")} />
          </button>
          <button
            onClick={() => setQv(true)}
            aria-label="Quick view"
            className="h-9 w-9 grid place-items-center rounded-full bg-background/90 hover:bg-background opacity-0 group-hover:opacity-100 transition"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => toggleCompare(product.id)}
            aria-label="Compare"
            className="h-9 w-9 grid place-items-center rounded-full bg-background/90 hover:bg-background opacity-0 group-hover:opacity-100 transition"
          >
            <Scale className={cn("h-4 w-4", comparing && "text-gold")} />
          </button>
        </div>
        <button
          onClick={() => addToCart(product, product.sizes[0], product.colors[0].name)}
          disabled={!product.inStock}
          className="absolute inset-x-0 bottom-0 disabled:opacity-60 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-primary text-primary-foreground py-3 text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2"
        >
          <ShoppingBag className="h-3.5 w-3.5" /> {product.inStock ? "Quick Add" : "Sold Out"}
        </button>
      </div>
      <div className="pt-4">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{product.category}</p>
        <Link href={`/product/${product.slug}`} className="mt-1 block text-sm font-medium truncate hover:text-gold">
          {product.name}
        </Link>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-sm">{formatPrice(product.price)}</span>
          {product.compareAt && <span className="text-xs text-muted-foreground line-through">{formatPrice(product.compareAt)}</span>}
          <div className="ml-auto flex gap-1">
            {product.colors.slice(0, 3).map((c) => (
              <span key={c.name} className="h-2.5 w-2.5 rounded-full border border-border" style={{ backgroundColor: c.hex }} />
            ))}
          </div>
        </div>
      </div>
      <QuickView product={product} open={qv} onOpenChange={setQv} />
    </div>
  );
}