import type { Metadata } from "next";
import { PageClient } from "./indexClient";

export const metadata: Metadata = {
  title: "Dashboard — Kosisi Admin",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PageClient />;
}
