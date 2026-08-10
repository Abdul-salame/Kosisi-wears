import type { ReactNode } from "react";
import Link from "next/link";

export function PolicyPage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: ReactNode }) {
  return (
    <div className="container-luxury max-w-3xl py-16">
      <nav className="mb-6 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link> / <span className="text-foreground">{title}</span>
      </nav>
      <p className="text-[11px] uppercase tracking-[0.3em] text-gold">{eyebrow}</p>
      <h1 className="mt-3 font-display text-4xl sm:text-5xl">{title}</h1>
      <p className="mt-4 text-muted-foreground">{intro}</p>
      <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}

export function PolicySection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-2xl text-foreground">{heading}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}
