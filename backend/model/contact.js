import mongoose from "mongoose";

const Schema = mongoose.Schema;

const contactSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String },
    message: { type: String, required: true },
    status: { type: String, enum: ["unread", "read", "replied"], default: "unread" }
  },
  { timestamps: true }
);

const contactModel = mongoose.model("Contact", contactSchema);

export default contactModel;
