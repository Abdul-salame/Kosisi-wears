import { useEffect } from "react";
import { createPersistentStore } from "./persist";

const store = createPersistentStore<string[]>("recently-viewed", []);

export const useRecentlyViewed = store.useStore;

export function trackView(productId: string) {
  store.set((prev) => [productId, ...prev.filter((id) => id !== productId)].slice(0, 12));
}

export function useTrackView(productId: string) {
  useEffect(() => { trackView(productId); }, [productId]);
}

export const clearRecentlyViewed = () => store.set([]);
