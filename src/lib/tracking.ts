export const TRACK_STATUSES = ["Pending", "Paid", "Processing", "Shipped", "Delivered"] as const;
export type TrackStatus = (typeof TRACK_STATUSES)[number];

export type TrackedOrder = {
  id: string;
  placed: string;
  customer: string;
  status: TrackStatus;
  courier: string;
  tracking: string;
  eta: string;
  items: { name: string; qty: number; price: number }[];
  events: { label: string; date: string; note: string }[];
};

export const TRACKED_ORDERS: TrackedOrder[] = [
  {
    id: "KW-4X21K", placed: "Jul 18, 2026", customer: "Ada Obi", status: "Delivered",
    courier: "DHL Express", tracking: "DHL-88213904", eta: "Delivered Jul 24, 2026",
    items: [{ name: "Heritage Varsity Jacket", qty: 1, price: 385 }, { name: "Gold Emblem Cap", qty: 1, price: 95 }],
    events: [
      { label: "Order placed", date: "Jul 18, 09:12", note: "Awaiting payment confirmation" },
      { label: "Payment confirmed", date: "Jul 18, 09:20", note: "Paid via Paystack" },
      { label: "Processing", date: "Jul 19, 11:40", note: "Packed at the Lagos atelier" },
      { label: "Shipped", date: "Jul 20, 08:05", note: "Handed to DHL Express" },
      { label: "Delivered", date: "Jul 24, 14:32", note: "Signed for by A. Obi" },
    ],
  },
  {
    id: "KW-9F02P", placed: "Jul 26, 2026", customer: "David Kalu", status: "Shipped",
    courier: "GIG Logistics", tracking: "GIG-4402117", eta: "Aug 2, 2026",
    items: [{ name: "Monogram Heavy Hoodie", qty: 2, price: 210 }],
    events: [
      { label: "Order placed", date: "Jul 26, 17:02", note: "Order received" },
      { label: "Payment confirmed", date: "Jul 26, 17:04", note: "Paid via card" },
      { label: "Processing", date: "Jul 27, 10:15", note: "Quality check complete" },
      { label: "Shipped", date: "Jul 29, 07:50", note: "In transit to Abuja hub" },
    ],
  },
  {
    id: "KW-1B77Q", placed: "Jul 30, 2026", customer: "Zara Musa", status: "Processing",
    courier: "Pending assignment", tracking: "—", eta: "Aug 5, 2026",
    items: [{ name: "Atelier Crewneck", qty: 1, price: 175 }, { name: "Ivory Linen Kaftan", qty: 3, price: 60 }],
    events: [
      { label: "Order placed", date: "Jul 30, 12:41", note: "Order received" },
      { label: "Payment confirmed", date: "Jul 30, 12:43", note: "Paid via Flutterwave" },
      { label: "Processing", date: "Jul 31, 09:00", note: "Being prepared at the atelier" },
    ],
  },
  {
    id: "KW-7C99M", placed: "Jul 31, 2026", customer: "Guest", status: "Pending",
    courier: "Pending assignment", tracking: "—", eta: "Aug 7, 2026",
    items: [{ name: "Onyx Letterman", qty: 1, price: 340 }],
    events: [{ label: "Order placed", date: "Jul 31, 08:22", note: "Awaiting payment confirmation" }],
  },
];

export const findOrder = (id: string) =>
  TRACKED_ORDERS.find((o) => o.id.toLowerCase() === id.trim().toLowerCase());
