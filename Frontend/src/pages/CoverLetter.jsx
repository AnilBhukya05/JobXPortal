import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Copy, Check } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { askClaude, extractPlainText } from "../services/claudeApi";

export default function CoverLetter() {
  const navigate = useNavigate();
  const location = useLocation();
  const job = location.state?.job || null;

  const [form, setForm] = useState({
    name: "",
    experience: "",
    skills: "",
    jobTitle: job?.title || "",
    company: job?.company || "",
    jd: job?.description || "",
    tone: "professional",
  });
  const [letter, setLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function generate() {
    if (!form.name.trim() || !form.jobTitle.trim()) {
      setError("Please fill in at least your name and the job title.");
      return;
    }
    setError(""); setLoading(true); setLetter("");

    try {
      const text = await askClaude(
        `Write a ${form.tone} cover letter as plain text only.

Applicant: ${form.name}
Experience: ${form.experience || "fresher"}
Skills: ${form.skills || "general"}
Role: ${form.jobTitle}
Company: ${form.company || "the company"}
${form.jd ? "Job summary: " + form.jd.slice(0, 400) : ""}

Rules:
- Start with: Dear Hiring Manager,
- Write exactly 3 paragraphs
- End with: Sincerely,\n${form.name}
- Do NOT return JSON
- Do NOT use any brackets, keys, or quotes around the letter
- Return ONLY the letter text itself`,
        700
      );

      setLetter(extractPlainText(text));
    } catch (e) {
      setError("Failed to generate: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  function copyLetter() {
    navigator.clipboard.writeText(letter).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
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

  return (
    <>
      <Navbar />
      <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--text)", padding: "32px 24px 64px" }}>
        <div style={{ maxWidth: 920, margin: "0 auto" }}>

          <button onClick={() => navigate(-1)} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontFamily: "JetBrains Mono", fontSize: 12, color: "var(--muted)",
            background: "none", border: "none", cursor: "pointer", marginBottom: 24,
            letterSpacing: "0.08em",
          }}>
            <ArrowLeft size={14} /> Back
          </button>

          <p style={{ fontFamily: "JetBrains Mono", fontSize: 11, letterSpacing: "0.1em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 8 }}>
            AI POWERED
          </p>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, marginBottom: 8 }}>
            Cover Letter Generator
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 15, marginBottom: 28 }}>
            Fill in a few details and get a tailored cover letter in seconds.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="rg2">
            {/* FORM */}
            <div style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 16, padding: "24px",
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { name: "name", label: "Your Full Name *", placeholder: "Anil Bhukya" },
                  { name: "experience", label: "Years of Experience", placeholder: "e.g. 2 years" },
                  { name: "skills", label: "Key Skills", placeholder: "React, Node.js, Python..." },
                  { name: "jobTitle", label: "Job Title *", placeholder: "Senior React Developer" },
                  { name: "company", label: "Company Name", placeholder: "Google" },
                ].map((field) => (
                  <div key={field.name}>
                    <label style={labelStyle}>{field.label}</label>
                    <input
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      style={inputStyle}
                      onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                      onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                    />
                  </div>
                ))}

                <div>
                  <label style={labelStyle}>Tone</label>
                  <select name="tone" value={form.tone} onChange={handleChange}
                    style={{ ...inputStyle, cursor: "pointer" }}>
                    <option value="professional">Professional</option>
                    <option value="enthusiastic">Enthusiastic</option>
                    <option value="concise">Concise</option>
                    <option value="creative">Creative</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Job Description <span style={{ color: "var(--muted)", fontWeight: 400 }}>(optional)</span></label>
                  <textarea
                    name="jd" value={form.jd} onChange={handleChange}
                    placeholder="Paste JD for a more tailored letter..." rows={4}
                    style={{ ...inputStyle, resize: "vertical" }}
                    onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                  />
                </div>
              </div>

              {error && (
                <p style={{ color: "#fb7185", fontFamily: "Poppins", fontSize: 13, marginTop: 12 }}>
                  {error}
                </p>
              )}

              <button onClick={generate} disabled={loading} style={{
                width: "100%", marginTop: 16,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "13px", background: "var(--accent)", color: "#09090B",
                border: "none", borderRadius: 10, cursor: "pointer",
                fontFamily: "Poppins", fontSize: 14, fontWeight: 700,
                opacity: loading ? 0.7 : 1, transition: "opacity 0.2s",
              }}>
                {loading ? (
                  <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Writing...</>
                ) : "Generate Cover Letter"}
              </button>
            </div>

            {/* OUTPUT */}
            <div style={{
              background: "var(--surface)",
              border: `1px solid ${letter ? "var(--accent)" : "var(--border)"}`,
              borderRadius: 16, padding: "24px",
              transition: "border-color 0.3s",
            }}>
              {letter ? (
                <>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <span style={{ fontFamily: "Poppins", fontSize: 13, fontWeight: 700, color: "var(--accent)" }}>
                      Your Cover Letter
                    </span>
                    <button onClick={copyLetter} style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "6px 14px",
                      background: copied ? "var(--accent)" : "var(--bg)",
                      border: "1px solid var(--border)", borderRadius: 8,
                      color: copied ? "#09090B" : "var(--muted)",
                      cursor: "pointer", fontFamily: "Poppins", fontSize: 12, fontWeight: 600,
                      transition: "all 0.2s",
                    }}>
                      {copied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy</>}
                    </button>
                  </div>
                  <p style={{
                    fontFamily: "Poppins", fontSize: 14, lineHeight: 1.8,
                    color: "var(--text)", whiteSpace: "pre-line",
                  }}>
                    {letter}
                  </p>
                </>
              ) : (
                <div style={{
                  minHeight: 300, display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: 12,
                }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: "50%",
                    background: "var(--surface2)", border: "1px solid var(--border)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 24,
                  }}>✉️</div>
                  <p style={{ color: "var(--muted)", fontFamily: "Poppins", fontSize: 14, textAlign: "center" }}>
                    Your cover letter will appear here
                  </p>
                  <p style={{ color: "var(--muted)", fontFamily: "JetBrains Mono", fontSize: 11, textAlign: "center", opacity: 0.6 }}>
                    Fill in the form and click Generate
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media(max-width:640px) { .rg2 { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  );
}