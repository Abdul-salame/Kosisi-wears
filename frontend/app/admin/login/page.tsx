import type { Metadata } from "next";
import { PageClient } from "./loginClient";

export const metadata: Metadata = {
  title: "Admin Sign In — Kosisi",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PageClient />;
}
