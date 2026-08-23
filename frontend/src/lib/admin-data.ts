export type OrderStatus = "Pending" | "Paid" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

export type AdminOrder = {
  id: string;
  customer: string;
  email: string;
  date: string;
  total: number;
  items: number;
  status: OrderStatus;
  payment: "Card" | "Paystack" | "Bank";
};

export type AdminCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  orders: number;
  spent: number;
  joined: string;
  status: "Active" | "VIP" | "Inactive";
};

export type AdminProduct = {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  discount: number;
  stock: number;
  sizes: string[];
  colors: string[];
  image: string;
  status: "Active" | "Draft" | "Archived";
  sold: number;
};

export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  products: number;
  image: string;
  status: "Active" | "Hidden";
};

export type AdminCoupon = {
  id: string;
  code: string;
  discount: number;
  type: "%" | "$";
  uses: number;
  limit: number;
  expires: string;
  status: "Active" | "Expired" | "Scheduled";
};

export type AdminReview = {
  id: string;
  product: string;
  customer: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  status: "Approved" | "Pending" | "Rejected";
};

export type StockMovement = {
  id: string;
  product: string;
  change: number;
  reason: string;
  date: string;
};

const IMG = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=400&q=80`;

const CATS = ["Hoodies", "Sweatshirts", "Varsity Jackets", "Uniforms", "Kaftans", "Caps"];
const NAMES = [
  "Monogram Heavy Hoodie", "Gold Crest Pullover",
  "Atelier Crewneck", "Heritage Varsity", "Onyx Letterman", "Signature Suit Set",
  "Royal Kaftan", "Ivory Kaftan", "Gold Emblem Cap", "Suede Six-Panel",
  "Charcoal Zip Hoodie", "Embroidered Crewneck", "Gilded Varsity",
  "Two-Piece Uniform", "Royal Embroidered Kaftan", "Gold Crest Kaftan", "Bone Baseball Cap",
];
const IMGS = [
  "photo-1620799140408-edc6dcb6d633","photo-1556821840-3a63f95609a7","photo-1591047139829-d91aecb6caea",
  "photo-1521572163474-6864f9cf17ab","photo-1588850561407-ed78c282e89b","photo-1516762689617-e1cffcef479d",
  "photo-1517466787929-bc90951d0974","photo-1503341504253-dff4815485f1","photo-1542291026-7eec264c27ff",
  "photo-1552374196-1ab2a1c593e8","photo-1512436991641-6745cdb1723f","photo-1523381210434-271e8be1f52b",
];

const s = (n: number) => { const x = Math.sin(n) * 10000; return x - Math.floor(x); };

export const adminProducts: AdminProduct[] = NAMES.map((n, i) => ({
  id: `PRD-${1000 + i}`,
  name: n,
  sku: `KW-${String(1000 + i)}`,
  category: CATS[i % CATS.length],
  price: Math.round((90 + s(i + 1) * 320) / 5) * 5,
  discount: s(i + 4) > 0.7 ? Math.round(s(i + 5) * 30) : 0,
  stock: Math.floor(s(i + 2) * 120),
  sizes: ["S", "M", "L", "XL"].slice(0, 2 + Math.floor(s(i + 3) * 3)),
  colors: ["Onyx", "Ivory", "Gold"].slice(0, 1 + Math.floor(s(i + 6) * 3)),
  image: IMG(IMGS[i % IMGS.length]),
  status: (s(i + 7) > 0.85 ? "Draft" : s(i + 7) < 0.1 ? "Archived" : "Active") as AdminProduct["status"],
  sold: Math.floor(s(i + 8) * 500),
}));

export const adminCategories: AdminCategory[] = CATS.map((c, i) => ({
  id: `CAT-${100 + i}`,
  name: c,
  slug: c.toLowerCase().replace(/\s+/g, "-"),
  products: 3 + Math.floor(s(i + 20) * 12),
  image: IMG(IMGS[i % IMGS.length]),
  status: "Active",
}));

const FIRST = ["Amaka", "David", "Zara", "Chinedu", "Sofia", "Ibrahim", "Tolu", "Nina", "Marcus", "Aisha", "Kenji", "Layla", "Omar", "Isla", "Kai"];
const LAST = ["Okafor", "Kim", "Martins", "Adeyemi", "Rossi", "Bello", "Ade", "Chen", "Silva", "Diallo", "Tanaka", "Hassan", "Khan", "Reid", "Wong"];
const CITIES = ["Lagos", "Abuja", "London", "New York", "Paris", "Milan", "Dubai", "Tokyo", "Accra", "Nairobi"];

export const adminCustomers: AdminCustomer[] = Array.from({ length: 24 }, (_, i) => {
  const orders = 1 + Math.floor(s(i + 30) * 24);
  const spent = orders * (120 + Math.floor(s(i + 31) * 400));
  return {
    id: `CUS-${2000 + i}`,
    name: `${FIRST[i % FIRST.length]} ${LAST[(i + 3) % LAST.length]}`,
    email: `${FIRST[i % FIRST.length].toLowerCase()}.${LAST[(i + 3) % LAST.length].toLowerCase()}@mail.com`,
    phone: `+${Math.floor(1 + s(i + 32) * 8)}${Math.floor(1000000000 + s(i + 33) * 8999999999)}`.slice(0, 14),
    city: CITIES[i % CITIES.length],
    orders,
    spent,
    joined: new Date(2024, (i * 3) % 12, (i * 5) % 28 + 1).toISOString().slice(0, 10),
    status: spent > 4000 ? "VIP" : s(i + 34) < 0.15 ? "Inactive" : "Active",
  };
});

const STATUSES: OrderStatus[] = ["Pending", "Paid", "Processing", "Shipped", "Delivered", "Cancelled"];
const PAYMENTS: AdminOrder["payment"][] = ["Card", "Paystack", "Bank"];

export const adminOrders: AdminOrder[] = Array.from({ length: 32 }, (_, i) => {
  const c = adminCustomers[i % adminCustomers.length];
  const items = 1 + Math.floor(s(i + 50) * 5);
  return {
    id: `#KW-${5000 + i}`,
    customer: c.name,
    email: c.email,
    date: new Date(2026, 6, 27 - (i % 27)).toISOString().slice(0, 10),
    total: Math.round((120 + s(i + 51) * 900) / 5) * 5,
    items,
    status: STATUSES[Math.floor(s(i + 52) * STATUSES.length)],
    payment: PAYMENTS[i % PAYMENTS.length],
  };
});

