import mongoose from "mongoose";

const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String },
    body: { type: String, required: true },
    images: [{ type: String }],
    date: { type: String },
    status: {
      type: String,
      enum: ["Published", "Pending", "Hidden"],
      default: "Published"
    }
  },
  { timestamps: true }
);

const reviewModel = mongoose.model("Review", reviewSchema);

export default reviewModel;
