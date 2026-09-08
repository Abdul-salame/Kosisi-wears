import mongoose from "mongoose";

const Schema = mongoose.Schema;

const customOrderSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    itemType: {
      type: String,
      enum: ["Jersey", "Cap", "Other"],
      default: "Jersey"
    },
    styleReference: { type: String },
    colors: { type: String, required: true },
    teamOrClubName: { type: String },
    playerNamesNumbers: { type: String },
    notes: { type: String },
    referenceImage: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    status: {
      type: String,
      enum: ["New", "Contacted", "Quoted", "In Production", "Closed"],
      default: "New"
    },
    quotedPrice: { type: Number }
  },
  { timestamps: true }
);

const customOrderModel = mongoose.model("CustomOrder", customOrderSchema);

export default customOrderModel;
