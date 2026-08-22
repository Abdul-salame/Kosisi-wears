"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { PackageSearch, Check, Truck, CreditCard, Clock, Home } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/site/EmptyState";
import { DeliveryChangeForm } from "@/components/site/DeliveryChangeForm";
import { findOrder, TRACK_STATUSES, TRACKED_ORDERS, type TrackedOrder } from "@/lib/tracking";
import { formatPrice } from "@/lib/store";
import { findPlacedOrder, type PlacedOrder } from "@/lib/placed-orders";
import { cn } from "@/lib/utils";

const ICONS = [Clock, CreditCard, PackageSearch, Truck, Home];

const PAYMENT_LABEL: Record<string, string> = { card: "card", paystack: "Paystack" };

function fromPlaced(o: PlacedOrder): TrackedOrder {
  const placed = new Date(o.placedAt);
  const fmt = (d: Date) => d.toLocaleString("en-US", { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
  const eta = new Date(placed.getTime() + (o.delivery === "express" ? 2 : 5) * 86400000);
  return {
    id: o.id,
    placed: placed.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
    customer: o.name || "Guest",
    status: "Processing",
    courier: o.delivery === "pickup" ? "Atelier pickup · Lagos" : "Pending assignment",
    tracking: "—",
    eta: eta.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
    items: o.items.map((i) => ({ name: i.name, qty: i.qty, price: i.price })),
    events: [
      { label: "Order placed", date: fmt(placed), note: "Order received" },
      { label: "Payment confirmed", date: fmt(placed), note: `Paid via ${PAYMENT_LABEL[o.payment] ?? o.payment}` },
      { label: "Processing", date: fmt(placed), note: "Being prepared at the atelier" },
    ],
  };
}

const lookupOrder = (id: string) => {
  const placed = findPlacedOrder(id.trim());
  return placed ? fromPlaced(placed) : findOrder(id);
};

export function TrackClient() {

  const orderParam = useSearchParams().get("order")?.slice(0, 20) ?? undefined;
  const [value, setValue] = useState(orderParam ?? "");
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderParam) return;
    setValue(orderParam);
    const found = lookupOrder(orderParam);
    setOrder(found ?? null);
    setError(found ? "" : "We couldn't find that order number. Check it and try again.");
  }, [orderParam]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const found = lookupOrder(value.slice(0, 20));
    if (!found) { setOrder(null); setError("We couldn't find that order number. Check it and try again."); return; }
    setError(""); setOrder(found);
  };

  const stepIndex = order ? TRACK_STATUSES.indexOf(order.status) : -1;

  return (
    <div className="container-luxury max-w-4xl py-16">
      <header className="text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Order tracking</p>
        <h1 className="mt-3 font-display text-4xl sm:text-6xl">Where is my order?</h1>
        <p className="mt-4 text-sm text-muted-foreground">Enter the order number from your confirmation email.</p>
      </header>

      <form onSubmit={submit} className="mx-auto mt-8 flex max-w-xl flex-col gap-2 sm:flex-row">
        <Input value={value} maxLength={20} onChange={(e) => setValue(e.target.value)} placeholder="e.g. KW-4X21K" className="h-12 rounded-none" />
        <Button type="submit" className="h-12 rounded-none px-8 text-[11px] uppercase tracking-[0.2em]">Track order</Button>
      </form>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Try a demo order: {TRACKED_ORDERS.map((o) => (
          <button key={o.id} onClick={() => setValue(o.id)} className="mx-1 underline hover:text-gold">{o.id}</button>
        ))}
      </p>

      {error && (
        <EmptyState className="mt-12" icon={PackageSearch} eyebrow="Not found" title="No order matches that number" description={error}>
          <Link href="/contact" className="border border-foreground px-6 py-3 text-[11px] uppercase tracking-[0.2em] hover:bg-foreground hover:text-background">Contact support</Link>
        </EmptyState>
      )}

      {order && (
        <div className="mt-12 border border-border">
          <div className="grid gap-4 border-b border-border p-6 sm:grid-cols-4">
            <div><p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Order</p><p className="mt-1 font-display text-lg">{order.id}</p></div>
            <div><p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Placed</p><p className="mt-1 font-display text-lg">{order.placed}</p></div>
            <div><p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Courier</p><p className="mt-1 font-display text-lg">{order.courier}</p></div>
            <div><p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">ETA</p><p className="mt-1 font-display text-lg">{order.eta}</p></div>
          </div>

          <div className="p-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              {TRACK_STATUSES.map((s, i) => {
                const Icon = ICONS[i];
                const done = i <= stepIndex;
                return (
                  <div key={s} className="flex flex-1 items-center gap-3 sm:flex-col sm:text-center">
                    <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-full border", done ? "border-gold bg-gold text-gold-foreground" : "border-border text-muted-foreground")}>
                      {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    </span>
                    <span className={cn("text-[11px] uppercase tracking-[0.2em]", done ? "text-foreground" : "text-muted-foreground")}>{s}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-8 border-t border-border p-6 md:grid-cols-2">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Tracking events</p>
              <ol className="mt-4 space-y-4">
                {order.events.slice().reverse().map((e, i) => (
                  <li key={i} className="border-l border-border pl-4">
                    <p className="text-sm font-medium">{e.label}</p>
                    <p className="text-xs text-muted-foreground">{e.date} · {e.note}</p>
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-xs text-muted-foreground">Tracking number: <span className="text-foreground">{order.tracking}</span></p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Items</p>
              <ul className="mt-4 space-y-3">
                {order.items.map((it) => (
                  <li key={it.name} className="flex justify-between border-b border-border pb-3 text-sm">
                    <span>{it.name} × {it.qty}</span>
                    <span>{formatPrice(it.price * it.qty)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-between font-display text-lg">
                <span>Total</span>
                <span>{formatPrice(order.items.reduce((a, b) => a + b.price * b.qty, 0))}</span>
              </div>
            </div>
          </div>

          {order.status !== "Delivered" && <DeliveryChangeForm orderId={order.id} />}
        </div>
      )}
    </div>
  );

}
