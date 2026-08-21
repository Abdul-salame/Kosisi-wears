import type { Metadata } from "next";
import { Suspense } from "react";
import { CustomOrderClient } from "./CustomOrderClient";

export const metadata: Metadata = {
  title: "Custom Order — Kosisi Wears",
  description: "Commission a custom jersey, cap, or uniform from the Kosisi atelier. Tell us your colors, crest, and details and we'll send a quote.",
};

export default function Page() {
  return (
    <Suspense>
      <CustomOrderClient />
    </Suspense>
  );
}
