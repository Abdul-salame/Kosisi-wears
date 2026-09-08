import express from "express";
import { SubmitContactMessage, GetContactMessages } from "../controllers/contact/contactController.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/send", SubmitContactMessage);
router.get("/", verifyAdmin, GetContactMessages);

export default router;
