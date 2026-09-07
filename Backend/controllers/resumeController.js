import Resume from "../models/Resume.js";

export async function getResume(req, res) {
  try {
    const resume = await Resume.findOne({ user: req.user._id });
    res.json({ resume: resume || null });
  } catch (err) {
    res.status(500).json({ message: "Failed to load resume", error: err.message });
  }
}

export async function saveResume(req, res) {
  try {
    const data = { ...req.body, user: req.user._id };
    const resume = await Resume.findOneAndUpdate(
      { user: req.user._id },
      data,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json({ resume });
  } catch (err) {
    res.status(500).json({ message: "Failed to save resume", error: err.message });
  }
}