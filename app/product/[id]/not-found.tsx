import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-luxury py-24 text-center">
      <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Not found</p>
      <h1 className="mt-3 font-display text-4xl">This piece is no longer available</h1>
      <Link href="/shop" className="mt-6 inline-block border-b border-foreground text-[11px] uppercase tracking-[0.2em]">Shop the collection</Link>
    </div>
  );
}
