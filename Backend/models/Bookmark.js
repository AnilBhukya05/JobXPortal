import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    jobId: { type: String, required: true },
    title: { type: String, required: true },
    company: { type: String, default: "" },
    location: { type: String, default: "" },
    url: { type: String, default: "" },
    source: { type: String, default: "" },
  },
  { timestamps: true }
);

bookmarkSchema.index({ user: 1, jobId: 1 }, { unique: true });

export default mongoose.model("Bookmark", bookmarkSchema);