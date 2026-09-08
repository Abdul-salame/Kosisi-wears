import mongoose from "mongoose";

const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true },
    image: { type: String },
    productCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const categoryModel = mongoose.model("Category", categorySchema);

export default categoryModel;
