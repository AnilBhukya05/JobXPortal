import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    role: { type: String, enum: ["seeker", "employer"], required: true },

    name: { type: String, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    linkedin: { type: String, trim: true },

    // Seeker-only fields
    location: { type: String, trim: true },
    targetRole: { type: String, trim: true },
    experience: { type: String, default: "fresher" },
    skills: { type: String, default: "" },
    bio: { type: String, default: "" },
    github: { type: String, trim: true },
    preferredSalary: { type: String, trim: true },
    jobType: { type: String, default: "Full Time" },
    openToRemote: { type: Boolean, default: false },

    // Employer-only fields
    companyName: { type: String, trim: true },
    industry: { type: String, trim: true },
    companySize: { type: String, default: "1-10" },
    website: { type: String, trim: true },
    companyLocation: { type: String, trim: true },
    hiringContactEmail: { type: String, trim: true },
    aboutCompany: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);