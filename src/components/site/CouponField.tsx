"use client";

import { useState } from "react";
import { BadgePercent, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { applyCoupon, removeCoupon, useDiscount } from "@/lib/coupon";
import { formatPrice } from "@/lib/store";

export function CouponField({ subtotal }: { subtotal: number }) {
  const [code, setCode] = useState("");
  const { coupon, discount } = useDiscount(subtotal);

  if (coupon) {
    return (
      <div className="mt-6 flex items-center justify-between border border-gold/50 bg-gold/5 px-4 py-3">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-gold">
            <BadgePercent className="h-3.5 w-3.5" /> {coupon.code}
          </p>
          <p className="mt-1 truncate text-xs text-muted-foreground">{coupon.label} · −{formatPrice(discount)}</p>
        </div>
        <button onClick={removeCoupon} aria-label="Remove coupon" className="text-muted-foreground hover:text-destructive">
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); if (applyCoupon(code, subtotal)) setCode(""); }}
      className="mt-6 space-y-2"
    >
      <label className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Coupon code</label>
      <div className="flex gap-2">
        <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="KOSISI10" className="h-11 rounded-none uppercase" />
        <Button type="submit" variant="outline" disabled={!code.trim()} className="h-11 rounded-none px-5 text-[11px] uppercase tracking-[0.2em]">Apply</Button>
      </div>
    </form>
  );
}
