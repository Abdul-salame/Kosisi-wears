"use client";

import Link from "next/link";
import { AccountLayout } from "@/components/site/AccountLayout";
import { Heart } from "lucide-react";
import { ProductCard } from "@/components/site/ProductCard";
import { EmptyState } from "@/components/site/EmptyState";
import { ProductGridSkeleton } from "@/components/site/Skeletons";
import { RecentlyViewedRow } from "@/components/site/RecentlyViewedRow";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { products } from "@/lib/products";

function Wishlist() {
  const { wishlist, hydrated } = useStore();
  const items = products.filter((p) => wishlist.includes(p.id));

  return (
    <div>
      <h1 className="font-display text-3xl">Wishlist</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {hydrated ? `${items.length} saved pieces` : "Loading your saved pieces…"}
      </p>

      {!hydrated ? (
        <div className="mt-8"><ProductGridSkeleton count={6} /></div>
      ) : items.length === 0 ? (
        <>
          <EmptyState
            className="mt-8"
            icon={Heart}
            eyebrow="Wishlist"
            title="Nothing saved yet"
            description="Tap the heart on any piece to keep it here — we'll hold it while you decide."
          >
            <Button asChild className="h-12 rounded-none px-8 text-[11px] uppercase tracking-[0.2em]">
              <Link href="/shop">Browse the collection</Link>
            </Button>
          </EmptyState>
          <RecentlyViewedRow className="mt-16" limit={4} />
        </>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}

export function PageClient() {
  return (
    <AccountLayout>
      <Wishlist />
    </AccountLayout>
  );
}
