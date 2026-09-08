import mongoose from "mongoose";

const Schema = mongoose.Schema;

const stockMovementSchema = new Schema(
  {
    product: { type: String, required: true },
    change: { type: Number, required: true },
    reason: { type: String, required: true },
    date: { type: String, default: () => new Date().toISOString().slice(0, 10) }
  },
  { timestamps: true }
);

const stockMovementModel = mongoose.model("StockMovement", stockMovementSchema);

export default stockMovementModel;
