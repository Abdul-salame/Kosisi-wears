import type { Metadata } from "next";
import { PageClient } from "./OrdersClient";

export const metadata: Metadata = {
  title: "My Orders — Kosisi",
  description: "Track and review your Kosisi orders.",
};

export default function Page() {
  return <PageClient />;
}
