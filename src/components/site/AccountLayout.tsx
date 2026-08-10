"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Heart, MapPin, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/account", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/account/orders", label: "My Orders", icon: Package, exact: false },
  { to: "/account/wishlist", label: "Wishlist", icon: Heart, exact: false },
  { to: "/account/addresses", label: "Addresses", icon: MapPin, exact: false },
  { to: "/account/settings", label: "Settings", icon: Settings, exact: false },
] as const;

export function AccountLayout({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="container-luxury py-12 grid gap-10 lg:grid-cols-[240px_1fr]">
      <aside className="lg:sticky lg:top-24 h-fit">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">Account</p>
        <nav className="flex flex-col">
          {items.map((i) => {
            const active = i.exact ? pathname === i.to : pathname?.startsWith(i.to);
            return (
              <Link
                key={i.to}
                href={i.to}
                className={cn(
                  "group flex items-center gap-3 py-3 text-sm border-b border-border",
                  active && "text-gold",
                )}
              >
                <i.icon className="h-4 w-4" />
                {i.label}
              </Link>
            );
          })}
          <button className="mt-6 flex items-center gap-3 py-3 text-sm text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </nav>
      </aside>
      <main>{children}</main>
    </div>
  );
}
