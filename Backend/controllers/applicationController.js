import Application from "../models/Application.js";

export async function getApplications(req, res) {
  try {
    const applications = await Application.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ applications });
  } catch (err) {
    res.status(500).json({ message: "Failed to load applications", error: err.message });
  }
}

export async function addApplication(req, res) {
  try {
    const { title, company, url, stage, bookmarked, notes } = req.body;
    if (!title) {
      return res.status(400).json({ message: "title is required" });
    }

    const application = await Application.create({
      user: req.user._id,
      title,
      company,
      url,
      stage: stage || "saved",
      bookmarked: Boolean(bookmarked),
      notes,
    });
    res.status(201).json({ application });
  } catch (err) {
    res.status(500).json({ message: "Failed to add application", error: err.message });
  }
}

export async function updateApplication(req, res) {
  try {
    const { id } = req.params;
    const application = await Application.findOneAndUpdate(
      { _id: id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.json({ application });
  } catch (err) {
    res.status(500).json({ message: "Failed to update application", error: err.message });
  }
}

export async function deleteApplication(req, res) {
  try {
    const { id } = req.params;
    await Application.findOneAndDelete({ _id: id, user: req.user._id });
    res.json({ message: "Application deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete application", error: err.message });
  }
}