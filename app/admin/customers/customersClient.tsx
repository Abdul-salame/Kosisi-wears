"use client";

import { useState } from "react";
import { Search, Mail } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatCurrency, orderStatusColor, type AdminCustomer } from "@/lib/admin-data";
import { useAdminCustomers, useAdminOrders, deleteCustomers } from "@/lib/admin-store";
import { toast } from "sonner";

export function PageClient() {
    const rows = useAdminCustomers();
    const orders = useAdminOrders();
    const [q, setQ] = useState("");
    const [selected, setSelected] = useState<string[]>([]);
    const [detail, setDetail] = useState<AdminCustomer | null>(null);
    const filtered = rows.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()) || c.email.toLowerCase().includes(q.toLowerCase()));
    return (
      <AdminShell title="Customers" breadcrumbs={[{ label: "Customers" }]}>
        <div className="border border-border/60 bg-card">
          <div className="flex flex-wrap items-center gap-3 border-b border-border/40 p-4">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search customers…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
            </div>
          </div>
          {selected.length > 0 && (
            <div className="flex items-center justify-between border-b border-border/40 bg-gold/5 px-4 py-2 text-sm">
              <span>{selected.length} selected</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => { toast.success("Email sent"); setSelected([]); }}><Mail className="mr-2 h-3.5 w-3.5" /> Email</Button>
                <Button size="sm" variant="destructive" onClick={() => { deleteCustomers(selected); toast.success("Deleted"); setSelected([]); }}>Delete</Button>
              </div>
            </div>
          )}
          <Table>
            <TableHeader><TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>Customer</TableHead><TableHead>Location</TableHead>
              <TableHead className="text-right">Orders</TableHead><TableHead className="text-right">Spent</TableHead>
              <TableHead>Status</TableHead><TableHead>Joined</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id} className="cursor-pointer" onClick={() => setDetail(c)}>
                  <TableCell onClick={(e) => e.stopPropagation()}><Checkbox checked={selected.includes(c.id)} onCheckedChange={() => setSelected((s) => s.includes(c.id) ? s.filter((x) => x !== c.id) : [...s, c.id])} /></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center bg-gold/10 text-gold text-xs font-medium">{c.name.split(" ").map((s) => s[0]).join("")}</div>
                      <div><div className="text-sm font-medium">{c.name}</div><div className="text-xs text-muted-foreground">{c.email}</div></div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{c.city}</TableCell>
                  <TableCell className="text-right">{c.orders}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(c.spent)}</TableCell>
                  <TableCell><Badge variant="outline">{c.status}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{c.joined}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
          <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
            {detail && (
              <>
                <SheetHeader><SheetTitle className="font-display text-2xl">{detail.name}</SheetTitle></SheetHeader>
                <div className="mt-4 space-y-4 text-sm">
                  <div className="border border-border/60 p-4 space-y-1">
                    <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span>{detail.email}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span>{detail.phone}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">City</span><span>{detail.city}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Total spent</span><span className="font-medium">{formatCurrency(detail.spent)}</span></div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Order history</div>
                    <div className="space-y-2">
                      {orders.filter((o) => o.customer === detail.name).slice(0, 5).map((o) => (
                        <div key={o.id} className="flex items-center justify-between border border-border/60 p-3 text-sm">
                          <div><div className="font-mono text-xs">{o.id}</div><div className="text-xs text-muted-foreground">{o.date}</div></div>
                          <Badge variant="outline" className={orderStatusColor(o.status)}>{o.status}</Badge>
                          <div className="font-medium">{formatCurrency(o.total)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </AdminShell>
    );
  }
