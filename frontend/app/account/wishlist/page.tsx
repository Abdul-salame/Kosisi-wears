import type { Metadata } from "next";
import { PageClient } from "./WishlistClient";

export const metadata: Metadata = {
  title: "My Wishlist — Kosisi",
  description: "Your saved Kosisi pieces.",
};

export default function Page() {
  return <PageClient />;
}
