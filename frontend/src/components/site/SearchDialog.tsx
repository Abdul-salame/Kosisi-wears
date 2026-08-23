"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Clock, TrendingUp, X, SearchX } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/products";
import { formatPrice } from "@/lib/store";
import { recordSearch, useRecentSearches, clearRecentSearches, TRENDING_SEARCHES } from "@/lib/search-history";

export function SearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [q, setQ] = useState("");
  const router = useRouter();
  const recent = useRecentSearches();

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (term.length < 1) return [];
    return products
      .filter((p) => p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term))
      .slice(0, 6);
  }, [q]);

  const go = (slug: string) => {
    recordSearch(q);
    onOpenChange(false);
    setQ("");
    router.push(`/product/${slug}`);
  };

  const searchAll = (term: string) => {
    recordSearch(term);
    onOpenChange(false);
    setQ("");
    router.push(`/shop?q=${encodeURIComponent(term)}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-0 rounded-none p-0">
        <DialogTitle className="sr-only">Search products</DialogTitle>
        <div className="flex items-center gap-2 border-b border-border px-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            autoFocus
            value={q}
            maxLength={100}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && q.trim()) searchAll(q); }}
            placeholder="Search jerseys, hoodies, jackets…"
            className="h-14 border-0 text-base shadow-none focus-visible:ring-0"
          />
          {q && <button onClick={() => setQ("")} aria-label="Clear"><X className="h-4 w-4 text-muted-foreground" /></button>}
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4">
          {q.trim() === "" ? (
            <div className="space-y-6">
              {recent.length > 0 && (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground"><Clock className="h-3.5 w-3.5" /> Recent searches</p>
                    <button onClick={clearRecentSearches} className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-gold">Clear</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recent.map((r) => (
                      <button key={r} onClick={() => setQ(r)} className="border border-border px-3 py-1.5 text-xs hover:border-gold hover:text-gold">{r}</button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground"><TrendingUp className="h-3.5 w-3.5" /> Trending now</p>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_SEARCHES.map((t) => (
                    <button key={t} onClick={() => setQ(t)} className="border border-border px-3 py-1.5 text-xs hover:border-gold hover:text-gold">{t}</button>
                  ))}
                </div>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center">
              <SearchX className="mx-auto h-8 w-8 text-gold" strokeWidth={1.25} />
              <p className="mt-4 font-display text-xl">No results for "{q.slice(0, 40)}"</p>
              <p className="mt-2 text-sm text-muted-foreground">Try a different keyword, or browse the full collection.</p>
              <Button className="mt-6 h-11 rounded-none px-6 text-[11px] uppercase tracking-[0.2em]" onClick={() => searchAll("")}>Browse all products</Button>
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((p) => (
                <button key={p.id} onClick={() => go(p.slug)} className="flex w-full items-center gap-4 p-2 text-left hover:bg-accent">
                  <img src={p.images[0]} alt="" className="h-16 w-12 object-cover bg-secondary" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm">{p.name}</span>
                    <span className="block text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{p.category}</span>
                  </span>
                  <span className="text-sm">{formatPrice(p.price)}</span>
                </button>
              ))}
              <button onClick={() => searchAll(q)} className="mt-2 w-full border-t border-border pt-3 text-[11px] uppercase tracking-[0.2em] text-gold">
                See all results for "{q.slice(0, 30)}" →
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
