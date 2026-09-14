import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  Loader2,
  Send,
  CheckCircle2,
  Lightbulb,
  Link2,
  Users,
} from "lucide-react";
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
    if (!form.applyUrl.trim() && !form.companyEmail.trim())
      return "Add an apply link or a contact email.";

    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const err = validate();

    if (err) {
      setError(err);
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      await postJobApi({
        ...form,
        salaryMin: form.salaryMin ? Number(form.salaryMin) : null,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : null,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
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
    width: "100%",
    background: "#F8FAFF",
    border: "1px solid #E2E6F0",
    borderRadius: 11,
    padding: "11px 14px",
    color: "#0B132B",
    fontFamily: "Poppins",
    fontSize: 13,
    outline: "none",
    transition: "all 0.2s ease",
  };

  const labelStyle = {
    fontFamily: "Poppins",
    fontSize: 12,
    fontWeight: 600,
    color: "#0B132B",
    display: "block",
    marginBottom: 7,
  };

  const sectionTitle = (title) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 18,
        marginTop: 30,
      }}
    >
      <span
        style={{
          fontFamily: "JetBrains Mono",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.12em",
          color: "#4F46E5",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        {title}
      </span>

      <div
        style={{
          flex: 1,
          height: 1,
          background: "#E2E6F0",
        }}
      />
    </div>
  );

  const focusInput = (e) => {
    e.currentTarget.style.borderColor = "#4F46E5";
    e.currentTarget.style.boxShadow =
      "0 0 0 3px rgba(79,70,229,0.08)";
    e.currentTarget.style.background = "#FFFFFF";
  };

  const blurInput = (e) => {
    e.currentTarget.style.borderColor = "#E2E6F0";
    e.currentTarget.style.boxShadow = "none";
    e.currentTarget.style.background = "#F8FAFF";
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          background: "#F8FAFF",
          minHeight: "100vh",
          color: "#0B132B",
          padding: "32px 24px 72px",
        }}
      >
        <div
          style={{
            maxWidth: 820,
            margin: "0 auto",
          }}
        >
          {/* ===================================================== */}
          {/* BACK */}
          {/* ===================================================== */}

          <button
            onClick={() => navigate(-1)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "JetBrains Mono",
              fontSize: 11,
              color: "#64748B",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              marginBottom: 26,
              letterSpacing: "0.08em",
              padding: 0,
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#4F46E5";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#64748B";
            }}
          >
            <ArrowLeft size={14} />
            Back
          </button>

          {/* ===================================================== */}
          {/* HEADER */}
          {/* ===================================================== */}

          <div style={{ marginBottom: 30 }}>
            <p
              style={{
                fontFamily: "JetBrains Mono",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.12em",
                color: "#64748B",
                textTransform: "uppercase",
                marginBottom: 9,
              }}
            >
              FOR EMPLOYERS
            </p>

            <h1
              style={{
                fontSize: "clamp(1.9rem, 4vw, 2.7rem)",
                fontWeight: 800,
                letterSpacing: "-0.035em",
                marginBottom: 9,
                display: "flex",
                alignItems: "center",
                gap: 12,
                color: "#0B132B",
              }}
            >
              <span
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 13,
                  background: "#4F46E5",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 20px rgba(79,70,229,0.18)",
                }}
              >
                <Briefcase
                  size={23}
                  color="#FFFFFF"
                />
              </span>

              Post a Job
            </h1>

            <p
              style={{
                color: "#64748B",
                fontSize: 14,
                lineHeight: 1.7,
                maxWidth: 620,
                margin: 0,
              }}
            >
              Free to post. Your listing goes live immediately and appears in
              search across the board.
            </p>
          </div>

          {/* ===================================================== */}
          {/* FORM CARD */}
          {/* ===================================================== */}

          <form
            onSubmit={handleSubmit}
            style={{
              background: "#FFFFFF",
              border: "1px solid #E2E6F0",
              borderRadius: 18,
              padding: "28px 24px",
              boxShadow: "0 8px 30px rgba(15,23,42,0.05)",
            }}
          >
            {/* ================================================= */}
            {/* COMPANY */}
            {/* ================================================= */}

            {sectionTitle("Company")}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
                marginBottom: 14,
              }}
              className="rg2"
            >
              <div>
                <label style={labelStyle}>
                  Company Name *
                </label>

                <input
                  value={form.company}
                  onChange={(e) =>
                    set("company", e.target.value)
                  }
                  placeholder="Acme Inc."
                  style={inputStyle}
                  onFocus={focusInput}
                  onBlur={blurInput}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Contact Email
                </label>

                <input
                  value={form.companyEmail}
                  onChange={(e) =>
                    set("companyEmail", e.target.value)
                  }
                  placeholder="hiring@acme.com"
                  style={inputStyle}
                  onFocus={focusInput}
                  onBlur={blurInput}
                />
              </div>
            </div>

            {/* ================================================= */}
            {/* ROLE */}
            {/* ================================================= */}

            {sectionTitle("Role")}

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>
                Job Title *
              </label>

              <input
                value={form.title}
                onChange={(e) =>
                  set("title", e.target.value)
                }
                placeholder="Frontend Engineer"
                style={inputStyle}
                onFocus={focusInput}
                onBlur={blurInput}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
                marginBottom: 14,
              }}
              className="rg2"
            >
              <div>
                <label style={labelStyle}>
                  Location *
                </label>

                <input
                  value={form.location}
                  onChange={(e) =>
                    set("location", e.target.value)
                  }
                  placeholder="Hyderabad, Telangana"
                  style={inputStyle}
                  onFocus={focusInput}
                  onBlur={blurInput}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Job Type
                </label>

                <select
                  value={form.type}
                  onChange={(e) =>
                    set("type", e.target.value)
                  }
                  style={{
                    ...inputStyle,
                    cursor: "pointer",
                  }}
                  onFocus={focusInput}
                  onBlur={blurInput}
                >
                  <option>Full Time</option>
                  <option>Part Time</option>
                  <option>Contract</option>
                  <option>Internship</option>
                </select>
              </div>
            </div>

            {/* ================================================= */}
            {/* LISTING DURATION */}
            {/* ================================================= */}

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>
                Listing Duration
              </label>

              <select
                value={form.durationDays}
                onChange={(e) =>
                  set("durationDays", e.target.value)
                }
                style={{
                  ...inputStyle,
                  cursor: "pointer",
                }}
                onFocus={focusInput}
                onBlur={blurInput}
              >
                {DURATION_OPTIONS.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                  >
                    {opt.label}
                  </option>
                ))}
              </select>

              <p
                style={{
                  fontFamily: "Poppins",
                  fontSize: 11.5,
                  color: "#64748B",
                  marginTop: 7,
                  lineHeight: 1.6,
                }}
              >
                After this period, your listing stops showing in search —
                it stays visible (marked Expired) on your dashboard.
              </p>
            </div>

            {/* ================================================= */}
            {/* EXPERIENCE + REMOTE */}
            {/* ================================================= */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
                marginBottom: 14,
              }}
              className="rg2"
            >
              <div>
                <label style={labelStyle}>
                  Experience Level
                </label>

                <select
                  value={form.experienceLevel}
                  onChange={(e) =>
                    set(
                      "experienceLevel",
                      e.target.value
                    )
                  }
                  style={{
                    ...inputStyle,
                    cursor: "pointer",
                  }}
                  onFocus={focusInput}
                  onBlur={blurInput}
                >
                  <option value="fresher">
                    Fresher
                  </option>

                  <option value="junior">
                    Junior
                  </option>

                  <option value="mid">
                    Mid
                  </option>

                  <option value="senior">
                    Senior
                  </option>
                </select>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                }}
              >
                <label
                  style={{
                    ...labelStyle,
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    cursor: "pointer",
                    marginBottom: 11,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={form.remote}
                    onChange={(e) =>
                      set(
                        "remote",
                        e.target.checked
                      )
                    }
                    style={{
                      accentColor: "#4F46E5",
                      width: 16,
                      height: 16,
                      cursor: "pointer",
                    }}
                  />

                  Remote friendly
                </label>
              </div>
            </div>

            {/* ================================================= */}
            {/* SALARY */}
            {/* ================================================= */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
                marginBottom: 14,
              }}
              className="rg2"
            >
              <div>
                <label style={labelStyle}>
                  Salary Min (Rs, per year)
                </label>

                <input
                  type="number"
                  value={form.salaryMin}
                  onChange={(e) =>
                    set(
                      "salaryMin",
                      e.target.value
                    )
                  }
                  placeholder="600000"
                  style={inputStyle}
                  onFocus={focusInput}
                  onBlur={blurInput}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Salary Max (Rs, per year)
                </label>

                <input
                  type="number"
                  value={form.salaryMax}
                  onChange={(e) =>
                    set(
                      "salaryMax",
                      e.target.value
                    )
                  }
                  placeholder="1200000"
                  style={inputStyle}
                  onFocus={focusInput}
                  onBlur={blurInput}
                />
              </div>
            </div>

            {/* ================================================= */}
            {/* SKILLS */}
            {/* ================================================= */}

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>
                Skills / Tags (comma separated)
              </label>

              <input
                value={form.tags}
                onChange={(e) =>
                  set("tags", e.target.value)
                }
                placeholder="React, TypeScript, REST APIs"
                style={inputStyle}
                onFocus={focusInput}
                onBlur={blurInput}
              />
            </div>

            {/* ================================================= */}
            {/* DESCRIPTION */}
            {/* ================================================= */}

            {sectionTitle("Description")}

            <textarea
              value={form.description}
              onChange={(e) =>
                set(
                  "description",
                  e.target.value
                )
              }
              placeholder="Responsibilities, requirements, benefits..."
              rows={7}
              style={{
                ...inputStyle,
                resize: "vertical",
                lineHeight: 1.7,
              }}
              onFocus={focusInput}
              onBlur={blurInput}
            />

            {/* ================================================= */}
            {/* APPLY */}
            {/* ================================================= */}

            {sectionTitle("How candidates apply")}

            <div style={{ marginBottom: 6 }}>
              <label style={labelStyle}>
                Apply URL
              </label>

              <div
                style={{
                  position: "relative",
                }}
              >
                <Link2
                  size={15}
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94A3B8",
                    pointerEvents: "none",
                  }}
                />

                <input
                  value={form.applyUrl}
                  onChange={(e) =>
                    set(
                      "applyUrl",
                      e.target.value
                    )
                  }
                  placeholder="https://acme.com/careers/frontend-engineer"
                  style={{
                    ...inputStyle,
                    paddingLeft: 40,
                  }}
                  onFocus={focusInput}
                  onBlur={blurInput}
                />
              </div>

              <p
                style={{
                  fontFamily: "Poppins",
                  fontSize: 11.5,
                  color: "#64748B",
                  marginTop: 7,
                  lineHeight: 1.6,
                }}
              >
                Leave blank to let candidates apply via the contact email
                above instead.
              </p>
            </div>

            {/* ================================================= */}
            {/* ERROR */}
            {/* ================================================= */}

            {error && (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 9,
                  marginTop: 18,
                  padding: "11px 13px",
                  borderRadius: 10,
                  background: "#FFF1F2",
                  border: "1px solid #FECDD3",
                  color: "#E11D48",
                  fontFamily: "Poppins",
                  fontSize: 12.5,
                  lineHeight: 1.5,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#E11D48",
                    marginTop: 6,
                    flexShrink: 0,
                  }}
                />

                {error}
              </div>
            )}

            {/* ================================================= */}
            {/* SUBMIT */}
            {/* ================================================= */}

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "13px",
                background: submitting
                  ? "#818CF8"
                  : "#4F46E5",
                color: "#FFFFFF",
                border: "none",
                borderRadius: 11,
                cursor: submitting
                  ? "default"
                  : "pointer",
                fontFamily: "Poppins",
                fontSize: 14,
                fontWeight: 700,
                opacity: submitting ? 0.85 : 1,
                marginTop: 24,
                transition: "all 0.2s ease",
                boxShadow: submitting
                  ? "none"
                  : "0 8px 20px rgba(79,70,229,0.18)",
              }}
              onMouseEnter={(e) => {
                if (!submitting) {
                  e.currentTarget.style.background = "#4338CA";
                  e.currentTarget.style.transform =
                    "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 24px rgba(79,70,229,0.22)";
                }
              }}
              onMouseLeave={(e) => {
                if (!submitting) {
                  e.currentTarget.style.background = "#4F46E5";
                  e.currentTarget.style.transform =
                    "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 20px rgba(79,70,229,0.18)";
                }
              }}
            >
              {submitting ? (
                <>
                  <Loader2
                    size={17}
                    style={{
                      animation:
                        "spin 1s linear infinite",
                    }}
                  />

                  Posting...
                </>
              ) : (
                <>
                  <Send size={16} />

                  Post Job — Free
                </>
              )}
            </button>

            {/* TRUST NOTE */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                marginTop: 14,
                color: "#94A3B8",
                fontFamily: "Poppins",
                fontSize: 11,
              }}
            >
              <CheckCircle2
                size={13}
                color="#10B981"
              />

              Free job posting • No upfront payment
            </div>
          </form>

          {/* ===================================================== */}
          {/* POSTING TIPS */}
          {/* ===================================================== */}

          <section
            style={{
              marginTop: 28,
            }}
          >
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E6F0",
                borderRadius: 18,
                padding: "24px",
                boxShadow:
                  "0 6px 24px rgba(15,23,42,0.035)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 11,
                  marginBottom: 18,
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 11,
                    background: "#FFF7ED",
                    border:
                      "1px solid #FED7AA",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Lightbulb
                    size={18}
                    color="#F59E0B"
                  />
                </div>

                <div>
                  <h2
                    style={{
                      fontFamily: "Poppins",
                      fontSize: 16,
                      fontWeight: 700,
                      color: "#0B132B",
                      margin: 0,
                    }}
                  >
                    Posting Tips
                  </h2>

                  <p
                    style={{
                      fontFamily: "Poppins",
                      fontSize: 11.5,
                      color: "#64748B",
                      margin: "3px 0 0",
                    }}
                  >
                    Create a listing candidates will understand quickly.
                  </p>
                </div>
              </div>

              <div
                className="tips-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(3, 1fr)",
                  gap: 12,
                }}
              >
                {[
                  {
                    icon: Briefcase,
                    title: "Clear Job Title",
                    text: "Use a specific role name such as Frontend Engineer instead of a vague title.",
                  },
                  {
                    icon: Users,
                    title: "Useful Details",
                    text: "Include responsibilities, requirements, skills, salary and work location.",
                  },
                  {
                    icon: Link2,
                    title: "Easy Application",
                    text: "Provide a working application URL or a contact email for candidates.",
                  },
                ].map((tip) => (
                  <div
                    key={tip.title}
                    style={{
                      padding: "15px",
                      background: "#F8FAFF",
                      border:
                        "1px solid #E8EBF3",
                      borderRadius: 12,
                    }}
                  >
                    <tip.icon
                      size={16}
                      color="#4F46E5"
                      style={{
                        marginBottom: 9,
                      }}
                    />

                    <h3
                      style={{
                        fontFamily: "Poppins",
                        fontSize: 12.5,
                        fontWeight: 700,
                        color: "#0B132B",
                        margin: "0 0 5px",
                      }}
                    >
                      {tip.title}
                    </h3>

                    <p
                      style={{
                        fontFamily: "Poppins",
                        fontSize: 11.5,
                        lineHeight: 1.65,
                        color: "#64748B",
                        margin: 0,
                      }}
                    >
                      {tip.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ===================================================== */}
          {/* EMPLOYER INFO */}
          {/* ===================================================== */}

          <div
            className="employer-info"
            style={{
              marginTop: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              textAlign: "center",
              color: "#94A3B8",
              fontFamily: "JetBrains Mono",
              fontSize: 10,
              letterSpacing: "0.04em",
            }}
          >
            <CheckCircle2
              size={13}
              color="#10B981"
            />

            Your listing will appear in JobXPortal search after posting.
          </div>
        </div>
      </div>

      <Footer />

      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 640px) {
          .rg2 {
            grid-template-columns: 1fr !important;
          }

          .tips-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 480px) {
          .employer-info {
            padding: 0 10px;
            line-height: 1.6;
          }
        }
      `}</style>
    </>
  );
}