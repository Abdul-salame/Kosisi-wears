import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions — Kosisi",
  description: "The terms and conditions governing your use of the Kosisi website and purchase of our products.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className="container-luxury py-12 max-w-3xl">
      <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Legal</p>
      <h1 className="font-display text-5xl mt-3">Terms & Conditions</h1>
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-2">Last updated · January 2026</p>

      <div className="mt-8 space-y-6 text-muted-foreground leading-relaxed">
        <p>These Terms & Conditions govern the use of kosisi.co and the purchase of goods from Kosisi Wears. By using the site or placing an order, you agree to be bound by these terms.</p>

        <h2 className="font-display text-2xl text-foreground mt-8">Orders</h2>
        <p>All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order at our discretion. Prices are shown in Naira (₦) unless otherwise stated and may change without notice.</p>

        <h2 className="font-display text-2xl text-foreground mt-8">Shipping & delivery</h2>
        <p>Delivery timelines are estimates. Title and risk of loss pass to you upon delivery to the carrier. Import duties and taxes for international orders are the responsibility of the customer.</p>

        <h2 className="font-display text-2xl text-foreground mt-8">Returns</h2>
        <p>Unworn pieces may be returned within 30 days of delivery. Items marked "Final Sale" are non-returnable. Refunds are issued to the original payment method within 5 business days of receipt.</p>

        <h2 className="font-display text-2xl text-foreground mt-8">Intellectual property</h2>
        <p>All content on this site — including logos, imagery, product designs and copy — is the property of Kosisi Wears and may not be reproduced without permission.</p>

        <h2 className="font-display text-2xl text-foreground mt-8">Limitation of liability</h2>
        <p>To the fullest extent permitted by law, Kosisi Wears is not liable for indirect, incidental, or consequential damages arising from the use of our products or website.</p>

        <h2 className="font-display text-2xl text-foreground mt-8">Governing law</h2>
        <p>These terms are governed by the laws of the Federal Republic of Nigeria, without regard to conflict-of-law principles.</p>

        <h2 className="font-display text-2xl text-foreground mt-8">Contact</h2>
        <p>Questions? Reach us at <a className="text-gold underline" href="mailto:legal@kosisi.co">legal@kosisi.co</a>.</p>
      </div>
    </div>
  );
}