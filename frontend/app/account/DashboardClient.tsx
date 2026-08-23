"use client";

import { AccountLayout } from "@/components/site/AccountLayout";
import { Package, Heart, MapPin, CreditCard } from "lucide-react";
import { formatPrice, useStore } from "@/lib/store";

export function PageClient() {
  return (
    <AccountLayout>
      <Dashboard />
    </AccountLayout>
  );
}

function Dashboard() {
  const { cart, wishlist, subtotal } = useStore();
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Welcome back</p>
      <h1 className="font-display text-4xl mt-2">Ada.</h1>
      <p className="text-muted-foreground text-sm mt-2">Your private Kosisi concierge.</p>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Package, label: "Open orders", value: "2" },
          { icon: Heart, label: "Wishlist items", value: String(wishlist.length) },
          { icon: CreditCard, label: "Bag value", value: formatPrice(subtotal) },
          { icon: MapPin, label: "Saved addresses", value: "1" },
        ].map((s, i) => (
          <div key={i} className="border border-border p-6">
            <s.icon className="h-5 w-5 text-gold" />
            <p className="mt-4 text-2xl font-display">{s.value}</p>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="font-display text-2xl">Recent orders</h2>
        <div className="mt-4 border border-border divide-y divide-border">
          {[
            { id: "KW-4X21K", date: "Jan 12, 2026", total: 420, status: "Delivered" },
            { id: "KW-9F02P", date: "Dec 30, 2025", total: 285, status: "In transit" },
          ].map(o => (
            <div key={o.id} className="grid grid-cols-[1fr_auto] sm:grid-cols-4 gap-2 p-5 text-sm items-center">
              <div><p className="font-medium">{o.id}</p><p className="text-xs text-muted-foreground">{o.date}</p></div>
              <div className="hidden sm:block text-muted-foreground">3 items</div>
              <div className="hidden sm:block">{formatPrice(o.total)}</div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-gold">{o.status}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
