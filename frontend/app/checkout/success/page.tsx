import type { Metadata } from "next";
import { Suspense } from "react";
import { SuccessClient } from "./SuccessClient";

export const metadata: Metadata = {
  title: "Order Confirmed — Kosisi",
  description: "Your Kosisi order is confirmed. Thank you.",
  openGraph: {
    title: "Order Confirmed — Kosisi",
    description: "Thank you for your Kosisi order.",
  },
};

export default function Page() {
  return (
    <Suspense>
      <SuccessClient />
    </Suspense>
  );
}
