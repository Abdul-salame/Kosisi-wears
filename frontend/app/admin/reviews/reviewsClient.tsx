"use client";

import { useState } from "react";
import { Star, Check, X } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useAdminReviews, setReviewStatus, deleteReviews } from "@/lib/admin-store";
import { toast } from "sonner";

export function PageClient() {
    const rows = useAdminReviews();
    const [selected, setSelected] = useState<string[]>([]);
    const color = (s: string) => s === "Approved" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" : s === "Rejected" ? "bg-red-500/15 text-red-400 border-red-500/30" : "bg-amber-500/15 text-amber-400 border-amber-500/30";
    return (
      <AdminShell title="Reviews" breadcrumbs={[{ label: "Reviews" }]}>
        {selected.length > 0 && (
          <div className="mb-4 flex items-center justify-between border border-gold/30 bg-gold/5 px-4 py-2 text-sm">
            <span>{selected.length} selected</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => { setReviewStatus(selected, "Approved"); setSelected([]); toast.success("Approved"); }}>Approve</Button>
              <Button size="sm" variant="outline" onClick={() => { setReviewStatus(selected, "Rejected"); setSelected([]); toast.success("Rejected"); }}>Reject</Button>
              <Button size="sm" variant="destructive" onClick={() => { deleteReviews(selected); setSelected([]); toast.success("Deleted"); }}>Delete</Button>
            </div>
          </div>
        )}
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.id} className="flex gap-4 border border-border/60 bg-card p-5">
              <Checkbox checked={selected.includes(r.id)} onCheckedChange={() => setSelected((s) => s.includes(r.id) ? s.filter((x) => x !== r.id) : [...s, r.id])} className="mt-1" />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="font-medium">{r.title}</div>
                      <div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? "fill-gold text-gold" : "text-muted-foreground/30"}`} />)}</div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{r.customer} on {r.product} · {r.date}</div>
                  </div>
                  <Badge variant="outline" className={color(r.status)}>{r.status}</Badge>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{r.body}</p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => { setReviewStatus([r.id], "Approved"); toast.success("Approved"); }}><Check className="mr-1 h-3.5 w-3.5" /> Approve</Button>
                  <Button size="sm" variant="outline" onClick={() => { setReviewStatus([r.id], "Rejected"); toast.success("Review rejected"); }}><X className="mr-1 h-3.5 w-3.5" /> Reject</Button>
                  <Button size="sm" variant="ghost" onClick={() => { deleteReviews([r.id]); toast.success("Deleted"); }}>Delete</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </AdminShell>
    );
  }
