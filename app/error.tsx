"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const isNetwork = /fetch|network/i.test(error.message);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">
          {isNetwork ? "Network error" : "Error 500"}
        </p>
        <h1 className="mt-3 font-display text-5xl text-foreground">
          {isNetwork ? "Connection lost." : "Something broke."}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {isNetwork
            ? "We couldn't reach the atelier. Check your connection and try again."
            : "Our team has been notified. Try again, or head back home."}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}
