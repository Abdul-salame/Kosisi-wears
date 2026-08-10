import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { products, type Product } from "./products";

export type CartItem = {
  id: string;
  productId: string;
  size: string;
  color: string;
  qty: number;
};

type StoreCtx = {
  cart: CartItem[];
  wishlist: string[];
  addToCart: (p: Product, size: string, color: string, qty?: number) => void;
  updateQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  inWishlist: (productId: string) => boolean;
  subtotal: number;
  shipping: number;
  total: number;
  count: number;
  hydrated: boolean;
};

const Ctx = createContext<StoreCtx | null>(null);

function load<T>(k: string, fb: T): T {
  if (typeof window === "undefined") return fb;
  try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : fb; } catch { return fb; }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCart(load<CartItem[]>("cart", []));
    setWishlist(load<string[]>("wishlist", []));
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem("cart", JSON.stringify(cart)); }, [cart, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("wishlist", JSON.stringify(wishlist)); }, [wishlist, hydrated]);

  const value = useMemo<StoreCtx>(() => {
    const subtotal = cart.reduce((sum, i) => {
      const p = products.find((x) => x.id === i.productId);
      return sum + (p ? p.price * i.qty : 0);
    }, 0);
    const shipping = subtotal > 0 ? (subtotal > 250 ? 0 : 15) : 0;
    return {
      cart,
      wishlist,
      addToCart: (p, size, color, qty = 1) => {
        setCart((c) => {
          const key = `${p.id}-${size}-${color}`;
          const existing = c.find((x) => x.id === key);
          if (existing) return c.map((x) => (x.id === key ? { ...x, qty: x.qty + qty } : x));
          return [...c, { id: key, productId: p.id, size, color, qty }];
        });
        toast.success(`Added to bag`, { description: `${p.name} · ${size} · ${color}` });
      },
      updateQty: (id, qty) => setCart((c) => c.map((x) => (x.id === id ? { ...x, qty: Math.max(1, qty) } : x))),
      removeItem: (id) => setCart((c) => c.filter((x) => x.id !== id)),
      clearCart: () => setCart([]),
      toggleWishlist: (pid) =>
        setWishlist((w) => {
          if (w.includes(pid)) { toast("Removed from wishlist"); return w.filter((x) => x !== pid); }
          toast.success("Added to wishlist");
          return [...w, pid];
        }),
      inWishlist: (pid) => wishlist.includes(pid),
      subtotal, shipping, total: subtotal + shipping,
      count: cart.reduce((a, b) => a + b.qty, 0),
      hydrated,
    };
  }, [cart, wishlist, hydrated]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore must be used within StoreProvider");
  return v;
}

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n);