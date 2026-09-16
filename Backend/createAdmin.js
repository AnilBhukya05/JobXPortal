import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import { connectDB } from "./config/db.js";

dotenv.config();

async function createAdmin() {
  try {
    await connectDB();

    const name =
      process.env.ADMIN_NAME ||
      "JobXPortal Admin";

    const email =
      process.env.ADMIN_EMAIL?.toLowerCase();

    const password =
      process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.error(
        "ADMIN_EMAIL and ADMIN_PASSWORD are required in .env"
      );

      process.exit(1);
    }

    if (password.length < 8) {
      console.error(
        "ADMIN_PASSWORD must be at least 8 characters"
      );

      process.exit(1);
    }

    const existing =
      await User.findOne({ email });

    if (existing) {
      existing.role = "admin";
      existing.isVerified = true;

      if (password) {
        existing.password = password;
      }

      await existing.save();

      console.log(
        `Admin account updated: ${email}`
      );

      process.exit(0);
    }

    await User.create({
      name,
      email,
      password,
      role: "admin",
      isVerified: true,
    });

    console.log(
      `Admin account created: ${email}`
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "Failed to create admin:",
      error.message
    );

    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

createAdmin();