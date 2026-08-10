import { useSyncExternalStore } from "react";
import { notifications as seed, type AdminNotification } from "./admin-data";

let state: AdminNotification[] = seed.map((n) => ({ ...n }));
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useAdminNotifications() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => state,
  );
}

export function markNotificationRead(id: number) {
  state = state.map((n) => (n.id === id ? { ...n, read: true } : n));
  emit();
}

export function markAllNotificationsRead() {
  state = state.map((n) => ({ ...n, read: true }));
  emit();
}

export function toggleNotificationRead(id: number) {
  state = state.map((n) => (n.id === id ? { ...n, read: !n.read } : n));
  emit();
}

export function unreadNotificationCount() {
  return state.filter((n) => !n.read).length;
}