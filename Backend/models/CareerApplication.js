import mongoose from "mongoose";

const careerApplicationSchema =
  new mongoose.Schema(
    {
      // Logged-in JobXPortal user
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      // Career being applied for
      career: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Career",
        required: true,
      },

      name: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },

      phone: {
        type: String,
        trim: true,
        default: "",
      },

      linkedin: {
        type: String,
        trim: true,
        default: "",
      },

      github: {
        type: String,
        trim: true,
        default: "",
      },

      resume: {
        type: String,
        required: true,
        trim: true,
      },

      coverLetter: {
        type: String,
        trim: true,
        default: "",
      },

      status: {
        type: String,

        enum: [
          "pending",
          "reviewing",
          "shortlisted",
          "rejected",
          "hired",
        ],

        default: "pending",
      },
    },

    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "CareerApplication",
  careerApplicationSchema
);