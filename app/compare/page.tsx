import type { Metadata } from "next";
import { PageClient } from "./compareClient";

export const metadata: Metadata = {
  title: "Compare Pieces — Kosisi Wears",
  description: "Compare Kosisi Wears jerseys, hoodies and jackets side by side — price, sizes, colours, ratings and availability.",
};

export default function Page() {
  return <PageClient />;
}
