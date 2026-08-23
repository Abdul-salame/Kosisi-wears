import type { Metadata } from "next";
import { PageClient } from "./DashboardClient";

export const metadata: Metadata = {
  title: "My Account — Kosisi",
  description: "Manage your Kosisi account, orders, wishlist and addresses.",
};

export default function Page() {
  return <PageClient />;
}
