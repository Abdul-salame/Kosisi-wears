"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  LayoutDashboard, Package, Tags, ShoppingCart, Users, Boxes,
  BarChart3, Ticket, Star, Settings, Bell, Search, Sun, Moon,
  Menu, LogOut, ChevronRight, Shirt,
} from "lucide-react";
import { useTheme } from "@/lib/theme";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAdminNotifications, markAllNotificationsRead, markNotificationRead } from "@/lib/admin-notifications";
import { useAdminSession, adminSignOut, useAdminProducts, useAdminOrders, useAdminCustomers } from "@/lib/admin-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type NavItem = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
};

const NAV: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: Tags },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/custom-orders", label: "Custom Requests", icon: Shirt },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/inventory", label: "Inventory", icon: Boxes },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/coupons", label: "Coupons", icon: Ticket },
  { to: "/admin/reviews", label: "Reviews", icon: Star },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

function SidebarContent({ pathname, onSignOut }: { pathname: string; onSignOut: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <Link href="/admin" className="flex items-center gap-2 border-b border-border/60 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center bg-gold text-gold-foreground font-display text-lg">A</div>
        <div>
          <div className="font-display text-lg leading-none">Kosisi</div>
          <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Admin Suite</div>
        </div>
      </Link>
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                href={item.to}
                className={cn(
                  "group flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-gold/10 text-foreground border-l-2 border-gold"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="tracking-wide">{item.label}</span>
                {active && <ChevronRight className="ml-auto h-3.5 w-3.5 text-gold" />}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
      <div className="border-t border-border/60 p-4">
        <button onClick={onSignOut} className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">
          <LogOut className="h-3.5 w-3.5" /> Sign out
        </button>
      </div>
    </div>
  );
}

export function AdminShell({
  children, title, breadcrumbs, actions,
}: {
  children: ReactNode;
  title: string;
  breadcrumbs?: { label: string; to?: string }[];
  actions?: ReactNode;
}) {
  const { theme, toggle } = useTheme();
  const pathname = usePathname() ?? "";
  const [mobileOpen, setMobileOpen] = useState(false);
  const notifications = useAdminNotifications();
  const unread = notifications.filter((n) => !n.read).length;
  const router = useRouter();
  const session = useAdminSession();
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState("");
  const products = useAdminProducts();
  const orders = useAdminOrders();
  const customers = useAdminCustomers();

  useEffect(() => { setReady(true); }, []);
  useEffect(() => {
    if (ready && !session) router.replace("/admin/login");
  }, [ready, session, router]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [] as { key: string; label: string; sub: string; to: string }[];
    return [
      ...products.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
        .slice(0, 4).map((p) => ({ key: p.id, label: p.name, sub: `Product · ${p.sku}`, to: "/admin/products" })),
      ...orders.filter((o) => o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q))
        .slice(0, 4).map((o) => ({ key: o.id, label: o.id, sub: `Order · ${o.customer}`, to: "/admin/orders" })),
      ...customers.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
        .slice(0, 4).map((c) => ({ key: c.id, label: c.name, sub: `Customer · ${c.email}`, to: "/admin/customers" })),
    ];
  }, [query, products, orders, customers]);

  const signOut = () => {
    adminSignOut();
    toast.success("Signed out");
    router.replace("/admin/login");
  };

  const initials = (session?.name ?? "Admin").split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border/60 bg-card lg:block">
        <SidebarContent pathname={pathname} onSignOut={signOut} />
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-border/60 bg-background/85 backdrop-blur-lg">
          <div className="flex h-16 items-center gap-3 px-4 md:px-8">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SidebarContent pathname={pathname} onSignOut={signOut} />
              </SheetContent>
            </Sheet>

            <div className="relative hidden max-w-md flex-1 md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search orders, products, customers…"
                className="h-10 pl-9 bg-secondary/50 border-transparent focus-visible:border-gold"
              />
              {query.trim() && (
                <div className="absolute left-0 right-0 top-12 z-30 max-h-80 overflow-y-auto border border-border/60 bg-popover shadow-lg">
                  {results.length === 0 ? (
                    <div className="px-3 py-4 text-sm text-muted-foreground">No matches for “{query}”</div>
                  ) : results.map((r) => (
                    <Link
                      key={`${r.sub}-${r.key}`}
                      href={r.to}
                      onClick={() => setQuery("")}
                      className="block border-b border-border/40 px-3 py-2.5 last:border-0 hover:bg-accent"
                    >
                      <div className="text-sm">{r.label}</div>
                      <div className="text-xs text-muted-foreground">{r.sub}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="ml-auto flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={toggle} title="Toggle theme">
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative" aria-label={`Notifications, ${unread} unread`}>
                    <Bell className="h-4 w-4" />
                    {unread > 0 && (
                      <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[10px] font-semibold text-gold-foreground">
                        {unread}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-96 p-0">
                  <DropdownMenuLabel className="flex items-center justify-between px-3 py-2.5">
                    <span className="flex items-center gap-2">
                      Notifications
                      <Badge variant="secondary" className="text-[10px]">{unread} unread</Badge>
                    </span>
                    <button
                      onClick={() => markAllNotificationsRead()}
                      className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-gold disabled:opacity-40"
                      disabled={unread === 0}
                    >
                      Mark all read
                    </button>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.slice(0, 6).map((n) => (
                      <DropdownMenuItem
                        key={n.id}
                        onSelect={() => markNotificationRead(n.id)}
                        className={cn(
                          "flex-col items-start gap-0.5 border-l-2 px-3 py-2.5",
                          n.read ? "border-transparent opacity-70" : "border-gold",
                        )}
                      >
                        <div className="flex w-full items-center justify-between gap-2">
                          <div className="text-sm font-medium">{n.title}</div>
                          {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-gold" />}
                        </div>
                        <div className="text-xs text-muted-foreground">{n.desc}</div>
                        <div className="text-[10px] uppercase tracking-wider text-gold">{n.time}</div>
                      </DropdownMenuItem>
                    ))}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="justify-center py-2.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground focus:text-gold">
                    <Link href="/admin/notifications">View all notifications</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="ml-2 gap-2 pl-1 pr-3">
                    <Avatar className="h-8 w-8"><AvatarFallback className="bg-gold text-gold-foreground text-xs">{initials}</AvatarFallback></Avatar>
                    <div className="hidden text-left md:block">
                      <div className="text-xs font-medium leading-none">{session?.name ?? "Admin"}</div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{session?.role ?? "Owner"}</div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>My account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><Link href="/admin/settings">Settings</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/">View storefront</Link></DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={signOut}>Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/40 px-4 py-4 md:px-8">
            <div>
              <nav className="mb-1 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                <Link href="/admin">Admin</Link>
                {breadcrumbs?.map((b, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    <ChevronRight className="h-3 w-3" />
                    {b.to ? <Link href={b.to} className="hover:text-foreground">{b.label}</Link> : <span className="text-foreground">{b.label}</span>}
                  </span>
                ))}
              </nav>
              <h1 className="font-display text-3xl">{title}</h1>
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        </header>
        <div className="p-4 md:p-8">{children}</div>
      </div>
    </div>
  );
}

export function StatCard({
  label, value, change, icon: Icon, trend = "up",
}: {
  label: string; value: string; change: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: "up" | "down";
}) {
  return (
    <div className="group relative overflow-hidden border border-border/60 bg-card p-6 transition-colors hover:border-gold/50">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
          <div className="mt-3 font-display text-3xl">{value}</div>
          <div className={cn("mt-2 text-xs", trend === "up" ? "text-emerald-400" : "text-red-400")}>
            {trend === "up" ? "▲" : "▼"} {change} <span className="text-muted-foreground">vs last month</span>
          </div>
        </div>
        <div className="flex h-11 w-11 items-center justify-center bg-gold/10 text-gold">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 bg-gold transition-transform duration-500 group-hover:scale-x-100" />
    </div>
  );
}