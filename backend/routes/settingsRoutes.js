import express from "express";
import { GetSettings, UpdateSettings } from "../controllers/settings/settingsController.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", GetSettings);
router.put("/", verifyAdmin, UpdateSettings);

export default router;
