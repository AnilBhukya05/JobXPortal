import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema({
  title: String,
  company: String,
  startDate: String,
  endDate: String,
  description: String,
}, { _id: false });

const educationDetailSchema = new mongoose.Schema({
  degree: String,
  institution: String,
  year: String,
}, { _id: false });

const projectSchema = new mongoose.Schema({
  title: String,
  technologies: String,
  description: String,
}, { _id: false });

const resumeSchema = new mongoose.Schema({
  name: String,
  url: String,
}, { _id: false });

const profileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },

    name: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    dob: { type: String, default: "" },
    gender: { type: String, default: "" },
    education: { type: String, default: "" },
    nationality: { type: String, default: "Indian" },
    headline: { type: String, default: "" },
    about: { type: String, default: "" },
    photo: { type: String, default: "" },
    available: { type: Boolean, default: false },

    experience: { type: [experienceSchema], default: [] },
    educationDetails: { type: [educationDetailSchema], default: [] },
    projects: { type: [projectSchema], default: [] },
    skills: { type: [String], default: [] },
    languages: { type: [String], default: [] },

    resume: { type: resumeSchema, default: null },
    videoIntroduction: { type: String, default: "" },

    address: { type: String, default: "" },
    preferredLocations: { type: [String], default: [] },
    currentSalary: { type: String, default: "" },
    expectedSalary: { type: String, default: "" },

    linkedin: { type: String, default: "" },
    github: { type: String, default: "" },
    portfolio: { type: String, default: "" },

    // Employer-only fields
    companyName: { type: String, default: "" },
    industry: { type: String, default: "" },
    companySize: { type: String, default: "1-10" },
    website: { type: String, default: "" },
    companyLocation: { type: String, default: "" },
    hiringContactEmail: { type: String, default: "" },
    aboutCompany: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);