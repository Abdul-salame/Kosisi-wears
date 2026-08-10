import type { Metadata } from "next";
import { PageClient } from "./customersClient";

export const metadata: Metadata = {
  title: "Customers — Kosisi Admin",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PageClient />;
}
