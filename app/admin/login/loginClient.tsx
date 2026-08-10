"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { adminSignIn } from "@/lib/admin-store";

export function PageClient() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("admin@kosisi.co");
  const [password, setPassword] = useState("kosisi2026");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.includes("@") || password.length < 6) {
      setError("Enter a valid email and a password of at least 6 characters.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      adminSignIn(email);
      toast.success("Welcome back");
      router.push("/admin");
    }, 500);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/90 via-black/60 to-black/30" />
        <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center bg-gold text-gold-foreground font-display text-xl">A</div>
            <div>
              <div className="font-display text-xl">Kosisi</div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-gold/80">Admin Suite</div>
            </div>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Command Center</p>
            <h2 className="mt-4 max-w-md font-display text-5xl leading-tight">Curate the atelier.<br/>Command the drop.</h2>
            <p className="mt-6 max-w-md text-sm text-white/70">Manage inventory, orders, customers and analytics from a single elegant workspace.</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-6 md:p-12">
        <form onSubmit={submit} className="w-full max-w-sm space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-gold">
              <Shield className="h-3.5 w-3.5" /> Secure Admin Access
            </div>
            <h1 className="font-display text-4xl">Sign in</h1>
            <p className="text-sm text-muted-foreground">Enter your credentials to continue to the dashboard.</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs uppercase tracking-widest">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pw" className="text-xs uppercase tracking-widest">Password</Label>
              <div className="relative">
                <Input id="pw" type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required className="h-11 pr-10" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2"><Checkbox defaultChecked /> <span className="text-muted-foreground">Remember me</span></label>
              <Link href="/admin/forgot-password" className="text-gold hover:underline">Forgot?</Link>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <Button type="submit" disabled={loading} className="h-11 w-full bg-primary text-primary-foreground uppercase tracking-[0.2em] hover:bg-gold hover:text-gold-foreground">
            {loading ? "Signing in…" : "Sign in"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">← Back to storefront</Link>
          </p>
        </form>
      </div>
    </div>
  );
}