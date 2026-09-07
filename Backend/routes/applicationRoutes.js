import express from "express";
import {
  getApplications,
  addApplication,
  updateApplication,
  deleteApplication,
} from "../controllers/applicationController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getApplications);
router.post("/", protect, addApplication);
router.patch("/:id", protect, updateApplication);
router.delete("/:id", protect, deleteApplication);

export default router;