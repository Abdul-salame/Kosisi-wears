import { useSyncExternalStore } from "react";

export function createPersistentStore<T>(key: string, initial: T) {
  let state = initial;
  let loaded = false;
  const listeners = new Set<() => void>();

  const emit = () => listeners.forEach((l) => l());

  const hydrate = () => {
    if (loaded || typeof window === "undefined") return;
    loaded = true;
    try {
      const raw = localStorage.getItem(key);
      if (raw) { state = JSON.parse(raw) as T; emit(); }
    } catch { /* ignore */ }
  };

  const set = (next: T | ((prev: T) => T)) => {
    state = typeof next === "function" ? (next as (p: T) => T)(state) : next;
    try { localStorage.setItem(key, JSON.stringify(state)); } catch { /* ignore */ }
    emit();
  };

  const subscribe = (l: () => void) => {
    hydrate();
    listeners.add(l);
    return () => { listeners.delete(l); };
  };

  const useStore = () => useSyncExternalStore(subscribe, () => state, () => initial);

  return { get: () => { hydrate(); return state; }, set, subscribe, useStore };
}
