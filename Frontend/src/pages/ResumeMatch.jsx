import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, CheckCircle2, XCircle, AlertCircle, Upload, FileText, X } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { askClaude, parseJSON } from "../services/claudeApi";

async function extractTextFromPDF(file) {
  const pdfjsLib = await import("pdfjs-dist");
  // Use the same version as the installed package
  const pdfjsVersion = pdfjsLib.version;
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    new URL("pdfjs-dist/build/pdf.worker.min.js", import.meta.url).toString();

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str).join(" ");
    fullText += pageText + "\n";
  }

  return fullText.trim();
}

export default function ResumeMatch() {
  const navigate = useNavigate();
  const fileRef = useRef();
  const [jd, setJd] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setError("");
    setFileLoading(true);
    setFileName(file.name);

    try {
      let text = "";

      if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
        text = await extractTextFromPDF(file);
        if (!text || text.length < 50) {
          throw new Error("Could not extract text from this PDF. It may be scanned or image-based. Please paste your resume text instead.");
        }
      } else {
        text = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target.result);
          reader.onerror = () => reject(new Error("Failed to read file"));
          reader.readAsText(file);
        });
      }

      setResumeText(text);
    } catch (err) {
      setError(err.message);
      setFileName("");
      setResumeText("");
      if (fileRef.current) fileRef.current.value = "";
    } finally {
      setFileLoading(false);
    }
  }

  function clearFile() {
    setFileName("");
    setResumeText("");
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleMatch() {
    if (!jd.trim() || !resumeText.trim()) {
      setError("Please paste a job description and upload or paste your resume.");
      return;
    }
    setError(""); setLoading(true); setResult(null);

    try {
      const text = await askClaude(
        `You are a resume matcher. Analyze the match between this job description and resume.

JOB DESCRIPTION:
${jd.slice(0, 1500)}

RESUME:
${resumeText.slice(0, 1500)}

Return ONLY this JSON with no extra text:
{"score":75,"matched_skills":["skill1","skill2","skill3"],"missing_skills":["skill1","skill2","skill3"],"verdict":"One sentence assessment here.","tips":["Tip one here.","Tip two here.","Tip three here."]}`,
        800
      );
      setResult(parseJSON(text));
    } catch (err) {
      setError("Analysis failed: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  const scoreColor = !result ? "var(--accent)"
    : result.score >= 70 ? "#00FFB3"
    : result.score >= 40 ? "#FFB020"
    : "#fb7185";

  const textareaStyle = {
    width: "100%", background: "var(--surface)",
    border: "1px solid var(--border)", borderRadius: 12,
    padding: "14px 16px", color: "var(--text)",
    fontFamily: "Poppins", fontSize: 13, resize: "vertical",
    outline: "none", transition: "border-color 0.15s",
  };

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
            AI POWERED
          </p>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, marginBottom: 8 }}>
            Resume Match Score
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 15, marginBottom: 32 }}>
            Paste a job description and upload your resume to see how well you match and exactly what skills you are missing.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20, maxWidth: "100%" }} className="rg2">

            {/* JOB DESCRIPTION */}
            <div>
              <label style={{ fontFamily: "Poppins", fontSize: 13, fontWeight: 600, color: "var(--text)", display: "block", marginBottom: 8 }}>
                Job Description
              </label>
              <textarea
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                placeholder="Paste the full job description here..."
                rows={16}
                style={textareaStyle}
                onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
              />
            </div>

            {/* RESUME */}
            <div>
              <label style={{ fontFamily: "Poppins", fontSize: 13, fontWeight: 600, color: "var(--text)", display: "block", marginBottom: 8 }}>
                Your Resume
              </label>

              {/* UPLOAD ZONE */}
              <div
                onClick={() => !fileLoading && fileRef.current?.click()}
                style={{
                  border: "2px dashed var(--border)", borderRadius: 12,
                  padding: "20px 24px", textAlign: "center",
                  cursor: fileLoading ? "default" : "pointer",
                  background: "var(--surface)", marginBottom: 10,
                  transition: "border-color 0.15s, background 0.15s",
                }}
                onMouseEnter={(e) => { if (!fileLoading) { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.background = "var(--surface2)"; } }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--surface)"; }}
              >
                {fileLoading ? (
                  <>
                    <Loader2 size={24} style={{ color: "var(--accent)", margin: "0 auto 8px", animation: "spin 1s linear infinite" }} />
                    <p style={{ fontFamily: "Poppins", fontWeight: 600, color: "var(--accent)", fontSize: 13, marginBottom: 0 }}>
                      Reading file...
                    </p>
                  </>
                ) : (
                  <>
                    <Upload size={24} style={{ color: "var(--accent)", margin: "0 auto 8px" }} />
                    <p style={{ fontFamily: "Poppins", fontWeight: 600, color: "var(--text)", fontSize: 13, marginBottom: 3 }}>
                      Upload Resume (.pdf, .txt, .doc)
                    </p>
                    <p style={{ fontFamily: "Poppins", fontSize: 11, color: "var(--muted)" }}>
                      Click to browse your files
                    </p>
                  </>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept=".txt,.doc,.docx,.pdf"
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                />
              </div>

              {/* FILE BADGE */}
              {fileName && !fileLoading && (
                <div style={{
                  border: "1px solid var(--accent)", borderRadius: 10,
                  padding: "10px 14px", marginBottom: 10,
                  background: "rgba(0,255,179,0.05)",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <FileText size={16} style={{ color: "var(--accent)", flexShrink: 0 }} />
                    <span style={{ fontFamily: "Poppins", fontSize: 12, fontWeight: 600, color: "var(--accent)" }}>
                      {fileName}
                    </span>
                  </div>
                  <button onClick={clearFile} style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "var(--muted)", display: "flex", transition: "color 0.15s",
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#fb7185"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "var(--muted)"}
                  >
                    <X size={15} />
                  </button>
                </div>
              )}

              <p style={{ fontFamily: "Poppins", fontSize: 12, color: "var(--muted)", marginBottom: 6, textAlign: "center" }}>
                or paste resume text directly
              </p>

              <textarea
                value={resumeText}
                onChange={(e) => { setResumeText(e.target.value); if (!e.target.value) setFileName(""); }}
                placeholder="Paste your resume text here..."
                rows={resumeText ? 9 : 5}
                style={textareaStyle}
                onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
              />
            </div>
          </div>

          {error && (
            <p style={{ color: "#fb7185", fontFamily: "Poppins", fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>
              {error}
            </p>
          )}

          <button onClick={handleMatch} disabled={loading || fileLoading} style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "13px 32px", background: "var(--accent)", color: "#09090B",
            border: "none", borderRadius: 12, cursor: "pointer",
            fontFamily: "Poppins", fontSize: 14, fontWeight: 700,
            opacity: (loading || fileLoading) ? 0.7 : 1, transition: "opacity 0.2s",
            marginBottom: 32,
          }}>
            {loading
              ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Analysing...</>
              : "Analyse Match"
            }
          </button>

          {result && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{
                background: "var(--surface)", border: `1px solid ${scoreColor}40`,
                borderRadius: 16, padding: "28px 32px",
                display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap",
              }}>
                <div style={{
                  width: 100, height: 100, borderRadius: "50%",
                  border: `4px solid ${scoreColor}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: `${scoreColor}10`, flexShrink: 0,
                }}>
                  <span style={{ fontSize: "1.8rem", fontWeight: 800, color: scoreColor, fontFamily: "JetBrains Mono" }}>
                    {result.score}%
                  </span>
                </div>
                <div>
                  <p style={{ fontFamily: "JetBrains Mono", fontSize: 11, letterSpacing: "0.1em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 6 }}>
                    MATCH SCORE
                  </p>
                  <p style={{ fontSize: 16, fontWeight: 600, color: "var(--text)", maxWidth: 500, lineHeight: 1.5 }}>
                    {result.verdict}
                  </p>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="rg2">
                <div style={{ background: "var(--surface)", border: "1px solid rgba(0,255,179,0.2)", borderRadius: 16, padding: "20px 24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <CheckCircle2 size={18} color="#00FFB3" />
                    <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>Matched Skills</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {(result.matched_skills || []).map((s) => (
                      <span key={s} style={{ padding: "4px 12px", borderRadius: 6, background: "rgba(0,255,179,0.1)", border: "1px solid rgba(0,255,179,0.3)", color: "#00FFB3", fontSize: 12, fontFamily: "JetBrains Mono" }}>{s}</span>
                    ))}
                  </div>
                </div>

                <div style={{ background: "var(--surface)", border: "1px solid rgba(251,113,133,0.2)", borderRadius: 16, padding: "20px 24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <XCircle size={18} color="#fb7185" />
                    <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>Missing Skills</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {(result.missing_skills || []).map((s) => (
                      <span key={s} style={{ padding: "4px 12px", borderRadius: 6, background: "rgba(251,113,133,0.1)", border: "1px solid rgba(251,113,133,0.3)", color: "#fb7185", fontSize: 12, fontFamily: "JetBrains Mono" }}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "20px 24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <AlertCircle size={18} color="#FFB020" />
                  <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>Improvement Tips</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {(result.tips || []).map((tip, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <span style={{
                        width: 24, height: 24, borderRadius: "50%",
                        background: "rgba(255,176,32,0.15)", border: "1px solid rgba(255,176,32,0.3)",
                        color: "#FFB020", fontSize: 11, fontWeight: 700,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, fontFamily: "JetBrains Mono",
                      }}>
                        {i + 1}
                      </span>
                      <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media(max-width: 768px) {
          .rg2 { grid-template-columns: 1fr !important; }
        }
        @media(max-width: 640px) {
          .rg2 textarea { min-height: 140px !important; }
        }
      `}</style>
    </>
  );
}