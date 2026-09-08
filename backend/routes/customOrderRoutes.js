import express from "express";
import {
  CreateCustomOrder,
  GetCustomOrders,
  GetCustomOrderById,
  UpdateCustomOrderStatus,
  UpdateCustomOrderQuote,
  DeleteCustomOrders,
  upload
} from "../controllers/customOrder/customOrderController.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/create", upload.single("referenceImage"), CreateCustomOrder);
router.get("/:id", GetCustomOrderById);

// Admin protected routes
router.get("/", verifyAdmin, GetCustomOrders);
router.patch("/:id/status", verifyAdmin, UpdateCustomOrderStatus);
router.patch("/:id/quote", verifyAdmin, UpdateCustomOrderQuote);
router.delete("/delete", verifyAdmin, DeleteCustomOrders);
router.delete("/delete/:id", verifyAdmin, DeleteCustomOrders);

export default router;
