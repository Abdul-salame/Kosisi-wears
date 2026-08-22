import { jsPDF } from "jspdf";
import { BRAND } from "./brand";
import type { PlacedOrder } from "./placed-orders";

const PAYMENT_LABEL: Record<string, string> = {
  card: "Card payment",
  paystack: "Paystack",
};

const money = (n: number) => "NGN " + n.toLocaleString("en-NG", { maximumFractionDigits: 0 });

export const trackingPath = (id: string) => `/track?order=${encodeURIComponent(id)}`;

export const trackingUrl = (id: string) =>
  (typeof window !== "undefined" ? window.location.origin : "https://kosisiwears.com") + trackingPath(id);

const loadImageDataUrl = async (src: string) => {
  const res = await fetch(src);
  if (!res.ok) throw new Error(`Failed to load image: ${src}`);
  const blob = await res.blob();
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export async function downloadReceiptPdf(order: PlacedOrder) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const M = 48;
  let y = 64;
  let brandTextX = M;

  try {
    const logoDataUrl = await loadImageDataUrl(BRAND.logo);
    const logoSize = 34; // BRAND.logo is a square asset — keep width/height equal to avoid distortion
    doc.addImage(logoDataUrl, "JPEG", M, y - logoSize + 6, logoSize, logoSize);
    brandTextX += logoSize + 12;
  } catch {
    // If the logo cannot be loaded, fall back to text-only header.
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(BRAND.short, brandTextX, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text("RECEIPT", W - M, y - 12, { align: "right" });
  doc.setFontSize(10);
  doc.setTextColor(60);
  doc.text(order.id, W - M, y + 2, { align: "right" });
  y += 16;
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(BRAND.tagline, M, y);
  doc.text(new Date(order.placedAt).toLocaleString(), W - M, y, { align: "right" });

  y += 18;
  doc.setDrawColor(200);
  doc.line(M, y, W - M, y);
  y += 26;

  // Billed to / shipping
  doc.setTextColor(30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Billed to", M, y);
  doc.text("Delivery", W / 2, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(80);
  const left = [order.name, order.email, order.phone || ""].filter(Boolean);
  const right = [
    order.deliveryLabel,
    order.address,
    `${order.city} ${order.postal}`,
    [order.state, order.country].filter(Boolean).join(", "),
  ].filter(Boolean);
  const rows = Math.max(left.length, right.length);
  for (let i = 0; i < rows; i++) {
    const ly = y + 14 + i * 12;
    if (left[i]) doc.text(String(left[i]), M, ly);
    if (right[i]) doc.text(String(right[i]), W / 2, ly);
  }
  y += 14 + rows * 12 + 16;

  // Items table header
  doc.setDrawColor(220);
  doc.line(M, y, W - M, y);
  y += 14;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30);
  doc.text("Item", M, y);
  doc.text("Qty", W - M - 150, y, { align: "right" });
  doc.text("Price", W - M - 80, y, { align: "right" });
  doc.text("Amount", W - M, y, { align: "right" });
  y += 8;
  doc.line(M, y, W - M, y);
  y += 16;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(60);
  order.items.forEach((i) => {
    if (y > 720) { doc.addPage(); y = 64; }
    const name = doc.splitTextToSize(i.name, 240) as string[];
    doc.text(name[0], M, y);
    doc.setTextColor(130);
    doc.setFontSize(8);
    doc.text(`${i.size} / ${i.color}`, M, y + 11);
    doc.setFontSize(9);
    doc.setTextColor(60);
    doc.text(String(i.qty), W - M - 150, y, { align: "right" });
    doc.text(money(i.price), W - M - 80, y, { align: "right" });
    doc.text(money(i.price * i.qty), W - M, y, { align: "right" });
    y += 28;
  });

  doc.setDrawColor(220);
  doc.line(M, y - 8, W - M, y - 8);
  y += 8;

  const totalRow = (label: string, value: string, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setTextColor(bold ? 20 : 90);
    doc.setFontSize(bold ? 11 : 9);
    doc.text(label, W - M - 150, y);
    doc.text(value, W - M, y, { align: "right" });
    y += bold ? 20 : 15;
  };
  totalRow("Subtotal", money(order.subtotal));
  if (order.discount > 0)
    totalRow(`Discount${order.couponCode ? ` (${order.couponCode})` : ""}`, "-" + money(order.discount));
  totalRow("Delivery", order.deliveryFee === 0 ? "Free" : money(order.deliveryFee));
  totalRow("Total paid", money(order.total), true);

  y += 12;
  doc.setDrawColor(220);
  doc.line(M, y, W - M, y);
  y += 20;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(30);
  doc.text("Payment details", M, y);
  y += 14;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(80);
  doc.text(`Method: ${PAYMENT_LABEL[order.payment] ?? order.payment}`, M, y);
  y += 12;
  doc.text(
    order.payment === "card"
      ? `Card ending ${order.cardLast4 ?? "----"} - authorised`
      : `Confirmed via ${PAYMENT_LABEL[order.payment] ?? order.payment} - reference ${order.id}`,
    M,
    y,
  );
  y += 12;
  doc.text(`Status: Paid - ${money(order.total)}`, M, y);

  y += 22;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(30);
  doc.text("Track this order", M, y);
  y += 14;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(80);
  doc.text(`Order reference: ${order.id}`, M, y);
  y += 12;
  const link = trackingUrl(order.id);
  doc.setTextColor(20, 90, 180);
  doc.textWithLink(link, M, y, { url: link });
  doc.setTextColor(80);

  y += 34;
  doc.setFontSize(8);
  doc.setTextColor(140);
  doc.text(`Thank you for shopping with ${BRAND.name}. Questions? ${BRAND.email}`, M, y);

  doc.save(`${BRAND.short}-receipt-${order.id}.pdf`);
}