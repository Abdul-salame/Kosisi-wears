import { MessageCircle } from "lucide-react";
import { BRAND, whatsappLink } from "@/lib/brand";

export function WhatsAppButton() {
  return (
    <a
      href={whatsappLink(`Hello ${BRAND.name}! I'd like to ask about an order.`)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-gold px-4 py-3 text-gold-foreground shadow-lg transition-transform hover:scale-105"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden text-[11px] uppercase tracking-[0.2em] sm:inline">Chat with us</span>
    </a>
  );
}
