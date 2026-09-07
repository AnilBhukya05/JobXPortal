import Report from "../models/Report.js";

export async function createReport(req, res) {
  try {
    const { jobId, reason } = req.body;
    if (!jobId || !reason) return res.status(400).json({ message: "Job and reason are required" });

    const cleanId = jobId.replace(/^employer-/, "");
    await Report.create({ job: cleanId, reportedBy: req.user?._id || null, reason });
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to submit report", error: err.message });
  }
}