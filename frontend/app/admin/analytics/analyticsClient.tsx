"use client";

import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { AdminShell } from "@/components/admin/AdminShell";
import { salesData, customerGrowth, adminProducts } from "@/lib/admin-data";

export function PageClient() {
    const top = [...adminProducts].sort((a, b) => b.sold - a.sold).slice(0, 8).map((p) => ({ name: p.name.split(" ")[0], sold: p.sold }));
    const tip = { background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", fontSize: 12 };
    return (
      <AdminShell title="Analytics" breadcrumbs={[{ label: "Analytics" }]}>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {[
            { t: "Revenue", d: salesData, k: "revenue", c: <AreaChart data={salesData}><CartesianGrid strokeDasharray="3 3" opacity={0.3} /><XAxis dataKey="month" fontSize={11} /><YAxis fontSize={11} /><Tooltip contentStyle={tip} /><Area dataKey="revenue" stroke="#c9a24a" fill="#c9a24a" fillOpacity={0.3} /></AreaChart> },
            { t: "Orders", c: <BarChart data={salesData}><CartesianGrid strokeDasharray="3 3" opacity={0.3} /><XAxis dataKey="month" fontSize={11} /><YAxis fontSize={11} /><Tooltip contentStyle={tip} /><Bar dataKey="orders" fill="#c9a24a" /></BarChart> },
            { t: "Customer growth", c: <LineChart data={customerGrowth}><CartesianGrid strokeDasharray="3 3" opacity={0.3} /><XAxis dataKey="month" fontSize={11} /><YAxis fontSize={11} /><Tooltip contentStyle={tip} /><Line dataKey="customers" stroke="#c9a24a" strokeWidth={2} dot={{ fill: "#c9a24a" }} /></LineChart> },
            { t: "Top products", c: <BarChart data={top} layout="vertical"><CartesianGrid strokeDasharray="3 3" opacity={0.3} /><XAxis type="number" fontSize={11} /><YAxis dataKey="name" type="category" fontSize={11} width={80} /><Tooltip contentStyle={tip} /><Bar dataKey="sold" fill="#c9a24a" /></BarChart> },
          ].map((x) => (
            <div key={x.t} className="border border-border/60 bg-card p-6">
              <div className="font-display text-xl mb-4">{x.t}</div>
              <div className="h-64"><ResponsiveContainer width="100%" height="100%">{x.c}</ResponsiveContainer></div>
            </div>
          ))}
        </div>
      </AdminShell>
    );
  }
