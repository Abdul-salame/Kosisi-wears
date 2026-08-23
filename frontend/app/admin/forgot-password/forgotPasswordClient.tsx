"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PageClient() {
  const [sent, setSent] = useState(false);
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="w-full max-w-md space-y-6">
        <div className="mx-auto flex h-12 w-12 items-center justify-center bg-gold/10 text-gold"><Mail className="h-5 w-5" /></div>
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Recovery</p>
          <h1 className="mt-2 font-display text-3xl">Forgot your password?</h1>
          <p className="mt-2 text-sm text-muted-foreground">Enter your admin email and we'll send you a reset link.</p>
        </div>
        {sent ? (
          <div className="border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-400">
            Reset link sent. Check your inbox for further instructions.
          </div>
        ) : (
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-widest">Email</Label>
            <Input type="email" required className="h-11" placeholder="admin@kosisi.co" />
          </div>
        )}
        <Button className="h-11 w-full uppercase tracking-[0.2em]">Send reset link</Button>
        <div className="text-center text-sm">
          <Link href="/admin/login" className="text-muted-foreground hover:text-foreground">← Back to sign in</Link>
        </div>
      </form>
    </div>
  );
}