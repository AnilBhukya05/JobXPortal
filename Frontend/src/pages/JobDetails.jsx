import { Link, useParams } from "react-router-dom";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import SEO from "../components/SEO";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useJobs } from "../context/JobsContext";
import { useBookmarkContext } from "../context/BookmarkContext";
import { useAuth } from "../context/AuthContext";

import { statusFor } from "../data/jobs";
import {
  recordJobViewApi,
  recordApplicationApi,
} from "../services/employerJobsService";
import { request } from "../services/api";

const SITE_URL = "https://jobxportal.vercel.app";

function JobPostingSchema({ job }) {
  useEffect(() => {
    if (!job) return;

    const isEmployerJob = String(job.id).startsWith("employer-");

    if (!isEmployerJob) return;

    const scriptId = "jobxportal-jobposting-schema";

    document.getElementById(scriptId)?.remove();

    const description =
      job.description ||
      `${job.title} at ${job.company}. View job details and application information on JobXPortal.`;

    const schema = {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      title: job.title,
      description,
      url: `${SITE_URL}/job/${job.id}`,
      hiringOrganization: {
        "@type": "Organization",
        name: job.company,
      },
    };

    if (job.datePosted || job.createdAt) {
      schema.datePosted = job.datePosted || job.createdAt;
    }

    if (job.validThrough) {
      schema.validThrough = job.validThrough;
    }

    if (job.type || job.employmentType) {
      schema.employmentType = job.employmentType || job.type;
    }

    if (job.remote) {
      schema.jobLocationType = "TELECOMMUTE";
    } else if (job.location) {
      schema.jobLocation = {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressLocality: job.location,
          addressCountry: "IN",
        },
      };
    }

    if (job.salary) {
      schema.baseSalary = {
        "@type": "MonetaryAmount",
        currency: "INR",
        value: {
          "@type": "QuantitativeValue",
          value: job.salary,
        },
      };
    }

    const script = document.createElement("script");

    script.id = scriptId;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema);

    document.head.appendChild(script);

    return () => {
      document.getElementById(scriptId)?.remove();
    };
  }, [job]);

  return null;
}