export const adminCoupons: AdminCoupon[] = [
  { id: "1", code: "KOSISI10", discount: 10, type: "%", uses: 148, limit: 500, expires: "2026-12-31", status: "Active" },
  { id: "2", code: "GOLD20", discount: 20, type: "%", uses: 62, limit: 200, expires: "2026-09-30", status: "Active" },
  { id: "3", code: "WELCOME50", discount: 50, type: "$", uses: 320, limit: 1000, expires: "2026-08-15", status: "Active" },
  { id: "4", code: "SUMMER25", discount: 25, type: "%", uses: 500, limit: 500, expires: "2026-07-01", status: "Expired" },
  { id: "5", code: "FALL30", discount: 30, type: "%", uses: 0, limit: 300, expires: "2026-10-01", status: "Scheduled" },
  { id: "6", code: "VIP15", discount: 15, type: "%", uses: 22, limit: 100, expires: "2026-11-20", status: "Active" },
];

export const adminReviews: AdminReview[] = Array.from({ length: 10 }, (_, i) => ({
  id: `REV-${300 + i}`,
  product: adminProducts[i % adminProducts.length].name,
  customer: adminCustomers[i % adminCustomers.length].name,
  rating: 3 + Math.floor(s(i + 70) * 3),
  title: ["Absolutely love it", "Great fit", "Premium quality", "Runs small", "Perfect drop"][i % 5],
  body: "Fabric feels incredible and the tailoring is precise. The gold detailing is subtle but unmistakable.",
  date: new Date(2026, 6, 20 - i).toISOString().slice(0, 10),
  status: (["Approved", "Pending", "Approved", "Rejected", "Pending"] as const)[i % 5],
}));

export const stockHistory: StockMovement[] = Array.from({ length: 12 }, (_, i) => ({
  id: `MOV-${400 + i}`,
  product: adminProducts[i % adminProducts.length].name,
  change: (i % 3 === 0 ? -1 : 1) * (1 + Math.floor(s(i + 80) * 40)),
  reason: i % 3 === 0 ? "Sale" : i % 3 === 1 ? "Restock" : "Adjustment",
  date: new Date(2026, 6, 27 - i).toISOString().slice(0, 10),
}));

export const salesData = [
  { month: "Jan", revenue: 42000, orders: 210 },
  { month: "Feb", revenue: 48500, orders: 240 },
  { month: "Mar", revenue: 51200, orders: 262 },
  { month: "Apr", revenue: 60800, orders: 298 },
  { month: "May", revenue: 72400, orders: 340 },
  { month: "Jun", revenue: 81200, orders: 388 },
  { month: "Jul", revenue: 94300, orders: 442 },
];

export const customerGrowth = [
  { month: "Jan", customers: 120 },
  { month: "Feb", customers: 168 },
  { month: "Mar", customers: 224 },
  { month: "Apr", customers: 302 },
  { month: "May", customers: 388 },
  { month: "Jun", customers: 486 },
  { month: "Jul", customers: 612 },
];

export const categoryBreakdown = CATS.map((c, i) => ({
  name: c,
  value: 400 + Math.floor(s(i + 90) * 1800),
}));

export type AdminNotification = {
  id: number;
  title: string;
  desc: string;
  time: string;
  type: "order" | "stock" | "review" | "payment" | "coupon" | "custom";
  read?: boolean;
};

export const notifications: AdminNotification[] = [
  { id: 1, title: "New order #KW-5031", desc: "Amaka Okafor placed an order of ₦486,000", time: "2m ago", type: "order" },
  { id: 2, title: "Low stock: Gold Emblem Cap", desc: "Only 4 units remaining", time: "1h ago", type: "stock" },
  { id: 3, title: "New review submitted", desc: "5-star review awaiting approval", time: "3h ago", type: "review" },
  { id: 4, title: "Payment received", desc: "₦1,240,000 from Paystack", time: "5h ago", type: "payment" },
  { id: 5, title: "Coupon SUMMER25 expired", desc: "500 uses reached before expiry", time: "1d ago", type: "coupon", read: true },
  { id: 6, title: "New order #KW-5028", desc: "David Kim placed an order of ₦312,000", time: "1d ago", type: "order", read: true },
  { id: 7, title: "Review approved", desc: "Zara Martins · Monogram Heavy Hoodie", time: "2d ago", type: "review", read: true },
];

export const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n);

export const orderStatusColor = (s: OrderStatus): string => ({
  Pending: "bg-muted text-muted-foreground",
  Paid: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  Processing: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Shipped: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  Delivered: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
}[s]);