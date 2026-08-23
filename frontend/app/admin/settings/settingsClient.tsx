"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/lib/theme";
import { useAdminSettings, saveSettings, defaultSettings, type AdminSettings } from "@/lib/admin-store";
import { toast } from "sonner";

export function PageClient() {
  const saved = useAdminSettings();
  const { theme, toggle } = useTheme();
  const [form, setForm] = useState<AdminSettings>(saved);

  useEffect(() => { setForm(saved); }, [saved]);

  const set = <K extends keyof AdminSettings>(k: K, v: AdminSettings[K]) => setForm((f) => ({ ...f, [k]: v }));
  const dirty = JSON.stringify(form) !== JSON.stringify(saved);

  return (
    <AdminShell title="Settings" breadcrumbs={[{ label: "Settings" }]}>
      <Tabs defaultValue="store">
        <TabsList className="mb-6 flex-wrap">
          <TabsTrigger value="store">Store</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="store" className="grid gap-4 border border-border/60 bg-card p-6 md:grid-cols-2">
          <div className="space-y-2"><Label>Store name</Label><Input value={form.storeName} onChange={(e) => set("storeName", e.target.value)} /></div>
          <div className="space-y-2"><Label>Support email</Label><Input value={form.supportEmail} onChange={(e) => set("supportEmail", e.target.value)} /></div>
          <div className="space-y-2 md:col-span-2"><Label>Description</Label><Textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} /></div>
          <div className="space-y-2"><Label>Currency</Label><Input value={form.currency} onChange={(e) => set("currency", e.target.value)} /></div>
          <div className="space-y-2"><Label>Timezone</Label><Input value={form.timezone} onChange={(e) => set("timezone", e.target.value)} /></div>
        </TabsContent>

        <TabsContent value="payment" className="space-y-3 border border-border/60 bg-card p-6">
          {Object.keys(form.payments).map((n) => (
            <div key={n} className="flex items-center justify-between border-b border-border/40 pb-3 last:border-0">
              <div><div className="font-medium">{n}</div><div className="text-xs text-muted-foreground">Accept payments via {n}</div></div>
              <Switch checked={form.payments[n]} onCheckedChange={(v) => set("payments", { ...form.payments, [n]: v })} />
            </div>
          ))}
        </TabsContent>

        <TabsContent value="shipping" className="grid gap-4 border border-border/60 bg-card p-6 md:grid-cols-2">
          <div className="space-y-2"><Label>Standard rate</Label><Input value={form.shipping.standard} onChange={(e) => set("shipping", { ...form.shipping, standard: e.target.value })} /></div>
          <div className="space-y-2"><Label>Free shipping over</Label><Input value={form.shipping.freeOver} onChange={(e) => set("shipping", { ...form.shipping, freeOver: e.target.value })} /></div>
          <div className="space-y-2"><Label>Express rate</Label><Input value={form.shipping.express} onChange={(e) => set("shipping", { ...form.shipping, express: e.target.value })} /></div>
          <div className="space-y-2"><Label>Processing time</Label><Input value={form.shipping.processing} onChange={(e) => set("shipping", { ...form.shipping, processing: e.target.value })} /></div>
        </TabsContent>

        <TabsContent value="social" className="grid gap-4 border border-border/60 bg-card p-6 md:grid-cols-2">
          {Object.keys(form.social).map((s) => (
            <div key={s} className="space-y-2">
              <Label>{s}</Label>
              <Input value={form.social[s]} placeholder={`https://${s.toLowerCase()}.com/kosisi`} onChange={(e) => set("social", { ...form.social, [s]: e.target.value })} />
            </div>
          ))}
        </TabsContent>

        <TabsContent value="theme" className="space-y-4 border border-border/60 bg-card p-6">
          <div className="flex items-center justify-between">
            <div><div className="font-medium">Dark mode</div><div className="text-xs text-muted-foreground">Applies instantly across the admin and storefront</div></div>
            <Switch checked={theme === "dark"} onCheckedChange={() => toggle()} />
          </div>
          <div className="flex items-center justify-between">
            <div><div className="font-medium">Reset settings</div><div className="text-xs text-muted-foreground">Restore every setting to its default value</div></div>
            <Button variant="outline" onClick={() => { saveSettings(defaultSettings); toast.success("Settings reset"); }}>Reset</Button>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-3 border border-border/60 bg-card p-6">
          {Object.keys(form.notifications).map((n) => (
            <div key={n} className="flex items-center justify-between border-b border-border/40 pb-3 last:border-0">
              <div className="text-sm">{n}</div>
              <Switch checked={form.notifications[n]} onCheckedChange={(v) => set("notifications", { ...form.notifications, [n]: v })} />
            </div>
          ))}
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex items-center justify-end gap-3">
        {dirty && <span className="text-xs text-muted-foreground">Unsaved changes</span>}
        <Button variant="outline" disabled={!dirty} onClick={() => setForm(saved)}>Discard</Button>
        <Button
          className="bg-gold text-gold-foreground hover:bg-gold/90"
          disabled={!dirty}
          onClick={() => { saveSettings(form); toast.success("Settings saved"); }}
        >
          Save changes
        </Button>
      </div>
    </AdminShell>
  );
}