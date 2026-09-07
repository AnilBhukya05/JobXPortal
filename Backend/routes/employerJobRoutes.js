import express from "express";
import { postJob, getMyJobs, deleteJob } from "../controllers/employerJobController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, postJob);
router.get("/", protect, getMyJobs);
router.delete("/:id", protect, deleteJob);

export default router;