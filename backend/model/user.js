import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    FirstName: { type: String, required: true },
    LastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer"
    },
    accountType: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer"
    },
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String, default: "Nigeria" }
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

export default userModel;
