"use client";

import { useMemo, useState } from "react";
import { Search, Eye, X } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatCurrency, orderStatusColor, type AdminOrder, type OrderStatus } from "@/lib/admin-data";
import { useAdminOrders, updateOrderStatus, deleteOrders } from "@/lib/admin-store";
import { InvoicePreview } from "@/components/admin/InvoicePreview";
import { toast } from "sonner";

const STEPS: OrderStatus[] = ["Pending", "Paid", "Processing", "Shipped", "Delivered"];

export function PageClient() {
  const rows = useAdminOrders();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [payment, setPayment] = useState("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [detail, setDetail] = useState<AdminOrder | null>(null);
  const [invoice, setInvoice] = useState<AdminOrder | null>(null);

  const filtered = useMemo(() => {
    return rows.filter((o) => {
      if (q && !o.id.toLowerCase().includes(q.toLowerCase()) && !o.customer.toLowerCase().includes(q.toLowerCase())) return false;
      if (status !== "all" && o.status !== status) return false;
      if (payment !== "all" && o.payment !== payment) return false;
      return true;
    });
  }, [rows, q, status, payment]);

  const chips = [
    q && { k: "search", label: `"${q}"`, clear: () => setQ("") },
    status !== "all" && { k: "status", label: status, clear: () => setStatus("all") },
    payment !== "all" && { k: "pay", label: payment, clear: () => setPayment("all") },
  ].filter(Boolean) as { k: string; label: string; clear: () => void }[];

  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const bulkStatus = (s: OrderStatus) => { updateOrderStatus(selected, s); toast.success(`${selected.length} orders marked ${s}`); setSelected([]); };

  return (
    <AdminShell title="Orders" breadcrumbs={[{ label: "Orders" }]}>
      <div className="border border-border/60 bg-card">
        <div className="flex flex-wrap items-center gap-3 border-b border-border/40 p-4">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search order or customer…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              {["Pending","Paid","Processing","Shipped","Delivered","Cancelled"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={payment} onValueChange={setPayment}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Payment" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All payment</SelectItem>
              {["Card","Paystack","Flutterwave","Bank"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {chips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-b border-border/40 px-4 py-2 text-xs">
            {chips.map((c) => (
              <Badge key={c.k} variant="outline" className="gap-1.5">
                {c.label}
                <button onClick={c.clear}><X className="h-3 w-3" /></button>
              </Badge>
            ))}
            <button onClick={() => { setQ(""); setStatus("all"); setPayment("all"); }} className="text-muted-foreground hover:text-foreground">Clear all</button>
          </div>
        )}

        {selected.length > 0 && (
          <div className="flex items-center justify-between border-b border-border/40 bg-gold/5 px-4 py-2 text-sm">
            <span>{selected.length} selected</span>
            <div className="flex gap-2">
              <Select onValueChange={(v) => bulkStatus(v as OrderStatus)}>
                <SelectTrigger className="h-8 w-[160px]"><SelectValue placeholder="Update status" /></SelectTrigger>
                <SelectContent>{STEPS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
              <Button size="sm" variant="destructive" onClick={() => { deleteOrders(selected); toast.success("Deleted"); setSelected([]); }}>Delete</Button>
            </div>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"><Checkbox checked={selected.length === filtered.length && filtered.length > 0} onCheckedChange={() => setSelected(selected.length === filtered.length ? [] : filtered.map((o) => o.id))} /></TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.slice(0, 15).map((o) => (
              <TableRow key={o.id}>
                <TableCell><Checkbox checked={selected.includes(o.id)} onCheckedChange={() => toggle(o.id)} /></TableCell>
                <TableCell className="font-mono text-xs">{o.id}</TableCell>
                <TableCell><div className="text-sm">{o.customer}</div><div className="text-xs text-muted-foreground">{o.email}</div></TableCell>
                <TableCell className="text-muted-foreground">{o.date}</TableCell>
                <TableCell>{o.payment}</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(o.total)}</TableCell>
                <TableCell><Badge variant="outline" className={orderStatusColor(o.status)}>{o.status}</Badge></TableCell>
                <TableCell className="text-right">
                  <Button size="icon" variant="ghost" onClick={() => setDetail(o)}><Eye className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {detail && (
            <>
              <SheetHeader>
                <SheetTitle className="font-display text-2xl">{detail.id}</SheetTitle>
                <div className="text-sm text-muted-foreground">{detail.customer} · {detail.email}</div>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-3">Status timeline</div>
                  <div className="space-y-3">
                    {STEPS.map((s, i) => {
                      const idx = STEPS.indexOf(detail.status);
                      const done = i <= idx;
                      return (
                        <div key={s} className="flex items-center gap-3">
                          <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] ${done ? "bg-gold text-gold-foreground" : "bg-muted text-muted-foreground"}`}>{i + 1}</div>
                          <div className={`text-sm ${done ? "" : "text-muted-foreground"}`}>{s}</div>
                          {done && <div className="ml-auto text-xs text-muted-foreground">{detail.date}</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="border border-border/60 p-4 text-sm space-y-1">
                  <div className="flex justify-between"><span className="text-muted-foreground">Items</span><span>{detail.items}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Payment</span><span>{detail.payment}</span></div>
                  <div className="flex justify-between font-medium"><span>Total</span><span>{formatCurrency(detail.total)}</span></div>
                </div>
                <div className="flex gap-2">
                  <Select value={detail.status} onValueChange={(v) => { updateOrderStatus([detail.id], v as OrderStatus); setDetail({ ...detail, status: v as OrderStatus }); toast.success("Status updated"); }}>
                    <SelectTrigger className="flex-1"><SelectValue /></SelectTrigger>
                    <SelectContent>{["Pending","Paid","Processing","Shipped","Delivered","Cancelled"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                  <Button variant="outline" onClick={() => setInvoice(detail)}>Invoice</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <InvoicePreview order={invoice} open={!!invoice} onOpenChange={(o) => !o && setInvoice(null)} />
    </AdminShell>
  );
}