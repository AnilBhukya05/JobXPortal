import { Link, useParams } from "react-router-dom";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useJobs } from "../context/JobsContext";
import { useBookmarkContext } from "../context/BookmarkContext";
import { useAuth } from "../context/AuthContext";
import { statusFor } from "../data/jobs";
import { recordJobViewApi, recordApplicationApi } from "../services/employerJobsService";
import { request } from "../services/api";

export default function JobDetails() {
  const { id } = useParams();
  const { getJobById, loading, search } = useJobs();
  const { addRecent } = useBookmarkContext();
  const { user } = useAuth();
  const [refetched, setRefetched] = useState(false);
  const hasRecordedView = useRef(false);

  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);

  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportSent, setReportSent] = useState(false);

  const contextJob = getJobById(id);
  const job = contextJob || (() => {
    try {
      const stored = sessionStorage.getItem("jobxportal_preview_" + id);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    if (!job && !loading && !refetched) {
      setRefetched(true);
      search({ what: "software developer", where: "india" });
    }
  }, [job, loading, refetched, search]);

  useEffect(() => {
    if (job) addRecent(job);
  }, [job?.id]);

  useEffect(() => {
    if (!job?.id || !String(job.id).startsWith("employer-")) return;
    if (hasRecordedView.current) return;
    hasRecordedView.current = true;
    recordJobViewApi(job.id);
  }, [job?.id]);

  useEffect(() => {
    if (!job) return;
    const prevTitle = document.title;
    document.title = `${job.title} at ${job.company} | JobXPortal`;

    let meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta ? meta.content : null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = `${job.title} at ${job.company}, ${job.location}. ${job.type}${job.remote ? " · Remote" : ""}. Apply now on JobXPortal.`;

    return () => {
      document.title = prevTitle;
      if (meta && prevDesc !== null) meta.content = prevDesc;
    };
  }, [job?.id]);

  async function handleMarkApplied() {
    if (!user) return;
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
    if (!reportReason.trim()) return;
    try {
      await request("/reports", { method: "POST", body: JSON.stringify({ jobId: job.id, reason: reportReason }) });
      setReportSent(true);
    } catch {}
  }

  if (loading || (!job && !refetched)) {
    return (
      <>
        <Navbar />
        <div style={{
          background: "var(--bg)", minHeight: "100vh",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexDirection: "column", gap: 16,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            border: "3px solid var(--border)",
            borderTopColor: "var(--accent)",
            animation: "spin 0.8s linear infinite",
          }} />
          <p style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: "var(--muted)", letterSpacing: "0.1em" }}>
            LOADING JOB...
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
        <Footer />
      </>
    );
  }

  if (!job) {
    return (
      <>
        <Navbar />
        <div style={{
          background: "var(--bg)", minHeight: "100vh", color: "var(--text)",
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", padding: "0 24px", textAlign: "center",
        }}>
          <p style={{ fontFamily: "JetBrains Mono", fontSize: 11, letterSpacing: "0.1em", color: "var(--muted)", marginBottom: 12 }}>
            FLIGHT NOT FOUND
          </p>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: 12 }}>
            This listing has left the board.
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 28, maxWidth: 400 }}>
            Live results are only kept for your current search session. Go back and search again to find it.
          </p>
          <Link to="/jobs" style={{
            padding: "12px 28px", background: "var(--accent)", color: "#09090B",
            borderRadius: 10, fontWeight: 700, textDecoration: "none",
            fontFamily: "Poppins, sans-serif", fontSize: 14,
          }}>
            Back to jobs
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const status = statusFor(job.postedDaysAgo);
  const isTruncated = job.description && job.description.trim().slice(-3) === "...";
  const isEmployerJob = String(job.id).startsWith("employer-");

  const statusColors = {
    NEW: { color: "var(--teal)", border: "rgba(45,212,191,0.3)", bg: "rgba(45,212,191,0.08)" },
    LIVE: { color: "var(--accent)", border: "rgba(0,255,179,0.3)", bg: "rgba(0,255,179,0.08)" },
    "CLOSING SOON": { color: "#fb7185", border: "rgba(251,113,133,0.3)", bg: "rgba(251,113,133,0.08)" },
  };
  const sc = statusColors[status] || statusColors.LIVE;

  return (
    <>
      <Navbar />
      <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--text)", padding: "32px 24px 64px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <Link to="/jobs" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontFamily: "JetBrains Mono", fontSize: 12,
            color: "var(--muted)", textDecoration: "none",
            letterSpacing: "0.08em",
            transition: "color 0.15s",
          }}
            onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent)"}
            onMouseLeave={(e) => e.currentTarget.style.color = "var(--muted)"}
          >
            <ArrowLeft size={14} /> Back to board
          </Link>

          <div style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 20,
            padding: "36px 32px",
            marginTop: 20,
          }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
              <span style={{
                fontFamily: "JetBrains Mono", fontSize: 11,
                letterSpacing: "0.08em",
                padding: "4px 12px", borderRadius: 6,
                color: sc.color, border: `1px solid ${sc.border}`, background: sc.bg,
              }}>
                {status}
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800, lineHeight: 1.2, marginBottom: 8 }}>
              {job.title}
            </h1>
            <h2 style={{ fontSize: "1rem", fontWeight: 500, color: "var(--muted)", marginBottom: 16 }}>
              {job.company}
              {job.employerId && (
                <Link to={`/company/${job.employerId}`} style={{ color: "var(--accent)", fontFamily: "Poppins", fontSize: 13, textDecoration: "none", marginLeft: 10 }}>
                  View company →
                </Link>
              )}
            </h2>

            <div style={{
              display: "flex", flexWrap: "wrap", gap: 8,
              fontFamily: "JetBrains Mono", fontSize: 13,
              color: "var(--muted)", marginBottom: 20,
            }}>
              <span>{job.location}</span>
              <span>—</span>
              <span>{job.type}</span>
              <span>—</span>
              <span style={{ color: "var(--accent)", fontWeight: 600 }}>{job.salary}</span>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
              {job.tags.map((tag) => (
                <span key={tag} style={{
                  fontFamily: "JetBrains Mono", fontSize: 12,
                  padding: "4px 12px", borderRadius: 6,
                  background: "var(--surface2)", border: "1px solid var(--border)",
                  color: "var(--muted)",
                }}>
                  {tag}
                </span>
              ))}
            </div>

            <div style={{ borderTop: "1px solid var(--border)", marginBottom: 24 }} />

            <p style={{
              color: "var(--text)", lineHeight: 1.8, fontSize: 15,
              whiteSpace: "pre-line", opacity: 0.9,
            }}>
              {job.description}
            </p>

            {isTruncated && (
              <p style={{
                marginTop: 16, fontSize: 13,
                color: "var(--muted)", fontFamily: "JetBrains Mono",
                padding: "12px 16px",
                background: "var(--surface2)",
                borderRadius: 8, border: "1px solid var(--border)",
              }}>
                This is a preview. The full job description is on the original posting.
              </p>
            )}

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 28 }}>
              <a
                href={job.applyUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "var(--accent)", color: "#09090B",
                  padding: "13px 28px", borderRadius: 12,
                  fontWeight: 700, fontSize: 14,
                  fontFamily: "Poppins, sans-serif",
                  textDecoration: "none",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = "0.85"}
                onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
              >
                {isTruncated ? "Read Full Description & Apply" : "Apply Now"}
                <ExternalLink size={15} />
              </a>

              {user && isEmployerJob && (
                <button
                  onClick={handleMarkApplied}
                  disabled={applied || applying}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: applied ? "rgba(0,255,179,0.1)" : "none",
                    border: `1px solid ${applied ? "var(--accent)" : "var(--border)"}`,
                    color: applied ? "var(--accent)" : "var(--muted)",
                    padding: "13px 24px", borderRadius: 12,
                    fontWeight: 700, fontSize: 14, fontFamily: "Poppins, sans-serif",
                    cursor: applied ? "default" : "pointer",
                  }}
                >
                  {applied ? "✓ Marked as Applied" : applying ? "Saving..." : "I Applied to This"}
                </button>
              )}
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap" }}>
              <Link
                to="/interview-prep"
                state={{ job }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "9px 18px",
                  background: "rgba(0,255,179,0.1)", border: "1px solid rgba(0,255,179,0.3)",
                  color: "var(--accent)", borderRadius: 10, textDecoration: "none",
                  fontFamily: "Poppins", fontSize: 13, fontWeight: 600,
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(0,255,179,0.18)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "rgba(0,255,179,0.1)"}
              >
                🎯 Interview Prep
              </Link>
              <Link
                to="/cover-letter"
                state={{ job }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "9px 18px",
                  background: "rgba(255,176,32,0.1)", border: "1px solid rgba(255,176,32,0.3)",
                  color: "#FFB020", borderRadius: 10, textDecoration: "none",
                  fontFamily: "Poppins", fontSize: 13, fontWeight: 600,
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,176,32,0.18)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,176,32,0.1)"}
              >
                ✉️ Cover Letter
              </Link>
            </div>

            {isEmployerJob && (
              <div style={{ marginTop: 20 }}>
                {!reportOpen ? (
                  <button onClick={() => setReportOpen(true)} style={{ background: "none", border: "none", color: "var(--muted)", fontFamily: "JetBrains Mono", fontSize: 11, cursor: "pointer", textDecoration: "underline" }}>
                    Report this listing
                  </button>
                ) : reportSent ? (
                  <p style={{ color: "var(--accent)", fontFamily: "Poppins", fontSize: 13 }}>Thanks — we'll review it.</p>
                ) : (
                  <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                    <input value={reportReason} onChange={(e) => setReportReason(e.target.value)} placeholder="Why are you reporting this?" style={{ flex: 1, minWidth: 200, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", color: "var(--text)", fontFamily: "Poppins", fontSize: 12 }} />
                    <button onClick={submitReport} style={{ padding: "8px 16px", background: "#fb7185", color: "#09090B", border: "none", borderRadius: 8, fontFamily: "Poppins", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Submit</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}