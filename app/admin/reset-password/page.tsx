import type { Metadata } from "next";
import { PageClient } from "./resetPasswordClient";

export const metadata: Metadata = {
  title: "Reset Password — Kosisi Admin",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PageClient />;
}
