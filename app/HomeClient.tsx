"use client";

import Link from "next/link";
import { ArrowRight, Truck, ShieldCheck, RotateCcw, Sparkles, Star, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/site/ProductCard";
import { RecentlyViewedRow } from "@/components/site/RecentlyViewedRow";
import { categories, featured, newArrivals, bestSellers, testimonials } from "@/lib/products";

export function PageClient() {
  return (
    <div>
{/* Hero */}
<section className="relative min-h-[85vh] overflow-hidden">
  <img src="/hero.jpg" alt="Kosisi campaign" width={1600} height={1000} className="absolute inset-0 h-full w-full object-cover" />
  <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/55 to-black/30" />
  <div className="relative container-luxury min-h-[85vh] flex flex-col justify-center py-24 px-4 sm:px-0">
    <p className="text-[11px] uppercase tracking-[0.3em] text-gold fade-up">Fall / Winter 2026</p>
    <h1 className="mt-4 font-display text-4xl sm:text-7xl lg:text-8xl leading-[0.95] text-white max-w-3xl fade-up">
      Cut for the<br/><span className="italic text-gold">modern icon.</span>
    </h1>
    <p className="mt-6 max-w-lg text-white/70 fade-up">
      Heavyweight jerseys, hand-finished varsity jackets, and monogram hoodies —
      crafted in limited runs from the Kosisi atelier.
    </p>
    <div className="mt-10 flex flex-col sm:flex-row gap-4 fade-up">
      <Button asChild size="lg" className="w-full sm:w-auto rounded-none h-12 px-8 text-[11px] uppercase tracking-[0.2em] bg-gold hover:bg-gold/90 text-gold-foreground">
        <Link href="/shop">Shop the Collection <ArrowRight className="ml-2 h-4 w-4" /></Link>
      </Button>
      <Button asChild size="lg" variant="outline" className="w-full sm:w-auto rounded-none h-12 px-8 text-[11px] uppercase tracking-[0.2em] bg-transparent border-white/40 text-white hover:bg-white hover:text-black">
        <Link href="/about">Our Story</Link>
      </Button>
    </div>
  </div>
</section>

      {/* Marquee */}
      <section className="border-y border-border bg-primary text-primary-foreground overflow-hidden">
        <div className="marquee-track flex whitespace-nowrap py-4 text-[11px] uppercase tracking-[0.3em]">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex shrink-0 items-center gap-12 pr-12">
              {["New Drop · Heritage Varsity","Free Shipping over ₦250,000","Handcrafted in Limited Runs","Signature Gold Detailing","Members-only Early Access"].map((t, i) => (
                <span key={i} className="flex items-center gap-12">{t}<span className="text-gold">✦</span></span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container-luxury py-20 sm:py-24 px-4 sm:px-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-10">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-gold mb-2">The Collection</p>
            <h2 className="font-display text-3xl sm:text-5xl">Shop by category</h2>
          </div>
          <Link href="/shop" className="inline-flex items-center justify-center text-[11px] uppercase tracking-[0.2em] hover:text-gold">View All →</Link>
        </div>
        <div className="flex sm:grid overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none -mx-4 px-4 sm:mx-0 sm:px-0 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 scrollbar-none">
          {categories.slice(0, 7).map((c) => (
            <Link
              key={c.name}
              href={{ pathname: "/shop", query: { cat: c.name } }}
              className="group relative aspect-4/5 overflow-hidden bg-secondary shrink-0 w-[62vw] sm:w-auto snap-start"
            >
              <img src={c.image} alt={c.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-linear-to from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="font-display text-xl text-white">{c.name}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/70 mt-1">Shop now →</p>
              </div>
            </Link>
          ))}
          <Link
            href="/shop"
            className="group relative aspect-3/4 overflow-hidden bg-gold text-gold-foreground grid place-items-center shrink-0 w-[62vw] sm:w-auto snap-start"
          >
            <div className="text-center p-6">
              <Sparkles className="h-6 w-6 mx-auto" />
              <p className="font-display text-xl mt-2">Explore All</p>
              <p className="text-[10px] uppercase tracking-[0.2em] mt-1">120+ Pieces</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured */}
      <ProductGrid title="Featured Products" eyebrow="Editor's Picks" products={featured} />

      {/* Lookbook banner */}
      <section className="relative">
        <div className="container-luxury py-20 px-4 sm:px-0 grid gap-10 lg:grid-cols-2 items-center">
          <div className="relative aspect-5/6 overflow-hidden rounded-4xl">
            <img src="/lookbook.jpg" alt="Kosisi lookbook" width={1600} height={900} loading="lazy" className="h-full w-full object-cover" />
          </div>
          <div className="text-center lg:text-left">
            <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Lookbook FW26</p>
            <h2 className="font-display text-4xl sm:text-6xl mt-3">Quiet luxury,<br/><span className="italic text-gold">loud presence.</span></h2>
            <p className="mt-6 text-muted-foreground max-w-md">
              Every piece is designed at our atelier and produced in runs under 300.
              Heavyweight cotton, hand-embroidered crests, and hardware finished in
              antique gold.
            </p>
            <Button asChild variant="outline" className="rounded-none mt-8 h-12 px-8 text-[11px] uppercase tracking-[0.2em]">
              <Link href="/shop">Discover the Drop</Link>
            </Button>
          </div>
        </div>
      </section>

      <ProductGrid title="New Arrivals" eyebrow="Just Landed" products={newArrivals} badge="New Arrivals" />
      <ProductGrid title="Best Sellers" eyebrow="The Icons" products={bestSellers} tinted badge="Best Sellers" />

      {/* Why Us */}
      <section className="container-luxury py-20 px-4 sm:px-0">
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold text-center">Why Kosisi</p>
        <h2 className="font-display text-3xl sm:text-5xl text-center mt-3">Made with intention.</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {[
            { icon: Truck, title: "Complimentary Shipping", body: "Free worldwide delivery on all orders over ₦250,000." },
            { icon: ShieldCheck, title: "Lifetime Craftsmanship", body: "Every seam guaranteed. Repairs on us, forever." },
            { icon: RotateCcw, title: "30-Day Returns", body: "Unworn pieces, effortless returns. No questions." },
            { icon: Sparkles, title: "Limited Runs", body: "Never more than 300 pieces per silhouette." },
          ].map((f, i) => (
            <div key={i} className="text-center">
              <div className="mx-auto h-12 w-12 grid place-items-center rounded-full border border-gold text-gold">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-secondary/50 py-20 px-4 sm:px-0">
        <div className="container-luxury">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold text-center">Client Word</p>
          <h2 className="font-display text-3xl sm:text-5xl text-center mt-3">Worn by the discerning.</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {testimonials.map((t, i) => (
              <blockquote key={i} className="bg-background border border-border p-8">
                <div className="flex gap-1 text-gold">{[1,2,3,4,5].map(x => <Star key={x} className="h-4 w-4 fill-gold" />)}</div>
                <p className="mt-4 font-display text-lg leading-relaxed">"{t.quote}"</p>
                <footer className="mt-6 text-sm">
                  <p className="font-medium">{t.name}</p>
                  <p className="text-muted-foreground text-xs">{t.role}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="container-luxury py-20 px-4 sm:px-0">
        <div className="relative overflow-hidden bg-primary text-primary-foreground p-8 sm:p-16 text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold">The List</p>
          <h2 className="font-display text-3xl sm:text-5xl mt-3">Join Kosisi Society.</h2>
          <p className="mt-4 text-primary-foreground/70 max-w-lg mx-auto">Early access to drops, private events, and 10% off your first order.</p>
          <form onSubmit={(e) => e.preventDefault()} className="mt-8 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <Input placeholder="Enter your email" className="rounded-none bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 h-12" />
            <Button type="submit" className="rounded-none h-12 px-8 bg-gold hover:bg-gold/90 text-gold-foreground text-[11px] uppercase tracking-[0.2em]">Subscribe</Button>
          </form>
        </div>
      </section>

      {/* Recently viewed */}
      <div className="container-luxury pb-20">
        <RecentlyViewedRow />
      </div>

      {/* Instagram */}
      <section className="container-luxury pb-20 px-4 sm:px-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-gold">@kosisi.atelier</p>
            <h2 className="font-display text-2xl sm:text-4xl mt-2">On the feed</h2>
          </div>
          <a href="#" className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] hover:text-gold">
            <Instagram className="h-4 w-4" /> Follow
          </a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {[...featured, ...newArrivals]
            .filter((product, index, all) => all.findIndex((item) => item.id === product.id) === index)
            .slice(0, 6)
            .map((p) => (
              <a key={p.id} href="#" className="group relative aspect-square overflow-hidden bg-secondary">
                <img src={p.images[0]} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 grid place-items-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Instagram className="h-5 w-5 text-white" />
                </div>
              </a>
            ))}
        </div>
      </section>
    </div>
  );
}

function ProductGrid({ title, eyebrow, products, tinted, badge }: { title: string; eyebrow: string; products: typeof featured; tinted?: boolean; badge?: string }) {
  return (
    <section className={tinted ? "bg-secondary/40 py-20" : "py-20"}>
      <div className="container-luxury">
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-gold mb-2">{eyebrow}</p>
            <h2 className="font-display text-3xl sm:text-5xl">{title}</h2>
          </div>
          <Link href={badge ? { pathname: "/shop", query: { badge } } : "/shop"} className="text-[11px] uppercase tracking-[0.2em] hover:text-gold">View All →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
          {products.slice(0, 8).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}
