import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type Crumb = {
  label: string;
  to?: string;
};

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        {items.map((c, i) => (
          <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3 w-3 opacity-60" />}
            {c.to && i < items.length - 1 ? (
              <Link href={c.to} className="hover:text-gold transition-colors">
                {c.label}
              </Link>
            ) : (
              <span className="text-foreground">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
