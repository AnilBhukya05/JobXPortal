import Profile from "../models/Profile.js";

export async function getProfile(req, res) {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    res.json({ profile: profile || null });
  } catch (err) {
    res.status(500).json({ message: "Failed to load profile", error: err.message });
  }
}

export async function saveProfile(req, res) {
  try {
    const payload = { ...req.body, user: req.user._id, role: req.user.role };

    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      payload,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json({ profile });
  } catch (err) {
    res.status(500).json({ message: "Failed to save profile", error: err.message });
  }
}

export async function getPublicProfile(req, res) {
  try {
    const profile = await Profile.findOne({ user: req.params.userId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const publicFields = {
      name: profile.name,
      headline: profile.headline,
      about: profile.about,
      photo: profile.photo,
      skills: profile.skills,
      experience: profile.experience,
      educationDetails: profile.educationDetails,
      projects: profile.projects,
      languages: profile.languages,
      available: profile.available,
      linkedin: profile.linkedin,
      github: profile.github,
      portfolio: profile.portfolio,
    };

    res.json({ profile: publicFields });
  } catch (err) {
    res.status(500).json({ message: "Failed to load profile", error: err.message });
  }
}