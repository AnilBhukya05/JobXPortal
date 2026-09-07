import Job from "../models/Job.js";
import jwt from "jsonwebtoken";

function requireEmployer(req, res) {
  if (req.user.role !== "employer") {
    res.status(403).json({ message: "Only employer accounts can do this" });
    return false;
  }
  if (!req.user.isVerified) {
    res.status(403).json({ message: "Please verify your email before posting jobs" });
    return false;
  }
  return true;
}

function formatSalary(min, max) {
  if (!min && !max) return "Not disclosed";
  const toLakh = (n) => "Rs " + (n / 100000).toFixed(1) + "L";
  if (min && max) return toLakh(min) + " - " + toLakh(max);
  return toLakh(min || max);
}

const ALLOWED_DURATIONS = [7, 14, 30, 60];

export async function postJob(req, res) {
  try {
    if (!requireEmployer(req, res)) return;

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentCount = await Job.countDocuments({ postedBy: req.user._id, createdAt: { $gte: since } });
    if (recentCount >= 5) {
      return res.status(429).json({ message: "You've reached the daily limit of 5 job posts. Try again tomorrow." });
    }

    const { company, companyEmail, title, location, type, remote, experienceLevel, salaryMin, salaryMax, tags, description, applyUrl, durationDays } = req.body;

    if (!company || !title || !location || !description) {
      return res.status(400).json({ message: "Company, title, location and description are required" });
    }

    const safeDuration = ALLOWED_DURATIONS.includes(Number(durationDays)) ? Number(durationDays) : 30;
    const expiresAt = new Date(Date.now() + safeDuration * 24 * 60 * 60 * 1000);

    const job = await Job.create({
      postedBy: req.user._id,
      company, companyEmail, title, location,
      type: type || "Full Time",
      remote: Boolean(remote),
      experienceLevel: experienceLevel || "mid",
      salaryMin: salaryMin || null,
      salaryMax: salaryMax || null,
      tags: Array.isArray(tags) ? tags : [],
      description,
      applyUrl,
      expiresAt,
    });

    res.status(201).json({ job });
  } catch (err) {
    res.status(500).json({ message: "Failed to post job", error: err.message });
  }
}

export async function getMyJobs(req, res) {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Only employer accounts can do this" });
    }

    const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
    const now = Date.now();
    const shaped = jobs.map((j) => ({
      id: j._id,
      company: j.company,
      title: j.title,
      location: j.location,
      applyUrl: j.applyUrl,
      views: j.views,
      applicants: j.applicants,
      createdAt: j.createdAt,
      expiresAt: j.expiresAt,
      isExpired: j.expiresAt ? new Date(j.expiresAt).getTime() < now : false,
    }));

    res.json({ jobs: shaped });
  } catch (err) {
    res.status(500).json({ message: "Failed to load your job posts", error: err.message });
  }
}

export async function deleteJob(req, res) {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Only employer accounts can do this" });
    }

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (String(job.postedBy) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can only delete your own job posts" });
    }

    await job.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete job post", error: err.message });
  }
}

export async function getPublicJobs(req, res) {
  try {
    const what = (req.query.what || "").trim();
    const where = (req.query.where || "").trim();
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);

    const filter = { expiresAt: { $gt: new Date() } };

    if (what) {
      const words = what
        .split(/\s+/)
        .filter((w) => w.length > 2 && !["and", "the", "for", "jobs", "job"].includes(w.toLowerCase()));

      if (words.length) {
        const orConditions = words.flatMap((word) => {
          const regex = new RegExp(word, "i");
          return [{ title: regex }, { company: regex }, { tags: regex }];
        });
        filter.$or = orConditions;
      }
    }
    if (where && where.toLowerCase() !== "india") {
      filter.location = new RegExp(where, "i");
    }

    const total = await Job.countDocuments(filter);
    const jobs = await Job.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);

    const normalized = jobs.map((j) => {
      const days = Math.max(0, Math.floor((Date.now() - new Date(j.createdAt).getTime()) / 86400000));
      return {
        id: "employer-" + j._id,
        title: j.title,
        company: j.company,
        location: j.location,
        remote: j.remote,
        type: j.type,
        portal: "employer",
        source: "JobXPortal",
        postedDaysAgo: days,
        tags: j.tags,
        salary: formatSalary(j.salaryMin, j.salaryMax),
        applyUrl: j.applyUrl || (j.companyEmail ? `mailto:${j.companyEmail}` : ""),
        description: j.description,
        employerId: j.postedBy,
      };
    });

    res.json({ jobs: normalized, count: normalized.length, total, hasMore: page * limit < total });
  } catch (err) {
    res.status(500).json({ message: "Failed to load jobs", error: err.message });
  }
}

export async function recordView(req, res) {
  try {
    const id = req.params.id.replace(/^employer-/, "");
    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
        userId = decoded.id;
      } catch {
        // invalid/expired token — treat as anonymous rather than failing
      }
    }

    if (userId) {
      const alreadyViewed = job.viewedBy.some((u) => String(u) === String(userId));
      if (!alreadyViewed) {
        job.viewedBy.push(userId);
        job.views += 1;
        await job.save();
      }
    } else {
      job.views += 1;
      await job.save();
    }

    res.json({ success: true, views: job.views });
  } catch (err) {
    res.status(500).json({ message: "Failed to record view", error: err.message });
  }
}

export async function recordApplication(req, res) {
  try {
    if (!req.user) return res.status(401).json({ message: "Sign in to mark a job as applied" });

    const id = req.params.id.replace(/^employer-/, "");
    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const already = job.appliedBy.some((u) => String(u) === String(req.user._id));
    if (already) return res.json({ success: true, alreadyApplied: true, applicants: job.applicants });

    job.appliedBy.push(req.user._id);
    job.applicants += 1;
    await job.save();

    res.json({ success: true, alreadyApplied: false, applicants: job.applicants });
  } catch (err) {
    res.status(500).json({ message: "Failed to record application", error: err.message });
  }
}

export async function getCompanyProfile(req, res) {
  try {
    const { employerId } = req.params;
    const jobs = await Job.find({ postedBy: employerId, expiresAt: { $gt: new Date() } }).sort({ createdAt: -1 });

    if (!jobs.length) {
      const anyJob = await Job.findOne({ postedBy: employerId }).sort({ createdAt: -1 });
      if (!anyJob) return res.status(404).json({ message: "Company not found" });
    }

    const shaped = jobs.map((j) => ({
      id: "employer-" + j._id,
      title: j.title,
      location: j.location,
      type: j.type,
      remote: j.remote,
      salary: formatSalary(j.salaryMin, j.salaryMax),
      createdAt: j.createdAt,
    }));

    const companyName = jobs[0]?.company || "This company";
    res.json({ company: companyName, jobs: shaped });
  } catch (err) {
    res.status(500).json({ message: "Failed to load company", error: err.message });
  }
}