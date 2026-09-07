import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, ChevronDown, ChevronUp, Lightbulb } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { askClaude, parseJSON } from "../services/claudeApi";

const CATEGORIES = [
  { id: "technical", label: "Technical", color: "#00FFB3", bg: "rgba(0,255,179,0.06)" },
  { id: "behavioral", label: "Behavioral", color: "#FFB020", bg: "rgba(255,176,32,0.06)" },
  { id: "situational", label: "Situational", color: "#2DD4BF", bg: "rgba(45,212,191,0.06)" },
  { id: "company", label: "About Company", color: "#a78bfa", bg: "rgba(167,139,250,0.06)" },
];

export default function InterviewPrep() {
  const navigate = useNavigate();
  const location = useLocation();
  const job = location.state?.job || null;

  const [title, setTitle] = useState(job?.title || "");
  const [desc, setDesc] = useState(job?.description || "");
  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState({});

  function toggleQ(id) {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  async function generate() {
    if (!title.trim()) { setError("Please enter a job title."); return; }
    setError(""); setLoading(true); setQuestions(null);

    // Keep tips SHORT to avoid JSON truncation
    const prompt = `Generate 3 interview questions per category for a "${title}" role.
${desc ? "Job context: " + desc.slice(0, 300) : ""}

Return ONLY this JSON. Keep each tip under 40 words:
{"technical":[{"q":"question","tip":"short tip"},{"q":"question","tip":"short tip"},{"q":"question","tip":"short tip"}],"behavioral":[{"q":"question","tip":"short tip"},{"q":"question","tip":"short tip"},{"q":"question","tip":"short tip"}],"situational":[{"q":"question","tip":"short tip"},{"q":"question","tip":"short tip"},{"q":"question","tip":"short tip"}],"company":[{"q":"question","tip":"short tip"},{"q":"question","tip":"short tip"},{"q":"question","tip":"short tip"}]}`;

    try {
      const text = await askClaude(prompt, 1500);
      setQuestions(parseJSON(text));
    } catch (e) {
      setError("Failed to generate: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--text)", padding: "32px 24px 64px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>

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
            Interview Prep
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 15, marginBottom: 28 }}>
            Get AI-generated interview questions with clear answer guides tailored to any role.
          </p>

          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px", marginBottom: 28 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontFamily: "Poppins", fontSize: 13, fontWeight: 600, color: "var(--text)", display: "block", marginBottom: 8 }}>
                  Job Title *
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && generate()}
                  placeholder="e.g. Senior React Developer, Social Media Manager..."
                  style={{
                    width: "100%", background: "var(--bg)",
                    border: "1px solid var(--border)", borderRadius: 10,
                    padding: "12px 16px", color: "var(--text)",
                    fontFamily: "Poppins", fontSize: 14, outline: "none",
                    transition: "border-color 0.15s",
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                />
              </div>

              <div>
                <label style={{ fontFamily: "Poppins", fontSize: 13, fontWeight: 600, color: "var(--text)", display: "block", marginBottom: 8 }}>
                  Job Description{" "}
                  <span style={{ color: "var(--muted)", fontWeight: 400 }}>(optional)</span>
                </label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Paste job description here for more tailored questions..."
                  rows={4}
                  style={{
                    width: "100%", background: "var(--bg)",
                    border: "1px solid var(--border)", borderRadius: 10,
                    padding: "12px 16px", color: "var(--text)",
                    fontFamily: "Poppins", fontSize: 13, resize: "vertical",
                    outline: "none", transition: "border-color 0.15s",
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                />
              </div>
            </div>

            {error && (
              <p style={{ color: "#fb7185", fontFamily: "Poppins", fontSize: 13, marginTop: 12, lineHeight: 1.5 }}>
                {error}
              </p>
            )}

            <button onClick={generate} disabled={loading} style={{
              display: "flex", alignItems: "center", gap: 8, marginTop: 16,
              padding: "12px 32px", background: "var(--accent)", color: "#09090B",
              border: "none", borderRadius: 10, cursor: "pointer",
              fontFamily: "Poppins", fontSize: 14, fontWeight: 700,
              opacity: loading ? 0.7 : 1, transition: "opacity 0.2s",
            }}>
              {loading ? <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Generating...</> : "Generate Questions"}
            </button>
          </div>

          {questions && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <p style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "var(--muted)", letterSpacing: "0.06em", textAlign: "center" }}>
                CLICK ANY QUESTION TO SEE THE ANSWER GUIDE
              </p>

              {CATEGORIES.map((cat) => {
                const catQs = questions[cat.id] || [];
                return (
                  <div key={cat.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
                    <div style={{ padding: "14px 20px", background: cat.bg, borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: cat.color, display: "inline-block", boxShadow: `0 0 6px ${cat.color}` }} />
                      <span style={{ fontFamily: "Poppins", fontSize: 14, fontWeight: 700, color: cat.color }}>
                        {cat.label} Questions
                      </span>
                    </div>

                    {catQs.map((item, i) => {
                      const key = cat.id + i;
                      const isOpen = !!open[key];
                      return (
                        <div key={key}>
                          <button onClick={() => toggleQ(key)} style={{
                            width: "100%", display: "flex", alignItems: "flex-start", justifyContent: "space-between",
                            padding: "16px 20px", background: isOpen ? cat.bg : "none",
                            border: "none", borderBottom: "1px solid var(--border)",
                            cursor: "pointer", textAlign: "left", gap: 16, transition: "background 0.15s",
                          }}>
                            <span style={{ fontFamily: "Poppins", fontSize: 14, fontWeight: 600, color: "var(--text)", lineHeight: 1.5, flex: 1 }}>
                              {i + 1}. {item.q}
                            </span>
                            <span style={{ color: isOpen ? cat.color : "var(--muted)", flexShrink: 0, marginTop: 2 }}>
                              {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </span>
                          </button>

                          {isOpen && (
                            <div style={{ padding: "16px 20px 20px", background: "var(--bg)", borderBottom: i < catQs.length - 1 ? "1px solid var(--border)" : "none" }}>
                              <div style={{
                                display: "flex", gap: 12, alignItems: "flex-start",
                                padding: "16px 18px", background: "var(--surface)",
                                border: `1px solid ${cat.color}30`, borderLeft: `4px solid ${cat.color}`, borderRadius: 10,
                              }}>
                                <Lightbulb size={18} style={{ color: cat.color, flexShrink: 0, marginTop: 2 }} />
                                <div>
                                  <p style={{ fontFamily: "Poppins", fontSize: 11, fontWeight: 700, color: cat.color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                                    How to answer
                                  </p>
                                  <p style={{ fontFamily: "Poppins", fontSize: 14, lineHeight: 1.75, color: "var(--text)", margin: 0 }}>
                                    {item.tip}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}