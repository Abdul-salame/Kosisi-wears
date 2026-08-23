"use client";

import { useState, type FormEvent } from "react";
import { Check, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NewsletterForm({ variant = "light" }: { variant?: "light" | "dark" }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) || value.length > 255) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setDone(true);
  };

  if (done) {
    return (
      <div className={cn("flex items-start gap-3 border p-5 text-left", variant === "dark" ? "border-gold/40 bg-primary-foreground/5" : "border-gold/40 bg-gold/5")}>
        <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold text-gold-foreground">
          <Check className="h-4 w-4" />
        </span>
        <div>
          <p className="font-display text-lg">You're on the list.</p>
          <p className="mt-1 text-sm opacity-70">
            We've sent a confirmation to <strong>{email}</strong>. Your 10% welcome code is inside.
          </p>
          <button onClick={() => { setDone(false); setEmail(""); }} className="mt-2 text-[11px] uppercase tracking-[0.2em] underline opacity-70 hover:opacity-100">
            Subscribe another email
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="w-full">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={255}
            placeholder="Enter your email"
            aria-label="Email address"
            className={cn("h-12 rounded-none pl-9", variant === "dark" && "bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50")}
          />
        </div>
        <Button type="submit" className="h-12 rounded-none bg-gold px-8 text-[11px] uppercase tracking-[0.2em] text-gold-foreground hover:bg-gold/90">
          Subscribe
        </Button>
      </div>
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </form>
  );
}
