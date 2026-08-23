import type { Metadata } from "next";
import { CartClient } from "./CartClient";

export const metadata: Metadata = {
  title: "Shopping Bag — Kosisi",
  description: "Review the items in your Kosisi shopping bag before checkout.",
};

export default function Page() {
  return <CartClient />;
}
