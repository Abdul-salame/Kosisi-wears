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
import {
  useCustomOrderRequests,
  updateCustomOrderStatus,
  updateCustomOrderQuote,
  deleteCustomOrderRequests,
  type CustomOrderRequest,
  type CustomOrderStatus,
} from "@/lib/custom-orders";
import { toast } from "sonner";

const STATUSES: CustomOrderStatus[] = ["New", "Contacted", "Quoted", "In Production", "Closed"];

const statusColor = (s: CustomOrderStatus): string => ({
  New: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  Contacted: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Quoted: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  "In Production": "bg-gold/15 text-gold border-gold/30",
  Closed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
}[s]);

export function PageClient() {
  const rows = useCustomOrderRequests();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [detail, setDetail] = useState<CustomOrderRequest | null>(null);
  const [quoteInput, setQuoteInput] = useState("");

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (q && !r.id.toLowerCase().includes(q.toLowerCase()) && !r.name.toLowerCase().includes(q.toLowerCase()) && !r.email.toLowerCase().includes(q.toLowerCase())) return false;
      if (status !== "all" && r.status !== status) return false;
      return true;
    });
  }, [rows, q, status]);

  const chips = [
    q && { k: "search", label: `"${q}"`, clear: () => setQ("") },
    status !== "all" && { k: "status", label: status, clear: () => setStatus("all") },
  ].filter(Boolean) as { k: string; label: string; clear: () => void }[];

  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const bulkStatus = (s: CustomOrderStatus) => { updateCustomOrderStatus(selected, s); toast.success(`${selected.length} request(s) marked ${s}`); setSelected([]); };

  return (
    <AdminShell title="Custom Requests" breadcrumbs={[{ label: "Custom Requests" }]}>
      <div className="border border-border/60 bg-card">
        <div className="flex flex-wrap items-center gap-3 border-b border-border/40 p-4">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search request, name or email…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
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
            <button onClick={() => { setQ(""); setStatus("all"); }} className="text-muted-foreground hover:text-foreground">Clear all</button>
          </div>
        )}

        {selected.length > 0 && (
          <div className="flex items-center justify-between border-b border-border/40 bg-gold/5 px-4 py-2 text-sm">
            <span>{selected.length} selected</span>
            <div className="flex gap-2">
              <Select onValueChange={(v) => bulkStatus(v as CustomOrderStatus)}>
                <SelectTrigger className="h-8 w-[160px]"><SelectValue placeholder="Update status" /></SelectTrigger>
                <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
              <Button size="sm" variant="destructive" onClick={() => { deleteCustomOrderRequests(selected); toast.success("Deleted"); setSelected([]); }}>Delete</Button>
            </div>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"><Checkbox checked={selected.length === filtered.length && filtered.length > 0} onCheckedChange={() => setSelected(selected.length === filtered.length ? [] : filtered.map((r) => r.id))} /></TableHead>
              <TableHead>Request</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Colors</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-10">No custom requests yet.</TableCell></TableRow>
            )}
            {filtered.slice(0, 25).map((r) => (
              <TableRow key={r.id}>
                <TableCell><Checkbox checked={selected.includes(r.id)} onCheckedChange={() => toggle(r.id)} /></TableCell>
                <TableCell className="font-mono text-xs">{r.id}</TableCell>
                <TableCell><div className="text-sm">{r.name}</div><div className="text-xs text-muted-foreground">{r.email}</div></TableCell>
                <TableCell>{r.itemType}</TableCell>
                <TableCell className="text-muted-foreground">{r.colors || "—"}</TableCell>
                <TableCell><Badge variant="outline" className={statusColor(r.status)}>{r.status}</Badge></TableCell>
                <TableCell className="text-right">
                  <Button size="icon" variant="ghost" onClick={() => { setDetail(r); setQuoteInput(r.quotedPrice ? String(r.quotedPrice) : ""); }}><Eye className="h-4 w-4" /></Button>
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
                <div className="text-sm text-muted-foreground">{detail.name} · {detail.email}{detail.phone ? ` · ${detail.phone}` : ""}</div>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {detail.referenceImage && (
                  <div className="aspect-video overflow-hidden rounded border border-border bg-muted">
                    <img src={detail.referenceImage} alt="Reference" className="h-full w-full object-cover" />
                  </div>
                )}
                <div className="border border-border/60 p-4 text-sm space-y-2">
                  <div className="flex justify-between"><span className="text-muted-foreground">Item</span><span>{detail.itemType}</span></div>
                  {detail.styleReference && <div className="flex justify-between"><span className="text-muted-foreground">Style reference</span><span>{detail.styleReference}</span></div>}
                  <div className="flex justify-between"><span className="text-muted-foreground">Colors</span><span>{detail.colors || "—"}</span></div>
                  {detail.teamOrClubName && <div className="flex justify-between"><span className="text-muted-foreground">Team / Club</span><span>{detail.teamOrClubName}</span></div>}
                  <div className="flex justify-between"><span className="text-muted-foreground">Submitted</span><span>{new Date(detail.createdAt).toLocaleString()}</span></div>
                </div>
                {detail.playerNamesNumbers && (
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Player names / numbers</div>
                    <p className="text-sm whitespace-pre-wrap">{detail.playerNamesNumbers}</p>
                  </div>
                )}
                {detail.notes && (
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Notes</div>
                    <p className="text-sm whitespace-pre-wrap">{detail.notes}</p>
                  </div>
                )}
                <div className="space-y-2">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Status</div>
                  <Select value={detail.status} onValueChange={(v) => { updateCustomOrderStatus([detail.id], v as CustomOrderStatus); setDetail({ ...detail, status: v as CustomOrderStatus }); toast.success("Status updated"); }}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Quoted price (₦)</div>
                  <div className="flex gap-2">
                    <Input type="number" value={quoteInput} onChange={(e) => setQuoteInput(e.target.value)} placeholder="e.g. 45000" />
                    <Button
                      variant="outline"
                      onClick={() => {
                        const val = Number(quoteInput);
                        if (!val) { toast.error("Enter a valid amount"); return; }
                        updateCustomOrderQuote(detail.id, val);
                        setDetail({ ...detail, quotedPrice: val });
                        toast.success("Quote saved");
                      }}
                    >
                      Save
                    </Button>
                  </div>
                </div>
                <Button asChild variant="outline" className="w-full">
                  <a href={`mailto:${detail.email}?subject=Your Kosisi custom order ${detail.id}`}>Email customer</a>
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </AdminShell>
  );
}
