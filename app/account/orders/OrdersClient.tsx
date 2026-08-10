"use client";

import Link from "next/link";
import { AccountLayout } from "@/components/site/AccountLayout";
import { useEffect, useState } from "react";
import { Package } from "lucide-react";
import { EmptyState } from "@/components/site/EmptyState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/store";
import { usePlacedOrders } from "@/lib/placed-orders";

const MOCK_ORDERS = [
  { id: "KW-4X21K", date: "Jan 12, 2026", total: 420, status: "Delivered", items: 3 },
  { id: "KW-9F02P", date: "Dec 30, 2025", total: 285, status: "In transit", items: 2 },
  { id: "KW-1B77Q", date: "Nov 04, 2025", total: 610, status: "Delivered", items: 4 },
  { id: "KW-7C99M", date: "Oct 21, 2025", total: 180, status: "Cancelled", items: 1 },
];

const ROW = "grid grid-cols-[1fr_auto] sm:grid-cols-[1.2fr_1fr_1fr_1fr_auto] gap-4 p-5 items-center";

function OrdersSkeleton() {
  return (
    <div className="mt-8 border border-border">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className={`${ROW} border-b border-border last:border-0`}>
          <div className="space-y-2"><Skeleton className="h-4 w-24 rounded-none" /><Skeleton className="h-3 w-20 rounded-none" /></div>
          <Skeleton className="hidden h-3 w-16 rounded-none sm:block" />
          <Skeleton className="hidden h-4 w-16 rounded-none sm:block" />
          <Skeleton className="hidden h-3 w-20 rounded-none sm:block" />
          <Skeleton className="h-8 w-16 rounded-none" />
        </div>
      ))}
    </div>
  );
}

function Orders() {
  const [loading, setLoading] = useState(true);
  const placed = usePlacedOrders();
  const ORDERS = [
    ...placed.map((o) => ({
      id: o.id,
      date: new Date(o.placedAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      total: o.total,
      status: "Processing",
      items: o.items.reduce((n, i) => n + i.qty, 0),
    })),
    ...MOCK_ORDERS,
  ];
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl">My Orders</h1>

      {loading ? (
        <OrdersSkeleton />
      ) : ORDERS.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon={Package}
          eyebrow="Orders"
          title="No orders yet"
          description="When you place an order it will appear here with live tracking and invoices."
        >
          <Button asChild className="h-12 rounded-none px-8 text-[11px] uppercase tracking-[0.2em]">
            <Link href="/shop">Shop the collection</Link>
          </Button>
        </EmptyState>
      ) : (
        <div className="mt-8 border border-border">
          <div className={`${ROW} border-b border-border text-[11px] uppercase tracking-[0.2em] text-muted-foreground`}>
            <span>Order</span><span className="hidden sm:block">Items</span><span className="hidden sm:block">Total</span><span className="hidden sm:block">Status</span><span />
          </div>
          {ORDERS.map((o) => (
            <div key={o.id} className={`${ROW} border-b border-border text-sm last:border-0`}>
              <div>
                <p className="font-medium">{o.id}</p>
                <p className="text-xs text-muted-foreground">{o.date}</p>
              </div>
              <div className="hidden text-muted-foreground sm:block">{o.items} items</div>
              <div className="hidden sm:block">{formatPrice(o.total)}</div>
              <div className="hidden sm:block"><span className="text-[11px] uppercase tracking-[0.2em] text-gold">{o.status}</span></div>
              <Button asChild variant="outline" size="sm" className="rounded-none">
                <Link href={{ pathname: "/track", query: { order: o.id } }}>View</Link>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function PageClient() {
  return (
    <AccountLayout>
      <Orders />
    </AccountLayout>
  );
}
