"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, LayoutGrid, List, SlidersHorizontal, SearchX } from "lucide-react";
import { ProductCard } from "@/components/site/ProductCard";
import { products, isNewArrival, isBestSeller } from "@/lib/products";
import { EmptyState } from "@/components/site/EmptyState";
import { ProductGridSkeleton } from "@/components/site/Skeletons";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { cn } from "@/lib/utils";

const ALL_CATS = ["Jerseys","Hoodies","Sweatshirts","Varsity Jackets","Uniforms","Kaftans","Caps"] as const;
const ALL_SIZES = ["XS","S","M","L","XL","XXL"];
const ALL_COLORS = Array.from(new Map(products.flatMap(p => p.colors.map(c => [c.name, c])) ).values());
const PAGE_SIZE = 9;

export function ShopClient() {

  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";
  const initialCat = searchParams.get("cat") ?? undefined;
  const initialBadge = searchParams.get("badge") ?? undefined;
  const [q, setQ] = useState(initialQ);
  const [cats, setCats] = useState<string[]>(initialCat ? [initialCat] : []);
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [price, setPrice] = useState<[number, number]>([0, 500]);
  const [inStock, setInStock] = useState(false);
  const [badges, setBadges] = useState<string[]>(initialBadge ? [initialBadge] : []);
  const [sort, setSort] = useState("newest");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Keep filters in sync when the URL changes (nav / footer category links).
  useEffect(() => { setQ(initialQ); setPage(1); }, [initialQ]);
  useEffect(() => { setCats(initialCat ? [initialCat] : []); setPage(1); }, [initialCat]);
  useEffect(() => { setBadges(initialBadge ? [initialBadge] : []); setPage(1); }, [initialBadge]);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, [q, cats, sizes, colors, price, inStock, badges, sort]);

  const filtered = useMemo(() => {
    let list = products.filter(p =>
      (q === "" || p.name.toLowerCase().includes(q.toLowerCase())) &&
      (cats.length === 0 || cats.includes(p.category)) &&
      (sizes.length === 0 || p.sizes.some(s => sizes.includes(s))) &&
      (colors.length === 0 || p.colors.some(c => colors.includes(c.name))) &&
      p.price >= price[0] && p.price <= price[1] &&
      (!inStock || p.inStock) &&
      (badges.length === 0 || badges.some((b) =>
        (b === "New Arrivals" && isNewArrival(p)) ||
        (b === "Best Sellers" && isBestSeller(p)) ||
        (b === "On Sale" && !!p.compareAt)))
    );
    if (sort === "price-asc") list = [...list].sort((a,b)=>a.price-b.price);
    if (sort === "price-desc") list = [...list].sort((a,b)=>b.price-a.price);
    if (sort === "popular") list = [...list].sort((a,b)=>b.reviews-a.reviews);
    if (sort === "newest") list = [...list].reverse();
    return list;
  }, [q, cats, sizes, colors, price, inStock, sort, badges]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paged = filtered.slice((currentPage-1)*PAGE_SIZE, currentPage*PAGE_SIZE);

  const toggle = (val: string, list: string[], setter: (v: string[]) => void) => {
    setter(list.includes(val) ? list.filter(x => x !== val) : [...list, val]);
    setPage(1);
  };

  const Filters = (
    <div className="space-y-8">
      <div>
        <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold mb-3">Category</h4>
        <div className="space-y-2">
          {ALL_CATS.map(c => (
            <label key={c} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox checked={cats.includes(c)} onCheckedChange={() => toggle(c, cats, setCats)} />
              {c}
            </label>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold mb-3">Price · ₦{price[0]} – ₦{price[1]}</h4>
        <Slider value={price} onValueChange={(v) => { setPrice(v as [number, number]); setPage(1); }} min={0} max={500} step={10} />
      </div>
      <div>
        <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold mb-3">Size</h4>
        <div className="flex flex-wrap gap-2">
          {ALL_SIZES.map(s => (
            <button key={s} onClick={() => toggle(s, sizes, setSizes)} className={cn("h-9 min-w-9 px-3 text-xs border", sizes.includes(s) ? "border-gold text-gold" : "border-border hover:border-foreground")}>{s}</button>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold mb-3">Color</h4>
        <div className="flex flex-wrap gap-2">
          {ALL_COLORS.map(c => (
            <button key={c.name} onClick={() => toggle(c.name, colors, setColors)} title={c.name} className={cn("h-8 w-8 rounded-full border-2", colors.includes(c.name) ? "border-gold" : "border-border")} style={{ backgroundColor: c.hex }} />
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold mb-3">Highlights</h4>
        <div className="flex flex-wrap gap-2">
          {["New Arrivals", "Best Sellers", "On Sale"].map((b) => (
            <button key={b} onClick={() => toggle(b, badges, setBadges)} className={cn("px-3 py-1.5 text-xs border", badges.includes(b) ? "border-gold text-gold" : "border-border hover:border-foreground")}>{b}</button>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold mb-3">Availability</h4>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <Checkbox checked={inStock} onCheckedChange={(v) => { setInStock(!!v); setPage(1); }} /> In stock only
        </label>
      </div>
      <Button variant="outline" size="sm" className="rounded-none w-full" onClick={() => {
        setCats([]); setSizes([]); setColors([]); setPrice([0,500]); setInStock(false); setBadges([]); setQ(""); setPage(1);
      }}>Clear all</Button>
    </div>
  );

  return (
    <div className="container-luxury py-10">
      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          ...(cats.length === 1 ? [{ label: "Shop", to: "/shop" }, { label: cats[0] }] : [{ label: "Shop" }]),
        ]}
      />
      <header className="mb-8">
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Collection</p>
        <h1 className="font-display text-4xl sm:text-5xl mt-2">{cats.length === 1 ? cats[0] : badges.length === 1 ? badges[0] : "Shop All"}</h1>
        <p className="text-muted-foreground mt-2 text-sm">{filtered.length} pieces</p>
      </header>

      <div className="grid lg:grid-cols-[240px_1fr] gap-10">
        <aside className="hidden lg:block sticky top-24 self-start">{Filters}</aside>
        <div>
          <div className="flex flex-wrap items-center gap-3 border-y border-border py-3 mb-6">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search products…" className="pl-9 rounded-none border-0 shadow-none focus-visible:ring-0 bg-transparent" />
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-none lg:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-2" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <SheetTitle className="mb-6">Filters</SheetTitle>
                {Filters}
              </SheetContent>
            </Sheet>
            <Select value={sort} onValueChange={(v) => { setSort(v); setPage(1); }}>
              <SelectTrigger className="w-[180px] rounded-none border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="price-asc">Price: Low → High</SelectItem>
                <SelectItem value="price-desc">Price: High → Low</SelectItem>
              </SelectContent>
            </Select>
            <div className="hidden sm:flex border border-border">
              <button onClick={() => setView("grid")} className={cn("h-9 w-9 grid place-items-center", view === "grid" && "bg-primary text-primary-foreground")}><LayoutGrid className="h-4 w-4" /></button>
              <button onClick={() => setView("list")} className={cn("h-9 w-9 grid place-items-center", view === "list" && "bg-primary text-primary-foreground")}><List className="h-4 w-4" /></button>
            </div>
          </div>

          {loading ? (
            <ProductGridSkeleton count={9} />
          ) : paged.length === 0 ? (
            <EmptyState icon={SearchX} eyebrow="No results" title="Nothing matches those filters" description="Try a broader price range, fewer filters, or a different keyword.">
              <Button className="rounded-none h-11 px-6 text-[11px] uppercase tracking-[0.2em]" onClick={() => { setCats([]); setSizes([]); setColors([]); setPrice([0,500]); setInStock(false); setBadges([]); setQ(""); setPage(1); }}>Clear all filters</Button>
            </EmptyState>
          ) : view === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10">
              {paged.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="space-y-6">
              {paged.map(p => <ProductCard key={p.id} product={p} view="list" />)}
            </div>
          )}

          {pageCount > 1 && (
            <div className="mt-12 flex items-center justify-center gap-1">
              <Button variant="outline" size="sm" className="rounded-none" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>Prev</Button>
              {Array.from({ length: pageCount }).map((_, i) => (
                <button key={i} onClick={() => setPage(i+1)} className={cn("h-9 w-9 border text-sm", currentPage === i+1 ? "border-gold text-gold" : "border-border hover:border-foreground")}>{i+1}</button>
              ))}
              <Button variant="outline" size="sm" className="rounded-none" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>Next</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

}
