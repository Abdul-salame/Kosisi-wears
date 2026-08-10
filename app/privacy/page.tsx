import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Kosisi",
  description: "How Kosisi collects, uses and protects your personal information.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className="container-luxury py-12 max-w-3xl">
      <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Legal</p>
      <h1 className="font-display text-5xl mt-3">Privacy Policy</h1>
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-2">Last updated · January 2026</p>

      <div className="prose prose-invert max-w-none mt-8 space-y-6 text-muted-foreground leading-relaxed">
        <p>This Privacy Policy explains how Kosisi Wears ("we", "our", "us") collects, uses and safeguards information you share when using our website or purchasing our products. This page is maintained by Kosisi and describes the practices currently applied to customer-facing services.</p>

        <h2 className="font-display text-2xl text-foreground mt-8">Information we collect</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Contact details you provide (name, email, phone, delivery address)</li>
          <li>Order and payment information required to fulfil your purchase</li>
          <li>Account preferences, wishlist items and communication settings</li>
          <li>Usage data such as browser type, device, and general location</li>
        </ul>

        <h2 className="font-display text-2xl text-foreground mt-8">How we use it</h2>
        <p>We use your information to process orders, provide customer support, personalise your experience, send transactional messages, and — with your consent — share news of new drops and private events.</p>

        <h2 className="font-display text-2xl text-foreground mt-8">Sharing</h2>
        <p>We share data only with trusted providers who help us operate the store (payment processors, shipping partners, email delivery). We do not sell personal information.</p>

        <h2 className="font-display text-2xl text-foreground mt-8">Your rights</h2>
        <p>You may request access, correction, or deletion of your personal information at any time by writing to <a className="text-gold underline" href="mailto:privacy@kosisi.co">privacy@kosisi.co</a>. Where applicable, you may also withdraw consent, object to certain processing, or lodge a complaint with your local data protection authority.</p>

        <h2 className="font-display text-2xl text-foreground mt-8">Cookies</h2>
        <p>We use essential cookies to run the store and optional analytics cookies to understand how visitors use the site. You can adjust cookie preferences in your browser.</p>

        <h2 className="font-display text-2xl text-foreground mt-8">Contact</h2>
        <p>Questions about this policy? Write to <a className="text-gold underline" href="mailto:privacy@kosisi.co">privacy@kosisi.co</a>.</p>
      </div>
    </div>
  );
}