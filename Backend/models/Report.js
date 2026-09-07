import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    reason: { type: String, required: true },
    status: { type: String, enum: ["open", "reviewed"], default: "open" },
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);