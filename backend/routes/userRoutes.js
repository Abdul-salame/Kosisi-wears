import express from "express";
import {
  CreateUser,
  loginUser,
  adminLogin,
  logoutUser,
  GetUsers,
  DeleteUsers
} from "../controllers/user/userController.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/create", CreateUser);
router.post("/login", loginUser);
router.post("/admin/login", adminLogin);
router.post("/logout", logoutUser);

// Admin protected routes
router.get("/", verifyAdmin, GetUsers);
router.delete("/delete", verifyAdmin, DeleteUsers);
router.delete("/:id", verifyAdmin, DeleteUsers);

export default router;
