import express from "express";
import { getResume, saveResume } from "../controllers/resumeController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getResume);
router.put("/", protect, saveResume);

export default router;