import type { Metadata } from "next";
import { PageClient } from "./ordersClient";

export const metadata: Metadata = {
  title: "Orders — Kosisi Admin",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PageClient />;
}
