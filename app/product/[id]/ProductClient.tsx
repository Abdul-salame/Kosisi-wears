"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, Minus, Plus, Heart, Truck, RotateCcw, ShieldCheck, MessageCircle, Scale, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/site/ProductCard";
import { ProductGallery } from "@/components/site/ProductGallery";
import { ReviewsSection } from "@/components/site/ReviewsSection";
import { products, productBadges, variantStock, variantLabel, type Product } from "@/lib/products";
import { formatPrice, useStore } from "@/lib/store";
import { useTrackView, useRecentlyViewed } from "@/lib/recently-viewed";
import { toggleCompare, useCompare } from "@/lib/compare";
import { BRAND, whatsappLink } from "@/lib/brand";
import { cn } from "@/lib/utils";

export function ProductClient({ product }: { product: Product }) {
  const router = useRouter();

  const { addToCart, toggleWishlist, inWishlist } = useStore();
  const [size, setSize] = useState(product.sizes[0]);
  const [color, setColor] = useState(product.colors[0].name);
  const [qty, setQty] = useState(1);
  const wished = inWishlist(product.id);
  const compare = useCompare();
  const badges = productBadges(product);

  useTrackView(product.id);
  const recentIds = useRecentlyViewed();

  const stock = variantStock(product, size, color);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const recent = useMemo(
    () => recentIds.filter((id) => id !== product.id).map((id) => products.find((p) => p.id === id)).filter(Boolean).slice(0, 4) as Product[],
    [recentIds, product.id],
  );

  return (
    <div className="container-luxury py-8">
      <nav className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">Home</Link> / <Link href="/shop" className="hover:text-foreground">Shop</Link> /{" "}
        <Link href={{ pathname: "/shop", query: { cat: product.category } }} className="hover:text-foreground">{product.category}</Link> / <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10">
        <ProductGallery images={product.images} alt={product.name} />

        <div>
          <div className="flex flex-wrap gap-2">
            {badges.map((b) => (
              <span key={b} className={cn("text-[10px] uppercase tracking-[0.2em] px-2 py-1",
                b === "Sale" ? "bg-destructive text-destructive-foreground" :
                b === "Limited Edition" ? "bg-gold text-gold-foreground" :
                b === "Out of Stock" ? "bg-muted text-muted-foreground" : "border border-border")}>{b}</span>
            ))}
          </div>
          <p className="mt-3 text-[11px] uppercase tracking-[0.3em] text-gold">{product.category}</p>
          <h1 className="font-display text-3xl sm:text-4xl mt-2">{product.name}</h1>
          <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex">{[1,2,3,4,5].map(i => <Star key={i} className={cn("h-4 w-4", i <= Math.round(product.rating) ? "fill-gold text-gold" : "text-muted-foreground")} />)}</div>
            <span>{product.rating}</span><span>·</span><span>{product.reviews} reviews</span>
          </div>
          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-display text-3xl">{formatPrice(product.price)}</span>
            {product.compareAt && <span className="text-lg text-muted-foreground line-through">{formatPrice(product.compareAt)}</span>}
            {product.compareAt && <span className="text-xs uppercase tracking-[0.2em] bg-destructive text-destructive-foreground px-2 py-1">Save {formatPrice(product.compareAt - product.price)}</span>}
          </div>

          <p className="mt-6 text-sm text-muted-foreground leading-relaxed">{product.description}</p>

          <div className="mt-8">
            <p className="text-[11px] uppercase tracking-[0.2em] mb-3">Color / Design: <span className="text-muted-foreground normal-case tracking-normal">{color}</span></p>
            <div className="flex gap-2">
              {product.colors.map(c => (
                <button key={c.name} onClick={() => setColor(c.name)} className={cn("h-9 w-9 rounded-full border-2", color === c.name ? "border-gold" : "border-border")} style={{ backgroundColor: c.hex }} aria-label={c.name} />
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-[11px] uppercase tracking-[0.2em] mb-3">
              <span>Size</span>
              <Link href="/size-guide" className="text-muted-foreground hover:text-gold">Size Guide</Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(s => {
                const st = variantStock(product, s, color);
                return (
                  <button key={s} onClick={() => setSize(s)} disabled={st === 0}
                    className={cn("h-11 min-w-11 px-4 text-sm border transition-colors relative",
                      size === s ? "border-gold bg-gold/10 text-gold" : "border-border hover:border-foreground",
                      st === 0 && "opacity-40 line-through cursor-not-allowed")}>{s}</button>
                );
              })}
            </div>
            <p className={cn("mt-3 text-xs", stock === 0 ? "text-destructive" : stock <= 3 ? "text-gold" : "text-muted-foreground")}>
              {variantLabel(stock)} · {size} / {color}
            </p>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <div className="inline-flex items-center border border-border h-12">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="h-full w-12 grid place-items-center hover:bg-accent"><Minus className="h-4 w-4" /></button>
              <span className="w-10 text-center">{qty}</span>
              <button onClick={() => setQty(q => Math.min(Math.max(stock, 1), q + 1))} className="h-full w-12 grid place-items-center hover:bg-accent"><Plus className="h-4 w-4" /></button>
            </div>
            <Button disabled={stock === 0} onClick={() => addToCart(product, size, color, qty)} className="flex-1 h-12 rounded-none uppercase tracking-[0.2em] text-[11px]">
              {stock === 0 ? "Sold out" : "Add to Bag"}
            </Button>
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-none" onClick={() => toggleWishlist(product.id)} aria-label="Wishlist">
              <Heart className={cn("h-4 w-4", wished && "fill-gold text-gold")} />
            </Button>
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-none" onClick={() => toggleCompare(product.id)} aria-label="Compare">
              <Scale className={cn("h-4 w-4", compare.includes(product.id) && "text-gold")} />
            </Button>
          </div>
          <Button disabled={stock === 0} onClick={() => { addToCart(product, size, color, qty); router.push("/checkout"); }} variant="outline" className="w-full mt-3 h-12 rounded-none uppercase tracking-[0.2em] text-[11px] border-gold text-gold hover:bg-gold hover:text-gold-foreground">
            Buy Now
          </Button>

          <a
            href={whatsappLink(`Hi ${BRAND.name}, I'd like to ask about the ${product.name} (${size} / ${color}).`)}
            target="_blank" rel="noopener noreferrer"
            className="mt-3 flex h-12 w-full items-center justify-center gap-2 border border-border text-[11px] uppercase tracking-[0.2em] hover:border-gold hover:text-gold"
          >
            <MessageCircle className="h-4 w-4" /> Chat before buying
          </a>

          <div className="mt-8 grid grid-cols-3 gap-3 pt-6 border-t border-border">
            {[
              { Icon: Truck, label: "Free Shipping" },
              { Icon: RotateCcw, label: "30-day Returns" },
              { Icon: ShieldCheck, label: "Lifetime Repairs" },
            ].map(({ Icon, label }, i) => (
              <div key={i} className="text-center">
                <Icon className="h-5 w-5 mx-auto text-gold" />
                <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Tabs defaultValue="description" className="mt-16">
        <TabsList className="rounded-none bg-transparent border-b border-border w-full justify-start h-auto p-0">
          {["description","reviews","shipping"].map(v => (
            <TabsTrigger key={v} value={v} className="rounded-none border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:bg-transparent data-[state=active]:shadow-none text-[11px] uppercase tracking-[0.2em] px-6 py-3">
              {v}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="description" className="pt-8 max-w-3xl text-muted-foreground leading-relaxed space-y-4">
          <p>{product.description}</p>
          <ul className="space-y-1 text-sm">
            {["Heavyweight 420gsm brushed cotton","Hand-embroidered Kosisi crest with gold metallic thread","YKK Excella zippers with antique gold finish","Cut and sewn in limited runs of 300 pieces"].map((l) => (
              <li key={l} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />{l}</li>
            ))}
          </ul>
        </TabsContent>
        <TabsContent value="reviews" className="pt-8">
          <ReviewsSection productId={product.id} productName={product.name} />
        </TabsContent>
        <TabsContent value="shipping" className="pt-8 max-w-3xl text-sm text-muted-foreground space-y-3">
          <p><strong className="text-foreground">Complimentary shipping</strong> on orders over ₦250,000. Standard delivery 3–5 business days.</p>
          <p><strong className="text-foreground">Express</strong> available at checkout for 1–2 business day delivery worldwide.</p>
          <p><strong className="text-foreground">Returns</strong> accepted within 30 days on unworn pieces with tags attached.</p>
          <Link href="/delivery" className="inline-block border-b border-foreground text-[11px] uppercase tracking-[0.2em]">Full delivery information</Link>
        </TabsContent>
      </Tabs>

      {related.length > 0 && (
        <section className="mt-20">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold">You may also like</p>
          <h2 className="font-display text-3xl mt-2 mb-8">Related pieces</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {recent.length > 0 && (
        <section className="mt-20">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Recently viewed</p>
          <h2 className="font-display text-3xl mt-2 mb-8">Keep exploring</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
            {recent.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );

}
