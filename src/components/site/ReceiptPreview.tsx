"use client";

import Image from "next/image";
import { Download, Link2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatPrice } from "@/lib/store";
import { BRAND } from "@/lib/brand";
import type { PlacedOrder } from "@/lib/placed-orders";
import { downloadReceiptPdf, trackingUrl } from "@/lib/receipt";

const PAYMENT_LABEL: Record<string, string> = {
  card: "Card payment",
  paystack: "Paystack",
};

export function ReceiptPreview({ order }: { order: PlacedOrder }) {
  const link = trackingUrl(order.id);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-12 rounded-none px-8 text-[11px] uppercase tracking-[0.2em]">
          <Download className="mr-2 h-4 w-4" /> Receipt (PDF)
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg rounded-none p-0">
        <DialogHeader className="border-b border-border px-6 py-4">
          <DialogTitle className="font-display text-xl">Receipt preview</DialogTitle>
          <DialogDescription className="sr-only">Order {order.id} receipt preview</DialogDescription>
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground" aria-hidden="true">{order.id}</p>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="px-6 py-5 text-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border bg-muted/40">
                  <Image src={BRAND.logo} alt={`${BRAND.name} logo`} width={40} height={40} className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="font-display text-lg tracking-[0.15em]">{BRAND.short}</p>
                  <p className="text-xs text-muted-foreground">{BRAND.tagline}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Receipt</p>
                <p className="text-xs text-muted-foreground">{new Date(order.placedAt).toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 border-t border-border pt-5 sm:grid-cols-2">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Billed to</p>
                <p className="mt-1">{order.name}</p>
                <p className="text-xs text-muted-foreground">{order.email}</p>
                {order.phone && <p className="text-xs text-muted-foreground">{order.phone}</p>}
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Delivery</p>
                <p className="mt-1">{order.deliveryLabel}</p>
                <p className="text-xs text-muted-foreground">{order.address}, {order.city} {order.postal}</p>
                <p className="text-xs text-muted-foreground">{order.state ? `${order.state}, ` : ""}{order.country}</p>
              </div>
            </div>

            <div className="mt-5 space-y-3 border-t border-border pt-5">
              {order.items.map((i, idx) => (
                <div key={`${i.productId}-${i.size}-${i.color}-${idx}`} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate">{i.name}</p>
                    <p className="text-xs text-muted-foreground">{i.size} · {i.color} · x{i.qty}</p>
                  </div>
                  <span>{formatPrice(i.price * i.qty)}</span>
                </div>
              ))}
            </div>

            <dl className="mt-4 space-y-2 border-t border-border pt-4">
              <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd></div>
              {order.discount > 0 && (
                <div className="flex justify-between text-gold"><dt>Discount{order.couponCode ? ` · ${order.couponCode}` : ""}</dt><dd>−{formatPrice(order.discount)}</dd></div>
              )}
              <div className="flex justify-between"><dt className="text-muted-foreground">Delivery</dt><dd>{order.deliveryFee === 0 ? "Free" : formatPrice(order.deliveryFee)}</dd></div>
              <div className="flex justify-between border-t border-border pt-3 font-display text-lg"><dt>Total paid</dt><dd>{formatPrice(order.total)}</dd></div>
            </dl>

            <div className="mt-5 border-t border-border pt-5">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Payment</p>
              <p className="mt-1">{PAYMENT_LABEL[order.payment] ?? "Payment"}</p>
              <p className="text-xs text-muted-foreground">
                {order.payment === "card"
                  ? `Card ending ${order.cardLast4} · authorised`
                  : `Confirmed via ${PAYMENT_LABEL[order.payment]} · reference ${order.id}`}
              </p>
            </div>

            <div className="mt-5 border-t border-border pt-5">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Tracking</p>
              <p className="mt-1 text-xs text-muted-foreground">Order reference · <span className="text-foreground">{order.id}</span></p>
              <p className="mt-1 flex items-start gap-2 break-all text-xs text-gold" aria-label={`Tracking link for order ${order.id}`}>
                <Link2 className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />{link}
              </p>
            </div>
          </div>
        </ScrollArea>

        <div className="flex flex-wrap justify-end gap-3 border-t border-border px-6 py-4">
          <Button
            onClick={() => downloadReceiptPdf(order)}
            aria-label="Download receipt PDF"
            className="h-11 rounded-none px-6 text-[11px] uppercase tracking-[0.2em]"
          >
            <Download className="mr-2 h-4 w-4" aria-hidden="true" /> Download PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}