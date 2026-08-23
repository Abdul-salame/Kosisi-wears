import Link from "next/link";
import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { BRAND } from "@/lib/brand";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-background">
      <div className="container-luxury py-16 grid gap-12 md:grid-cols-2 lg:grid-cols-5">
        <div>
          <div className="flex items-center gap-3">
            <img src={BRAND.logo} alt={`${BRAND.name} logo`} className="h-12 w-12 rounded-full object-cover" />
            <div className="font-display text-xl tracking-[0.25em] font-bold leading-none">
              KOSISI<span className="block text-[9px] tracking-[0.4em] text-gold">WEARS</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">
            Luxury sportswear cut for the modern icon. Designed in-house, crafted in limited runs.
          </p>
          <div className="mt-6 flex gap-3">
            {[Instagram, Twitter, Facebook, Youtube].map((I, i) => (
              <a key={i} href="#" className="h-9 w-9 grid place-items-center rounded-full border border-border hover:border-gold hover:text-gold transition-colors">
                <I className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] font-semibold mb-4">Shop</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/shop" className="hover:text-foreground">All Products</Link></li>
            <li><Link href="/portfolio" className="hover:text-foreground">Custom Jerseys</Link></li>
            <li><Link href={{ pathname: "/shop", query: { cat: "Hoodies" } }} className="hover:text-foreground">Hoodies</Link></li>
            <li><Link href={{ pathname: "/shop", query: { cat: "Varsity Jackets" } }} className="hover:text-foreground">Varsity Jackets</Link></li>
            <li><Link href={{ pathname: "/shop", query: { cat: "Caps" } }} className="hover:text-foreground">Caps</Link></li>
            <li><Link href="/compare" className="hover:text-foreground">Compare</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/about" className="hover:text-foreground">About</Link></li>
            <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
            <li><Link href="/faq" className="hover:text-foreground">FAQ</Link></li>
            <li><Link href="/track" className="hover:text-foreground">Track Order</Link></li>
            <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-foreground">Terms & Conditions</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] font-semibold mb-4">Help</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/shipping" className="hover:text-foreground">Shipping Policy</Link></li>
            <li><Link href="/returns" className="hover:text-foreground">Returns &amp; Refunds</Link></li>
            <li><Link href="/size-guide" className="hover:text-foreground">Size Guide</Link></li>
            <li><Link href="/delivery" className="hover:text-foreground">Delivery Information</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] font-semibold mb-4">Newsletter</h4>
          <p className="text-sm text-muted-foreground mb-4">Early access to drops and private events.</p>
          <NewsletterForm />
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-luxury py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Kosisi Wears. All rights reserved.</p>
          <p>Designed with intention. Made to last.</p>
        </div>
      </div>
    </footer>
  );
}