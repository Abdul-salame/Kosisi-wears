import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon, eyebrow, title, description, children, className,
}: {
  icon: LucideIcon;
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border border-border bg-secondary/20 px-6 py-20 text-center", className)}>
      <div className="relative mx-auto h-24 w-24">
        <div className="absolute inset-0 rounded-full border border-gold/30" />
        <div className="absolute inset-3 rounded-full border border-gold/20" />
        <div className="absolute inset-0 grid place-items-center">
          <Icon className="h-8 w-8 text-gold" strokeWidth={1.25} />
        </div>
      </div>
      {eyebrow && <p className="mt-8 text-[11px] uppercase tracking-[0.3em] text-gold">{eyebrow}</p>}
      <h2 className="mt-3 font-display text-3xl">{title}</h2>
      {description && <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">{description}</p>}
      {children && <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>}
    </div>
  );
}
