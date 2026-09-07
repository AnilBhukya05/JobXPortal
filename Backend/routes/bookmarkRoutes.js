import express from "express";
import { getBookmarks, addBookmark, removeBookmark } from "../controllers/bookmarkController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getBookmarks);
router.post("/", protect, addBookmark);
router.delete("/:jobId", protect, removeBookmark);

export default router;