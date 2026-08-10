"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/lib/theme";
import { StoreProvider } from "@/lib/store";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Toaster } from "@/components/ui/sonner";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";

export function AppProviders({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  return (
    <ThemeProvider>
      <StoreProvider>
        <div className="min-h-screen flex flex-col">
          {!isAdmin && <Navbar />}
          <main className="flex-1">{children}</main>
          {!isAdmin && <Footer />}
        </div>
        {!isAdmin && <WhatsAppButton />}
        <Toaster />
      </StoreProvider>
    </ThemeProvider>
  );
}
