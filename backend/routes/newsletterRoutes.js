import express from "express";
import { SubscribeNewsletter, GetNewsletterSubscribers } from "../controllers/newsletter/newsletterController.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/subscribe", SubscribeNewsletter);
router.get("/", verifyAdmin, GetNewsletterSubscribers);

export default router;
