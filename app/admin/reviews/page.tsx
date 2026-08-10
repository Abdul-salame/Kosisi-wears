import type { Metadata } from "next";
import { PageClient } from "./reviewsClient";

export const metadata: Metadata = {
  title: "Reviews — Kosisi Admin",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PageClient />;
}
