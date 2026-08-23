"use client";

import { useState } from "react";
import { AlertTriangle, Package, TrendingUp, TrendingDown, Minus, Plus } from "lucide-react";
import { AdminShell, StatCard } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminProducts, useStockHistory, adjustStock } from "@/lib/admin-store";
import { toast } from "sonner";

export function PageClient() {
    const products = useAdminProducts();
    const movements = useStockHistory();
    const [amount, setAmount] = useState<Record<string, string>>({});
    const low = products.filter((p) => p.stock < 30);
    const total = products.reduce((s, p) => s + p.stock, 0);
    const restocked = movements.filter((m) => m.change > 0).reduce((s, m) => s + m.change, 0);
    const soldUnits = movements.filter((m) => m.change < 0).reduce((s, m) => s - m.change, 0);
    const apply = (id: string, name: string, sign: 1 | -1) => {
      const n = Number(amount[id] || 1);
      if (!n || n < 1) return;
      adjustStock(id, sign * n, sign > 0 ? "Restock" : "Adjustment");
      setAmount((a) => ({ ...a, [id]: "" }));
      toast.success(`${name}: ${sign > 0 ? "+" : "-"}${n} units`);
    };
    return (
      <AdminShell title="Inventory" breadcrumbs={[{ label: "Inventory" }]}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <StatCard label="Total units" value={String(total)} change="3.2%" icon={Package} />
          <StatCard label="Low stock" value={String(low.length)} change={`${low.length} items`} icon={AlertTriangle} trend="down" />
          <StatCard label="Restocked" value={String(restocked)} change="18%" icon={TrendingUp} />
          <StatCard label="Units out" value={String(soldUnits)} change="6%" icon={TrendingDown} />
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="border border-border/60 bg-card">
            <div className="p-4 font-display text-xl">Current stock</div>
            <div className="max-h-[520px] overflow-y-auto">
              <Table>
                <TableHeader><TableRow><TableHead>Product</TableHead><TableHead className="text-right">Stock</TableHead><TableHead className="text-right">Adjust</TableHead></TableRow></TableHeader>
                <TableBody>
                  {products.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="text-sm">{p.name}<div className="font-mono text-xs text-muted-foreground">{p.sku}</div></TableCell>
                      <TableCell className={`text-right ${p.stock < 10 ? "text-red-400" : p.stock < 30 ? "text-amber-400" : ""}`}>{p.stock}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button size="icon" variant="ghost" onClick={() => apply(p.id, p.name, -1)}><Minus className="h-3.5 w-3.5" /></Button>
                          <Input
                            className="h-8 w-14 text-center"
                            value={amount[p.id] ?? ""}
                            placeholder="1"
                            onChange={(e) => setAmount((a) => ({ ...a, [p.id]: e.target.value.replace(/\D/g, "") }))}
                          />
                          <Button size="icon" variant="ghost" onClick={() => apply(p.id, p.name, 1)}><Plus className="h-3.5 w-3.5" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="border border-border/60 bg-card">
            <div className="p-4 font-display text-xl">Stock history</div>
            <div className="max-h-[520px] overflow-y-auto">
            <Table>
              <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Product</TableHead><TableHead>Reason</TableHead><TableHead className="text-right">Change</TableHead></TableRow></TableHeader>
              <TableBody>
                {movements.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="text-xs text-muted-foreground">{m.date}</TableCell>
                    <TableCell className="text-sm">{m.product}</TableCell>
                    <TableCell><Badge variant="outline">{m.reason}</Badge></TableCell>
                    <TableCell className={`text-right font-medium ${m.change < 0 ? "text-red-400" : "text-emerald-400"}`}>{m.change > 0 ? "+" : ""}{m.change}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          </div>
        </div>
      </AdminShell>
    );
}