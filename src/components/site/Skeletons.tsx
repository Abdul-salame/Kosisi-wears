import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-[4/5] w-full rounded-none" />
      <Skeleton className="mt-4 h-3 w-20 rounded-none" />
      <Skeleton className="mt-2 h-4 w-3/4 rounded-none" />
      <Skeleton className="mt-2 h-4 w-16 rounded-none" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => <ProductCardSkeleton key={i} />)}
    </div>
  );
}

export function ProductPageSkeleton() {
  return (
    <div className="container-luxury grid gap-10 py-10 lg:grid-cols-2">
      <Skeleton className="aspect-[4/5] w-full rounded-none" />
      <div className="space-y-4">
        <Skeleton className="h-3 w-24 rounded-none" />
        <Skeleton className="h-10 w-3/4 rounded-none" />
        <Skeleton className="h-4 w-40 rounded-none" />
        <Skeleton className="h-8 w-32 rounded-none" />
        <Skeleton className="h-20 w-full rounded-none" />
        <Skeleton className="h-12 w-full rounded-none" />
      </div>
    </div>
  );
}

export function CartSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="grid grid-cols-[140px_minmax(0,1fr)] gap-6 border-b border-border pb-6">
            <Skeleton className="aspect-[4/5] rounded-none" />
            <div className="space-y-3">
              <Skeleton className="h-3 w-20 rounded-none" />
              <Skeleton className="h-5 w-2/3 rounded-none" />
              <Skeleton className="h-9 w-28 rounded-none" />
            </div>
          </div>
        ))}
      </div>
      <Skeleton className="h-72 w-full rounded-none" />
    </div>
  );
}

export function DashboardCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border border-border/60 bg-card p-6">
          <Skeleton className="h-3 w-24 rounded-none" />
          <Skeleton className="mt-4 h-8 w-32 rounded-none" />
          <Skeleton className="mt-3 h-3 w-16 rounded-none" />
        </div>
      ))}
    </div>
  );
}
