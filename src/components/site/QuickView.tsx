"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, Minus, Plus, Heart } from "lucide-react";
import { formatPrice, useStore } from "@/lib/store";
import type { Product } from "@/lib/products";
import { cn } from "@/lib/utils";

export function QuickView({ product, open, onOpenChange }: { product: Product; open: boolean; onOpenChange: (v: boolean) => void }) {
  const { addToCart, toggleWishlist, inWishlist } = useStore();
  const [size, setSize] = useState(product.sizes[0]);
  const [color, setColor] = useState(product.colors[0].name);
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <DialogTitle className="sr-only">{product.name}</DialogTitle>
        <div className="grid md:grid-cols-2">
          <div className="bg-secondary">
            <div className="aspect-[4/5] relative overflow-hidden">
              <img src={product.images[active]} alt={product.name} className="h-full w-full object-cover" />
            </div>
            <div className="grid grid-cols-4 gap-1 p-1">
              {product.images.map((src, i) => (
                <button key={i} onClick={() => setActive(i)} className={cn("aspect-square overflow-hidden border-2", active === i ? "border-gold" : "border-transparent")}>
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
          <div className="p-8 overflow-y-auto max-h-[85vh]">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{product.category}</p>
            <h2 className="font-display text-2xl mt-2">{product.name}</h2>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex">{[1,2,3,4,5].map(i => <Star key={i} className={cn("h-3.5 w-3.5", i <= Math.round(product.rating) ? "fill-gold text-gold" : "text-muted-foreground")} />)}</div>
              {product.rating} · {product.reviews} reviews
            </div>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-display text-2xl">{formatPrice(product.price)}</span>
              {product.compareAt && <span className="text-muted-foreground line-through">{formatPrice(product.compareAt)}</span>}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{product.description}</p>

            <div className="mt-6">
              <p className="text-[11px] uppercase tracking-[0.2em] mb-2">Color: <span className="text-muted-foreground normal-case tracking-normal">{color}</span></p>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <button key={c.name} onClick={() => setColor(c.name)} className={cn("h-8 w-8 rounded-full border-2", color === c.name ? "border-gold" : "border-border")} style={{ backgroundColor: c.hex }} aria-label={c.name} />
                ))}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-[11px] uppercase tracking-[0.2em] mb-2">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button key={s} onClick={() => setSize(s)} className={cn("h-10 min-w-10 px-3 text-sm border", size === s ? "border-gold bg-gold/10 text-gold" : "border-border hover:border-foreground")}>{s}</button>
                ))}
              </div>
            </div>
            <div className="mt-6 flex items-center gap-4">
              <div className="inline-flex items-center border border-border">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="h-10 w-10 grid place-items-center hover:bg-accent"><Minus className="h-4 w-4" /></button>
                <span className="w-10 text-center text-sm">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="h-10 w-10 grid place-items-center hover:bg-accent"><Plus className="h-4 w-4" /></button>
              </div>
              <Button className="flex-1 h-10 rounded-none uppercase tracking-[0.2em] text-[11px]" onClick={() => { addToCart(product, size, color, qty); onOpenChange(false); }}>
                Add to Bag
              </Button>
              <Button variant="outline" size="icon" className="h-10 w-10 rounded-none" onClick={() => toggleWishlist(product.id)}>
                <Heart className={cn("h-4 w-4", inWishlist(product.id) && "fill-gold text-gold")} />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}