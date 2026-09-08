import express from "express";
import {
  GetInventory,
  AdjustStock,
  GetStockMovements
} from "../controllers/inventory/inventoryController.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

// Admin protected routes
router.get("/", verifyAdmin, GetInventory);
router.post("/adjust", verifyAdmin, AdjustStock);
router.get("/movements", verifyAdmin, GetStockMovements);

export default router;
