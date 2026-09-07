import express from "express";
import { getCompanyProfile } from "../controllers/employerJobController.js";

const router = express.Router();
router.get("/:employerId", getCompanyProfile);

export default router;