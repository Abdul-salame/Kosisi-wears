import type { Metadata } from "next";
import { PageClient } from "./inventoryClient";

export const metadata: Metadata = {
  title: "Inventory — Kosisi Admin",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PageClient />;
}
