"use client";

import { useMemo } from "react";
import { Download, Printer } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { adminProducts, formatCurrency, type AdminOrder } from "@/lib/admin-data";

const seed = (n: number) => { const x = Math.sin(n) * 10000; return x - Math.floor(x); };

export type InvoiceLine = { name: string; sku: string; size: string; qty: number; price: number };

export function buildInvoiceLines(order: AdminOrder): InvoiceLine[] {
  const base = Number(order.id.replace(/\D/g, "")) || 1;
  const sizes = ["S", "M", "L", "XL"];
  return Array.from({ length: order.items }, (_, i) => {
    const p = adminProducts[(base + i * 7) % adminProducts.length];
    return {
      name: p.name,
      sku: p.sku,
      size: sizes[Math.floor(seed(base + i) * sizes.length)],
      qty: 1 + Math.floor(seed(base + i + 11) * 2),
      price: p.price,
    };
  });
}

export function InvoicePreview({ order, open, onOpenChange }: { order: AdminOrder | null; open: boolean; onOpenChange: (o: boolean) => void }) {
  const lines = useMemo(() => (order ? buildInvoiceLines(order) : []), [order]);
  if (!order) return null;

  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const discount = Math.round(subtotal * (order.payment === "Bank" ? 0.05 : 0.1));
  const shipping = subtotal > 500 ? 0 : 25;
  const tax = Math.round((subtotal - discount) * 0.075);
  const total = subtotal - discount + shipping + tax;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="flex-row items-center justify-between gap-3 border-b border-border/50 px-6 py-4 print:hidden">
          <DialogTitle className="font-display text-xl">Invoice preview</DialogTitle>
          <div className="flex gap-2 pr-6">
            <Button size="sm" variant="outline" onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" />Print</Button>
            <Button size="sm" onClick={() => window.print()}><Download className="mr-2 h-4 w-4" />Download PDF</Button>
          </div>
        </DialogHeader>

        <div id="invoice-sheet" className="bg-card px-8 py-10 text-sm print:px-0">
          <div className="flex flex-wrap items-start justify-between gap-6 border-b border-border/60 pb-6">
            <div>
              <div className="font-display text-2xl tracking-tight">KOSISI</div>
              <div className="mt-1 text-xs uppercase tracking-[0.25em] text-muted-foreground">Atelier of Modern Sport</div>
              <div className="mt-4 text-xs text-muted-foreground leading-relaxed">
                12 Marina Boulevard<br />Lagos, Nigeria<br />billing@kosisi.style
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Invoice</div>
              <div className="font-mono text-lg">{order.id.replace("#", "INV-")}</div>
              <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                <div>Order {order.id}</div>
                <div>Issued {order.date}</div>
                <div>Payment · {order.payment}</div>
                <div>Status · {order.status}</div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 border-b border-border/60 py-6 sm:grid-cols-2">
            <div>
              <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Billed to</div>
              <div className="mt-2">{order.customer}</div>
              <div className="text-xs text-muted-foreground">{order.email}</div>
            </div>
            <div className="sm:text-right">
              <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Amount due</div>
              <div className="mt-2 font-display text-2xl">{formatCurrency(total)}</div>
            </div>
          </div>

          <table className="mt-6 w-full text-left">
            <thead>
              <tr className="border-b border-border/60 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                <th className="py-2 font-normal">Item</th>
                <th className="py-2 font-normal">Size</th>
                <th className="py-2 text-right font-normal">Qty</th>
                <th className="py-2 text-right font-normal">Price</th>
                <th className="py-2 text-right font-normal">Amount</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((l, i) => (
                <tr key={i} className="border-b border-border/30">
                  <td className="py-3">
                    <div>{l.name}</div>
                    <div className="font-mono text-xs text-muted-foreground">{l.sku}</div>
                  </td>
                  <td className="py-3 text-muted-foreground">{l.size}</td>
                  <td className="py-3 text-right">{l.qty}</td>
                  <td className="py-3 text-right">{formatCurrency(l.price)}</td>
                  <td className="py-3 text-right font-medium">{formatCurrency(l.price * l.qty)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 flex justify-end">
            <div className="w-full max-w-xs space-y-2">
              <Row label="Subtotal" value={formatCurrency(subtotal)} />
              <Row label="Discount" value={`− ${formatCurrency(discount)}`} />
              <Row label="Shipping" value={shipping === 0 ? "Complimentary" : formatCurrency(shipping)} />
              <Row label="Tax (7.5%)" value={formatCurrency(tax)} />
              <div className="flex justify-between border-t border-border/60 pt-3 font-display text-lg">
                <span>Total</span><span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-border/60 pt-6 text-xs leading-relaxed text-muted-foreground">
            Payment is processed securely. Returns accepted within 14 days of delivery in original condition.
            Thank you for choosing Kosisi.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}