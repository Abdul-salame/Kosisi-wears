import type { Metadata } from "next";
import Link from "next/link";
import { PolicyPage, PolicySection } from "@/components/site/PolicyPage";

export const metadata: Metadata = {
  title: "Delivery Information — Kosisi Wears",
  description: "Delivery windows, courier partners, tracking and packaging details for every Kosisi Wears order.",
};

export default function Page() {
  return (
    <PolicyPage eyebrow="Help" title="Delivery Information" intro="Where your order goes after it leaves the atelier, and how to follow it.">
      <PolicySection heading="Courier partners">
        <p>We ship domestically with GIG Logistics and internationally with DHL Express. Both provide door-to-door tracking.</p>
      </PolicySection>
      <PolicySection heading="Tracking your parcel">
        <p>A tracking number is emailed the moment your parcel is scanned by the courier. You can also follow progress on our <Link href="/track" className="text-gold underline">order tracking page</Link>.</p>
      </PolicySection>
      <PolicySection heading="Delivery windows">
        <ul className="space-y-2">
          <li>Lagos &amp; Abuja — 1–2 business days</li>
          <li>Other Nigerian states — 2–4 business days</li>
          <li>West Africa — 3–5 business days</li>
          <li>Worldwide — 3–7 business days</li>
        </ul>
      </PolicySection>
      <PolicySection heading="Packaging">
        <p>Each piece ships folded in tissue inside a reusable cotton dust bag and a rigid gold-foiled box. Gift notes can be added at checkout free of charge.</p>
      </PolicySection>
    </PolicyPage>
  );
}
