import type { Metadata } from "next";
import { Suspense } from "react";
import { TrackClient } from "./TrackClient";

export const metadata: Metadata = {
  title: "Track Your Order — Kosisi Wears",
  description: "Enter your Kosisi Wears order number to follow your piece from the atelier to your door — pending, paid, processing, shipped, delivered.",
  openGraph: {
    title: "Track Your Order — Kosisi Wears",
    description: "Follow your Kosisi Wears order in real time.",
  },
};

export default function Page() {
  return (
    <Suspense>
      <TrackClient />
    </Suspense>
  );
}
