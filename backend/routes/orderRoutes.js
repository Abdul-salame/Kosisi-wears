import express from "express";
import {
  CreateOrder,
  GetOrders,
  GetOrderById,
  TrackOrder,
  UpdateOrderStatus,
  RequestDeliveryChange,
  DeleteOrders
} from "../controllers/order/orderController.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

// Customer / Public routes
router.post("/create", CreateOrder);
router.get("/track/:id", TrackOrder);
router.get("/:id", GetOrderById);
router.post("/:id/delivery-change", RequestDeliveryChange);

// Admin protected routes
router.get("/", verifyAdmin, GetOrders);
router.patch("/:id/status", verifyAdmin, UpdateOrderStatus);
router.delete("/delete", verifyAdmin, DeleteOrders);
router.delete("/delete/:id", verifyAdmin, DeleteOrders);

export default router;
