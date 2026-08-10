"use client";

import { useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type AdminCoupon } from "@/lib/admin-data";
import { useAdminCoupons, upsertCoupon, deleteCoupon } from "@/lib/admin-store";
import { toast } from "sonner";

function CouponDialog({ coupon, trigger }: { coupon?: AdminCoupon; trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const editing = !!coupon;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="bg-gold text-gold-foreground hover:bg-gold/90"><Plus className="mr-2 h-4 w-4" /> New coupon</Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle className="font-display text-2xl">{editing ? "Edit coupon" : "New coupon"}</DialogTitle></DialogHeader>
        <form
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            upsertCoupon({
              id: coupon?.id ?? `CPN-${Date.now()}`,
              code: String(f.get("code") || "NEWCODE").toUpperCase(),
              discount: Number(f.get("discount") || 10),
              type: String(f.get("type") || "%") as AdminCoupon["type"],
              uses: coupon?.uses ?? 0,
              limit: Number(f.get("limit") || 100),
              expires: String(f.get("expires") || "2026-12-31"),
              status: String(f.get("status") || "Active") as AdminCoupon["status"],
            });
            toast.success(editing ? "Coupon updated" : "Coupon created");
            setOpen(false);
          }}
        >
          <div className="space-y-2 sm:col-span-2"><Label>Code</Label><Input name="code" required defaultValue={coupon?.code} className="font-mono uppercase" /></div>
          <div className="space-y-2"><Label>Discount</Label><Input name="discount" type="number" defaultValue={coupon?.discount ?? 10} /></div>
          <div className="space-y-2"><Label>Type</Label>
            <Select name="type" defaultValue={coupon?.type ?? "%"}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="%">Percent</SelectItem><SelectItem value="$">Fixed amount</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Usage limit</Label><Input name="limit" type="number" defaultValue={coupon?.limit ?? 100} /></div>
          <div className="space-y-2"><Label>Expires</Label><Input name="expires" type="date" defaultValue={coupon?.expires ?? "2026-12-31"} /></div>
          <div className="space-y-2 sm:col-span-2"><Label>Status</Label>
            <Select name="status" defaultValue={coupon?.status ?? "Active"}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{["Active", "Expired", "Scheduled"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <DialogFooter className="sm:col-span-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-gold text-gold-foreground hover:bg-gold/90">{editing ? "Save changes" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
export function PageClient() {
    const rows = useAdminCoupons();
    const color = (s: string) => s === "Active" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" : s === "Expired" ? "bg-red-500/15 text-red-400 border-red-500/30" : "bg-amber-500/15 text-amber-400 border-amber-500/30";
    return (
      <AdminShell title="Coupons" breadcrumbs={[{ label: "Coupons" }]} actions={<CouponDialog />}>
        <div className="border border-border/60 bg-card">
          <Table>
            <TableHeader><TableRow><TableHead>Code</TableHead><TableHead>Discount</TableHead><TableHead className="text-right">Uses</TableHead><TableHead>Expires</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
            <TableBody>
              {rows.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono text-sm font-medium">{c.code}</TableCell>
                  <TableCell>{c.type === "%" ? `${c.discount}%` : `₦${c.discount.toLocaleString()}`}</TableCell>
                  <TableCell className="text-right">{c.uses} / {c.limit}</TableCell>
                  <TableCell className="text-muted-foreground">{c.expires}</TableCell>
                  <TableCell><Badge variant="outline" className={color(c.status)}>{c.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <CouponDialog coupon={c} trigger={<Button size="icon" variant="ghost"><Pencil className="h-4 w-4" /></Button>} />
                      <Button size="icon" variant="ghost" onClick={() => { deleteCoupon(c.id); toast.success("Coupon deleted"); }}><Trash2 className="h-4 w-4 text-red-400" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </AdminShell>
    );
  }
