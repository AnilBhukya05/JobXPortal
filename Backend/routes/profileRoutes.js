import express from "express";
import { getProfile, saveProfile } from "../controllers/profileController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getProfile);
router.post("/", protect, saveProfile);

export default router;