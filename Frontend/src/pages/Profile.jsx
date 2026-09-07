import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Save, User, Pencil, Mail, Phone, MapPin,
  Link2, Code2, Briefcase, IndianRupee, Globe, CheckCircle2,
  Building2, Users2, Globe2,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { fetchProfile, saveProfileApi } from "../services/profileService";
import { useAuth } from "../context/AuthContext";

function getEmptySeekerForm(user) {
  return {
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    location: "",
    targetRole: "",
    experience: "fresher",
    skills: "",
    bio: "",
    linkedin: "",
    github: "",
    preferredSalary: "",
    jobType: "Full Time",
    openToRemote: false,
  };
}

function getEmptyEmployerForm(user) {
  return {
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    companyName: "",
    industry: "",
    companySize: "1-10",
    website: "",
    companyLocation: "",
    hiringContactEmail: user?.email || "",
    aboutCompany: "",
    linkedin: "",
  };
}

function getEmptyForm(user) {
  return user?.role === "employer" ? getEmptyEmployerForm(user) : getEmptySeekerForm(user);
}

const EXPERIENCE_LABELS = {
  fresher: "Fresher (0-1 years)",
  junior: "Junior (1-2 years)",
  mid: "Mid-level (2-5 years)",
  senior: "Senior (5+ years)",
};

const SEEKER_TOOL_LINKS = [
  { label: "Resume Builder", path: "/resume-builder", color: "#00FFB3" },
  { label: "Resume Match", path: "/resume-match", color: "#00FFB3" },
  { label: "Interview Prep", path: "/interview-prep", color: "#FFB020" },
  { label: "Cover Letter", path: "/cover-letter", color: "#2DD4BF" },
  { label: "Job Tracker", path: "/tracker", color: "#00FFB3" },
  { label: "Bookmarks", path: "/bookmarks", color: "#FFB020" },
  { label: "Salary Insights", path: "/salary-insights", color: "#2DD4BF" },
];

const EMPLOYER_TOOL_LINKS = [
  { label: "Post a Job", path: "/post-job", color: "#00FFB3" },
  { label: "Employer Dashboard", path: "/employer/dashboard", color: "#FFB020" },
];

