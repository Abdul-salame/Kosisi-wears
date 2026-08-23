import type { Metadata } from "next";
import { PageClient } from "./customOrdersClient";

export const metadata: Metadata = {
  title: "Custom Requests — Kosisi Admin",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PageClient />;
}
