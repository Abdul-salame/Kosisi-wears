import mongoose from "mongoose";

const Schema = mongoose.Schema;

const settingsSchema = new Schema(
  {
    storeName: { type: String, default: "Kosisi Wears" },
    supportEmail: { type: String, default: "support@kosisi.co" },
    description: { type: String, default: "Luxury sportswear crafted in limited runs." },
    currency: { type: String, default: "NGN" },
    timezone: { type: String, default: "Africa/Lagos" },
    payments: {
      type: Schema.Types.Mixed,
      default: { Paystack: true, Stripe: false, "Bank transfer": true }
    },
    shipping: {
      type: Schema.Types.Mixed,
      default: { standard: "₦15,000", freeOver: "₦250,000", express: "₦35,000", processing: "2-3 business days" }
    },
    social: {
      type: Schema.Types.Mixed,
      default: { Instagram: "", TikTok: "", Twitter: "", YouTube: "" }
    },
    notifications: {
      type: Schema.Types.Mixed,
      default: {
        "New orders": true,
        "Low stock alerts": true,
        "New reviews": true,
        "Coupon expirations": false,
        "Weekly summary": true
      }
    }
  },
  { timestamps: true }
);

const settingsModel = mongoose.model("Settings", settingsSchema);

export default settingsModel;
