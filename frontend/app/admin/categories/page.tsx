import type { Metadata } from "next";
import { PageClient } from "./categoriesClient";

export const metadata: Metadata = {
  title: "Categories — Kosisi Admin",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PageClient />;
}
