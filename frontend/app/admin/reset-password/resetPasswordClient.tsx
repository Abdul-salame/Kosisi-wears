"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function PageClient() {
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <form
        onSubmit={(e) => { e.preventDefault(); toast.success("Password updated"); router.push("/admin/login"); }}
        className="w-full max-w-md space-y-6"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center bg-gold/10 text-gold"><KeyRound className="h-5 w-5" /></div>
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Set new password</p>
          <h1 className="mt-2 font-display text-3xl">Reset your password</h1>
          <p className="mt-2 text-sm text-muted-foreground">Choose a strong password you haven't used before.</p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-widest">New password</Label>
            <Input type="password" required className="h-11" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-widest">Confirm password</Label>
            <Input type="password" required className="h-11" />
          </div>
        </div>
        <Button className="h-11 w-full uppercase tracking-[0.2em]">Update password</Button>
        <div className="text-center text-sm">
          <Link href="/admin/login" className="text-muted-foreground hover:text-foreground">← Back to sign in</Link>
        </div>
      </form>
    </div>
  );
}