import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  ChevronDown,
  ChevronUp,
  Lightbulb,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { askClaude, parseJSON } from "../services/claudeApi";

const CATEGORIES = [
  {
    id: "technical",
    label: "Technical",
    color: "#4F46E5",
    bg: "#EEF2FF",
  },
  {
    id: "behavioral",
    label: "Behavioral",
    color: "#D97706",
    bg: "#FFFBEB",
  },
  {
    id: "situational",
    label: "Situational",
    color: "#0F766E",
    bg: "#F0FDFA",
  },
  {
    id: "company",
    label: "About Company",
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
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
    setOpen((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  async function generate() {
    if (!title.trim()) {
      setError("Please enter a job title.");
      return;
    }

    setError("");
    setLoading(true);
    setQuestions(null);

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

  const inputStyle = {
    width: "100%",
    background: "#FFFFFF",
    border: "1px solid #E2E6F0",
    borderRadius: 10,
    padding: "12px 16px",
    color: "#0B132B",
    fontFamily: "Poppins",
    fontSize: 14,
    outline: "none",
    transition: "all 0.2s",
  };

  const labelStyle = {
    fontFamily: "Poppins",
    fontSize: 13,
    fontWeight: 600,
    color: "#334155",
    display: "block",
    marginBottom: 8,
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
        <div
          style={{
            maxWidth: 820,
            margin: "0 auto",
          }}
        >

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
              background: "transparent",
              border: "none",
              cursor: "pointer",
              marginBottom: 24,
              letterSpacing: "0.08em",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "#4F46E5")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "#64748B")
            }
          >
            <ArrowLeft size={14} />
            Back
          </button>

          {/* HEADER */}

          <p
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: 11,
              letterSpacing: "0.1em",
              color: "#4F46E5",
              textTransform: "uppercase",
              marginBottom: 8,
              fontWeight: 600,
            }}
          >
            AI POWERED
          </p>

          <h1
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 800,
              marginBottom: 8,
              color: "#0B132B",
              letterSpacing: "-0.03em",
            }}
          >
            Interview Prep
          </h1>

          <p
            style={{
              color: "#64748B",
              fontSize: 15,
              marginBottom: 28,
              lineHeight: 1.6,
            }}
          >
            Get AI-generated interview questions with clear answer guides
            tailored to any role.
          </p>

          {/* INPUT CARD */}

          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E2E6F0",
              borderRadius: 16,
              padding: "24px",
              marginBottom: 28,
              boxShadow:
                "0 8px 30px rgba(15, 23, 42, 0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >

              {/* JOB TITLE */}

              <div>
                <label style={labelStyle}>
                  Job Title *
                </label>

                <input
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" && generate()
                  }
                  placeholder="e.g. Senior React Developer, Social Media Manager..."
                  style={inputStyle}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor =
                      "#4F46E5";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(79, 70, 229, 0.08)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor =
                      "#E2E6F0";
                    e.currentTarget.style.boxShadow =
                      "none";
                  }}
                />
              </div>

              {/* JOB DESCRIPTION */}

              <div>
                <label style={labelStyle}>
                  Job Description{" "}
                  <span
                    style={{
                      color: "#94A3B8",
                      fontWeight: 400,
                    }}
                  >
                    (optional)
                  </span>
                </label>

                <textarea
                  value={desc}
                  onChange={(e) =>
                    setDesc(e.target.value)
                  }
                  placeholder="Paste job description here for more tailored questions..."
                  rows={4}
                  style={{
                    ...inputStyle,
                    fontSize: 13,
                    resize: "vertical",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor =
                      "#4F46E5";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(79, 70, 229, 0.08)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor =
                      "#E2E6F0";
                    e.currentTarget.style.boxShadow =
                      "none";
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
                  marginTop: 12,
                  lineHeight: 1.5,
                }}
              >
                {error}
              </p>
            )}

            {/* GENERATE */}

            <button
              onClick={generate}
              disabled={loading}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: 16,
                padding: "12px 32px",
                background: "#4F46E5",
                color: "#FFFFFF",
                border: "none",
                borderRadius: 10,
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
                fontFamily: "Poppins",
                fontSize: 14,
                fontWeight: 700,
                opacity: loading ? 0.7 : 1,
                transition: "all 0.2s",
                boxShadow:
                  "0 8px 20px rgba(79, 70, 229, 0.18)",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.background =
                    "#4338CA";
                  e.currentTarget.style.transform =
                    "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  "#4F46E5";
                e.currentTarget.style.transform =
                  "translateY(0)";
              }}
            >
              {loading ? (
                <>
                  <Loader2
                    size={15}
                    style={{
                      animation:
                        "spin 1s linear infinite",
                    }}
                  />
                  Generating...
                </>
              ) : (
                "Generate Questions"
              )}
            </button>
          </div>

          {/* GENERATED QUESTIONS */}

          {questions && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <p
                style={{
                  fontFamily: "JetBrains Mono",
                  fontSize: 11,
                  color: "#64748B",
                  letterSpacing: "0.06em",
                  textAlign: "center",
                }}
              >
                CLICK ANY QUESTION TO SEE THE ANSWER GUIDE
              </p>

              {CATEGORIES.map((cat) => {
                const catQs =
                  questions[cat.id] || [];

                return (
                  <div
                    key={cat.id}
                    style={{
                      background: "#FFFFFF",
                      border:
                        "1px solid #E2E6F0",
                      borderRadius: 16,
                      overflow: "hidden",
                      boxShadow:
                        "0 6px 24px rgba(15, 23, 42, 0.04)",
                    }}
                  >

                    {/* CATEGORY HEADER */}

                    <div
                      style={{
                        padding: "14px 20px",
                        background: cat.bg,
                        borderBottom:
                          "1px solid #E2E6F0",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background:
                            cat.color,
                          display:
                            "inline-block",
                        }}
                      />

                      <span
                        style={{
                          fontFamily: "Poppins",
                          fontSize: 14,
                          fontWeight: 700,
                          color: cat.color,
                        }}
                      >
                        {cat.label} Questions
                      </span>
                    </div>

                    {/* QUESTIONS */}

                    {catQs.map((item, i) => {
                      const key =
                        cat.id + i;

                      const isOpen =
                        !!open[key];

                      return (
                        <div
                          key={key}
                          style={{
                            borderBottom:
                              i < catQs.length - 1
                                ? "1px solid #E2E6F0"
                                : "none",
                          }}
                        >

                          {/* QUESTION BUTTON */}

                          <button
                            onClick={() =>
                              toggleQ(key)
                            }
                            style={{
                              width: "100%",
                              display: "flex",
                              alignItems:
                                "flex-start",
                              justifyContent:
                                "space-between",
                              padding:
                                "16px 20px",
                              background:
                                isOpen
                                  ? cat.bg
                                  : "#FFFFFF",
                              border: "none",
                              cursor: "pointer",
                              textAlign: "left",
                              gap: 16,
                              transition:
                                "background 0.15s",
                            }}
                          >
                            <span
                              style={{
                                fontFamily:
                                  "Poppins",
                                fontSize: 14,
                                fontWeight: 600,
                                color:
                                  "#0B132B",
                                lineHeight:
                                  1.5,
                                flex: 1,
                              }}
                            >
                              {i + 1}. {item.q}
                            </span>

                            <span
                              style={{
                                color: isOpen
                                  ? cat.color
                                  : "#94A3B8",
                                flexShrink: 0,
                                marginTop: 2,
                              }}
                            >
                              {isOpen ? (
                                <ChevronUp
                                  size={18}
                                />
                              ) : (
                                <ChevronDown
                                  size={18}
                                />
                              )}
                            </span>
                          </button>

                          {/* ANSWER GUIDE */}

                          {isOpen && (
                            <div
                              style={{
                                padding:
                                  "16px 20px 20px",
                                background:
                                  "#F8FAFF",
                                borderTop:
                                  "1px solid #E2E6F0",
                              }}
                            >
                              <div
                                style={{
                                  display:
                                    "flex",
                                  gap: 12,
                                  alignItems:
                                    "flex-start",
                                  padding:
                                    "16px 18px",
                                  background:
                                    "#FFFFFF",
                                  border: `1px solid ${cat.color}30`,
                                  borderLeft: `4px solid ${cat.color}`,
                                  borderRadius: 10,
                                  boxShadow:
                                    "0 4px 16px rgba(15, 23, 42, 0.03)",
                                }}
                              >
                                <Lightbulb
                                  size={18}
                                  style={{
                                    color:
                                      cat.color,
                                    flexShrink: 0,
                                    marginTop: 2,
                                  }}
                                />

                                <div>
                                  <p
                                    style={{
                                      fontFamily:
                                        "Poppins",
                                      fontSize: 11,
                                      fontWeight:
                                        700,
                                      color:
                                        cat.color,
                                      textTransform:
                                        "uppercase",
                                      letterSpacing:
                                        "0.08em",
                                      marginBottom:
                                        6,
                                    }}
                                  >
                                    How to answer
                                  </p>

                                  <p
                                    style={{
                                      fontFamily:
                                        "Poppins",
                                      fontSize: 14,
                                      lineHeight:
                                        1.75,
                                      color:
                                        "#334155",
                                      margin: 0,
                                    }}
                                  >
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

      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media(max-width:640px) {
          button {
            max-width: 100%;
          }
        }
      `}</style>
    </>
  );
}