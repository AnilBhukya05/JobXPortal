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
    const payload = { ...req.body, user: req.user._id };
    delete payload._id;
    delete payload.__v;

    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      payload,
      { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
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
      available: profile.available,
      skills: profile.skills,
      experience: profile.experience,
      educationDetails: profile.educationDetails,
      projects: profile.projects,
      languages: profile.languages,
      preferredLocations: profile.preferredLocations,
      resume: profile.resume,
      linkedin: profile.linkedin,
      github: profile.github,
      portfolio: profile.portfolio,
    };

    res.json({ profile: publicFields });
  } catch (err) {
    res.status(500).json({ message: "Failed to load profile", error: err.message });
  }
}

// Employer-facing candidate search — like recruiters searching resumes on Naukri/LinkedIn.
export async function searchCandidates(req, res) {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Only employer accounts can search candidates" });
    }

    const { q = "", skill = "", location = "" } = req.query;
    const filter = {};

    // Only show profiles that actually have something to show, and belong to seekers who filled them in.
    filter.name = { $ne: "" };

    const conditions = [];
    if (q) {
      const regex = new RegExp(q, "i");
      conditions.push({ $or: [{ name: regex }, { headline: regex }, { about: regex }] });
    }
    if (skill) {
      conditions.push({ skills: new RegExp(skill, "i") });
    }
    if (location) {
      conditions.push({ $or: [{ address: new RegExp(location, "i") }, { preferredLocations: new RegExp(location, "i") }] });
    }
    if (conditions.length) filter.$and = conditions;

    const profiles = await Profile.find(filter).sort({ updatedAt: -1 }).limit(50);

    const shaped = profiles.map((p) => ({
      userId: p.user,
      name: p.name,
      headline: p.headline,
      photo: p.photo,
      skills: p.skills.slice(0, 6),
      address: p.address,
      available: p.available,
      hasResume: Boolean(p.resume),
    }));

    res.json({ candidates: shaped, count: shaped.length });
  } catch (err) {
    res.status(500).json({ message: "Failed to search candidates", error: err.message });
  }
}