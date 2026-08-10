import { toast } from "sonner";
import { createPersistentStore } from "./persist";

const MAX = 4;
const store = createPersistentStore<string[]>("compare", []);

export const useCompare = store.useStore;

export function toggleCompare(productId: string) {
  const current = store.get();
  if (current.includes(productId)) {
    store.set(current.filter((id) => id !== productId));
    toast("Removed from compare");
    return;
  }
  if (current.length >= MAX) {
    toast.error(`You can compare up to ${MAX} pieces`);
    return;
  }
  store.set([...current, productId]);
  toast.success("Added to compare");
}

export const inCompare = (id: string) => store.get().includes(id);
export const clearCompare = () => store.set([]);
