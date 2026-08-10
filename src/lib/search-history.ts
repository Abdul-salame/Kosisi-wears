import { createPersistentStore } from "./persist";

const store = createPersistentStore<string[]>("recent-searches", []);

export const useRecentSearches = store.useStore;
export const clearRecentSearches = () => store.set([]);

export function recordSearch(term: string) {
  const t = term.trim();
  if (t.length < 2) return;
  store.set((prev) => [t, ...prev.filter((x) => x.toLowerCase() !== t.toLowerCase())].slice(0, 6));
}

export const TRENDING_SEARCHES = [
  "Varsity jacket",
  "Heavyweight hoodie",
  "Home jersey",
  "Gold emblem cap",
  "Team uniform",
];
