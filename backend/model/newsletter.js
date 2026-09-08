import mongoose from "mongoose";

const Schema = mongoose.Schema;

const newsletterSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    subscribedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ["active", "unsubscribed"], default: "active" }
  },
  { timestamps: true }
);

const newsletterModel = mongoose.model("Newsletter", newsletterSchema);

export default newsletterModel;