export default function JobDetails() {
  const { id } = useParams();

  const { getJobById, loading, search } = useJobs();
  const { addRecent } = useBookmarkContext();
  const { user } = useAuth();

  const [refetched, setRefetched] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);

  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportSent, setReportSent] = useState(false);

  const hasRecordedView = useRef(false);

  const contextJob = getJobById(id);

  const job =
    contextJob ||
    (() => {
      try {
        const stored = sessionStorage.getItem(
          `jobxportal_preview_${id}`
        );

        return stored ? JSON.parse(stored) : null;
      } catch {
        return null;
      }
    })();

  useEffect(() => {
    if (!job && !loading && !refetched) {
      setRefetched(true);

      search({
        what: "software developer",
        where: "india",
      });
    }
  }, [job, loading, refetched, search]);

  useEffect(() => {
    if (job) {
      addRecent(job);
    }
  }, [job?.id, addRecent]);

  useEffect(() => {
    if (!job?.id) return;

    const isEmployerJob = String(job.id).startsWith("employer-");

    if (!isEmployerJob || hasRecordedView.current) return;

    hasRecordedView.current = true;

    recordJobViewApi(job.id);
  }, [job?.id]);

  async function handleMarkApplied() {
    if (!user || !job) return;

    setApplying(true);

    try {
      await recordApplicationApi(job.id);
      setApplied(true);
    } catch (err) {
      console.error(err);
    } finally {
      setApplying(false);
    }
  }

  async function submitReport() {
    if (!job || !reportReason.trim()) return;

    try {
      await request("/reports", {
        method: "POST",
        body: JSON.stringify({
          jobId: job.id,
          reason: reportReason.trim(),
        }),
      });

      setReportSent(true);
    } catch (err) {
      console.error(err);
    }
  }

  if (loading || (!job && !refetched)) {
    return (
      <>
        <Navbar />

        <div
          style={{
            background: "#F8FAFF",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              border: "3px solid #E2E6F0",
              borderTopColor: "#4F46E5",
              animation: "spin 0.8s linear infinite",
            }}
          />

          <p
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: 12,
              color: "#64748B",
              letterSpacing: "0.1em",
              margin: 0,
            }}
          >
            LOADING JOB...
          </p>
        </div>

        <Footer />

        <style>{`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </>
    );
  }

  if (!job) {
    return (
      <>
        <SEO
          title="Job Not Found | JobXPortal"
          description="This job listing is no longer available on JobXPortal."
          path={`/job/${id}`}
          noindex
        />

        <Navbar />

        <div
          style={{
            background: "#F8FAFF",
            minHeight: "100vh",
            color: "#0B132B",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 24px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: 11,
              letterSpacing: "0.1em",
              color: "#64748B",
              marginBottom: 12,
            }}
          >
            JOB NOT FOUND
          </p>

          <h1
            style={{
              fontFamily: "Poppins",
              fontSize: "1.8rem",
              fontWeight: 800,
              color: "#0B132B",
              marginBottom: 12,
            }}
          >
            This job listing is no longer available.
          </h1>

          <p
            style={{
              color: "#64748B",
              fontFamily: "Poppins",
              fontSize: 14,
              lineHeight: 1.7,
              marginBottom: 28,
              maxWidth: 400,
            }}
          >
            Live results are only kept for your current search session. Go back
            and search again to find another opportunity.
          </p>

          <Link
            to="/jobs"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "12px 28px",
              background: "#4F46E5",
              color: "#FFFFFF",
              borderRadius: 10,
              fontWeight: 700,
              textDecoration: "none",
              fontFamily: "Poppins, sans-serif",
              fontSize: 14,
              boxShadow: "0 8px 20px rgba(79,70,229,0.18)",
            }}
          >
            Back to jobs
          </Link>
        </div>

        <Footer />
      </>
    );
  }

  const status = statusFor(job.postedDaysAgo);

  const isTruncated =
    Boolean(job.description) &&
    job.description.trim().slice(-3) === "...";

  const isEmployerJob = String(job.id).startsWith("employer-");

  const statusColors = {
    NEW: {
      color: "#4F46E5",
      border: "#C7D2FE",
      bg: "#EEF2FF",
    },

    LIVE: {
      color: "#10B981",
      border: "#A7F3D0",
      bg: "#ECFDF5",
    },

    "CLOSING SOON": {
      color: "#E11D48",
      border: "#FECDD3",
      bg: "#FFF1F2",
    },
  };

  const sc = statusColors[status] || statusColors.LIVE;

  const jobTitle = job.title || "Job Opportunity";
  const companyName = job.company || "Company";
  const location = job.location || "India";
  const jobType = job.type || job.employmentType || "Full-time";
  const salary = job.salary || "Salary not disclosed";

  const seoTitle = `${jobTitle} at ${companyName} | JobXPortal`;

  const seoDescription =
    `Apply for ${jobTitle} at ${companyName} in ${location}. ` +
    `${jobType}${job.remote ? " · Remote" : ""}. ` +
    `View job details, requirements and application information on JobXPortal.`;

  const tags = Array.isArray(job.tags) ? job.tags : [];

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        path={`/job/${job.id}`}
      />

      <JobPostingSchema job={job} />

      <Navbar />

      <main
        style={{
          background: "#F8FAFF",
          minHeight: "100vh",
          color: "#0B132B",
          padding: "40px 24px 72px",
        }}
      >
        <div
          style={{
            maxWidth: 820,
            margin: "0 auto",
          }}
        >
          {/* Back */}
          <Link
            to="/jobs"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "JetBrains Mono",
              fontSize: 12,
              color: "#64748B",
              textDecoration: "none",
              letterSpacing: "0.06em",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#4F46E5";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#64748B";
            }}
          >
            <ArrowLeft size={14} />
            Back to jobs
          </Link>

          {/* Job Card */}
          <article
            style={{
              background: "#FFFFFF",
              border: "1px solid #E2E6F0",
              borderRadius: 20,
              padding: "34px 32px",
              marginTop: 20,
              boxShadow: "0 10px 35px rgba(15,23,42,0.05)",
            }}
          >
            {/* Status */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 20,
              }}
            >
              <span
                style={{
                  fontFamily: "JetBrains Mono",
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  padding: "5px 12px",
                  borderRadius: 7,
                  color: sc.color,
                  border: `1px solid ${sc.border}`,
                  background: sc.bg,
                  fontWeight: 600,
                }}
              >
                {status}
              </span>

              {job.remote && (
                <span
                  style={{
                    fontFamily: "JetBrains Mono",
                    fontSize: 11,
                    letterSpacing: "0.08em",
                    padding: "5px 12px",
                    borderRadius: 7,
                    color: "#4F46E5",
                    border: "1px solid #C7D2FE",
                    background: "#EEF2FF",
                    fontWeight: 600,
                  }}
                >
                  REMOTE
                </span>
              )}
            </div>

            {/* Title */}
            <h1
              style={{
                fontFamily: "Poppins",
                fontSize: "clamp(1.6rem, 4vw, 2.35rem)",
                fontWeight: 800,
                lineHeight: 1.2,
                color: "#0B132B",
                margin: "0 0 7px",
                letterSpacing: "-0.035em",
              }}
            >
              {jobTitle}
            </h1>

            {/* Company */}
            <h2
              style={{
                fontFamily: "Poppins",
                fontSize: "1rem",
                fontWeight: 500,
                color: "#64748B",
                margin: "0 0 18px",
              }}
            >
              {companyName}

              {job.employerId && (
                <Link
                  to={`/company/${job.employerId}`}
                  style={{
                    color: "#4F46E5",
                    fontFamily: "Poppins",
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: "none",
                    marginLeft: 10,
                  }}
                >
                  View company →
                </Link>
              )}
            </h2>

            {/* Job Meta */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                fontFamily: "JetBrains Mono",
                fontSize: 13,
                color: "#64748B",
                marginBottom: 20,
              }}
            >
              <span>{location}</span>

              <span>—</span>

              <span>{jobType}</span>

              <span>—</span>

              <span
                style={{
                  color: "#10B981",
                  fontWeight: 700,
                }}
              >
                {salary}
              </span>
            </div>

            {/* Experience */}
            {job.experience && (
              <div
                style={{
                  fontFamily: "JetBrains Mono",
                  fontSize: 13,
                  color: "#64748B",
                  marginBottom: 20,
                }}
              >
                Experience:{" "}
                <span
                  style={{
                    color: "#0B132B",
                    fontWeight: 600,
                  }}
                >
                  {job.experience}
                </span>
              </div>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  marginBottom: 28,
                }}
              >
                {tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: "Poppins",
                      fontSize: 12,
                      padding: "6px 12px",
                      borderRadius: 20,
                      background: "#F4F3FF",
                      border: "1px solid #E0E7FF",
                      color: "#4F46E5",
                      fontWeight: 500,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Divider */}
            <div
              style={{
                borderTop: "1px solid #E8ECF3",
                marginBottom: 26,
              }}
            />

            {/* Description */}
            <section>
              <h2
                style={{
                  fontFamily: "Poppins",
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#0B132B",
                  marginBottom: 14,
                  letterSpacing: "-0.02em",
                }}
              >
                Job Description
              </h2>

              <p
                style={{
                  color: "#334155",
                  fontFamily: "Poppins",
                  lineHeight: 1.85,
                  fontSize: 15,
                  whiteSpace: "pre-line",
                  margin: 0,
                }}
              >
                {job.description || "No job description is available."}
              </p>
            </section>

            {/* Truncated Notice */}
            {isTruncated && (
              <p
                style={{
                  marginTop: 18,
                  fontSize: 13,
                  color: "#64748B",
                  fontFamily: "Poppins",
                  lineHeight: 1.6,
                  padding: "13px 16px",
                  background: "#F8FAFF",
                  borderRadius: 10,
                  border: "1px solid #E2E6F0",
                }}
              >
                This is a preview. The full job description is available on the
                original posting.
              </p>
            )}

            {/* Apply Actions */}
            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                marginTop: 30,
              }}
            >
              {job.applyUrl && (
                <a
                  href={job.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "#4F46E5",
                    color: "#FFFFFF",
                    padding: "13px 26px",
                    borderRadius: 11,
                    fontWeight: 700,
                    fontSize: 14,
                    fontFamily: "Poppins, sans-serif",
                    textDecoration: "none",
                    transition: "all 0.2s",
                    boxShadow: "0 8px 20px rgba(79,70,229,0.18)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#4338CA";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#4F46E5";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {isTruncated
                    ? "Read Full Description & Apply"
                    : "Apply Now"}

                  <ExternalLink size={15} />
                </a>
              )}

              {user && isEmployerJob && (
                <button
                  onClick={handleMarkApplied}
                  disabled={applied || applying}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: applied ? "#ECFDF5" : "#FFFFFF",
                    border: `1px solid ${
                      applied ? "#A7F3D0" : "#D9DFEA"
                    }`,
                    color: applied ? "#059669" : "#475569",
                    padding: "13px 22px",
                    borderRadius: 11,
                    fontWeight: 700,
                    fontSize: 14,
                    fontFamily: "Poppins, sans-serif",
                    cursor: applied ? "default" : "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (!applied) {
                      e.currentTarget.style.borderColor = "#4F46E5";
                      e.currentTarget.style.color = "#4F46E5";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!applied) {
                      e.currentTarget.style.borderColor = "#D9DFEA";
                      e.currentTarget.style.color = "#475569";
                    }
                  }}
                >
                  {applied
                    ? "✓ Marked as Applied"
                    : applying
                      ? "Saving..."
                      : "I Applied to This"}
                </button>
              )}
            </div>

            {/* Career Tools */}
            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 24,
                flexWrap: "wrap",
              }}
            >
              <Link
                to="/interview-prep"
                state={{ job }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "9px 17px",
                  background: "#EEF2FF",
                  border: "1px solid #C7D2FE",
                  color: "#4F46E5",
                  borderRadius: 10,
                  textDecoration: "none",
                  fontFamily: "Poppins",
                  fontSize: 13,
                  fontWeight: 600,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#E0E7FF";
                  e.currentTarget.style.borderColor = "#A5B4FC";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#EEF2FF";
                  e.currentTarget.style.borderColor = "#C7D2FE";
                }}
              >
                🎯 Interview Prep
              </Link>

              <Link
                to="/cover-letter"
                state={{ job }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "9px 17px",
                  background: "#FFF7ED",
                  border: "1px solid #FED7AA",
                  color: "#EA580C",
                  borderRadius: 10,
                  textDecoration: "none",
                  fontFamily: "Poppins",
                  fontSize: 13,
                  fontWeight: 600,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#FFEDD5";
                  e.currentTarget.style.borderColor = "#FDBA74";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#FFF7ED";
                  e.currentTarget.style.borderColor = "#FED7AA";
                }}
              >
                ✉️ Cover Letter
              </Link>
            </div>

            {/* Report */}
            {isEmployerJob && (
              <div style={{ marginTop: 22 }}>
                {!reportOpen ? (
                  <button
                    onClick={() => setReportOpen(true)}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      color: "#94A3B8",
                      fontFamily: "JetBrains Mono",
                      fontSize: 11,
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#E11D48";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#94A3B8";
                    }}
                  >
                    Report this listing
                  </button>
                ) : reportSent ? (
                  <p
                    style={{
                      color: "#059669",
                      fontFamily: "Poppins",
                      fontSize: 13,
                      margin: 0,
                    }}
                  >
                    Thanks — we'll review it.
                  </p>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      marginTop: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    <input
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      placeholder="Why are you reporting this?"
                      style={{
                        flex: 1,
                        minWidth: 200,
                        background: "#FFFFFF",
                        border: "1px solid #D9DFEA",
                        borderRadius: 9,
                        padding: "9px 12px",
                        color: "#0B132B",
                        fontFamily: "Poppins",
                        fontSize: 12,
                        outline: "none",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#4F46E5";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#D9DFEA";
                      }}
                    />

                    <button
                      onClick={submitReport}
                      disabled={!reportReason.trim()}
                      style={{
                        padding: "9px 16px",
                        background: "#E11D48",
                        color: "#FFFFFF",
                        border: "none",
                        borderRadius: 9,
                        fontFamily: "Poppins",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: reportReason.trim()
                          ? "pointer"
                          : "not-allowed",
                        opacity: reportReason.trim() ? 1 : 0.5,
                      }}
                    >
                      Submit
                    </button>
                  </div>
                )}
              </div>
            )}
          </article>
        </div>
      </main>

      <Footer />

      <style>{`
        @media (max-width: 640px) {
          main {
            padding-left: 16px !important;
            padding-right: 16px !important;
          }

          article {
            padding: 24px 18px !important;
            border-radius: 16px !important;
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}