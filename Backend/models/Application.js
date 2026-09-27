import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // External/live job identifier used by JobXPortal.
    jobId: {
      type: String,
      default: "",
      index: true,
    },

    title: {
      type: String,
      required: true,
    },

    company: {
      type: String,
      default: "",
    },

    url: {
      type: String,
      default: "",
    },

    source: {
      type: String,
      default: "",
    },

    stage: {
      type: String,
      enum: [
        "saved",
        "started",
        "applied",
        "not_applied",
        "interview",
        "offer",
        "rejected",
      ],
      default: "saved",
    },

    startedAt: {
      type: Date,
      default: null,
    },

    appliedAt: {
      type: Date,
      default: null,
    },

    bookmarked: {
      type: Boolean,
      default: false,
    },

    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);