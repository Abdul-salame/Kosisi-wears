import type { Metadata } from "next";
import { CheckoutClient } from "./CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout — Kosisi",
  description: "Complete your Kosisi order — shipping, delivery and secure payment.",
  openGraph: {
    title: "Checkout — Kosisi",
    description: "Secure checkout for your Kosisi order.",
  },
};

export default function Page() {
  return <CheckoutClient />;
}
