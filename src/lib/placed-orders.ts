import { createPersistentStore } from "./persist";

export type PlacedOrderItem = {
  productId: string;
  name: string;
  image: string;
  size: string;
  color: string;
  qty: number;
  price: number;
};

export type PaymentMethod = "card" | "paystack";

export type PlacedOrder = {
  id: string;
  placedAt: string;
  email: string;
  name: string;
  phone?: string;
  address: string;
  city: string;
  postal: string;
  state?: string;
  country: string;
  delivery: string;
  deliveryLabel: string;
  deliveryFee: number;
  payment: PaymentMethod;
  cardLast4?: string;
  couponCode?: string;
  items: PlacedOrderItem[];
  subtotal: number;
  discount: number;
  total: number;
};

const store = createPersistentStore<PlacedOrder[]>("placed-orders", []);

export const usePlacedOrders = store.useStore;
export const getPlacedOrders = store.get;

export const newOrderId = () =>
  "KW-" + Math.random().toString(36).slice(2, 7).toUpperCase();

export function savePlacedOrder(order: PlacedOrder) {
  store.set((prev) => [order, ...prev.filter((o) => o.id !== order.id)].slice(0, 25));
}

export const findPlacedOrder = (id?: string | null) =>
  id ? store.get().find((o) => o.id.toLowerCase() === id.toLowerCase()) : undefined;
