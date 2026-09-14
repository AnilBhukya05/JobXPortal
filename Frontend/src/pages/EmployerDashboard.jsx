import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Plus,
  Trash2,
  Eye,
  Users,
  ExternalLink,
  Loader2,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart3,
} from "lucide-react";
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
    if (!window.confirm("Delete this job post? This can't be undone.")) {
      return;
    }

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

    const daysLeft = Math.max(
      0,
      Math.ceil((new Date(job.expiresAt).getTime() - Date.now()) / 86400000),
    );

    return `Expires in ${daysLeft}d`;
  }

  const totalViews = jobs.reduce((sum, j) => sum + (j.views || 0), 0);

  const totalApplicants = jobs.reduce((sum, j) => sum + (j.applicants || 0), 0);

  const activeJobs = jobs.filter((job) => !job.isExpired).length;

  const expiredJobs = jobs.filter((job) => job.isExpired).length;

  const applicationRate =
    totalViews > 0 ? ((totalApplicants / totalViews) * 100).toFixed(1) : "0.0";

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
            maxWidth: 1000,
            margin: "0 auto",
          }}
        >
          {/* ===================================================== */}
          {/* HEADER */}
          {/* ===================================================== */}

          <div
            className="dashboard-header"
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 18,
              marginBottom: 28,
            }}
          >
            <div>
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
                EMPLOYER DASHBOARD
              </p>

              <h1
                style={{
                  fontSize: "clamp(1.9rem, 4vw, 2.7rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.035em",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  margin: 0,
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
                  <Briefcase size={23} color="#FFFFFF" />
                </span>
                Your Job Posts
              </h1>

              <p
                style={{
                  color: "#64748B",
                  fontFamily: "Poppins",
                  fontSize: 13,
                  lineHeight: 1.6,
                  margin: "9px 0 0",
                }}
              >
                Manage your listings, track performance, and reach potential
                candidates.
              </p>
            </div>

            <Link
              to="/post-job"
              className="post-job-button"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "11px 19px",
                background: "#4F46E5",
                color: "#FFFFFF",
                borderRadius: 10,
                textDecoration: "none",
                fontFamily: "Poppins",
                fontSize: 13,
                fontWeight: 700,
                boxShadow: "0 7px 18px rgba(79,70,229,0.16)",
                transition: "all 0.2s ease",
              }}
            >
              <Plus size={16} />
              Post New Job
            </Link>
          </div>

          {/* ===================================================== */}
          {/* ERROR */}
          {/* ===================================================== */}

          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "12px 14px",
                marginBottom: 20,
                borderRadius: 11,
                background: "#FFF1F2",
                border: "1px solid #FECDD3",
                color: "#E11D48",
                fontFamily: "Poppins",
                fontSize: 12.5,
              }}
            >
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          {/* ===================================================== */}
          {/* OVERVIEW STATS */}
          {/* ===================================================== */}

          <div
            className="stat-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: 12,
              marginBottom: 30,
            }}
          >
            {[
              {
                label: "Active Posts",
                value: activeJobs,
                icon: Briefcase,
                color: "#4F46E5",
                bg: "rgba(79,70,229,0.08)",
              },
              {
                label: "Total Views",
                value: totalViews,
                icon: Eye,
                color: "#0EA5E9",
                bg: "rgba(14,165,233,0.08)",
              },
              {
                label: "Applicants",
                value: totalApplicants,
                icon: Users,
                color: "#10B981",
                bg: "rgba(16,185,129,0.08)",
              },
              {
                label: "Application Rate",
                value: `${applicationRate}%`,
                icon: TrendingUp,
                color: "#8B5CF6",
                bg: "rgba(139,92,246,0.08)",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="stat-card"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E2E6F0",
                  borderRadius: 15,
                  padding: "18px 17px",
                  boxShadow: "0 4px 18px rgba(15,23,42,0.035)",
                  transition: "all 0.2s ease",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                    marginBottom: 14,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "JetBrains Mono",
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: "0.09em",
                      textTransform: "uppercase",
                      color: "#64748B",
                    }}
                  >
                    {stat.label}
                  </span>

                  <span
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 9,
                      background: stat.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <stat.icon size={15} color={stat.color} />
                  </span>
                </div>

                <div
                  style={{
                    fontFamily: "JetBrains Mono",
                    fontSize: "clamp(1.35rem, 3vw, 1.9rem)",
                    fontWeight: 700,
                    color: stat.color,
                  }}
                >
                  {loading
                    ? "..."
                    : typeof stat.value === "string"
                      ? stat.value
                      : stat.value.toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* ===================================================== */}
          {/* QUICK OVERVIEW */}
          {/* ===================================================== */}

          {!loading && jobs.length > 0 && (
            <div
              className="overview-card"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E6F0",
                borderRadius: 16,
                padding: "18px 20px",
                marginBottom: 28,
                boxShadow: "0 4px 18px rgba(15,23,42,0.035)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 15,
                  flexWrap: "wrap",
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                  }}
                >
                  <BarChart3 size={17} color="#4F46E5" />

                  <span
                    style={{
                      fontFamily: "Poppins",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#0B132B",
                    }}
                  >
                    Posting Overview
                  </span>
                </div>

                <span
                  style={{
                    fontFamily: "JetBrains Mono",
                    fontSize: 10,
                    color: "#64748B",
                  }}
                >
                  {jobs.length} total{" "}
                  {jobs.length === 1 ? "listing" : "listings"}
                </span>
              </div>

              <div
                className="overview-items"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    padding: "11px 13px",
                    background: "#F8FAFF",
                    borderRadius: 10,
                    border: "1px solid #E8EBF3",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      marginBottom: 4,
                    }}
                  >
                    <CheckCircle2 size={14} color="#10B981" />

                    <span
                      style={{
                        fontFamily: "Poppins",
                        fontSize: 11,
                        color: "#64748B",
                      }}
                    >
                      Live
                    </span>
                  </div>

                  <strong
                    style={{
                      fontFamily: "JetBrains Mono",
                      fontSize: 15,
                      color: "#0B132B",
                    }}
                  >
                    {activeJobs}
                  </strong>
                </div>

                <div
                  style={{
                    padding: "11px 13px",
                    background: "#F8FAFF",
                    borderRadius: 10,
                    border: "1px solid #E8EBF3",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      marginBottom: 4,
                    }}
                  >
                    <Clock size={14} color="#F59E0B" />

                    <span
                      style={{
                        fontFamily: "Poppins",
                        fontSize: 11,
                        color: "#64748B",
                      }}
                    >
                      Expired
                    </span>
                  </div>

                  <strong
                    style={{
                      fontFamily: "JetBrains Mono",
                      fontSize: 15,
                      color: "#0B132B",
                    }}
                  >
                    {expiredJobs}
                  </strong>
                </div>

                <div
                  style={{
                    padding: "11px 13px",
                    background: "#F8FAFF",
                    borderRadius: 10,
                    border: "1px solid #E8EBF3",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      marginBottom: 4,
                    }}
                  >
                    <Users size={14} color="#4F46E5" />

                    <span
                      style={{
                        fontFamily: "Poppins",
                        fontSize: 11,
                        color: "#64748B",
                      }}
                    >
                      Candidates
                    </span>
                  </div>

                  <strong
                    style={{
                      fontFamily: "JetBrains Mono",
                      fontSize: 15,
                      color: "#0B132B",
                    }}
                  >
                    {totalApplicants.toLocaleString()}
                  </strong>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================== */}
          {/* SECTION HEADER */}
          {/* ===================================================== */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 13,
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: "JetBrains Mono",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#64748B",
                  margin: 0,
                }}
              >
                YOUR LISTINGS
              </p>
            </div>

            {!loading && jobs.length > 0 && (
              <Link
                to="/post-job"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  color: "#4F46E5",
                  textDecoration: "none",
                  fontFamily: "Poppins",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                <Plus size={14} />
                Add another
              </Link>
            )}
          </div>

          {/* ===================================================== */}
          {/* LOADING */}
          {/* ===================================================== */}

          {loading ? (
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E6F0",
                borderRadius: 16,
                padding: "55px 24px",
                textAlign: "center",
                boxShadow: "0 4px 18px rgba(15,23,42,0.035)",
              }}
            >
              <Loader2
                size={26}
                color="#4F46E5"
                style={{
                  animation: "spin 1s linear infinite",
                  marginBottom: 12,
                }}
              />

              <p
                style={{
                  fontFamily: "Poppins",
                  color: "#64748B",
                  fontSize: 13,
                  margin: 0,
                }}
              >
                Loading your job posts...
              </p>
            </div>
          ) : jobs.length === 0 ? (
            /* =================================================== */
            /* EMPTY STATE */
            /* =================================================== */

            <div
              style={{
                background: "#FFFFFF",
                border: "1px dashed #CBD5E1",
                borderRadius: 17,
                padding: "55px 24px",
                textAlign: "center",
                boxShadow: "0 4px 18px rgba(15,23,42,0.025)",
              }}
            >
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 16,
                  background: "rgba(79,70,229,0.08)",
                  border: "1px solid rgba(79,70,229,0.13)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <Briefcase size={26} color="#4F46E5" />
              </div>

              <p
                style={{
                  fontFamily: "Poppins",
                  fontWeight: 700,
                  fontSize: 16,
                  color: "#0B132B",
                  marginBottom: 7,
                }}
              >
                No job posts yet
              </p>

              <p
                style={{
                  fontFamily: "Poppins",
                  fontSize: 13,
                  lineHeight: 1.7,
                  color: "#64748B",
                  maxWidth: 420,
                  margin: "0 auto 20px",
                }}
              >
                Post your first role — it's free and goes live immediately.
              </p>

              <Link
                to="/post-job"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 20px",
                  background: "#4F46E5",
                  color: "#FFFFFF",
                  borderRadius: 10,
                  textDecoration: "none",
                  fontFamily: "Poppins",
                  fontSize: 13,
                  fontWeight: 700,
                  boxShadow: "0 7px 18px rgba(79,70,229,0.16)",
                }}
              >
                <Plus size={15} />
                Post a Job
              </Link>
            </div>
          ) : (
            /* =================================================== */
            /* JOB LIST */
            /* =================================================== */

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="job-row"
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #E2E6F0",
                    borderRadius: 15,
                    padding: "17px 19px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 15,
                    opacity: job.isExpired ? 0.68 : 1,
                    boxShadow: "0 3px 15px rgba(15,23,42,0.03)",
                    transition: "all 0.2s ease",
                  }}
                >
                  {/* JOB INFORMATION */}

                  <div
                    style={{
                      minWidth: 0,
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        flexWrap: "wrap",
                        marginBottom: 5,
                      }}
                    >
                      <h3
                        style={{
                          fontFamily: "Poppins",
                          fontWeight: 700,
                          fontSize: 15,
                          color: "#0B132B",
                          margin: 0,
                        }}
                      >
                        {job.title}
                      </h3>

                      <span
                        style={{
                          fontFamily: "JetBrains Mono",
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                          padding: "3px 8px",
                          borderRadius: 5,
                          color: job.isExpired ? "#E11D48" : "#059669",
                          border: `1px solid ${
                            job.isExpired ? "#FECDD3" : "#A7F3D0"
                          }`,
                          background: job.isExpired ? "#FFF1F2" : "#ECFDF5",
                        }}
                      >
                        {job.isExpired ? "EXPIRED" : "LIVE"}
                      </span>
                    </div>

                    <p
                      style={{
                        fontFamily: "JetBrains Mono",
                        fontSize: 10.5,
                        color: "#64748B",
                        margin: 0,
                        lineHeight: 1.6,
                      }}
                    >
                      {job.company} · {job.location} · Posted{" "}
                      {timeAgo(job.createdAt)}
                      {expiryLabel(job) ? ` · ${expiryLabel(job)}` : ""}
                    </p>

                    {/* JOB METRICS */}

                    <div
                      style={{
                        display: "flex",
                        gap: 16,
                        marginTop: 10,
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          fontFamily: "Poppins",
                          fontSize: 11.5,
                          color: "#64748B",
                        }}
                      >
                        <Eye size={13} color="#0EA5E9" />
                        {(job.views || 0).toLocaleString()} views
                      </span>

                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          fontFamily: "Poppins",
                          fontSize: 11.5,
                          color: "#64748B",
                        }}
                      >
                        <Users size={13} color="#10B981" />
                        {(job.applicants || 0).toLocaleString()} applicants
                      </span>

                      {job.views > 0 && (
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            fontFamily: "Poppins",
                            fontSize: 11.5,
                            color: "#64748B",
                          }}
                        >
                          <TrendingUp size={13} color="#8B5CF6" />
                          {(((job.applicants || 0) / job.views) * 100).toFixed(
                            1,
                          )}
                          % rate
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ACTIONS */}

                  <div
                    className="job-actions"
                    style={{
                      display: "flex",
                      gap: 8,
                      flexShrink: 0,
                    }}
                  >
                    {job.applyUrl && (
                      <a
                        href={job.applyUrl}
                        target="_blank"
                        rel="noreferrer"
                        title="View live listing"
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 9,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px solid #E2E6F0",
                          background: "#FFFFFF",
                          color: "#64748B",
                          textDecoration: "none",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#4F46E5";
                          e.currentTarget.style.borderColor = "#4F46E5";
                          e.currentTarget.style.background = "#F8FAFF";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "#64748B";
                          e.currentTarget.style.borderColor = "#E2E6F0";
                          e.currentTarget.style.background = "#FFFFFF";
                        }}
                      >
                        <ExternalLink size={15} />
                      </a>
                    )}

                    <button
                      onClick={() => handleDelete(job.id)}
                      disabled={deletingId === job.id}
                      title="Delete job post"
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 9,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid #FECACA",
                        background: "#FFF7F7",
                        color: "#E11D48",
                        cursor: deletingId === job.id ? "default" : "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (deletingId !== job.id) {
                          e.currentTarget.style.background = "#FFF1F2";
                          e.currentTarget.style.borderColor = "#FB7185";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#FFF7F7";
                        e.currentTarget.style.borderColor = "#FECACA";
                      }}
                    >
                      {deletingId === job.id ? (
                        <Loader2
                          size={15}
                          style={{
                            animation: "spin 1s linear infinite",
                          }}
                        />
                      ) : (
                        <Trash2 size={15} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ===================================================== */}
          {/* BOTTOM EMPLOYER TIP */}
          {/* ===================================================== */}

          {!loading && jobs.length > 0 && (
            <div
              style={{
                marginTop: 28,
                padding: "17px 19px",
                background: "#EEF2FF",
                border: "1px solid #C7D2FE",
                borderRadius: 14,
                display: "flex",
                alignItems: "flex-start",
                gap: 11,
              }}
            >
              <TrendingUp
                size={17}
                color="#4F46E5"
                style={{
                  marginTop: 2,
                  flexShrink: 0,
                }}
              />

              <div>
                <p
                  style={{
                    fontFamily: "Poppins",
                    fontSize: 12.5,
                    fontWeight: 700,
                    color: "#0B132B",
                    margin: "0 0 4px",
                  }}
                >
                  Keep your listings fresh
                </p>

                <p
                  style={{
                    fontFamily: "Poppins",
                    fontSize: 11.5,
                    lineHeight: 1.6,
                    color: "#64748B",
                    margin: 0,
                  }}
                >
                  Clear job titles, detailed descriptions, relevant skills,
                  salary information, and a working application link can help
                  candidates understand your opportunity faster.
                </p>
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

        .stat-card:hover {
          transform: translateY(-3px);
          border-color: rgba(79, 70, 229, 0.28) !important;
          box-shadow: 0 10px 28px rgba(15, 23, 42, 0.07) !important;
        }

        .job-row:hover {
          transform: translateY(-2px);
          border-color: rgba(79, 70, 229, 0.25) !important;
          box-shadow: 0 10px 25px rgba(15, 23, 42, 0.06) !important;
        }

        .post-job-button:hover {
          background: #4338CA !important;
          transform: translateY(-2px);
          box-shadow: 0 11px 25px rgba(79, 70, 229, 0.22) !important;
        }

        @media (max-width: 800px) {
          .stat-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }

          .overview-items {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 640px) {
          .dashboard-header {
            align-items: flex-start !important;
            flex-direction: column !important;
          }

          .post-job-button {
            width: 100%;
          }

          .stat-grid {
            grid-template-columns: 1fr 1fr !important;
          }

          .job-actions {
            width: 100%;
          }

          .job-actions a,
          .job-actions button {
            flex: 1;
          }
        }

        @media (max-width: 420px) {
          .stat-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
