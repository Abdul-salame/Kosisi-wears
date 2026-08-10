import type { Metadata } from "next";
import { PageClient } from "./notificationsClient";

export const metadata: Metadata = {
  title: "Notifications — Kosisi Admin",
  description: "Recent alerts across orders, inventory, reviews, coupons and payments in the Kosisi admin suite.",
};

export default function Page() {
  return <PageClient />;
}
