import express from "express";
import {
  CreateReview,
  GetProductReviews,
  GetAdminReviews,
  UpdateReviewStatus,
  DeleteReviews,
  upload
} from "../controllers/review/reviewController.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/create", upload.fields([{ name: "images", maxCount: 3 }]), CreateReview);
router.get("/product/:productId", GetProductReviews);

// Admin protected routes
router.get("/", verifyAdmin, GetAdminReviews);
router.patch("/:id/status", verifyAdmin, UpdateReviewStatus);
router.delete("/delete", verifyAdmin, DeleteReviews);
router.delete("/delete/:id", verifyAdmin, DeleteReviews);

export default router;
