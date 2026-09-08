import express from "express";
import {
  ValidateCoupon,
  CreateCoupon,
  GetCoupons,
  UpdateCoupon,
  DeleteCoupon
} from "../controllers/coupon/couponController.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/validate", ValidateCoupon);

// Admin protected routes
router.get("/", verifyAdmin, GetCoupons);
router.post("/create", verifyAdmin, CreateCoupon);
router.put("/update/:id", verifyAdmin, UpdateCoupon);
router.delete("/delete/:id", verifyAdmin, DeleteCoupon);

export default router;
