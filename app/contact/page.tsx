import type { Metadata } from "next";
import { ContactClient } from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact — Kosisi Wears",
  description: "Reach the Kosisi atelier by WhatsApp, email or phone. Visit our Lagos studio by appointment.",
};

export default function Page() {
  return <ContactClient />;
}
