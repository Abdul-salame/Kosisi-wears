import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Error 404</p>
        <h1 className="mt-4 font-display text-6xl">Off the map.</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          The page you&apos;re after doesn&apos;t exist — or the drop has moved.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-primary px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-primary-foreground hover:bg-gold hover:text-gold-foreground transition-colors"
          >
            Return home
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center border border-foreground px-6 py-3 text-[11px] uppercase tracking-[0.2em] hover:bg-foreground hover:text-background transition-colors"
          >
            Shop the collection
          </Link>
        </div>
      </div>
    </div>
  );
}
