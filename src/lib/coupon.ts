import { toast } from "sonner";
import { createPersistentStore } from "./persist";
import { COUPONS, validateCoupon, type Coupon } from "./coupons";

const store = createPersistentStore<string | null>("applied-coupon", null);

export const useAppliedCode = store.useStore;

export function applyCoupon(code: string, subtotal: number): boolean {
  const { coupon, error } = validateCoupon(code, subtotal);
  if (!coupon) {
    toast.error(error ?? "That coupon code isn't valid.");
    return false;
  }
  store.set(coupon.code);
  toast.success(`${coupon.code} applied`, { description: coupon.label });
  return true;
}

export function removeCoupon() {
  store.set(null);
  toast("Coupon removed");
}

export function findCoupon(code: string | null): Coupon | undefined {
  if (!code) return undefined;
  return COUPONS.find((c) => c.code === code);
}

/** Returns the active coupon + discount amount for a given subtotal. */
export function useDiscount(subtotal: number) {
  const code = useAppliedCode();
  const coupon = findCoupon(code);
  const valid = coupon && (!coupon.minSpend || subtotal >= coupon.minSpend);
  const discount = valid ? Math.round((subtotal * coupon!.percent) / 100) : 0;
  return { coupon: valid ? coupon : undefined, discount };
}
