import express from "express";
import {
  CreateProduct,
  GetProducts,
  GetProductByIdOrSlug,
  UpdateProduct,
  DeleteProduct,
  BulkDeleteProducts,
  BulkUpdateProductStatus,
  upload
} from "../controllers/product/productController.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", GetProducts);
router.get("/:identifier", GetProductByIdOrSlug);

// Admin protected routes
router.post("/create", verifyAdmin, upload.fields([{ name: "images", maxCount: 5 }]), CreateProduct);
router.put("/update/:id", verifyAdmin, upload.fields([{ name: "images", maxCount: 5 }]), UpdateProduct);
router.delete("/delete/:id", verifyAdmin, DeleteProduct);
router.delete("/bulk-delete", verifyAdmin, BulkDeleteProducts);
router.patch("/bulk-status", verifyAdmin, BulkUpdateProductStatus);

export default router;
