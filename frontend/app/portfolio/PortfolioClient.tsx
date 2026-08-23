"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { portfolio, portfolioCategories, type PortfolioCategory } from "@/lib/portfolio";

export function PortfolioClient() {
  const [active, setActive] = useState<PortfolioCategory | "All">("All");

  const filtered = useMemo(
    () => (active === "All" ? portfolio : portfolio.filter((p) => p.category === active)),
    [active]
  );

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[50vh] overflow-hidden">
        <img src="/lookbook.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative container-luxury min-h-[50vh] flex flex-col justify-center py-20 text-white">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Custom Work</p>
          <h1 className="mt-3 font-display text-5xl sm:text-7xl max-w-2xl">Our Work.</h1>
          <p className="mt-6 max-w-xl text-white/70">
            Club kits, corporate apparel, and event uniforms — each piece produced to order for a
            real client. These designs carry their owner&apos;s crest and aren&apos;t sold directly,
            but every one of them started as a conversation. Yours can too.
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="container-luxury pt-12">
        <div className="flex flex-wrap gap-2">
          {(["All", ...portfolioCategories] as const).map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={cn(
                "px-4 py-2 text-[11px] uppercase tracking-[0.2em] border transition-colors cursor-pointer",
                active === c
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-gold hover:text-gold"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="container-luxury py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((piece) => (
            <div key={piece.id} className="group">
              <div className="relative aspect-4/5 overflow-hidden bg-secondary">
                <img
                  src={piece.image}
                  alt={piece.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 bg-background/90 px-3 py-1 text-[10px] uppercase tracking-[0.2em]">
                  {piece.category}
                </span>
              </div>
              <p className="mt-4 font-display text-lg">{piece.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{piece.blurb}</p>
              <Link
                href={`/custom-order?ref=${encodeURIComponent(piece.title)}`}
                className="mt-2 inline-block text-[11px] uppercase tracking-[0.2em] text-gold hover:underline"
              >
                Order something like this →
              </Link>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-20">No pieces in this category yet.</p>
        )}
      </section>

      {/* CTA */}
      <section className="container-luxury pb-24">
        <div className="bg-primary text-primary-foreground p-10 sm:p-16 text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Commission Your Own</p>
          <h2 className="font-display text-3xl sm:text-5xl mt-3">Have a design in mind?</h2>
          <p className="mt-4 text-primary-foreground/70 max-w-lg mx-auto">
            Whether it&apos;s a club kit, corporate uniform, or a one-off event commission — tell us
            what you&apos;re picturing and we&apos;ll bring it to the atelier.
          </p>
          <Button asChild size="lg" className="mt-8 rounded-none h-12 px-8 text-[11px] uppercase tracking-[0.2em] bg-gold hover:bg-gold/90 text-gold-foreground">
            <Link href="/custom-order">Request a Custom Order <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
