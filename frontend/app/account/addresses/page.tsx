import type { Metadata } from "next";
import { PageClient } from "./AddressesClient";

export const metadata: Metadata = {
  title: "Addresses — Kosisi",
  description: "Manage your saved delivery addresses.",
};

export default function Page() {
  return <PageClient />;
}
