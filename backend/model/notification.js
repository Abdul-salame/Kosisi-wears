import mongoose from "mongoose";

const Schema = mongoose.Schema;

const notificationSchema = new Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    type: {
      type: String,
      enum: ["order", "stock", "review", "custom", "system"],
      default: "system"
    },
    time: { type: String, default: "Just now" },
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const notificationModel = mongoose.model("Notification", notificationSchema);

export default notificationModel;
