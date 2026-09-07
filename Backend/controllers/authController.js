import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import { sendWelcomeEmail, sendResetEmail, sendVerificationEmail } from "../utils/sendEmail.js";

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "30d" });
}

function sanitize(user) {
  return { id: user._id, name: user.name, email: user.email, role: user.role, isVerified: user.isVerified };
}

export async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are all required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "An account with that email already exists" });
    }

    const safeRole = role === "employer" ? "employer" : "seeker";
    const user = await User.create({ name, email, password, role: safeRole });

    const rawToken = user.generateVerificationToken();
    await user.save();

    sendWelcomeEmail(user.email, user.name);
    sendVerificationEmail(user.email, user.name, rawToken);

    const token = signToken(user._id);
    res.status(201).json({ token, user: sanitize(user) });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken(user._id);
    res.json({ token, user: sanitize(user) });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
}

export async function getMe(req, res) {
  res.json({ user: sanitize(req.user) });
}

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.json({ success: true });

    const rawToken = user.generateResetToken();
    await user.save();

    sendResetEmail(user.email, user.name, rawToken);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to process request", error: err.message });
  }
}

export async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ message: "Token and new password are required" });
    if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });

    const hashed = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Reset link is invalid or has expired" });

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to reset password", error: err.message });
  }
}

export async function verifyEmail(req, res) {
  try {
    const { token } = req.params;
    const hashed = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({ verificationToken: hashed });

    if (!user) return res.status(400).json({ message: "Verification link is invalid or has already been used" });

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to verify email", error: err.message });
  }
}