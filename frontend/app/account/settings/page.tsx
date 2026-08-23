import type { Metadata } from "next";
import { PageClient } from "./SettingsClient";

export const metadata: Metadata = {
  title: "Account Settings — Kosisi",
  description: "Manage your Kosisi account preferences.",
};

export default function Page() {
  return <PageClient />;
}
