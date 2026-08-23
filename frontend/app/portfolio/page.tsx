import type { Metadata } from "next";
import { PortfolioClient } from "./PortfolioClient";

export const metadata: Metadata = {
  title: "Our Work — Kosisi Wears",
  description: "A showcase of custom club kits, corporate apparel, and event uniforms produced by the Kosisi atelier. Request a custom commission of your own.",
};

export default function Page() {
  return <PortfolioClient />;
}
