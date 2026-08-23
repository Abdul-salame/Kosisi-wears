import type { Metadata } from "next";
import { PageClient } from "./productsClient";

export const metadata: Metadata = {
  title: "Products — Kosisi Admin",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PageClient />;
}
