import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import {
  sendResetEmail,
  sendVerificationEmail,
} from "../utils/sendEmail.js";

function signToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
}

function sanitize(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
  };
}

export async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are all required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const existing = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existing) {
      return res.status(409).json({
        message: "An account with that email already exists",
      });
    }

    const safeRole =
      role === "employer" ? "employer" : "seeker";

    const user = await User.create({
      name,
      email,
      password,
      role: safeRole,
    });

    // Generate 6-digit email verification OTP
    const otp = user.generateVerificationToken();

    await user.save();

    // Send emails
    sendVerificationEmail(user.email, user.name, otp);

    // Keep your existing JWT response
    const token = signToken(user._id);

    res.status(201).json({
      token,
      user: sanitize(user),
    });
  } catch (err) {
    res.status(500).json({
      message: "Registration failed",
      error: err.message,
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Require email verification before login
    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
        requiresVerification: true,
      });
    }

    const token = signToken(user._id);

    res.json({
      token,
      user: sanitize(user),
    });
  } catch (err) {
    res.status(500).json({
      message: "Login failed",
      error: err.message,
    });
  }
}

export async function getMe(req, res) {
  res.json({
    user: sanitize(req.user),
  });
}

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.json({
        success: true,
      });
    }

    const rawToken = user.generateResetToken();

    await user.save();

    sendResetEmail(
      user.email,
      user.name,
      rawToken
    );

    res.json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to process request",
      error: err.message,
    });
  }
}

export async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        message: "Token and new password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const cleanToken = token.trim();

    const hashed = crypto
      .createHash("sha256")
      .update(cleanToken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpires: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Reset link is invalid or has expired",
      });
    }

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to reset password",
      error: err.message,
    });
  }
}

export async function verifyEmail(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanOtp = otp.trim();

    // Hash the OTP before checking MongoDB
    const hashed = crypto
      .createHash("sha256")
      .update(cleanOtp)
      .digest("hex");

    const user = await User.findOne({
      email: cleanEmail,
      verificationToken: hashed,
      verificationTokenExpires: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    // Mark email as verified
    user.isVerified = true;

    // Remove OTP after successful verification
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    user.verificationAttempts = 0;

    await user.save();

    res.json({
      success: true,
      message: "Email verified successfully",
      user: sanitize(user),
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to verify email",
      error: err.message,
    });
  }
}

export async function sendVerificationOtp(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      return res.status(404).json({
        message: "No account found with this email.",
      });
    }

    if (user.isVerified) {
      return res.json({
        success: true,
        alreadyVerified: true,
        message: "Your email is already verified.",
      });
    }

    // Generate new 6-digit OTP
    const otp = user.generateVerificationToken();

    await user.save();

    // Send OTP
    await sendVerificationEmail(
      user.email,
      user.name,
      otp
    );

    res.json({
      success: true,
      message: "Verification OTP sent to your email.",
    });
  } catch (err) {
    console.error(
      "Send verification OTP error:",
      err
    );

    res.status(500).json({
      message: "Failed to send verification OTP",
      error: err.message,
    });
  }
}