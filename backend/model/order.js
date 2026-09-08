import mongoose from "mongoose";

const Schema = mongoose.Schema;

const orderItemSchema = new Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String },
  size: { type: String },
  color: { type: String },
  qty: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true }
});

const trackingEventSchema = new Schema({
  label: { type: String, required: true },
  date: { type: String, required: true },
  note: { type: String }
});

const orderSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    placedAt: { type: Date, default: Date.now },
    email: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postal: { type: String, required: true },
    state: { type: String },
    country: { type: String, required: true, default: "Nigeria" },
    delivery: { type: String, enum: ["standard", "express", "pickup"], default: "standard" },
    deliveryLabel: { type: String },
    deliveryFee: { type: Number, default: 0 },
    payment: { type: String, enum: ["card", "paystack"], default: "card" },
    cardLast4: { type: String },
    couponCode: { type: String },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing"
    },
    courier: { type: String, default: "Pending assignment" },
    tracking: { type: String, default: "—" },
    eta: { type: String },
    events: [trackingEventSchema],
    deliveryChangeRequest: {
      preferredDate: { type: Date },
      instructions: { type: String },
      requestedAt: { type: Date }
    }
  },
  { timestamps: true }
);

const orderModel = mongoose.model("Order", orderSchema);

export default orderModel;
