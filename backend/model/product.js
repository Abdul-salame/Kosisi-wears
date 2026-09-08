import mongoose from "mongoose";

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    compareAt: { type: Number },
    category: { type: String, required: true },
    sizes: [{ type: String }],
    colors: [
      {
        name: { type: String },
        hex: { type: String }
      }
    ],
    images: [{ type: String }],
    variantImages: { type: Schema.Types.Mixed },
    rating: { type: Number, default: 4.5 },
    reviews: { type: Number, default: 0 },
    tag: { type: String },
    description: { type: String, required: true },
    inStock: { type: Boolean, default: true },
    stock: { type: Number, default: 15 },
    status: {
      type: String,
      enum: ["Active", "Draft", "Archived"],
      default: "Active"
    }
  },
  { timestamps: true }
);

const productModel = mongoose.model("Product", productSchema);

export default productModel;
