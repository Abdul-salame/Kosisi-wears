"use client";

import { MessageCircle, Mail, Phone, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function ContactClient() {
  return (
    <div className="container-luxury py-12">
      <div className="max-w-2xl">
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Get in touch</p>
        <h1 className="font-display text-5xl sm:text-6xl mt-3">We&apos;re listening.</h1>
        <p className="mt-4 text-muted-foreground">Whether you have a question, a special request, or need help with an order — our concierge is here.</p>
      </div>

      <div className="mt-12 grid lg:grid-cols-[1fr_400px] gap-10">
        <section className="border border-border p-8">
          <h2 className="font-display text-2xl">Send a message</h2>
          <form onSubmit={(e) => { e.preventDefault(); toast.success("Message sent", { description: "We'll respond within 24 hours." }); }} className="mt-6 grid sm:grid-cols-2 gap-4">
            <div><Label>Name</Label><Input required className="rounded-none mt-2" /></div>
            <div><Label>Email</Label><Input required type="email" className="rounded-none mt-2" /></div>
            <div className="sm:col-span-2"><Label>Subject</Label><Input className="rounded-none mt-2" /></div>
            <div className="sm:col-span-2"><Label>Message</Label><Textarea rows={6} required className="rounded-none mt-2" /></div>
            <Button type="submit" className="rounded-none h-12 px-8 text-[11px] uppercase tracking-[0.2em] sm:col-span-2 sm:w-auto sm:justify-self-start">Send Message</Button>
          </form>
        </section>

        <aside className="space-y-4">
          {[
            { icon: MessageCircle, label: "WhatsApp", value: "+234 800 000 0000", href: "https://wa.me/2348000000000", tone: "gold" },
            { icon: Mail, label: "Email", value: "concierge@kosisi.co", href: "mailto:concierge@kosisi.co" },
            { icon: Phone, label: "Phone", value: "+234 800 000 0000", href: "tel:+2348000000000" },
            { icon: MapPin, label: "Atelier", value: "12 Bourdillon Road, Ikoyi, Lagos" },
          ].map((c, i) => (
            <a key={i} href={c.href} target="_blank" rel="noreferrer" className="flex items-start gap-4 border border-border p-5 hover:border-gold transition-colors">
              <div className={"h-10 w-10 grid place-items-center rounded-full " + (c.tone === "gold" ? "bg-gold text-gold-foreground" : "border border-gold text-gold")}>
                <c.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{c.label}</p>
                <p className="mt-1 font-medium">{c.value}</p>
              </div>
            </a>
          ))}
          <div className="border border-border p-5">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em]"><Clock className="h-4 w-4 text-gold" /> Business hours</div>
            <dl className="mt-4 space-y-1 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Mon – Fri</dt><dd>10:00 – 19:00</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Saturday</dt><dd>11:00 – 17:00</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Sunday</dt><dd>By appointment</dd></div>
            </dl>
          </div>
        </aside>
      </div>

      <section className="mt-12">
        <div className="relative aspect-[21/9] overflow-hidden bg-secondary border border-border">
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <MapPin className="h-8 w-8 mx-auto text-gold" />
              <p className="mt-3 font-display text-xl">Google Maps Placeholder</p>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1">12 Bourdillon Road, Ikoyi, Lagos</p>
            </div>
          </div>
          <div className="absolute inset-0" style={{ background: "repeating-linear-gradient(45deg, transparent, transparent 24px, oklch(from var(--foreground) l c h / 3%) 24px, oklch(from var(--foreground) l c h / 3%) 48px)" }} />
        </div>
      </section>
    </div>
  );
}
