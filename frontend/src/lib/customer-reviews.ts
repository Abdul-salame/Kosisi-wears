import { createPersistentStore } from "./persist";

export type CustomerReview = {
  id: string;
  productId: string;
  name: string;
  rating: number;
  title: string;
  body: string;
  images: string[];
  date: string;
};

const store = createPersistentStore<CustomerReview[]>("customer-reviews", []);

export const useCustomerReviews = store.useStore;

export function addReview(review: Omit<CustomerReview, "id" | "date">) {
  store.set((prev) => [
    { ...review, id: `r-${Date.now()}`, date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
    ...prev,
  ]);
}

export const SEED_REVIEWS: Record<string, CustomerReview[]> = {};

export const seedReviews = (productId: string): CustomerReview[] => [
  { id: `s1-${productId}`, productId, name: "Amaka O.", rating: 5, title: "Worth every naira", body: "Absolutely stunning quality. Feels like it's built to outlive me.", images: [], date: "Jun 12, 2026" },
  { id: `s2-${productId}`, productId, name: "David K.", rating: 5, title: "Impeccable fit", body: "The gold detail is subtle but instantly recognisable. Sizing was true to the guide.", images: [], date: "May 28, 2026" },
  { id: `s3-${productId}`, productId, name: "Zara M.", rating: 4, title: "Runs slightly large", body: "Size down for a fitted look. Otherwise perfect — the fabric is heavy in the best way.", images: [], date: "May 02, 2026" },
];
