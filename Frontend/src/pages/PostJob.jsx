import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Briefcase, Loader2, Send } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { postJobApi } from "../services/employerJobsService";

const EMPTY_JOB = {
  company: "",
  companyEmail: "",
  title: "",
  location: "",
  type: "Full Time",
  remote: false,
  experienceLevel: "mid",
  salaryMin: "",
  salaryMax: "",
  tags: "",
  description: "",
  applyUrl: "",
  durationDays: 30,
};

const DURATION_OPTIONS = [
  { value: 7, label: "1 week" },
  { value: 14, label: "2 weeks" },
  { value: 30, label: "1 month" },
  { value: 60, label: "2 months" },
];

export default function PostJob() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState(EMPTY_JOB);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function set(field, value) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  function validate() {
    if (!form.company.trim()) return "Company name is required.";
    if (!form.title.trim()) return "Job title is required.";
    if (!form.location.trim()) return "Location is required.";
    if (!form.description.trim()) return "Job description is required.";
    if (!form.applyUrl.trim() && !form.companyEmail.trim()) return "Add an apply link or a contact email.";
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setSubmitting(true);
    try {
      await postJobApi({
        ...form,
        salaryMin: form.salaryMin ? Number(form.salaryMin) : null,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : null,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        durationDays: Number(form.durationDays),
      });
      toast("Job posted!", "success");
      navigate("/employer/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
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

  const sectionTitle = (title) => (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, marginTop: 28 }}>
      <span style={{ fontFamily: "JetBrains Mono", fontSize: 11, letterSpacing: "0.1em", color: "var(--accent)", textTransform: "uppercase" }}>
        {title}
      </span>
      <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
    </div>
  );

  return (
    <>
      <Navbar />
      <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--text)", padding: "32px 24px 64px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>

          <button onClick={() => navigate(-1)} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontFamily: "JetBrains Mono", fontSize: 12, color: "var(--muted)",
            background: "none", border: "none", cursor: "pointer", marginBottom: 24,
            letterSpacing: "0.08em",
          }}>
            <ArrowLeft size={14} /> Back
          </button>

          <p style={{ fontFamily: "JetBrains Mono", fontSize: 11, letterSpacing: "0.1em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 8 }}>
            FOR EMPLOYERS
          </p>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 800, marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
            <Briefcase size={28} style={{ color: "var(--accent)" }} />
            Post a Job
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 28 }}>
            Free to post. Your listing goes live immediately and appears in search across the board.
          </p>

          <form onSubmit={handleSubmit} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "28px 24px" }}>

            {sectionTitle("Company")}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }} className="rg2">
              <div>
                <label style={labelStyle}>Company Name *</label>
                <input value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Acme Inc." style={inputStyle}
                  onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"} />
              </div>
              <div>
                <label style={labelStyle}>Contact Email</label>
                <input value={form.companyEmail} onChange={(e) => set("companyEmail", e.target.value)} placeholder="hiring@acme.com" style={inputStyle}
                  onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"} />
              </div>
            </div>

            {sectionTitle("Role")}
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Job Title *</label>
              <input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Frontend Engineer" style={inputStyle}
                onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }} className="rg2">
              <div>
                <label style={labelStyle}>Location *</label>
                <input value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="Hyderabad, Telangana" style={inputStyle}
                  onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"} />
              </div>
              <div>
                <label style={labelStyle}>Job Type</label>
                <select value={form.type} onChange={(e) => set("type", e.target.value)} style={inputStyle}>
                  <option>Full Time</option>
                  <option>Part Time</option>
                  <option>Contract</option>
                  <option>Internship</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Listing Duration</label>
              <select value={form.durationDays} onChange={(e) => set("durationDays", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                {DURATION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <p style={{ fontFamily: "Poppins", fontSize: 11.5, color: "var(--muted)", marginTop: 6 }}>
                After this period, your listing stops showing in search — it stays visible (marked Expired) on your dashboard.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }} className="rg2">
              <div>
                <label style={labelStyle}>Experience Level</label>
                <select value={form.experienceLevel} onChange={(e) => set("experienceLevel", e.target.value)} style={inputStyle}>
                  <option value="fresher">Fresher</option>
                  <option value="junior">Junior</option>
                  <option value="mid">Mid</option>
                  <option value="senior">Senior</option>
                </select>
              </div>
              <div>
                <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input type="checkbox" checked={form.remote} onChange={(e) => set("remote", e.target.checked)} style={{ accentColor: "var(--accent)", width: 15, height: 15 }} />
                  Remote friendly
                </label>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }} className="rg2">
              <div>
                <label style={labelStyle}>Salary Min (Rs, per year)</label>
                <input type="number" value={form.salaryMin} onChange={(e) => set("salaryMin", e.target.value)} placeholder="600000" style={inputStyle}
                  onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"} />
              </div>
              <div>
                <label style={labelStyle}>Salary Max (Rs, per year)</label>
                <input type="number" value={form.salaryMax} onChange={(e) => set("salaryMax", e.target.value)} placeholder="1200000" style={inputStyle}
                  onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"} />
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Skills / Tags (comma separated)</label>
              <input value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="React, TypeScript, REST APIs" style={inputStyle}
                onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"} />
            </div>

            {sectionTitle("Description")}
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Responsibilities, requirements, benefits..."
              rows={7}
              style={{ ...inputStyle, resize: "vertical" }}
              onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
              onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
            />

            {sectionTitle("How candidates apply")}
            <div style={{ marginBottom: 6 }}>
              <label style={labelStyle}>Apply URL</label>
              <input value={form.applyUrl} onChange={(e) => set("applyUrl", e.target.value)} placeholder="https://acme.com/careers/frontend-engineer" style={inputStyle}
                onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"} />
              <p style={{ fontFamily: "Poppins", fontSize: 11.5, color: "var(--muted)", marginTop: 6 }}>
                Leave blank to let candidates apply via the contact email above instead.
              </p>
            </div>

            {error && <p style={{ color: "#fb7185", fontFamily: "Poppins", fontSize: 13, marginTop: 16 }}>{error}</p>}

            <button type="submit" disabled={submitting} style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "13px", background: "var(--accent)", color: "#09090B",
              border: "none", borderRadius: 10, cursor: submitting ? "default" : "pointer",
              fontFamily: "Poppins", fontSize: 14, fontWeight: 700,
              opacity: submitting ? 0.75 : 1, marginTop: 22,
            }}>
              {submitting ? <><Loader2 size={17} style={{ animation: "spin 1s linear infinite" }} /> Posting...</> : <><Send size={16} /> Post Job — Free</>}
            </button>
          </form>
        </div>
      </div>
      <Footer />
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media(max-width:640px){.rg2{grid-template-columns:1fr!important;}}
      `}</style>
    </>
  );
}