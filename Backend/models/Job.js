import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    company: { type: String, required: true, trim: true },
    companyEmail: { type: String, trim: true },
    title: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    type: { type: String, default: "Full Time" },
    remote: { type: Boolean, default: false },
    experienceLevel: { type: String, default: "mid" },
    salaryMin: { type: Number, default: null },
    salaryMax: { type: Number, default: null },
    tags: { type: [String], default: [] },
    description: { type: String, required: true },
    applyUrl: { type: String, trim: true },
    views: { type: Number, default: 0 },
    applicants: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true },
    viewedBy: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] },
    appliedBy: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);