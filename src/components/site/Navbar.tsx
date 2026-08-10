"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, ShoppingBag, User, Menu, Sun, Moon, Scale } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SearchDialog } from "@/components/site/SearchDialog";
import { useCompare } from "@/lib/compare";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/track", label: "Track Order" },
  { to: "/faq", label: "FAQ" },
] as const;

export function Navbar() {
  const { count, wishlist } = useStore();
  const { theme, toggle } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const compare = useCompare();
  const pathname = usePathname();

  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname?.startsWith(to));

  return (
    <>
      <div className="w-full bg-primary text-primary-foreground text-[11px] tracking-[0.2em] uppercase py-2 text-center">
        Complimentary shipping on orders over <span className="text-gold">₦250,000</span>
      </div>
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
        <div className="container-luxury flex h-16 items-center justify-between gap-4">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <nav className="mt-8 flex flex-col gap-1">
                {NAV.map((n) => (
                  <Link key={n.to} href={n.to} onClick={() => setMenuOpen(false)} className="py-3 text-lg font-display border-b border-border">
                    {n.label}
                  </Link>
                ))}
                <Link href="/account" onClick={() => setMenuOpen(false)} className="py-3 text-lg font-display border-b border-border">Account</Link>
                <Link href="/account/wishlist" onClick={() => setMenuOpen(false)} className="py-3 text-lg font-display border-b border-border">Wishlist</Link>
                <Link href="/compare" onClick={() => setMenuOpen(false)} className="py-3 text-lg font-display border-b border-border">Compare</Link>
                <Link href="/cart" onClick={() => setMenuOpen(false)} className="py-3 text-lg font-display border-b border-border">Cart</Link>
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2.5">
            <img src={BRAND.logo} alt={`${BRAND.name} logo`} className="h-10 w-10 rounded-full object-cover" />
            <span className="font-display text-xl tracking-[0.25em] font-bold leading-none">
              KOSISI<span className="block text-[9px] tracking-[0.4em] text-gold">WEARS</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 text-[13px] uppercase tracking-[0.18em]">
            {NAV.map((n) => (
              <Link
                key={n.to}
                href={n.to}
                className={cn(
                  "relative text-muted-foreground hover:text-foreground transition-colors",
                  isActive(n.to) && "text-foreground",
                )}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} aria-label="Search">
              <Search className="h-[18px] w-[18px]" />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
            </Button>
            <Link href="/compare" className="relative hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent" aria-label="Compare">
              <Scale className="h-[18px] w-[18px]" />
              {compare.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[10px] font-semibold text-gold-foreground">
                  {compare.length}
                </span>
              )}
            </Link>
            <Link href="/account/wishlist" className="relative inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent">
              <Heart className="h-[18px] w-[18px]" />
              {wishlist.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[10px] font-semibold text-gold-foreground">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link href="/cart" className="relative inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent">
              <ShoppingBag className="h-[18px] w-[18px]" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[10px] font-semibold text-gold-foreground">
                  {count}
                </span>
              )}
            </Link>
            <Link href="/account" className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent">
              <User className="h-[18px] w-[18px]" />
            </Link>
          </div>
        </div>
      </header>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