function hasData(p, isEmployer) {
  return isEmployer ? Boolean(p.companyName || p.name) : Boolean(p.name || p.email || p.targetRole);
}

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEmployer = user?.role === "employer";
  const [form, setForm] = useState(() => getEmptyForm(user));
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const { profile } = await fetchProfile();
        if (profile) {
          setForm({ ...getEmptyForm(user), ...profile });
          setEditing(false);
        } else {
          setForm(getEmptyForm(user));
          setEditing(true);
        }
      } catch (err) {
        setError("Couldn't load your profile. Is the backend running?");
        setForm(getEmptyForm(user));
        setEditing(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  async function save() {
    setSaving(true);
    setError("");
    try {
      const { profile } = await saveProfileApi(form);
      setForm({ ...getEmptyForm(user), ...profile });
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  function set(field, value) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  const inputStyle = {
    width: "100%", background: "var(--bg)",
    border: "1px solid var(--border)", borderRadius: 10,
    padding: "10px 14px", color: "var(--text)",
    fontFamily: "Poppins", fontSize: 13, outline: "none",
    transition: "border-color 0.15s",
  };

  const labelStyle = {
    fontFamily: "Poppins", fontSize: 12, fontWeight: 600,
    color: "var(--text)", display: "block", marginBottom: 6,
  };

  const skillList = !isEmployer ? form.skills.split(",").map((s) => s.trim()).filter(Boolean) : [];

  const infoRowStyle = {
    display: "flex", alignItems: "center", gap: 10,
    padding: "12px 0", borderBottom: "1px solid var(--border)",
  };

  const infoIconWrap = {
    width: 32, height: 32, borderRadius: 8, flexShrink: 0,
    background: "var(--bg)", border: "1px solid var(--border)",
    display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)",
  };

  function normalizeUrl(url) {
    if (!url) return "";
    return url.startsWith("http") ? url : `https://${url}`;
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--muted)", padding: "64px 24px", textAlign: "center", fontFamily: "Poppins" }}>
          Loading your profile...
        </div>
        <Footer />
      </>
    );
  }

  const toolLinks = isEmployer ? EMPLOYER_TOOL_LINKS : SEEKER_TOOL_LINKS;

  return (
    <>
      <Navbar />
      <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--text)", padding: "32px 24px 64px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>

          <button onClick={() => navigate(-1)} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontFamily: "JetBrains Mono", fontSize: 12, color: "var(--muted)",
            background: "none", border: "none", cursor: "pointer", marginBottom: 24,
            letterSpacing: "0.08em",
          }}>
            <ArrowLeft size={14} /> Back
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32, flexWrap: "wrap" }}>
            <div style={{
              width: 72, height: 72, borderRadius: isEmployer ? 16 : "50%",
              background: "linear-gradient(135deg, var(--accent), var(--teal))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, fontWeight: 800, color: "#09090B", fontFamily: "Poppins",
              flexShrink: 0,
            }}>
              {isEmployer
                ? (form.companyName ? form.companyName.charAt(0).toUpperCase() : <Building2 size={28} />)
                : (form.name ? form.name.charAt(0).toUpperCase() : <User size={28} />)}
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <h1 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800, marginBottom: 4 }}>
                {isEmployer ? (form.companyName || "Your Company") : (form.name || "Your Profile")}
              </h1>
              <p style={{ color: "var(--muted)", fontSize: 13 }}>
                {isEmployer
                  ? (form.industry || "Add your company details below")
                  : (form.targetRole || "Add your target role below")}
              </p>
            </div>

            {!editing && (
              <button onClick={() => setEditing(true)} style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "10px 18px", background: "var(--surface)",
                border: "1px solid var(--border)", borderRadius: 10,
                color: "var(--text)", fontFamily: "Poppins", fontSize: 13, fontWeight: 600,
                cursor: "pointer", transition: "border-color 0.15s",
              }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}
              >
                <Pencil size={14} /> {isEmployer ? "Edit Company Profile" : "Edit Profile"}
              </button>
            )}
          </div>

          {saved && (
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "rgba(0,255,179,0.08)", border: "1px solid rgba(0,255,179,0.25)",
              borderRadius: 10, padding: "10px 16px", marginBottom: 20,
              color: "var(--accent)", fontFamily: "Poppins", fontSize: 13, fontWeight: 600,
            }}>
              <CheckCircle2 size={16} /> Profile saved
            </div>
          )}

          {error && (
            <div style={{
              background: "rgba(251,113,133,0.08)", border: "1px solid rgba(251,113,133,0.3)",
              borderRadius: 10, padding: "10px 16px", marginBottom: 20,
              color: "#fb7185", fontFamily: "Poppins", fontSize: 13, fontWeight: 600,
            }}>
              {error}
            </div>
          )}

          {!editing && !isEmployer && (
            <div style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 16, padding: "28px 24px",
            }}>
              {form.bio && (
                <p style={{ color: "var(--text)", fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
                  {form.bio}
                </p>
              )}

              <p style={{ fontFamily: "JetBrains Mono", fontSize: 11, letterSpacing: "0.1em", color: "var(--accent)", textTransform: "uppercase", marginBottom: 4 }}>
                Contact
              </p>
              <div>
                {form.email && (
                  <div style={infoRowStyle}>
                    <div style={infoIconWrap}><Mail size={15} /></div>
                    <span style={{ fontFamily: "Poppins", fontSize: 13, color: "var(--text)" }}>{form.email}</span>
                  </div>
                )}
                {form.phone && (
                  <div style={infoRowStyle}>
                    <div style={infoIconWrap}><Phone size={15} /></div>
                    <span style={{ fontFamily: "Poppins", fontSize: 13, color: "var(--text)" }}>{form.phone}</span>
                  </div>
                )}
                {form.location && (
                  <div style={infoRowStyle}>
                    <div style={infoIconWrap}><MapPin size={15} /></div>
                    <span style={{ fontFamily: "Poppins", fontSize: 13, color: "var(--text)" }}>{form.location}</span>
                  </div>
                )}
                {form.linkedin && (
                  <div style={infoRowStyle}>
                    <div style={infoIconWrap}><Link2 size={15} /></div>
                    <a href={normalizeUrl(form.linkedin)} target="_blank" rel="noreferrer" style={{ fontFamily: "Poppins", fontSize: 13, color: "var(--accent)", textDecoration: "none" }}>
                      {form.linkedin}
                    </a>
                  </div>
                )}
                {form.github && (
                  <div style={{ ...infoRowStyle, borderBottom: "none" }}>
                    <div style={infoIconWrap}><Code2 size={15} /></div>
                    <a href={normalizeUrl(form.github)} target="_blank" rel="noreferrer" style={{ fontFamily: "Poppins", fontSize: 13, color: "var(--accent)", textDecoration: "none" }}>
                      {form.github}
                    </a>
                  </div>
                )}
                {!form.email && !form.phone && !form.location && !form.linkedin && !form.github && (
                  <p style={{ color: "var(--muted)", fontSize: 13, padding: "8px 0" }}>No contact info added yet.</p>
                )}
              </div>

              <p style={{ fontFamily: "JetBrains Mono", fontSize: 11, letterSpacing: "0.1em", color: "var(--accent)", textTransform: "uppercase", marginTop: 28, marginBottom: 12 }}>
                Job Preferences
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 4 }}>
                {form.targetRole && (
                  <span style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 20, background: "var(--bg)", border: "1px solid var(--border)", fontSize: 12, fontFamily: "Poppins", color: "var(--text)" }}>
                    <Briefcase size={13} style={{ color: "var(--accent)" }} /> {form.targetRole}
                  </span>
                )}
                <span style={{ padding: "7px 14px", borderRadius: 20, background: "var(--bg)", border: "1px solid var(--border)", fontSize: 12, fontFamily: "Poppins", color: "var(--text)" }}>
                  {EXPERIENCE_LABELS[form.experience] || form.experience}
                </span>
                {form.preferredSalary && (
                  <span style={{ display: "flex", alignItems: "center", gap: 4, padding: "7px 14px", borderRadius: 20, background: "var(--bg)", border: "1px solid var(--border)", fontSize: 12, fontFamily: "Poppins", color: "var(--text)" }}>
                    <IndianRupee size={12} style={{ color: "var(--accent)" }} /> {form.preferredSalary}
                  </span>
                )}
                <span style={{ padding: "7px 14px", borderRadius: 20, background: "var(--bg)", border: "1px solid var(--border)", fontSize: 12, fontFamily: "Poppins", color: "var(--text)" }}>
                  {form.jobType}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 20, background: form.openToRemote ? "rgba(0,255,179,0.08)" : "var(--bg)", border: `1px solid ${form.openToRemote ? "rgba(0,255,179,0.3)" : "var(--border)"}`, fontSize: 12, fontFamily: "Poppins", color: form.openToRemote ? "var(--accent)" : "var(--muted)" }}>
                  <Globe size={13} /> {form.openToRemote ? "Open to Remote" : "On-site only"}
                </span>
              </div>

              {skillList.length > 0 && (
                <>
                  <p style={{ fontFamily: "JetBrains Mono", fontSize: 11, letterSpacing: "0.1em", color: "var(--accent)", textTransform: "uppercase", marginTop: 28, marginBottom: 12 }}>
                    Skills
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {skillList.map((s) => (
                      <span key={s} style={{
                        padding: "6px 12px", borderRadius: 8,
                        background: "rgba(0,255,179,0.06)", border: "1px solid rgba(0,255,179,0.2)",
                        fontSize: 12, fontFamily: "Poppins", color: "var(--accent)",
                      }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {!editing && isEmployer && (
            <div style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 16, padding: "28px 24px",
            }}>
              {form.aboutCompany && (
                <p style={{ color: "var(--text)", fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
                  {form.aboutCompany}
                </p>
              )}

              <p style={{ fontFamily: "JetBrains Mono", fontSize: 11, letterSpacing: "0.1em", color: "var(--accent)", textTransform: "uppercase", marginBottom: 4 }}>
                Company Info
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 4, marginTop: 12 }}>
                {form.industry && (
                  <span style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 20, background: "var(--bg)", border: "1px solid var(--border)", fontSize: 12, fontFamily: "Poppins", color: "var(--text)" }}>
                    <Building2 size={13} style={{ color: "var(--accent)" }} /> {form.industry}
                  </span>
                )}
                {form.companySize && (
                  <span style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 20, background: "var(--bg)", border: "1px solid var(--border)", fontSize: 12, fontFamily: "Poppins", color: "var(--text)" }}>
                    <Users2 size={13} style={{ color: "var(--accent)" }} /> {form.companySize} employees
                  </span>
                )}
                {form.companyLocation && (
                  <span style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 20, background: "var(--bg)", border: "1px solid var(--border)", fontSize: 12, fontFamily: "Poppins", color: "var(--text)" }}>
                    <MapPin size={13} style={{ color: "var(--accent)" }} /> {form.companyLocation}
                  </span>
                )}
              </div>

              <p style={{ fontFamily: "JetBrains Mono", fontSize: 11, letterSpacing: "0.1em", color: "var(--accent)", textTransform: "uppercase", marginTop: 28, marginBottom: 4 }}>
                Contact
              </p>
              <div>
                {form.hiringContactEmail && (
                  <div style={infoRowStyle}>
                    <div style={infoIconWrap}><Mail size={15} /></div>
                    <span style={{ fontFamily: "Poppins", fontSize: 13, color: "var(--text)" }}>{form.hiringContactEmail}</span>
                  </div>
                )}
                {form.phone && (
                  <div style={infoRowStyle}>
                    <div style={infoIconWrap}><Phone size={15} /></div>
                    <span style={{ fontFamily: "Poppins", fontSize: 13, color: "var(--text)" }}>{form.phone}</span>
                  </div>
                )}
                {form.website && (
                  <div style={infoRowStyle}>
                    <div style={infoIconWrap}><Globe2 size={15} /></div>
                    <a href={normalizeUrl(form.website)} target="_blank" rel="noreferrer" style={{ fontFamily: "Poppins", fontSize: 13, color: "var(--accent)", textDecoration: "none" }}>
                      {form.website}
                    </a>
                  </div>
                )}
                {form.linkedin && (
                  <div style={{ ...infoRowStyle, borderBottom: "none" }}>
                    <div style={infoIconWrap}><Link2 size={15} /></div>
                    <a href={normalizeUrl(form.linkedin)} target="_blank" rel="noreferrer" style={{ fontFamily: "Poppins", fontSize: 13, color: "var(--accent)", textDecoration: "none" }}>
                      {form.linkedin}
                    </a>
                  </div>
                )}
                {!form.hiringContactEmail && !form.phone && !form.website && !form.linkedin && (
                  <p style={{ color: "var(--muted)", fontSize: 13, padding: "8px 0" }}>No contact info added yet.</p>
                )}
              </div>
            </div>
          )}

          {editing && !isEmployer && (
            <div style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 16, padding: "28px 24px",
            }}>

              <p style={{ fontFamily: "JetBrains Mono", fontSize: 11, letterSpacing: "0.1em", color: "var(--accent)", textTransform: "uppercase", marginBottom: 16 }}>
                Personal Info
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }} className="rg2">
                {[
                  { field: "name", label: "Full Name", placeholder: "Anil Bhukya" },
                  { field: "email", label: "Email", placeholder: "anil@gmail.com" },
                  { field: "phone", label: "Phone", placeholder: "+91 9999999999" },
                  { field: "location", label: "City", placeholder: "Hyderabad" },
                  { field: "linkedin", label: "LinkedIn", placeholder: "linkedin.com/in/..." },
                  { field: "github", label: "GitHub", placeholder: "github.com/..." },
                ].map((f) => (
                  <div key={f.field}>
                    <label style={labelStyle}>{f.label}</label>
                    <input value={form[f.field]} onChange={(e) => set(f.field, e.target.value)}
                      placeholder={f.placeholder} style={inputStyle}
                      onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                      onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                    />
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Short Bio</label>
                <textarea value={form.bio} onChange={(e) => set("bio", e.target.value)}
                  placeholder="B.Tech CSE graduate passionate about frontend development..."
                  rows={3} style={{ ...inputStyle, resize: "vertical" }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                />
              </div>

              <p style={{ fontFamily: "JetBrains Mono", fontSize: 11, letterSpacing: "0.1em", color: "var(--accent)", textTransform: "uppercase", marginBottom: 16, marginTop: 28 }}>
                Job Preferences
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }} className="rg2">
                <div>
                  <label style={labelStyle}>Target Role</label>
                  <input value={form.targetRole} onChange={(e) => set("targetRole", e.target.value)}
                    placeholder="Frontend Developer" style={inputStyle}
                    onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Experience Level</label>
                  <select value={form.experience} onChange={(e) => set("experience", e.target.value)}
                    style={{ ...inputStyle, cursor: "pointer" }}>
                    <option value="fresher">Fresher (0-1 years)</option>
                    <option value="junior">Junior (1-2 years)</option>
                    <option value="mid">Mid-level (2-5 years)</option>
                    <option value="senior">Senior (5+ years)</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Preferred Salary</label>
                  <input value={form.preferredSalary} onChange={(e) => set("preferredSalary", e.target.value)}
                    placeholder="Rs 5L - Rs 8L" style={inputStyle}
                    onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Job Type</label>
                  <select value={form.jobType} onChange={(e) => set("jobType", e.target.value)}
                    style={{ ...inputStyle, cursor: "pointer" }}>
                    <option>Full Time</option>
                    <option>Part Time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>
                </div>
              </div>

              <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, cursor: "pointer" }}>
                <span style={{ fontFamily: "Poppins", fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Open to Remote</span>
                <div onClick={() => set("openToRemote", !form.openToRemote)} style={{
                  width: 40, height: 22, borderRadius: 11,
                  background: form.openToRemote ? "var(--teal)" : "var(--border)",
                  position: "relative", cursor: "pointer", transition: "background 0.25s",
                }}>
                  <span style={{
                    position: "absolute", top: 3, left: form.openToRemote ? 21 : 3,
                    width: 16, height: 16, borderRadius: "50%",
                    background: "white", transition: "left 0.25s",
                  }} />
                </div>
              </label>

              <div>
                <label style={labelStyle}>Skills (comma separated)</label>
                <input value={form.skills} onChange={(e) => set("skills", e.target.value)}
                  placeholder="React, JavaScript, Node.js, Python, SQL..." style={inputStyle}
                  onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                />
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap" }}>
                <button onClick={save} disabled={saving} style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "12px 28px",
                  background: "var(--accent)", color: "#09090B",
                  border: "none", borderRadius: 10, cursor: "pointer",
                  fontFamily: "Poppins", fontSize: 14, fontWeight: 700,
                  opacity: saving ? 0.7 : 1,
                }}>
                  <Save size={15} />
                  {saving ? "Saving..." : "Save Profile"}
                </button>
                {hasData(form, isEmployer) && (
                  <button onClick={() => setEditing(false)} style={{
                    padding: "12px 24px", background: "none",
                    border: "1px solid var(--border)", borderRadius: 10,
                    color: "var(--muted)", cursor: "pointer",
                    fontFamily: "Poppins", fontSize: 14, fontWeight: 600,
                  }}>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          )}

          {editing && isEmployer && (
            <div style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 16, padding: "28px 24px",
            }}>

              <p style={{ fontFamily: "JetBrains Mono", fontSize: 11, letterSpacing: "0.1em", color: "var(--accent)", textTransform: "uppercase", marginBottom: 16 }}>
                Company Info
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }} className="rg2">
                <div>
                  <label style={labelStyle}>Company Name</label>
                  <input value={form.companyName} onChange={(e) => set("companyName", e.target.value)}
                    placeholder="Acme Inc." style={inputStyle}
                    onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Industry</label>
                  <input value={form.industry} onChange={(e) => set("industry", e.target.value)}
                    placeholder="Software / Fintech / E-commerce..." style={inputStyle}
                    onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Company Size</label>
                  <select value={form.companySize} onChange={(e) => set("companySize", e.target.value)}
                    style={{ ...inputStyle, cursor: "pointer" }}>
                    <option value="1-10">1-10</option>
                    <option value="11-50">11-50</option>
                    <option value="51-200">51-200</option>
                    <option value="201-500">201-500</option>
                    <option value="500+">500+</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Company Location</label>
                  <input value={form.companyLocation} onChange={(e) => set("companyLocation", e.target.value)}
                    placeholder="Hyderabad, Telangana" style={inputStyle}
                    onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Website</label>
                  <input value={form.website} onChange={(e) => set("website", e.target.value)}
                    placeholder="acme.com" style={inputStyle}
                    onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Company LinkedIn</label>
                  <input value={form.linkedin} onChange={(e) => set("linkedin", e.target.value)}
                    placeholder="linkedin.com/company/..." style={inputStyle}
                    onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>About the Company</label>
                <textarea value={form.aboutCompany} onChange={(e) => set("aboutCompany", e.target.value)}
                  placeholder="What does your company do, and what's it like to work there..."
                  rows={4} style={{ ...inputStyle, resize: "vertical" }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                />
              </div>

              <p style={{ fontFamily: "JetBrains Mono", fontSize: 11, letterSpacing: "0.1em", color: "var(--accent)", textTransform: "uppercase", marginBottom: 16, marginTop: 28 }}>
                Hiring Contact
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }} className="rg2">
                <div>
                  <label style={labelStyle}>Hiring Contact Email</label>
                  <input value={form.hiringContactEmail} onChange={(e) => set("hiringContactEmail", e.target.value)}
                    placeholder="hiring@acme.com" style={inputStyle}
                    onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Phone</label>
                  <input value={form.phone} onChange={(e) => set("phone", e.target.value)}
                    placeholder="+91 9999999999" style={inputStyle}
                    onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap" }}>
                <button onClick={save} disabled={saving} style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "12px 28px",
                  background: "var(--accent)", color: "#09090B",
                  border: "none", borderRadius: 10, cursor: "pointer",
                  fontFamily: "Poppins", fontSize: 14, fontWeight: 700,
                  opacity: saving ? 0.7 : 1,
                }}>
                  <Save size={15} />
                  {saving ? "Saving..." : "Save Company Profile"}
                </button>
                {hasData(form, isEmployer) && (
                  <button onClick={() => setEditing(false)} style={{
                    padding: "12px 24px", background: "none",
                    border: "1px solid var(--border)", borderRadius: 10,
                    color: "var(--muted)", cursor: "pointer",
                    fontFamily: "Poppins", fontSize: 14, fontWeight: 600,
                  }}>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          )}

          <p style={{ fontFamily: "JetBrains Mono", fontSize: 11, letterSpacing: "0.1em", color: "var(--muted)", textTransform: "uppercase", marginTop: 28, marginBottom: 12 }}>
            {isEmployer ? "Employer Tools" : "All Tools"}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${isEmployer ? 2 : 3}, 1fr)`, gap: 10 }} className="rg3">
            {toolLinks.map((item) => (
              <button key={item.label} onClick={() => navigate(item.path)} style={{
                padding: "12px", background: "var(--surface)",
                border: `1px solid ${item.color}30`, borderRadius: 12,
                color: item.color, fontFamily: "Poppins", fontSize: 12, fontWeight: 600,
                cursor: "pointer", transition: "border-color 0.15s",
              }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = item.color}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = item.color + "30"}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <Footer />
      <style>{`
        @media(max-width:640px){.rg2{grid-template-columns:1fr!important;}}
        @media(max-width:640px){.rg3{grid-template-columns:1fr 1fr!important;}}
        @media(max-width:420px){.rg3{grid-template-columns:1fr!important;}}
      `}</style>
    </>
  );
}