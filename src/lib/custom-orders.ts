import { createPersistentStore } from "./persist";

export type CustomOrderItemType = "Jersey" | "Cap" | "Other";

export type CustomOrderStatus = "New" | "Contacted" | "Quoted" | "In Production" | "Closed";

export type CustomOrderRequest = {
  id: string;
  createdAt: string;
  itemType: CustomOrderItemType;
  styleReference?: string; // e.g. a portfolio piece title or cap series the customer referenced
  colors: string;
  teamOrClubName?: string;
  playerNamesNumbers?: string;
  notes?: string;
  referenceImage?: string; // base64 data URL, optional
  name: string;
  email: string;
  phone?: string;
  status: CustomOrderStatus;
  quotedPrice?: number;
};

const store = createPersistentStore<CustomOrderRequest[]>("custom-order-requests", []);

export const useCustomOrderRequests = store.useStore;
export const getCustomOrderRequests = store.get;

export const newCustomOrderId = () =>
  "CR-" + Math.random().toString(36).slice(2, 7).toUpperCase();

export function saveCustomOrderRequest(request: CustomOrderRequest) {
  store.set((prev) => [request, ...prev.filter((r) => r.id !== request.id)]);
}

export function updateCustomOrderStatus(ids: string[], status: CustomOrderStatus) {
  store.set((prev) => prev.map((r) => (ids.includes(r.id) ? { ...r, status } : r)));
}

export function updateCustomOrderQuote(id: string, quotedPrice: number) {
  store.set((prev) => prev.map((r) => (r.id === id ? { ...r, quotedPrice } : r)));
}

export function deleteCustomOrderRequests(ids: string[]) {
  store.set((prev) => prev.filter((r) => !ids.includes(r.id)));
}

export const findCustomOrderRequest = (id?: string | null) =>
  id ? store.get().find((r) => r.id.toLowerCase() === id.toLowerCase()) : undefined;
