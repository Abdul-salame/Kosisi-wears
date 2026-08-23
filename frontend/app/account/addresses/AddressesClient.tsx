"use client";

import { AccountLayout } from "@/components/site/AccountLayout";
import { Button } from "@/components/ui/button";
import { Plus, Home, Building2 } from "lucide-react";

const ADDRESSES = [
  { id: 1, label: "Home", icon: Home, name: "Ada Obi", line: "12 Bourdillon Road, Ikoyi", city: "Lagos, 101233", country: "Nigeria", primary: true },
  { id: 2, label: "Studio", icon: Building2, name: "Ada Obi", line: "45 Rue Saint-Honoré, Suite 3", city: "Paris, 75001", country: "France", primary: false },
];

function Addresses() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Addresses</h1>
        <Button className="rounded-none"><Plus className="h-4 w-4 mr-2" /> Add Address</Button>
      </div>
      <div className="mt-8 grid sm:grid-cols-2 gap-4">
        {ADDRESSES.map(a => (
          <div key={a.id} className="border border-border p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em]">
                <a.icon className="h-4 w-4 text-gold" />{a.label}
              </div>
              {a.primary && <span className="text-[10px] uppercase tracking-[0.2em] text-gold">Primary</span>}
            </div>
            <div className="mt-4 text-sm space-y-1">
              <p className="font-medium">{a.name}</p>
              <p className="text-muted-foreground">{a.line}</p>
              <p className="text-muted-foreground">{a.city}</p>
              <p className="text-muted-foreground">{a.country}</p>
            </div>
            <div className="mt-6 flex gap-4 text-[11px] uppercase tracking-[0.2em]">
              <button className="hover:text-gold">Edit</button>
              <button className="text-muted-foreground hover:text-destructive">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export function PageClient() {
  return (
    <AccountLayout>
      <Addresses />
    </AccountLayout>
  );
}
