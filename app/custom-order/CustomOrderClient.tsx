"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import {
  saveCustomOrderRequest,
  newCustomOrderId,
  type CustomOrderItemType,
  type CustomOrderRequest,
} from "@/lib/custom-orders";
import { addNotification } from "@/lib/admin-notifications";
import { toast } from "sonner";

export function CustomOrderClient() {
  const params = useSearchParams();
  const prefillRef = params.get("ref") ?? "";
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageDataUrl, setImageDataUrl] = useState<string>("");
  const [submitted, setSubmitted] = useState<CustomOrderRequest | null>(null);

  const onImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageDataUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const request: CustomOrderRequest = {
      id: newCustomOrderId(),
      createdAt: new Date().toISOString(),
      itemType: String(f.get("itemType") || "Jersey") as CustomOrderItemType,
      styleReference: String(f.get("styleReference") || "") || undefined,
      colors: String(f.get("colors") || ""),
      teamOrClubName: String(f.get("teamOrClubName") || "") || undefined,
      playerNamesNumbers: String(f.get("playerNamesNumbers") || "") || undefined,
      notes: String(f.get("notes") || "") || undefined,
      referenceImage: imageDataUrl || undefined,
      name: String(f.get("name") || ""),
      email: String(f.get("email") || ""),
      phone: String(f.get("phone") || "") || undefined,
      status: "New",
    };
    saveCustomOrderRequest(request);
    addNotification({
      title: "New custom order request",
      desc: `${request.name} requested a custom ${request.itemType.toLowerCase()} (${request.id})`,
      type: "custom",
    });
    toast.success("Request sent — we'll be in touch soon.");
    setSubmitted(request);
  };

  if (submitted) {
    return (
      <div className="container-luxury py-16 max-w-2xl">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 rounded-full bg-gold/10 border border-gold grid place-items-center">
            <Check className="h-10 w-10 text-gold" />
          </div>
          <p className="mt-6 text-[11px] uppercase tracking-[0.3em] text-gold">Request received</p>
          <h1 className="mt-3 font-display text-4xl sm:text-6xl">Thank you.</h1>
          <p className="mt-4 text-muted-foreground">
            {submitted.name}, we've received your custom {submitted.itemType.toLowerCase()} request.
            The atelier will review it and reach out to {submitted.email} within 24–48 hours with a quote.
          </p>
        </div>
        <div className="mt-10 border border-border p-6 text-left text-sm space-y-2">
          <div className="flex justify-between"><span className="text-muted-foreground">Reference</span><span className="font-display">{submitted.id}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Item</span><span>{submitted.itemType}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Colors</span><span>{submitted.colors || "—"}</span></div>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="outline" className="rounded-none h-12 px-8 text-[11px] uppercase tracking-[0.2em]">
            <Link href="/portfolio">Back to Our Work</Link>
          </Button>
          <Button asChild className="rounded-none h-12 px-8 text-[11px] uppercase tracking-[0.2em] bg-gold hover:bg-gold/90 text-gold-foreground">
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-luxury py-16 max-w-3xl">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Custom Order" }]} />
      <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Commission Your Own</p>
      <h1 className="mt-3 font-display text-4xl sm:text-6xl">Design your piece.</h1>
      <p className="mt-4 max-w-xl text-muted-foreground">
        Tell us what you're picturing — colors, crest, numbers, a reference from our{" "}
        <Link href="/portfolio" className="text-gold hover:underline">portfolio</Link> — and we'll follow
        up with a quote and timeline. This isn't an instant checkout; a member of the atelier reviews
        every request personally.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Item type</Label>
          <Select name="itemType" defaultValue="Jersey">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Jersey">Jersey / Kit</SelectItem>
              <SelectItem value="Cap">Cap</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Style reference (optional)</Label>
          <Input name="styleReference" defaultValue={prefillRef} placeholder="e.g. Hooped Club Kits, K2 Cap" />
        </div>

        <div className="space-y-2">
          <Label>Colors</Label>
          <Input name="colors" required placeholder="e.g. Navy, gold, white" />
        </div>
        <div className="space-y-2">
          <Label>Team / Club / Company name</Label>
          <Input name="teamOrClubName" placeholder="Optional" />
        </div>

        <div className="sm:col-span-2 space-y-2">
          <Label>Player names / numbers</Label>
          <Textarea name="playerNamesNumbers" rows={3} placeholder="e.g. 1. Adeyemi — 7, 2. Bello — 10 …" />
        </div>

        <div className="sm:col-span-2 space-y-2">
          <Label>Notes</Label>
          <Textarea name="notes" rows={3} placeholder="Anything else we should know — fit, deadline, quantity…" />
        </div>

        <div className="sm:col-span-2 space-y-2">
          <Label>Reference image (optional)</Label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div>
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                <Upload className="mr-2 h-4 w-4" /> Upload image
              </Button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onImagePick} />
            </div>
            {imageDataUrl ? (
              <div className="h-24 w-24 overflow-hidden rounded border border-border bg-muted">
                <img src={imageDataUrl} alt="Reference preview" className="h-full w-full object-cover" />
              </div>
            ) : (
              <div className="h-24 w-24 rounded border border-dashed border-border/70 bg-muted/50 text-center text-xs text-muted-foreground flex items-center justify-center px-2">
                No image
              </div>
            )}
          </div>
        </div>

        <div className="sm:col-span-2 border-t border-border pt-6 grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Your name</Label>
            <Input name="name" required />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input name="email" type="email" required />
          </div>
          <div className="space-y-2">
            <Label>Phone (optional)</Label>
            <Input name="phone" type="tel" />
          </div>
        </div>

        <div className="sm:col-span-2">
          <Button type="submit" size="lg" className="w-full sm:w-auto rounded-none h-12 px-10 text-[11px] uppercase tracking-[0.2em] bg-gold hover:bg-gold/90 text-gold-foreground">
            Send Request
          </Button>
        </div>
      </form>
    </div>
  );
}
