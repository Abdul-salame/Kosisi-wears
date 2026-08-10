"use client";

import { useMemo, useState } from "react";
import { Bell, CheckCheck, ShoppingCart, Package, Star, CreditCard, Ticket } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useAdminNotifications,
  markAllNotificationsRead,
  toggleNotificationRead,
} from "@/lib/admin-notifications";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  order: ShoppingCart,
  stock: Package,
  review: Star,
  payment: CreditCard,
  coupon: Ticket,
};

export function PageClient() {
  const items = useAdminNotifications();
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"all" | "unread" | "read">("all");

  const filtered = useMemo(() => {
    return items.filter((n) => {
      if (tab === "unread" && n.read) return false;
      if (tab === "read" && !n.read) return false;
      if (q && !`${n.title} ${n.desc} ${n.type}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [items, q, tab]);

  const unread = items.filter((n) => !n.read).length;

  return (
    <AdminShell
      title="Notifications"
      breadcrumbs={[{ label: "Notifications" }]}
      actions={
        <Button variant="outline" size="sm" onClick={() => markAllNotificationsRead()} disabled={unread === 0}>
          <CheckCheck className="mr-2 h-4 w-4" /> Mark all read
        </Button>
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList>
            <TabsTrigger value="all">All <Badge variant="secondary" className="ml-2 text-[10px]">{items.length}</Badge></TabsTrigger>
            <TabsTrigger value="unread">Unread <Badge variant="secondary" className="ml-2 text-[10px]">{unread}</Badge></TabsTrigger>
            <TabsTrigger value="read">Read</TabsTrigger>
          </TabsList>
        </Tabs>
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search notifications…"
          className="h-10 max-w-xs bg-secondary/50 border-transparent focus-visible:border-gold"
        />
      </div>

      <div className="mt-6 border border-border/60 bg-card">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <Bell className="h-8 w-8 text-muted-foreground" />
            <div className="font-display text-lg">Nothing to show</div>
            <p className="text-sm text-muted-foreground">You're all caught up.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border/60">
            {filtered.map((n) => {
              const Icon = ICONS[n.type] ?? Bell;
              return (
                <li
                  key={n.id}
                  className={cn(
                    "flex items-start gap-4 border-l-2 px-5 py-4 transition-colors hover:bg-accent/40",
                    n.read ? "border-transparent" : "border-gold bg-gold/[0.03]",
                  )}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-gold/10 text-gold">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className={cn("text-sm", n.read ? "text-muted-foreground" : "font-medium text-foreground")}>{n.title}</div>
                      {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-gold" />}
                      <Badge variant="outline" className="ml-auto text-[10px] uppercase tracking-wider">{n.type}</Badge>
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">{n.desc}</div>
                    <div className="mt-1 text-[10px] uppercase tracking-wider text-gold">{n.time}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleNotificationRead(n.id)}
                    className="text-[11px] uppercase tracking-[0.18em]"
                  >
                    {n.read ? "Mark unread" : "Mark read"}
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AdminShell>
  );
}