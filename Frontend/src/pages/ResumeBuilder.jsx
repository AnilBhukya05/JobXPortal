import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Plus, X, Eye, ExternalLink, FileText } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { fetchResume, saveResumeApi } from "../services/resumeService";

const EMPTY_RESUME = {
  name: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  portfolio: "",
  summary: "",
  skillCategories: [{ category: "", skills: "" }],
  experience: [{ company: "", role: "", location: "", duration: "", points: "" }],
  education: [{ institution: "", degree: "", year: "", grade: "", coursework: "" }],
  projects: [{ name: "", tech: "", github: "", live: "", points: "" }],
  certifications: "",
  publications: "",
  achievements: "",
};

export default function ResumeBuilder() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_RESUME);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const previewRef = useRef();
  const saveTimeout = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        const { resume } = await fetchResume();
        if (resume) setForm({ ...EMPTY_RESUME, ...resume });
      } catch (err) {
        setError("Couldn't load your resume. Is the backend running?");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function save(updated) {
    setForm(updated);
    setSaving(true);
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      try {
        await saveResumeApi(updated);
      } catch (err) {
        setError("Failed to save: " + err.message);
      } finally {
        setSaving(false);
      }
    }, 600);
  }

  function set(field, value) {
    save({ ...form, [field]: value });
  }

  function setSkillCat(i, field, value) {
    const cats = [...form.skillCategories];
    cats[i] = { ...cats[i], [field]: value };
    save({ ...form, skillCategories: cats });
  }

  function setExp(i, field, value) {
    const exp = [...form.experience];
    exp[i] = { ...exp[i], [field]: value };
    save({ ...form, experience: exp });
  }

  function setEdu(i, field, value) {
    const edu = [...form.education];
    edu[i] = { ...edu[i], [field]: value };
    save({ ...form, education: edu });
  }

  function setProj(i, field, value) {
    const proj = [...form.projects];
    proj[i] = { ...proj[i], [field]: value };
    save({ ...form, projects: proj });
  }

  async function exportPDF() {
    setPreview(true);
    setExporting(true);
    setTimeout(async () => {
      try {
        const { default: jsPDF } = await import("jspdf");
        const { default: html2canvas } = await import("html2canvas");
        const el = previewRef.current;
        const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        const w = pdf.internal.pageSize.getWidth();
        const h = (canvas.height * w) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, w, h);
        pdf.save(`${form.name || "resume"}_resume.pdf`);
      } catch (e) {
        alert("Export failed: " + e.message);
      } finally {
        setExporting(false);
      }
    }, 400);
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
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      marginBottom: 16, marginTop: 28,
    }}>
      <span style={{ fontFamily: "JetBrains Mono", fontSize: 11, letterSpacing: "0.1em", color: "var(--accent)", textTransform: "uppercase" }}>
        {title}
      </span>
      <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
    </div>
  );

  const addBtnStyle = {
    display: "flex", alignItems: "center", gap: 6,
    padding: "8px 16px", background: "none",
    border: "1px dashed var(--border)", borderRadius: 9,
    color: "var(--muted)", cursor: "pointer", fontFamily: "Poppins", fontSize: 12,
  };

  const cardStyle = {
    background: "var(--bg)", border: "1px solid var(--border)",
    borderRadius: 12, padding: "16px", marginBottom: 12, position: "relative",
  };

  const removeBtnStyle = {
    position: "absolute", top: 12, right: 12,
    background: "none", border: "none", cursor: "pointer", color: "var(--muted)",
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--muted)", padding: "64px 24px", textAlign: "center", fontFamily: "Poppins" }}>
          Loading your resume...
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--text)", padding: "32px 24px 64px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>

          <button onClick={() => navigate(-1)} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontFamily: "JetBrains Mono", fontSize: 12, color: "var(--muted)",
            background: "none", border: "none", cursor: "pointer", marginBottom: 24,
            letterSpacing: "0.08em",
          }}>
            <ArrowLeft size={14} /> Back
          </button>

          <p style={{ fontFamily: "JetBrains Mono", fontSize: 11, letterSpacing: "0.1em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 8 }}>
            RESUME BUILDER
          </p>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, marginBottom: 8 }}>
            Build Your Resume
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 8 }}>
            Fill in your details, preview and download as a clean PDF. {saving ? "Saving..." : "Saved to your account."}
          </p>
          {error && (
            <p style={{ color: "#fb7185", fontSize: 13, marginBottom: 20, fontFamily: "Poppins" }}>{error}</p>
          )}

          <a
            href="https://topmate.io/anilbhukya05/2241969"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
              background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14,
              padding: "16px 20px", marginBottom: 28, textDecoration: "none",
              transition: "border-color 0.15s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, background: "var(--accent)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <FileText size={18} color="#09090B" />
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 2 }}>
                  Prefer a ready-made ATS template?
                </p>
                <p style={{ fontFamily: "Poppins", fontSize: 12.5, color: "var(--muted)" }}>
                  Editable, ATS-friendly resume template by Anil Bhukya — plug in your details and go.
                </p>
              </div>
            </div>
            <ExternalLink size={16} style={{ color: "var(--muted)", flexShrink: 0 }} />
          </a>

          <div style={{ display: "flex", gap: 10, marginBottom: 32, flexWrap: "wrap" }}>
            <button onClick={() => setPreview(!preview)} style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "10px 20px", background: preview ? "var(--teal)" : "var(--surface)",
              border: "1px solid var(--border)", borderRadius: 10,
              color: preview ? "#09090B" : "var(--text)",
              fontFamily: "Poppins", fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}>
              <Eye size={15} />
              {preview ? "Edit Mode" : "Preview"}
            </button>
            <button onClick={exportPDF} disabled={exporting} style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "10px 20px", background: "var(--accent)", color: "#09090B",
              border: "none", borderRadius: 10,
              fontFamily: "Poppins", fontSize: 13, fontWeight: 700,
              cursor: "pointer", opacity: exporting ? 0.7 : 1,
            }}>
              <Download size={15} />
              {exporting ? "Exporting..." : "Download PDF"}
            </button>
            <button onClick={() => save(EMPTY_RESUME)} style={{
              padding: "10px 16px", background: "none",
              border: "1px solid var(--border)", borderRadius: 10,
              color: "var(--muted)", fontFamily: "Poppins",
              fontSize: 13, cursor: "pointer",
            }}>
              Clear All
            </button>
          </div>

          {preview && (
            <div ref={previewRef} style={{
              background: "#ffffff", color: "#111",
              padding: "40px 48px", borderRadius: 12,
              fontFamily: "Arial, sans-serif", marginBottom: 32,
              border: "1px solid var(--border)",
            }}>
              <div style={{ textAlign: "center", marginBottom: 20, borderBottom: "2px solid #10B981", paddingBottom: 16 }}>
                <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, color: "#111", letterSpacing: "-0.02em" }}>
                  {form.name || "Your Name"}
                </h1>
                {form.title && (
                  <p style={{ fontSize: 13, color: "#10B981", fontWeight: 600, margin: "4px 0 0" }}>
                    {form.title}
                  </p>
                )}
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px 14px", marginTop: 10, fontSize: 11.5, color: "#555" }}>
                  {form.location && <span>{form.location}</span>}
                  {form.email && <span>{form.email}</span>}
                  {form.phone && <span>{form.phone}</span>}
                  {form.linkedin && <span>linkedin.com/in/{form.linkedin}</span>}
                  {form.github && <span>github.com/{form.github}</span>}
                  {form.portfolio && <span>{form.portfolio}</span>}
                </div>
              </div>

              {form.summary && (
                <div style={{ marginBottom: 16 }}>
                  <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#10B981", marginBottom: 6 }}>Professional Summary</h2>
                  <p style={{ fontSize: 11.5, color: "#333", lineHeight: 1.7, margin: 0, textAlign: "justify" }}>{form.summary}</p>
                </div>
              )}

              {form.experience.some((e) => e.company) && (
                <div style={{ marginBottom: 16 }}>
                  <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#10B981", marginBottom: 10 }}>Experience</h2>
                  {form.experience.filter((e) => e.company).map((exp, i) => (
                    <div key={i} style={{ marginBottom: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <strong style={{ fontSize: 13, color: "#111" }}>{exp.role}</strong>
                        <span style={{ fontSize: 11, color: "#777" }}>{exp.duration}</span>
                      </div>
                      <div style={{ fontSize: 12, color: "#10B981", marginBottom: 4 }}>
                        {exp.company}{exp.location && <span style={{ color: "#888" }}> · {exp.location}</span>}
                      </div>
                      {exp.points && exp.points.split("\n").filter(Boolean).map((p, j) => (
                        <div key={j} style={{ fontSize: 11.5, color: "#444", paddingLeft: 12, marginBottom: 2, lineHeight: 1.5 }}>◦ {p}</div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {form.education.some((e) => e.institution) && (
                <div style={{ marginBottom: 16 }}>
                  <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#10B981", marginBottom: 10 }}>Education</h2>
                  {form.education.filter((e) => e.institution).map((edu, i) => (
                    <div key={i} style={{ marginBottom: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div>
                          <strong style={{ fontSize: 13, color: "#111" }}>{edu.institution}</strong>
                          <div style={{ fontSize: 12, color: "#555" }}>
                            {edu.degree}{edu.grade && ` | ${edu.grade}`}
                          </div>
                        </div>
                        <div style={{ textAlign: "right", fontSize: 11, color: "#777", whiteSpace: "nowrap" }}>
                          {edu.year}
                        </div>
                      </div>
                      {edu.coursework && (
                        <div style={{ fontSize: 11, color: "#666", marginTop: 3 }}>
                          Relevant Coursework: {edu.coursework}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {form.skillCategories.some((c) => c.category || c.skills) && (
                <div style={{ marginBottom: 16 }}>
                  <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#10B981", marginBottom: 8 }}>Skills</h2>
                  {form.skillCategories.filter((c) => c.category || c.skills).map((cat, i) => (
                    <div key={i} style={{ fontSize: 11.5, color: "#333", lineHeight: 1.7, marginBottom: 3 }}>
                      {cat.category && <strong style={{ color: "#111" }}>{cat.category} : </strong>}
                      {cat.skills}
                    </div>
                  ))}
                </div>
              )}

              {form.projects.some((p) => p.name) && (
                <div style={{ marginBottom: 16 }}>
                  <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#10B981", marginBottom: 10 }}>Projects</h2>
                  {form.projects.filter((p) => p.name).map((proj, i) => (
                    <div key={i} style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
                        <div>
                          <strong style={{ fontSize: 13, color: "#111" }}>{proj.name}</strong>
                          {proj.tech && <span style={{ fontSize: 11, color: "#10B981" }}> | {proj.tech}</span>}
                        </div>
                        <div style={{ fontSize: 11, color: "#10B981" }}>
                          {proj.github && <span>GitHub</span>}
                          {proj.github && proj.live && <span> · </span>}
                          {proj.live && <span>Live</span>}
                        </div>
                      </div>
                      {proj.points && proj.points.split("\n").filter(Boolean).map((p, j) => (
                        <div key={j} style={{ fontSize: 11.5, color: "#444", paddingLeft: 12, marginTop: 2, lineHeight: 1.5 }}>◦ {p}</div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {form.certifications && (
                <div style={{ marginBottom: 16 }}>
                  <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#10B981", marginBottom: 6 }}>Certifications</h2>
                  {form.certifications.split("\n").filter(Boolean).map((c, i) => (
                    <div key={i} style={{ fontSize: 11.5, color: "#444", paddingLeft: 12, marginBottom: 2 }}>◦ {c}</div>
                  ))}
                </div>
              )}

              {form.publications && (
                <div style={{ marginBottom: 16 }}>
                  <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#10B981", marginBottom: 6 }}>Publications</h2>
                  {form.publications.split("\n").filter(Boolean).map((c, i) => (
                    <div key={i} style={{ fontSize: 11.5, color: "#444", marginBottom: 2, lineHeight: 1.5 }}>{c}</div>
                  ))}
                </div>
              )}

              {form.achievements && (
                <div>
                  <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#10B981", marginBottom: 6 }}>Achievements</h2>
                  {form.achievements.split("\n").filter(Boolean).map((c, i) => (
                    <div key={i} style={{ fontSize: 11.5, color: "#444", paddingLeft: 12, marginBottom: 2, lineHeight: 1.5 }}>◦ {c}</div>
                  ))}
                </div>
              )}
            </div>
          )}

          {!preview && (
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "28px 24px" }}>

              {sectionTitle("Personal Information")}
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Professional Title</label>
                <input
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="Frontend Developer | React.js Developer | Software Engineer"
                  style={inputStyle}
                  onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="rg2">
                {[
                  { field: "name", label: "Full Name *", placeholder: "Anil Bhukya" },
                  { field: "email", label: "Email *", placeholder: "anil@gmail.com" },
                  { field: "phone", label: "Phone", placeholder: "+91 9999999999" },
                  { field: "location", label: "Location", placeholder: "Hyderabad, Telangana" },
                  { field: "linkedin", label: "LinkedIn Username", placeholder: "anil-bhukya" },
                  { field: "github", label: "GitHub Username", placeholder: "AnilBhukya05" },
                  { field: "portfolio", label: "Portfolio URL", placeholder: "anilbhukya.dev" },
                ].map((f) => (
                  <div key={f.field}>
                    <label style={labelStyle}>{f.label}</label>
                    <input
                      value={form[f.field]}
                      onChange={(e) => set(f.field, e.target.value)}
                      placeholder={f.placeholder}
                      style={inputStyle}
                      onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                      onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                    />
                  </div>
                ))}
              </div>

              {sectionTitle("Professional Summary")}
              <textarea
                value={form.summary}
                onChange={(e) => set("summary", e.target.value)}
                placeholder="Frontend Developer with 1+ year of hands-on experience building scalable, production-ready web applications using React.js..."
                rows={4}
                style={{ ...inputStyle, resize: "vertical" }}
                onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
              />

              {sectionTitle("Experience")}
              {form.experience.map((exp, i) => (
                <div key={i} style={cardStyle}>
                  {form.experience.length > 1 && (
                    <button onClick={() => save({ ...form, experience: form.experience.filter((_, j) => j !== i) })} style={removeBtnStyle}>
                      <X size={14} />
                    </button>
                  )}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }} className="rg2">
                    {[
                      { field: "company", placeholder: "Company Name" },
                      { field: "role", placeholder: "Job Title / Role" },
                      { field: "location", placeholder: "City (e.g. Hyderabad)" },
                      { field: "duration", placeholder: "Apr 2026 – Present" },
                    ].map((f) => (
                      <input key={f.field} value={exp[f.field]} onChange={(e) => setExp(i, f.field, e.target.value)}
                        placeholder={f.placeholder} style={inputStyle}
                        onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                        onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                      />
                    ))}
                  </div>
                  <textarea
                    value={exp.points}
                    onChange={(e) => setExp(i, "points", e.target.value)}
                    placeholder={"Built and shipped X using React.js and Tailwind CSS\nDeveloped Y improving Z by N%\nOwned the project end-to-end"}
                    rows={4}
                    style={{ ...inputStyle, resize: "vertical" }}
                    onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                  />
                </div>
              ))}
              <button onClick={() => save({ ...form, experience: [...form.experience, { company: "", role: "", location: "", duration: "", points: "" }] })} style={addBtnStyle}>
                <Plus size={13} /> Add Experience
              </button>

              {sectionTitle("Education")}
              {form.education.map((edu, i) => (
                <div key={i} style={cardStyle}>
                  {form.education.length > 1 && (
                    <button onClick={() => save({ ...form, education: form.education.filter((_, j) => j !== i) })} style={removeBtnStyle}>
                      <X size={14} />
                    </button>
                  )}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }} className="rg2">
                    {[
                      { field: "institution", placeholder: "CMR Engineering College" },
                      { field: "degree", placeholder: "B.Tech in Computer Science and Engineering" },
                      { field: "year", placeholder: "Nov 2021 – July 2025" },
                      { field: "grade", placeholder: "CGPA: 8.68/10" },
                    ].map((f) => (
                      <input key={f.field} value={edu[f.field]} onChange={(e) => setEdu(i, f.field, e.target.value)}
                        placeholder={f.placeholder} style={inputStyle}
                        onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                        onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                      />
                    ))}
                  </div>
                  <input
                    value={edu.coursework}
                    onChange={(e) => setEdu(i, "coursework", e.target.value)}
                    placeholder="Relevant Coursework: Web Technologies, DBMS, Operating Systems"
                    style={inputStyle}
                    onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                  />
                </div>
              ))}
              <button onClick={() => save({ ...form, education: [...form.education, { institution: "", degree: "", year: "", grade: "", coursework: "" }] })} style={addBtnStyle}>
                <Plus size={13} /> Add Education
              </button>

              {sectionTitle("Skills")}
              {form.skillCategories.map((cat, i) => (
                <div key={i} style={cardStyle}>
                  {form.skillCategories.length > 1 && (
                    <button onClick={() => save({ ...form, skillCategories: form.skillCategories.filter((_, j) => j !== i) })} style={removeBtnStyle}>
                      <X size={14} />
                    </button>
                  )}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12 }} className="rg2">
                    <input value={cat.category} onChange={(e) => setSkillCat(i, "category", e.target.value)}
                      placeholder="Frontend Development" style={inputStyle}
                      onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                      onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                    />
                    <input value={cat.skills} onChange={(e) => setSkillCat(i, "skills", e.target.value)}
                      placeholder="React.js, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS" style={inputStyle}
                      onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                      onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                    />
                  </div>
                </div>
              ))}
              <button onClick={() => save({ ...form, skillCategories: [...form.skillCategories, { category: "", skills: "" }] })} style={addBtnStyle}>
                <Plus size={13} /> Add Skill Category
              </button>

              {sectionTitle("Projects")}
              {form.projects.map((proj, i) => (
                <div key={i} style={cardStyle}>
                  {form.projects.length > 1 && (
                    <button onClick={() => save({ ...form, projects: form.projects.filter((_, j) => j !== i) })} style={removeBtnStyle}>
                      <X size={14} />
                    </button>
                  )}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }} className="rg2">
                    <input value={proj.name} onChange={(e) => setProj(i, "name", e.target.value)}
                      placeholder="Project Name" style={inputStyle}
                      onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                      onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                    />
                    <input value={proj.tech} onChange={(e) => setProj(i, "tech", e.target.value)}
                      placeholder="React.js, Tailwind CSS, JavaScript" style={inputStyle}
                      onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                      onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                    />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }} className="rg2">
                    <input value={proj.github} onChange={(e) => setProj(i, "github", e.target.value)}
                      placeholder="GitHub link" style={inputStyle}
                      onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                      onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                    />
                    <input value={proj.live} onChange={(e) => setProj(i, "live", e.target.value)}
                      placeholder="Live link" style={inputStyle}
                      onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                      onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                    />
                  </div>
                  <textarea
                    value={proj.points}
                    onChange={(e) => setProj(i, "points", e.target.value)}
                    placeholder={"Built a centralized job aggregation platform...\nImplemented advanced search and filtering functionality..."}
                    rows={3}
                    style={{ ...inputStyle, resize: "vertical" }}
                    onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                  />
                </div>
              ))}
              <button onClick={() => save({ ...form, projects: [...form.projects, { name: "", tech: "", github: "", live: "", points: "" }] })} style={addBtnStyle}>
                <Plus size={13} /> Add Project
              </button>

              {sectionTitle("Certifications")}
              <textarea
                value={form.certifications}
                onChange={(e) => set("certifications", e.target.value)}
                placeholder={"React JS – Core frontend concepts including component-based architecture, props, and hooks — Scaler\nJava Programming – Covered Java basics — Coursera"}
                rows={3}
                style={{ ...inputStyle, resize: "vertical" }}
                onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
              />

              {sectionTitle("Publications")}
              <textarea
                value={form.publications}
                onChange={(e) => set("publications", e.target.value)}
                placeholder={"Face Recognition-Based Attendance System Using KNN Algorithm — IEEE 3rd ICAISS, 2025. DOI: 10.1109/ICAISS61471.2025.11042050"}
                rows={2}
                style={{ ...inputStyle, resize: "vertical" }}
                onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
              />

              {sectionTitle("Achievements")}
              <textarea
                value={form.achievements}
                onChange={(e) => set("achievements", e.target.value)}
                placeholder={"Certificate of Merit – Naukri Campus Young Turks 2025, secured 95.22 percentile\nEvent Organizer – College-Level Events"}
                rows={3}
                style={{ ...inputStyle, resize: "vertical" }}
                onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
              />

            </div>
          )}
        </div>
      </div>
      <Footer />
      <style>{`@media(max-width:640px){.rg2{grid-template-columns:1fr!important;}}`}</style>
    </>
  );
}