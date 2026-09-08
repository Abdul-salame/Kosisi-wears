import express from "express";
import {
  GetNotifications,
  MarkNotificationRead,
  MarkAllNotificationsRead
} from "../controllers/notification/notificationController.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

// Admin protected routes
router.get("/", verifyAdmin, GetNotifications);
router.patch("/:id/read", verifyAdmin, MarkNotificationRead);
router.post("/mark-all-read", verifyAdmin, MarkAllNotificationsRead);

export default router;
