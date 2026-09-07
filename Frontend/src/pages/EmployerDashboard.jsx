import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Plus, Trash2, Eye, Users, ExternalLink, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useToast } from "../context/ToastContext";
import { fetchMyJobsApi, deleteJobApi } from "../services/employerJobsService";
import { timeAgo } from "../utils/time";

export default function EmployerDashboard() {
  const { toast } = useToast();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const { jobs } = await fetchMyJobsApi();
      setJobs(jobs || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this job post? This can't be undone.")) return;
    setDeletingId(id);
    try {
      await deleteJobApi(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
      toast("Job post removed", "info");
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setDeletingId(null);
    }
  }

  function expiryLabel(job) {
    if (!job.expiresAt) return null;
    if (job.isExpired) return "Expired";
    const daysLeft = Math.max(0, Math.ceil((new Date(job.expiresAt).getTime() - Date.now()) / 86400000));
    return `Expires in ${daysLeft}d`;
  }

  const totalViews = jobs.reduce((sum, j) => sum + (j.views || 0), 0);
  const totalApplicants = jobs.reduce((sum, j) => sum + (j.applicants || 0), 0);

  return (
    <>
      <Navbar />
      <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--text)", padding: "32px 24px 64px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 8 }}>
            <div>
              <p style={{ fontFamily: "JetBrains Mono", fontSize: 11, letterSpacing: "0.1em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 8 }}>
                EMPLOYER DASHBOARD
              </p>
              <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 800, display: "flex", alignItems: "center", gap: 12 }}>
                <Briefcase size={28} style={{ color: "var(--accent)" }} />
                Your Job Posts
              </h1>
            </div>
            <Link to="/post-job" style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "12px 20px", background: "var(--accent)", color: "#09090B",
              borderRadius: 10, textDecoration: "none",
              fontFamily: "Poppins", fontSize: 13, fontWeight: 700,
            }}>
              <Plus size={16} /> Post New Job
            </Link>
          </div>

          {error && <p style={{ color: "#fb7185", fontFamily: "Poppins", fontSize: 13, marginBottom: 20 }}>{error}</p>}

          <div className="stat-row" style={{
            display: "flex", background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 16, overflow: "hidden", margin: "28px 0 32px",
          }}>
            {[
              { label: "Active Posts", value: jobs.length, icon: Briefcase },
              { label: "Total Views", value: totalViews, icon: Eye },
              { label: "Total Applicants", value: totalApplicants, icon: Users },
            ].map((stat, i) => (
              <div key={stat.label} style={{
                flex: 1, padding: "20px 16px", textAlign: "center",
                borderLeft: i === 0 ? "none" : "1px solid var(--border)",
              }}>
                <div style={{ fontFamily: "JetBrains Mono", fontSize: "clamp(1.2rem, 4vw, 2.2rem)", fontWeight: 700, color: "var(--accent)" }}>
                  {loading ? "..." : stat.value.toLocaleString()}
                </div>
                <div style={{ fontFamily: "JetBrains Mono", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginTop: 6 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {loading ? (
            <p style={{ fontFamily: "Poppins", color: "var(--muted)", textAlign: "center", padding: "40px 0" }}>Loading your job posts...</p>
          ) : jobs.length === 0 ? (
            <div style={{
              background: "var(--surface)", border: "1px dashed var(--border)", borderRadius: 16,
              padding: "48px 24px", textAlign: "center",
            }}>
              <Briefcase size={28} style={{ color: "var(--muted)", marginBottom: 12 }} />
              <p style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 15, marginBottom: 6 }}>No job posts yet</p>
              <p style={{ fontFamily: "Poppins", fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>
                Post your first role — it's free and goes live immediately.
              </p>
              <Link to="/post-job" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "10px 20px", background: "var(--accent)", color: "#09090B",
                borderRadius: 10, textDecoration: "none",
                fontFamily: "Poppins", fontSize: 13, fontWeight: 700,
              }}>
                <Plus size={15} /> Post a Job
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {jobs.map((job) => (
                <div key={job.id} style={{
                  background: "var(--surface)", border: "1px solid var(--border)",
                  borderRadius: 14, padding: "16px 20px",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  flexWrap: "wrap", gap: 12,
                  opacity: job.isExpired ? 0.65 : 1,
                }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                      <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 15, color: "var(--text)" }}>{job.title}</h3>
                      <span style={{
                        fontFamily: "JetBrains Mono", fontSize: 10, letterSpacing: "0.06em",
                        padding: "2px 8px", borderRadius: 5,
                        color: job.isExpired ? "#fb7185" : "var(--accent)",
                        border: `1px solid ${job.isExpired ? "rgba(251,113,133,0.3)" : "rgba(0,255,179,0.3)"}`,
                        background: job.isExpired ? "rgba(251,113,133,0.08)" : "rgba(0,255,179,0.08)",
                      }}>
                        {job.isExpired ? "EXPIRED" : "LIVE"}
                      </span>
                    </div>
                    <p style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "var(--muted)" }}>
                      {job.company} · {job.location} · Posted {timeAgo(job.createdAt)}
                      {expiryLabel(job) ? ` · ${expiryLabel(job)}` : ""}
                    </p>
                    <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "Poppins", fontSize: 12, color: "var(--muted)" }}>
                        <Eye size={13} /> {job.views || 0} views
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "Poppins", fontSize: 12, color: "var(--muted)" }}>
                        <Users size={13} /> {job.applicants || 0} applicants
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    {job.applyUrl && (
                      <a href={job.applyUrl} target="_blank" rel="noreferrer" title="View live listing" style={{
                        width: 34, height: 34, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center",
                        border: "1px solid var(--border)", color: "var(--muted)", textDecoration: "none",
                      }}>
                        <ExternalLink size={15} />
                      </a>
                    )}
                    <button
                      onClick={() => handleDelete(job.id)}
                      disabled={deletingId === job.id}
                      title="Delete job post"
                      style={{
                        width: 34, height: 34, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center",
                        border: "1px solid var(--border)", background: "none", color: "#fb7185", cursor: "pointer",
                      }}
                    >
                      {deletingId === job.id ? <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> : <Trash2 size={15} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}