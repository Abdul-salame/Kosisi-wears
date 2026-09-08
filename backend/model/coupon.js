import mongoose from "mongoose";

const Schema = mongoose.Schema;

const couponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    percent: { type: Number, default: 0 },
    label: { type: String, required: true },
    minSpend: { type: Number },
    type: { type: String, enum: ["percentage", "fixed"], default: "percentage" },
    discount: { type: Number },
    limit: { type: Number, default: 100 },
    usedCount: { type: Number, default: 0 },
    expiresAt: { type: Date },
    status: { type: String, enum: ["active", "expired", "disabled"], default: "active" }
  },
  { timestamps: true }
);

const couponModel = mongoose.model("Coupon", couponSchema);

export default couponModel;
