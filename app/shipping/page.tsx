import type { Metadata } from "next";
import { PolicyPage, PolicySection } from "@/components/site/PolicyPage";

export const metadata: Metadata = {
  title: "Shipping Policy — Kosisi Wears",
  description: "Kosisi Wears shipping policy: dispatch times, domestic and international rates, free shipping thresholds and customs guidance.",
};

export default function Page() {
  return (
    <PolicyPage eyebrow="Policies" title="Shipping Policy" intro="Every piece is checked by hand before it leaves the atelier. Here's exactly how it reaches you.">
      <PolicySection heading="Dispatch times">
        <p>Orders placed before 2pm WAT on a business day are packed the same day. Made-to-order uniforms and varsity jackets take 3–5 working days before dispatch.</p>
      </PolicySection>
      <PolicySection heading="Rates">
        <ul className="space-y-2">
          <li>Lagos &amp; Abuja — ₦3,500 flat, 1–2 business days</li>
          <li>Rest of Nigeria — ₦6,000 flat, 2–4 business days</li>
          <li>International (DHL Express) — from ₦28,000, 3–7 business days</li>
          <li>Free standard shipping on all orders over ₦250,000</li>
        </ul>
      </PolicySection>
      <PolicySection heading="Duties &amp; customs">
        <p>International orders may attract import duties set by your local authority. These are payable by the recipient and are not included in the checkout total.</p>
      </PolicySection>
      <PolicySection heading="Lost or delayed parcels">
        <p>If tracking hasn't moved in 5 business days, message us on WhatsApp with your order number and we'll open a claim with the courier the same day.</p>
      </PolicySection>
    </PolicyPage>
  );
}
