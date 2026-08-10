import { createPersistentStore } from "./persist";
import {
  adminProducts, adminCategories, adminOrders, adminCustomers,
  adminCoupons, adminReviews, stockHistory,
  type AdminProduct, type AdminCategory, type AdminOrder, type AdminCustomer,
  type AdminCoupon, type AdminReview, type StockMovement, type OrderStatus,
} from "./admin-data";

const K = (n: string) => `kosisi.admin.${n}.v1`;

export const productsStore = createPersistentStore<AdminProduct[]>(K("products"), adminProducts);
export const categoriesStore = createPersistentStore<AdminCategory[]>(K("categories"), adminCategories);
export const ordersStore = createPersistentStore<AdminOrder[]>(K("orders"), adminOrders);
export const customersStore = createPersistentStore<AdminCustomer[]>(K("customers"), adminCustomers);
export const couponsStore = createPersistentStore<AdminCoupon[]>(K("coupons"), adminCoupons);
export const reviewsStore = createPersistentStore<AdminReview[]>(K("reviews"), adminReviews);
export const stockStore = createPersistentStore<StockMovement[]>(K("stock"), stockHistory);

export const useAdminProducts = productsStore.useStore;
export const useAdminCategories = categoriesStore.useStore;
export const useAdminOrders = ordersStore.useStore;
export const useAdminCustomers = customersStore.useStore;
export const useAdminCoupons = couponsStore.useStore;
export const useAdminReviews = reviewsStore.useStore;
export const useStockHistory = stockStore.useStore;

const today = () => new Date().toISOString().slice(0, 10);

/* ---------- products ---------- */
export function upsertProduct(p: AdminProduct) {
  productsStore.set((rows) =>
    rows.some((r) => r.id === p.id) ? rows.map((r) => (r.id === p.id ? p : r)) : [p, ...rows],
  );
}
export function deleteProducts(ids: string[]) {
  productsStore.set((rows) => rows.filter((r) => !ids.includes(r.id)));
}
export function setProductsStatus(ids: string[], status: AdminProduct["status"]) {
  productsStore.set((rows) => rows.map((r) => (ids.includes(r.id) ? { ...r, status } : r)));
}
export function adjustStock(productId: string, change: number, reason: string) {
  const product = productsStore.get().find((p) => p.id === productId);
  if (!product) return;
  productsStore.set((rows) =>
    rows.map((r) => (r.id === productId ? { ...r, stock: Math.max(0, r.stock + change) } : r)),
  );
  stockStore.set((rows) => [
    { id: `MOV-${Date.now()}`, product: product.name, change, reason, date: today() },
    ...rows,
  ]);
}

/* ---------- categories ---------- */
export function upsertCategory(c: AdminCategory) {
  categoriesStore.set((rows) =>
    rows.some((r) => r.id === c.id) ? rows.map((r) => (r.id === c.id ? c : r)) : [c, ...rows],
  );
}
export function deleteCategory(id: string) {
  categoriesStore.set((rows) => rows.filter((r) => r.id !== id));
}

/* ---------- orders ---------- */
export function updateOrderStatus(ids: string[], status: OrderStatus) {
  ordersStore.set((rows) => rows.map((r) => (ids.includes(r.id) ? { ...r, status } : r)));
}
export function deleteOrders(ids: string[]) {
  ordersStore.set((rows) => rows.filter((r) => !ids.includes(r.id)));
}

/* ---------- customers ---------- */
export function deleteCustomers(ids: string[]) {
  customersStore.set((rows) => rows.filter((r) => !ids.includes(r.id)));
}
export function setCustomerStatus(id: string, status: AdminCustomer["status"]) {
  customersStore.set((rows) => rows.map((r) => (r.id === id ? { ...r, status } : r)));
}

/* ---------- coupons ---------- */
export function upsertCoupon(c: AdminCoupon) {
  couponsStore.set((rows) =>
    rows.some((r) => r.id === c.id) ? rows.map((r) => (r.id === c.id ? c : r)) : [c, ...rows],
  );
}
export function deleteCoupon(id: string) {
  couponsStore.set((rows) => rows.filter((r) => r.id !== id));
}

/* ---------- reviews ---------- */
export function setReviewStatus(ids: string[], status: AdminReview["status"]) {
  reviewsStore.set((rows) => rows.map((r) => (ids.includes(r.id) ? { ...r, status } : r)));
}
export function deleteReviews(ids: string[]) {
  reviewsStore.set((rows) => rows.filter((r) => !ids.includes(r.id)));
}

/* ---------- settings ---------- */
export type AdminSettings = {
  storeName: string;
  supportEmail: string;
  description: string;
  currency: string;
  timezone: string;
  payments: Record<string, boolean>;
  shipping: { standard: string; freeOver: string; express: string; processing: string };
  social: Record<string, string>;
  notifications: Record<string, boolean>;
};

export const defaultSettings: AdminSettings = {
  storeName: "Kosisi Wears",
  supportEmail: "support@kosisi.co",
  description: "Luxury sportswear crafted in limited runs.",
  currency: "NGN",
  timezone: "Africa/Lagos",
  payments: { Paystack: true, Flutterwave: true, Stripe: false, "Bank transfer": true },
  shipping: { standard: "₦15,000", freeOver: "₦250,000", express: "₦35,000", processing: "2-3 business days" },
  social: { Instagram: "", TikTok: "", Twitter: "", YouTube: "" },
  notifications: {
    "New orders": true, "Low stock alerts": true, "New reviews": true,
    "Coupon expirations": false, "Weekly summary": true,
  },
};

export const settingsStore = createPersistentStore<AdminSettings>(K("settings"), defaultSettings);
export const useAdminSettings = settingsStore.useStore;
export function saveSettings(next: AdminSettings) {
  settingsStore.set(next);
}

/* ---------- session ---------- */
export type AdminSession = { email: string; name: string; role: string } | null;
export const sessionStore = createPersistentStore<AdminSession>(K("session"), null);
export const useAdminSession = sessionStore.useStore;
export function adminSignIn(email: string) {
  const name = email.split("@")[0]?.replace(/[._-]+/g, " ") || "Admin";
  sessionStore.set({
    email,
    name: name.replace(/\b\w/g, (c) => c.toUpperCase()),
    role: "Owner",
  });
}
export function adminSignOut() {
  sessionStore.set(null);
}