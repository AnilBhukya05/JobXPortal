import express from "express";
import { getProfile, saveProfile, getPublicProfile } from "../controllers/profileController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/public/:userId", getPublicProfile);
router.get("/", protect, getProfile);
router.post("/", protect, saveProfile);

export default router;