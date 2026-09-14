import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Upload,
  FileText,
  X,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { askClaude, parseJSON } from "../services/claudeApi";

async function extractTextFromPDF(file) {
  const pdfjsLib = await import("pdfjs-dist");

  // Use the same version as the installed package
  const pdfjsVersion = pdfjsLib.version;

  pdfjsLib.GlobalWorkerOptions.workerSrc =
    new URL(
      "pdfjs-dist/build/pdf.worker.min.js",
      import.meta.url
    ).toString();

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

      if (
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf")
      ) {
        text = await extractTextFromPDF(file);

        if (!text || text.length < 50) {
          throw new Error(
            "Could not extract text from this PDF. It may be scanned or image-based. Please paste your resume text instead."
          );
        }
      } else {
        text = await new Promise((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = (ev) => resolve(ev.target.result);
          reader.onerror = () =>
            reject(new Error("Failed to read file"));

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
      setError(
        "Please paste a job description and upload or paste your resume."
      );
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

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

  const scoreColor = !result
    ? "#4F46E5"
    : result.score >= 70
    ? "#10B981"
    : result.score >= 40
    ? "#F59E0B"
    : "#E11D48";

  const textareaStyle = {
    width: "100%",
    background: "#FFFFFF",
    border: "1px solid #E2E6F0",
    borderRadius: 12,
    padding: "14px 16px",
    color: "#0B132B",
    fontFamily: "Poppins",
    fontSize: 13,
    resize: "vertical",
    outline: "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
    boxSizing: "border-box",
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          background: "#F8FAFF",
          minHeight: "100vh",
          color: "#0B132B",
          padding: "32px 24px 64px",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          {/* BACK */}
          <button
            onClick={() => navigate(-1)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "JetBrains Mono",
              fontSize: 12,
              color: "#64748B",
              background: "none",
              border: "none",
              cursor: "pointer",
              marginBottom: 24,
              letterSpacing: "0.08em",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#4F46E5";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#64748B";
            }}
          >
            <ArrowLeft size={14} /> Back
          </button>

          {/* HEADER */}
          <p
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: 11,
              letterSpacing: "0.1em",
              color: "#64748B",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            AI POWERED
          </p>

          <h1
            style={{
              fontFamily: "Poppins",
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 800,
              marginBottom: 8,
              color: "#0B132B",
            }}
          >
            Resume Match Score
          </h1>

          <p
            style={{
              fontFamily: "Poppins",
              color: "#64748B",
              fontSize: 15,
              marginBottom: 32,
              lineHeight: 1.6,
            }}
          >
            Paste a job description and upload your resume to see how well you
            match and exactly what skills you are missing.
          </p>

          {/* INPUT SECTION */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginBottom: 20,
              maxWidth: "100%",
            }}
            className="rg2"
          >
            {/* JOB DESCRIPTION */}
            <div>
              <label
                style={{
                  fontFamily: "Poppins",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#0B132B",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                Job Description
              </label>

              <textarea
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                placeholder="Paste the full job description here..."
                rows={16}
                style={textareaStyle}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#4F46E5";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(79,70,229,0.08)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#E2E6F0";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            {/* RESUME */}
            <div>
              <label
                style={{
                  fontFamily: "Poppins",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#0B132B",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                Your Resume
              </label>

              {/* UPLOAD ZONE */}
              <div
                onClick={() =>
                  !fileLoading && fileRef.current?.click()
                }
                style={{
                  border: "2px dashed #D9DEEA",
                  borderRadius: 12,
                  padding: "20px 24px",
                  textAlign: "center",
                  cursor: fileLoading ? "default" : "pointer",
                  background: "#FFFFFF",
                  marginBottom: 10,
                  transition:
                    "border-color 0.15s, background 0.15s, box-shadow 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (!fileLoading) {
                    e.currentTarget.style.borderColor = "#4F46E5";
                    e.currentTarget.style.background = "#F8FAFF";
                    e.currentTarget.style.boxShadow =
                      "0 6px 18px rgba(79,70,229,0.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#D9DEEA";
                  e.currentTarget.style.background = "#FFFFFF";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {fileLoading ? (
                  <>
                    <Loader2
                      size={24}
                      style={{
                        color: "#4F46E5",
                        margin: "0 auto 8px",
                        animation:
                          "spin 1s linear infinite",
                      }}
                    />

                    <p
                      style={{
                        fontFamily: "Poppins",
                        fontWeight: 600,
                        color: "#4F46E5",
                        fontSize: 13,
                        marginBottom: 0,
                      }}
                    >
                      Reading file...
                    </p>
                  </>
                ) : (
                  <>
                    <Upload
                      size={24}
                      style={{
                        color: "#4F46E5",
                        margin: "0 auto 8px",
                      }}
                    />

                    <p
                      style={{
                        fontFamily: "Poppins",
                        fontWeight: 600,
                        color: "#0B132B",
                        fontSize: 13,
                        marginBottom: 3,
                      }}
                    >
                      Upload Resume (.pdf, .txt, .doc)
                    </p>

                    <p
                      style={{
                        fontFamily: "Poppins",
                        fontSize: 11,
                        color: "#64748B",
                      }}
                    >
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
                <div
                  style={{
                    border: "1px solid #A7F3D0",
                    borderRadius: 10,
                    padding: "10px 14px",
                    marginBottom: 10,
                    background: "#ECFDF5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      minWidth: 0,
                    }}
                  >
                    <FileText
                      size={16}
                      style={{
                        color: "#10B981",
                        flexShrink: 0,
                      }}
                    />

                    <span
                      style={{
                        fontFamily: "Poppins",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#059669",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {fileName}
                    </span>
                  </div>

                  <button
                    onClick={clearFile}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#64748B",
                      display: "flex",
                      transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#E11D48")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#64748B")
                    }
                  >
                    <X size={15} />
                  </button>
                </div>
              )}

              <p
                style={{
                  fontFamily: "Poppins",
                  fontSize: 12,
                  color: "#64748B",
                  marginBottom: 6,
                  textAlign: "center",
                }}
              >
                or paste resume text directly
              </p>

              <textarea
                value={resumeText}
                onChange={(e) => {
                  setResumeText(e.target.value);

                  if (!e.target.value) setFileName("");
                }}
                placeholder="Paste your resume text here..."
                rows={resumeText ? 9 : 5}
                style={textareaStyle}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#4F46E5";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(79,70,229,0.08)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#E2E6F0";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <p
              style={{
                color: "#E11D48",
                fontFamily: "Poppins",
                fontSize: 13,
                marginBottom: 16,
                lineHeight: 1.6,
              }}
            >
              {error}
            </p>
          )}

          {/* ANALYSE BUTTON */}
          <button
            onClick={handleMatch}
            disabled={loading || fileLoading}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "13px 32px",
              background: "#4F46E5",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 12,
              cursor:
                loading || fileLoading ? "default" : "pointer",
              fontFamily: "Poppins",
              fontSize: 14,
              fontWeight: 700,
              opacity: loading || fileLoading ? 0.7 : 1,
              transition: "all 0.2s ease",
              marginBottom: 32,
              boxShadow: "0 8px 20px rgba(79,70,229,0.15)",
            }}
            onMouseEnter={(e) => {
              if (!loading && !fileLoading) {
                e.currentTarget.style.background = "#4338CA";
                e.currentTarget.style.transform =
                  "translateY(-1px)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#4F46E5";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {loading ? (
              <>
                <Loader2
                  size={16}
                  style={{
                    animation:
                      "spin 1s linear infinite",
                  }}
                />
                Analysing...
              </>
            ) : (
              "Analyse Match"
            )}
          </button>

          {/* RESULTS */}
          {result && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {/* SCORE */}
              <div
                style={{
                  background: "#FFFFFF",
                  border: `1px solid ${scoreColor}40`,
                  borderRadius: 16,
                  padding: "28px 32px",
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                  flexWrap: "wrap",
                  boxShadow:
                    "0 6px 20px rgba(15,23,42,0.035)",
                }}
              >
                <div
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    border: `4px solid ${scoreColor}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: `${scoreColor}10`,
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: "1.8rem",
                      fontWeight: 800,
                      color: scoreColor,
                      fontFamily: "JetBrains Mono",
                    }}
                  >
                    {result.score}%
                  </span>
                </div>

                <div>
                  <p
                    style={{
                      fontFamily: "JetBrains Mono",
                      fontSize: 11,
                      letterSpacing: "0.1em",
                      color: "#64748B",
                      textTransform: "uppercase",
                      marginBottom: 6,
                    }}
                  >
                    MATCH SCORE
                  </p>

                  <p
                    style={{
                      fontFamily: "Poppins",
                      fontSize: 16,
                      fontWeight: 600,
                      color: "#0B132B",
                      maxWidth: 500,
                      lineHeight: 1.5,
                      margin: 0,
                    }}
                  >
                    {result.verdict}
                  </p>
                </div>
              </div>

              {/* SKILLS */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
                className="rg2"
              >
                {/* MATCHED */}
                <div
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #A7F3D0",
                    borderRadius: 16,
                    padding: "20px 24px",
                    boxShadow:
                      "0 4px 14px rgba(15,23,42,0.025)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 14,
                    }}
                  >
                    <CheckCircle2 size={18} color="#10B981" />

                    <span
                      style={{
                        fontFamily: "Poppins",
                        fontWeight: 700,
                        fontSize: 14,
                        color: "#0B132B",
                      }}
                    >
                      Matched Skills
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                    }}
                  >
                    {(result.matched_skills || []).map((s) => (
                      <span
                        key={s}
                        style={{
                          padding: "4px 12px",
                          borderRadius: 6,
                          background: "#ECFDF5",
                          border: "1px solid #A7F3D0",
                          color: "#059669",
                          fontSize: 12,
                          fontFamily: "JetBrains Mono",
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* MISSING */}
                <div
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #FECDD3",
                    borderRadius: 16,
                    padding: "20px 24px",
                    boxShadow:
                      "0 4px 14px rgba(15,23,42,0.025)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 14,
                    }}
                  >
                    <XCircle size={18} color="#E11D48" />

                    <span
                      style={{
                        fontFamily: "Poppins",
                        fontWeight: 700,
                        fontSize: 14,
                        color: "#0B132B",
                      }}
                    >
                      Missing Skills
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                    }}
                  >
                    {(result.missing_skills || []).map((s) => (
                      <span
                        key={s}
                        style={{
                          padding: "4px 12px",
                          borderRadius: 6,
                          background: "#FFF1F2",
                          border: "1px solid #FECDD3",
                          color: "#E11D48",
                          fontSize: 12,
                          fontFamily: "JetBrains Mono",
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* IMPROVEMENT TIPS */}
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E2E6F0",
                  borderRadius: 16,
                  padding: "20px 24px",
                  boxShadow:
                    "0 4px 14px rgba(15,23,42,0.025)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 14,
                  }}
                >
                  <AlertCircle size={18} color="#F59E0B" />

                  <span
                    style={{
                      fontFamily: "Poppins",
                      fontWeight: 700,
                      fontSize: 14,
                      color: "#0B132B",
                    }}
                  >
                    Improvement Tips
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  {(result.tips || []).map((tip, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        gap: 12,
                        alignItems: "flex-start",
                      }}
                    >
                      <span
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          background: "#FFFBEB",
                          border: "1px solid #FDE68A",
                          color: "#D97706",
                          fontSize: 11,
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          fontFamily: "JetBrains Mono",
                        }}
                      >
                        {i + 1}
                      </span>

                      <p
                        style={{
                          fontFamily: "Poppins",
                          color: "#64748B",
                          fontSize: 14,
                          lineHeight: 1.7,
                          margin: 0,
                        }}
                      >
                        {tip}
                      </p>
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
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media(max-width: 768px) {
          .rg2 {
            grid-template-columns: 1fr !important;
          }
        }

        @media(max-width: 640px) {
          .rg2 textarea {
            min-height: 140px !important;
          }
        }

        input::placeholder,
        textarea::placeholder {
          color: #94A3B8;
          opacity: 1;
        }
      `}</style>
    </>
  );
}