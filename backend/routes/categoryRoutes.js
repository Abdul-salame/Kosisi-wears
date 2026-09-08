import express from "express";
import {
  CreateCategory,
  GetCategories,
  UpdateCategory,
  DeleteCategory
} from "../controllers/category/categoryController.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", GetCategories);

// Admin protected routes
router.post("/create", verifyAdmin, CreateCategory);
router.put("/update/:id", verifyAdmin, UpdateCategory);
router.delete("/delete/:id", verifyAdmin, DeleteCategory);

export default router;
