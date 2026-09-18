import express from "express";

import {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  verifyEmail,
  sendVerificationOtp,
} from "../controllers/authController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/me", protect, getMe);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

// Public email verification
router.post("/verify-email", verifyEmail);

// Public OTP sending/resending
router.post("/send-verification", sendVerificationOtp);

export default router;