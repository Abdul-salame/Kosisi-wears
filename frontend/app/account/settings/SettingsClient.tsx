"use client";

import { AccountLayout } from "@/components/site/AccountLayout";
import { useRef, useState } from "react";
import { Camera, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

function Settings() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(URL.createObjectURL(file));
    e.target.value = "";
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl">Account Settings</h1>
        <p className="text-sm text-muted-foreground mt-2">Manage your profile, communications and security.</p>
      </div>

      <section>
        <h2 className="font-display text-xl mb-4">Profile photo</h2>
        <div className="flex flex-wrap items-center gap-5">
          <div className="relative h-24 w-24 overflow-hidden rounded-full border border-gold/40 bg-secondary">
            {photo ? (
              <img src={photo} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <span className="grid h-full w-full place-items-center font-display text-2xl text-muted-foreground">AO</span>
            )}
          </div>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-3">
              <Button type="button" variant="outline" className="rounded-none text-[11px] uppercase tracking-[0.2em]" onClick={() => fileRef.current?.click()}>
                <Camera className="mr-2 h-4 w-4" /> Upload photo
              </Button>
              {photo && (
                <Button type="button" variant="ghost" className="rounded-none text-[11px] uppercase tracking-[0.2em]" onClick={() => setPhoto(null)}>
                  <Trash2 className="mr-2 h-4 w-4" /> Remove
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">JPG or PNG, square, at least 400×400px.</p>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPick} />
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl mb-4">Profile</h2>
        <div className="grid sm:grid-cols-2 gap-4 max-w-xl">
          <div><Label>First name</Label><Input className="rounded-none mt-2" defaultValue="Ada" /></div>
          <div><Label>Last name</Label><Input className="rounded-none mt-2" defaultValue="Obi" /></div>
          <div className="sm:col-span-2"><Label>Email</Label><Input className="rounded-none mt-2" defaultValue="ada@kosisi.co" /></div>
          <div className="sm:col-span-2"><Label>Phone</Label><Input className="rounded-none mt-2" defaultValue="+234 800 000 0000" /></div>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl mb-4">Password</h2>
        <div className="grid sm:grid-cols-2 gap-4 max-w-xl">
          <div><Label>Current password</Label><Input type="password" className="rounded-none mt-2" /></div>
          <div><Label>New password</Label><Input type="password" className="rounded-none mt-2" /></div>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl mb-4">Communications</h2>
        <div className="space-y-4 max-w-xl">
          {[
            { t: "New drop notifications", d: "First access to atelier drops" },
            { t: "Order updates", d: "Shipping and delivery emails" },
            { t: "Private events", d: "Invitations to Kosisi Society experiences" },
          ].map((s, i) => (
            <div key={i} className="flex items-center justify-between border border-border p-4">
              <div><p className="text-sm font-medium">{s.t}</p><p className="text-xs text-muted-foreground">{s.d}</p></div>
              <Switch defaultChecked={i < 2} />
            </div>
          ))}
        </div>
      </section>

      <div className="flex gap-3">
        <Button className="rounded-none">Save Changes</Button>
        <Button variant="outline" className="rounded-none">Cancel</Button>
      </div>
    </div>
  );
}
export function PageClient() {
  return (
    <AccountLayout>
      <Settings />
    </AccountLayout>
  );
}
