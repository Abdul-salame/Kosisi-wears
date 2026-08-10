"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, Package, Mail, CreditCard, MapPin, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { formatPrice } from "@/lib/store";
import { usePlacedOrders } from "@/lib/placed-orders";
import { ReceiptPreview } from "@/components/site/ReceiptPreview";
import { trackingUrl } from "@/lib/receipt";

const PAYMENT_LABEL: Record<string, string> = {
  card: "Card payment",
  paystack: "Paystack",
  flutterwave: "Flutterwave",
};

export function SuccessClient() {
  const orderId = useSearchParams().get("order")?.slice(0, 20) ?? undefined;
  const orders = usePlacedOrders();
  const order = orders.find((o) => o.id === orderId) ?? orders[0];

  return (
    <div className="container-luxury py-16 max-w-3xl">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Checkout", to: "/checkout" }, { label: "Confirmation" }]} />
      <div className="text-center">
        <div className="mx-auto h-20 w-20 rounded-full bg-gold/10 border border-gold grid place-items-center">
          <Check className="h-10 w-10 text-gold" />
        </div>
        <p className="mt-6 text-[11px] uppercase tracking-[0.3em] text-gold">Order confirmed</p>
        <h1 className="mt-3 font-display text-4xl sm:text-6xl">Thank you.</h1>
        <p className="mt-4 text-muted-foreground">
          {order?.name ? `${order.name}, your order is being prepared with care at the atelier.` : "Your piece is being prepared with care at the atelier."}
        </p>
      </div>

      <div className="mt-10 border border-border p-6 text-left">
        <div className="grid gap-4 sm:grid-cols-3 text-sm">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Order number</p>
            <p className="mt-1 font-display text-lg">{order?.id ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Estimated delivery</p>
            <p className="mt-1 font-display text-lg">{order?.delivery === "express" ? "1–2 business days" : order?.delivery === "pickup" ? "Ready in 24h" : "3–5 business days"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Total paid</p>
            <p className="mt-1 font-display text-lg">{order ? formatPrice(order.total) : "—"}</p>
          </div>
        </div>

        {order && (
          <>
            <div className="mt-6 space-y-3 border-t border-border pt-6">
              {order.items.map((i, idx) => (
                <div key={`${i.productId}-${i.size}-${i.color}-${idx}`} className="flex gap-3">
                  <img src={i.image} alt="" className="h-16 w-12 object-cover bg-secondary" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{i.name}</p>
                    <p className="text-xs text-muted-foreground">{i.size} · {i.color} · x{i.qty}</p>
                  </div>
                  <span className="text-sm">{formatPrice(i.price * i.qty)}</span>
                </div>
              ))}
            </div>
            <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd></div>
              {order.discount > 0 && (
                <div className="flex justify-between text-gold"><dt>Discount{order.couponCode ? ` · ${order.couponCode}` : ""}</dt><dd>−{formatPrice(order.discount)}</dd></div>
              )}
              <div className="flex justify-between"><dt className="text-muted-foreground">Delivery</dt><dd>{order.deliveryFee === 0 ? "Free" : formatPrice(order.deliveryFee)}</dd></div>
              <div className="flex justify-between border-t border-border pt-3 font-display text-lg"><dt>Total</dt><dd>{formatPrice(order.total)}</dd></div>
            </dl>

            <div className="mt-6 grid gap-6 border-t border-border pt-6 text-sm sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-gold" />
                <div>
                  <p className="font-medium">Shipping to</p>
                  <p className="text-xs text-muted-foreground">{order.address}, {order.city} {order.postal}</p>
                  <p className="text-xs text-muted-foreground">{order.state ? `${order.state}, ` : ""}{order.country}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CreditCard className="mt-0.5 h-4 w-4 text-gold" />
                <div>
                  <p className="font-medium">{PAYMENT_LABEL[order.payment] ?? "Payment"}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.payment === "card"
                      ? `Card ending ${order.cardLast4} · authorised`
                      : `Confirmed via ${PAYMENT_LABEL[order.payment]} · reference ${order.id}`}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-border pt-6 text-sm">
              <div className="flex items-start gap-3">
                <Link2 className="mt-0.5 h-4 w-4 text-gold" />
                <div className="min-w-0">
                  <p className="font-medium">Order reference & tracking link</p>
                  <p className="text-xs text-muted-foreground">Reference <span className="text-foreground">{order.id}</span> — keep this for any enquiry.</p>
                  <Link
                    href={{ pathname: "/track", query: { order: order.id } }}
                    className="mt-1 block break-all text-xs text-gold underline underline-offset-4"
                  >
                    {trackingUrl(order.id)}
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="mt-6 grid gap-6 border-t border-border pt-6 text-sm sm:grid-cols-2">
          <div className="flex items-start gap-3"><Mail className="h-4 w-4 text-gold mt-0.5" /><div><p className="font-medium">Confirmation sent</p><p className="text-muted-foreground text-xs">We've emailed your receipt{order?.email ? ` to ${order.email}` : ""} and tracking will follow shortly.</p></div></div>
          <div className="flex items-start gap-3"><Package className="h-4 w-4 text-gold mt-0.5" /><div><p className="font-medium">Track your order</p><p className="text-muted-foreground text-xs">Follow the journey from atelier to your door in your account.</p></div></div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <Button asChild className="rounded-none h-12 px-8 text-[11px] uppercase tracking-[0.2em]"><Link href="/account/orders">View My Orders</Link></Button>
        {order && <ReceiptPreview order={order} />}
        {order && (
          <Button asChild variant="outline" className="rounded-none h-12 px-8 text-[11px] uppercase tracking-[0.2em]">
            <Link href={{ pathname: "/track", query: { order: order.id } }}>Track Order</Link>
          </Button>
        )}
        <Button asChild variant="outline" className="rounded-none h-12 px-8 text-[11px] uppercase tracking-[0.2em]"><Link href="/shop">Continue Shopping</Link></Button>
      </div>
    </div>
  );
}
