import type { Metadata } from "next";
import { PageClient } from "./forgotPasswordClient";

export const metadata: Metadata = {
  title: "Forgot Password — Kosisi Admin",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PageClient />;
}
