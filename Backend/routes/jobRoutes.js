import express from "express";
import { getPublicJobs, recordView, recordApplication } from "../controllers/employerJobController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getPublicJobs);
router.post("/:id/view", recordView);
router.post("/:id/apply", protect, recordApplication);

export default router;