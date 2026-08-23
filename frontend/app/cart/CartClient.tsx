"use client";

import Link from "next/link";
import { Minus, Plus, X, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/site/EmptyState";
import { CartSkeleton } from "@/components/site/Skeletons";
import { CouponField } from "@/components/site/CouponField";
import { RecentlyViewedRow } from "@/components/site/RecentlyViewedRow";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { useDiscount } from "@/lib/coupon";
import { formatPrice, useStore } from "@/lib/store";
import { products } from "@/lib/products";

export function CartClient() {
  const { cart, updateQty, removeItem, subtotal, shipping, total, hydrated } = useStore();
  const { discount } = useDiscount(subtotal);

  if (!hydrated) {
    return (
      <div className="container-luxury py-10">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Bag" }]} />
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Bag</p>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl">Shopping bag</h1>
        <div className="mt-10"><CartSkeleton /></div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container-luxury py-16">
        <EmptyState
          icon={ShoppingBag}
          eyebrow="Bag"
          title="Your bag is empty"
          description="Nothing here yet — start with a heavyweight hoodie or a hand-finished varsity jacket from the atelier."
        >
          <Button asChild className="h-12 rounded-none px-8 text-[11px] uppercase tracking-[0.2em]">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
          <Button asChild variant="outline" className="h-12 rounded-none px-8 text-[11px] uppercase tracking-[0.2em]">
            <Link href="/account/wishlist">View wishlist</Link>
          </Button>
        </EmptyState>
        <RecentlyViewedRow className="mt-20" />
      </div>
    );
  }

  return (
    <div className="container-luxury py-10">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Shop", to: "/shop" }, { label: "Bag" }]} />
      <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Bag</p>
      <h1 className="font-display text-4xl sm:text-5xl mt-2">Shopping bag</h1>

      <div className="mt-10 grid lg:grid-cols-[1fr_380px] gap-10">
        <div className="space-y-6">
          {cart.map((item) => {
            const p = products.find((x) => x.id === item.productId);
            if (!p) return null;
            return (
              <div key={item.id} className="grid grid-cols-[100px_minmax(0,1fr)_auto] sm:grid-cols-[140px_minmax(0,1fr)_auto] gap-4 sm:gap-6 border-b border-border pb-6">
                <Link href={`/product/${p.slug}`} className="aspect-[4/5] overflow-hidden bg-secondary">
                  <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
                </Link>
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{p.category}</p>
                  <Link href={`/product/${p.slug}`} className="mt-1 block font-display text-lg truncate hover:text-gold">{p.name}</Link>
                  <p className="mt-1 text-xs text-muted-foreground">Size: {item.size} · Color: {item.color}</p>
                  <div className="mt-4 inline-flex items-center border border-border">
                    <button onClick={() => updateQty(item.id, item.qty - 1)} className="h-9 w-9 grid place-items-center hover:bg-accent"><Minus className="h-3.5 w-3.5" /></button>
                    <span className="w-9 text-center text-sm">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)} className="h-9 w-9 grid place-items-center hover:bg-accent"><Plus className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button onClick={() => removeItem(item.id)} aria-label="Remove" className="text-muted-foreground hover:text-destructive"><X className="h-4 w-4" /></button>
                  <span className="font-display text-lg">{formatPrice(p.price * item.qty)}</span>
                </div>
              </div>
            );
          })}
          <Button asChild variant="ghost" className="rounded-none text-[11px] uppercase tracking-[0.2em]">
            <Link href="/shop">← Continue Shopping</Link>
          </Button>
        </div>

        <aside className="bg-secondary/50 border border-border p-6 h-fit lg:sticky lg:top-24">
          <h2 className="font-display text-2xl">Summary</h2>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
            {discount > 0 && (
              <div className="flex justify-between text-gold"><dt>Discount</dt><dd>−{formatPrice(discount)}</dd></div>
            )}
            <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd>{shipping === 0 ? "Complimentary" : formatPrice(shipping)}</dd></div>
            <div className="flex justify-between pt-4 border-t border-border font-display text-lg"><dt>Total</dt><dd>{formatPrice(total - discount)}</dd></div>
          </dl>
          <CouponField subtotal={subtotal} />
          <Button asChild className="w-full rounded-none mt-6 h-12 text-[11px] uppercase tracking-[0.2em]">
            <Link href="/checkout">Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
          <p className="mt-4 text-xs text-muted-foreground text-center">Taxes calculated at checkout. Free returns within 30 days.</p>
        </aside>
      </div>

      <RecentlyViewedRow className="mt-20" />
    </div>
  );
}