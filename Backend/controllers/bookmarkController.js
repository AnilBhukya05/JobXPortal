import Bookmark from "../models/Bookmark.js";

export async function getBookmarks(req, res) {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ bookmarks });
  } catch (err) {
    res.status(500).json({ message: "Failed to load bookmarks", error: err.message });
  }
}

export async function addBookmark(req, res) {
  try {
    const { jobId, title, company, location, url, source } = req.body;
    if (!jobId || !title) {
      return res.status(400).json({ message: "jobId and title are required" });
    }

    const bookmark = await Bookmark.findOneAndUpdate(
      { user: req.user._id, jobId },
      { user: req.user._id, jobId, title, company, location, url, source },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.status(201).json({ bookmark });
  } catch (err) {
    res.status(500).json({ message: "Failed to add bookmark", error: err.message });
  }
}

export async function removeBookmark(req, res) {
  try {
    const { jobId } = req.params;
    await Bookmark.findOneAndDelete({ user: req.user._id, jobId });
    res.json({ message: "Bookmark removed" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove bookmark", error: err.message });
  }
}