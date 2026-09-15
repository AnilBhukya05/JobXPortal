import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { getProfile, saveProfile, getPublicProfile, searchCandidates } from "../controllers/profileController.js";
import { protect } from "../middleware/auth.js";
import Profile from "../models/Profile.js";

const router = express.Router();

const uploadDir = path.resolve("uploads/resumes");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user._id}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [".pdf", ".doc", ".docx"];
    if (!allowed.includes(path.extname(file.originalname).toLowerCase())) {
      return cb(new Error("Only PDF, DOC or DOCX files are allowed"));
    }
    cb(null, true);
  },
});

router.get("/candidates", protect, searchCandidates);
router.get("/public/:userId", getPublicProfile);
router.get("/", protect, getProfile);
router.post("/", protect, saveProfile);

router.post("/resume", protect, upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const fileUrl = `${process.env.SERVER_URL || "http://localhost:5000"}/uploads/resumes/${req.file.filename}`;
    const resumeData = { name: req.file.originalname, url: fileUrl };

    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { resume: resumeData, user: req.user._id },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json({ profile, resume: resumeData });
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to upload resume" });
  }
});

export default router;