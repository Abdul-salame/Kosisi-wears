"use client";

import Link from "next/link";
import { DollarSign, ShoppingBag, Users, Package, ArrowUpRight, AlertTriangle } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell,
} from "recharts";
import { AdminShell, StatCard } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { salesData, categoryBreakdown, formatCurrency, orderStatusColor } from "@/lib/admin-data";
import { useAdminOrders, useAdminCustomers, useAdminProducts } from "@/lib/admin-store";

const COLORS = ["#c9a24a", "#e8e2d4", "#8b6f2c", "#c9b99a", "#5a4a20", "#f5f0e6", "#a67c00"];

export function PageClient() {
  const orders = useAdminOrders();
  const customers = useAdminCustomers();
  const products = useAdminProducts();
  const recent = orders.slice(0, 6);
  const recentCustomers = customers.slice(0, 5);
  const lowStock = products.filter((p) => p.stock < 30).slice(0, 5);
  const top = [...products].sort((a, b) => b.sold - a.sold).slice(0, 5);
  const revenue = orders.filter((o) => o.status !== "Cancelled").reduce((s, o) => s + o.total, 0);
  const activeProducts = products.filter((p) => p.status === "Active").length;

  return (
    <AdminShell title="Overview" breadcrumbs={[{ label: "Dashboard" }]}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Revenue (MTD)" value={formatCurrency(revenue)} change="12.4%" icon={DollarSign} />
        <StatCard label="Orders" value={String(orders.length)} change="8.1%" icon={ShoppingBag} />
        <StatCard label="Customers" value={String(customers.length)} change="14.2%" icon={Users} />
        <StatCard label="Active products" value={String(activeProducts)} change="2.0%" icon={Package} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="border border-border/60 bg-card p-6 xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Sales trend</div>
              <div className="mt-1 font-display text-2xl">Revenue this year</div>
            </div>
            <Badge variant="outline" className="border-gold/40 text-gold">+18% YoY</Badge>
          </div>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c9a24a" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#c9a24a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                <Area type="monotone" dataKey="revenue" stroke="#c9a24a" strokeWidth={2} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="border border-border/60 bg-card p-6">
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Category mix</div>
          <div className="mt-1 font-display text-2xl">By revenue</div>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryBreakdown} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={2}>
                  {categoryBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
            {categoryBreakdown.map((c, i) => (
              <div key={c.name} className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2" style={{ background: COLORS[i % COLORS.length] }} /> {c.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="border border-border/60 bg-card p-6">
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Monthly orders</div>
          <div className="mt-1 font-display text-2xl">Order volume</div>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                <Bar dataKey="orders" fill="#c9a24a" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="border border-border/60 bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Alerts</div>
              <div className="mt-1 font-display text-2xl flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-amber-500" /> Low stock</div>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-gold"><Link href="/admin/inventory">Manage</Link></Button>
          </div>
          <div className="mt-4 space-y-3">
            {lowStock.map((p) => (
              <div key={p.id} className="flex items-center gap-3 border-b border-border/40 pb-3 last:border-0 last:pb-0">
                <img src={p.image} alt={p.name} className="h-11 w-11 object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.category}</div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${p.stock < 10 ? "text-red-400" : "text-amber-400"}`}>{p.stock} left</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{p.sku}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="border border-border/60 bg-card xl:col-span-2">
          <div className="flex items-center justify-between p-6">
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Latest activity</div>
              <div className="mt-1 font-display text-2xl">Recent orders</div>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-gold gap-1">
              <Link href="/admin/orders">View all <ArrowUpRight className="h-3.5 w-3.5" /></Link>
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-xs">{o.id}</TableCell>
                  <TableCell>{o.customer}</TableCell>
                  <TableCell className="text-muted-foreground">{o.date}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(o.total)}</TableCell>
                  <TableCell><Badge variant="outline" className={orderStatusColor(o.status)}>{o.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="space-y-4">
          <div className="border border-border/60 bg-card p-6">
            <div className="flex items-center justify-between">
              <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Newest</div>
              <Button asChild variant="ghost" size="sm" className="text-gold"><Link href="/admin/customers">All</Link></Button>
            </div>
            <div className="mt-1 font-display text-xl">Recent customers</div>
            <div className="mt-4 space-y-3">
              {recentCustomers.map((c) => (
                <div key={c.id} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center bg-gold/10 text-gold text-xs font-medium">
                    {c.name.split(" ").map((s) => s[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-sm">{c.name}</div>
                    <div className="truncate text-xs text-muted-foreground">{c.email}</div>
                  </div>
                  <Badge variant="outline" className="text-[10px]">{c.status}</Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-border/60 bg-card p-6">
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Bestsellers</div>
            <div className="mt-1 font-display text-xl">Top products</div>
            <div className="mt-4 space-y-3">
              {top.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3">
                  <div className="w-4 text-center font-display text-lg text-gold">{i + 1}</div>
                  <img src={p.image} alt="" className="h-9 w-9 object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-sm">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.sold} sold</div>
                  </div>
                  <div className="text-sm">{formatCurrency(p.price)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}