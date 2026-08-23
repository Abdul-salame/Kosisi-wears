import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — Kosisi Wears",
  description: "Answers to common questions about Kosisi sizing, shipping, returns, care and craftsmanship.",
};

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";


const FAQS = {
  "Orders & Shipping": [
    ["How long does shipping take?", "Standard delivery is 3–5 business days within the EU/US and 5–10 days internationally. Express (1–2 days) is available at checkout."],
    ["Do you offer free shipping?", "Yes — complimentary worldwide shipping on all orders over ₦250,000."],
    ["Can I track my order?", "Absolutely. You'll receive a tracking link by email as soon as your order leaves the atelier."],
  ],
  "Returns & Exchanges": [
    ["What is your return policy?", "We accept returns within 30 days on unworn pieces with tags attached. Refunds are issued to the original payment method within 5 business days of receipt."],
    ["Can I exchange for a different size?", "Yes — simply return the piece and reorder your correct size. We'll expedite the replacement free of charge."],
  ],
  "Sizing & Fit": [
    ["Do your pieces run true to size?", "Most of our pieces are true to size. Hoodies and varsity jackets have an oversized cut — size down for a fitted silhouette."],
    ["Where can I find a size guide?", "A detailed size guide is linked on every product page under the size selector."],
  ],
  "Craftsmanship & Care": [
    ["Where are your pieces made?", "Every piece is cut and finished by hand in our Lagos atelier, with select pieces produced in Portugal for European distribution."],
    ["How should I care for my Kosisi piece?", "Cold wash inside out, hang to dry, warm iron on the reverse. We stand behind our stitching for life — send it back for repairs, on us."],
  ],
  "Account & Payments": [
    ["Do I need an account to order?", "No — guest checkout is fully supported. Creating an account unlocks order history, saved addresses, and early access to drops."],
    ["What payment methods do you accept?", "Cards (Visa, Mastercard, Amex) and Paystack."],
  ],
};

export default function Page() {
  return (
    <div className="container-luxury py-12 max-w-4xl">
      <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Help center</p>
      <h1 className="font-display text-5xl sm:text-6xl mt-3">Frequently asked.</h1>
      <p className="mt-4 text-muted-foreground max-w-xl">Everything you need to know about ordering, shipping, sizing and care.</p>

      <div className="mt-12 space-y-10">
        {Object.entries(FAQS).map(([section, items]) => (
          <section key={section}>
            <h2 className="font-display text-2xl mb-4">{section}</h2>
            <Accordion type="single" collapsible className="border-t border-border">
              {items.map(([q, a], i) => (
                <AccordionItem key={i} value={`${section}-${i}`} className="border-b border-border">
                  <AccordionTrigger className="text-left hover:text-gold hover:no-underline py-5">{q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-6">{a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ))}
      </div>
    </div>
  );
}