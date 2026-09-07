import mongoose from "mongoose";

const skillCategorySchema = new mongoose.Schema(
  { category: String, skills: String },
  { _id: false }
);

const experienceSchema = new mongoose.Schema(
  { company: String, role: String, location: String, duration: String, points: String },
  { _id: false }
);

const educationSchema = new mongoose.Schema(
  { institution: String, degree: String, year: String, grade: String, coursework: String },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  { name: String, tech: String, github: String, live: String, points: String },
  { _id: false }
);

const resumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    name: { type: String, default: "" },
    title: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    github: { type: String, default: "" },
    portfolio: { type: String, default: "" },
    summary: { type: String, default: "" },
    skillCategories: { type: [skillCategorySchema], default: [] },
    experience: { type: [experienceSchema], default: [] },
    education: { type: [educationSchema], default: [] },
    projects: { type: [projectSchema], default: [] },
    certifications: { type: String, default: "" },
    publications: { type: String, default: "" },
    achievements: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);