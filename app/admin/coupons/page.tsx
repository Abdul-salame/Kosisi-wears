import type { Metadata } from "next";
import { PageClient } from "./couponsClient";

export const metadata: Metadata = {
  title: "Coupons — Kosisi Admin",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PageClient />;
}
