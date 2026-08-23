import type { Metadata } from "next";
import { PolicyPage, PolicySection } from "@/components/site/PolicyPage";

export const metadata: Metadata = {
  title: "Returns & Refunds — Kosisi Wears",
  description: "30-day returns on unworn Kosisi Wears pieces. How to start a return, exchange a size and when refunds are processed.",
};

export default function Page() {
  return (
    <PolicyPage eyebrow="Policies" title="Returns & Refunds" intro="If a piece isn't right, we make it right. You have 30 days from delivery.">
      <PolicySection heading="What can be returned">
        <p>Unworn, unwashed items with the original tags and dust bag attached. Custom team uniforms and personalised embroidery are final sale.</p>
      </PolicySection>
      <PolicySection heading="Starting a return">
        <ol className="list-decimal space-y-2 pl-5">
          <li>Message us on WhatsApp or email with your order number.</li>
          <li>We send a prepaid return label within 24 hours.</li>
          <li>Drop the parcel at any partner courier point.</li>
        </ol>
      </PolicySection>
      <PolicySection heading="Exchanges">
        <p>Size exchanges are free once per order. We hold your replacement size for 7 days while the original travels back to us.</p>
      </PolicySection>
      <PolicySection heading="Refund timing">
        <p>Refunds are issued to the original payment method within 3–5 business days of the return arriving at the atelier. Shipping fees are refunded only where the item arrived faulty.</p>
      </PolicySection>
    </PolicyPage>
  );
}
