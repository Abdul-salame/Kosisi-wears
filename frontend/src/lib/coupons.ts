export type Coupon = { code: string; percent: number; label: string; minSpend?: number };

export const COUPONS: Coupon[] = [
  { code: "KOSISI10", percent: 10, label: "10% off your order" },
  { code: "WELCOME15", percent: 15, label: "15% off first order" },
  { code: "VIP20", percent: 20, label: "20% off orders over ₦300,000", minSpend: 300 },
];

export function validateCoupon(code: string, subtotal: number): { coupon?: Coupon; error?: string } {
  const found = COUPONS.find((c) => c.code.toLowerCase() === code.trim().toLowerCase());
  if (!found) return { error: "That coupon code isn't valid." };
  if (found.minSpend && subtotal < found.minSpend) {
    return { error: `Requires a minimum spend of ₦${found.minSpend.toLocaleString()}.` };
  }
  return { coupon: found };
}
