import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PortalCard from "../components/PortalCard";
import JobCard from "../components/JobCard";
import SplitFlap from "../components/SplitFlap";
import { JobsLoading, DemoBanner } from "../components/JobsStatus";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import { RefreshCw, Clock } from "lucide-react";
import { timeAgo } from "../utils/time";
import { useJobs } from "../context/JobsContext";
import { portals } from "../data/portals";
import { useBookmarkContext } from "../context/BookmarkContext";

function AnimatedNumber({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });

  useEffect(() => {
    if (!inView || target === 0) return;
    let start = 0;
    const step = Math.max(1, Math.ceil(target / 60));
    const timer = setInterval(() => {
      start = Math.min(target, start + step);
      setCount(start);
      if (start >= target) clearInterval(timer);
    }, 25);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function Home() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const { jobs, totalCount, loading, error, isDemo, lastUpdated, refresh } = useJobs();
  const { recent } = useBookmarkContext();

  const uniqueCompanies = new Set(jobs.map((j) => j.company)).size;
  const latest = [...jobs].sort((a, b) => a.postedDaysAgo - b.postedDaysAgo).slice(0, 4);

  function handleSearch(e) {
    e.preventDefault();
    const where = location.trim() || "india";
    navigate("/jobs?q=" + encodeURIComponent(keyword) + "&where=" + encodeURIComponent(where));
  }

  return (
    <>
      <Navbar />
      <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh", overflowX: "hidden" }}>

        {/* HERO */}
        <section style={{ position: "relative", padding: "60px 0 48px" }}>
          <div className="hero-grid" />
          <div className="hero-glow" />

          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px", position: "relative", zIndex: 1 }}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

              {/* LIVE BADGE */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                border: "1px solid var(--border)", background: "var(--surface)",
                padding: "5px 14px", borderRadius: 999, marginBottom: 20,
                fontFamily: "JetBrains Mono", fontSize: 10, letterSpacing: "0.1em",
                color: "var(--muted)", flexWrap: "wrap",
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", display: "inline-block", flexShrink: 0 }} />
                LIVE BOARD — UPDATED ON EVERY SEARCH
              </div>

              {/* HEADING */}
              <div style={{ marginBottom: 16, overflow: "hidden" }}>
                <h1 style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(1.7rem, 5.5vw, 5rem)",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.1,
                  color: "var(--text)",
                  margin: 0,
                }}>
                  Now boarding:
                </h1>
                <div style={{
                  overflow: "hidden",
                  maxWidth: "100%",
                }}>
                  <SplitFlap
                    words={["FRONTEND ENGINEER", "PRODUCT DESIGNER", "DATA ANALYST", "DEVOPS ENGINEER"]}
                    style={{
                      color: "var(--accent)",
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 800,
                      fontSize: "clamp(1.5rem, 5vw, 4.8rem)",
                      letterSpacing: "-0.03em",
                      lineHeight: 1.1,
                      display: "block",
                      overflow: "hidden",
                      maxWidth: "100%",
                    }}
                  />
                </div>
              </div>

              <p style={{
                color: "var(--muted)", fontSize: "clamp(14px, 2.5vw, 18px)",
                marginBottom: 28, maxWidth: 520, lineHeight: 1.6,
              }}>
                Real jobs from LinkedIn, Naukri, Glassdoor and more — pulled live every time you search.
              </p>

              {/* SEARCH FORM */}
              <form onSubmit={handleSearch} style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: 10,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                maxWidth: 640,
              }}>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Job title, skill or company"
                  style={{
                    background: "transparent", border: "none", outline: "none",
                    padding: "9px 12px", color: "var(--text)",
                    fontFamily: "Poppins", fontSize: 14, width: "100%",
                  }}
                />
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center" }}>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Location (e.g. Bangalore)"
                      style={{
                        width: "100%",
                        background: "var(--surface2)", border: "1px solid var(--border)",
                        borderRadius: 10, outline: "none",
                        padding: "9px 12px", color: "var(--text)",
                        fontFamily: "Poppins", fontSize: 13,
                      }}
                    />
                    {location && (
                      <button
                        type="button"
                        onClick={() => setLocation("")}
                        style={{
                          position: "absolute", right: 8,
                          background: "none", border: "none",
                          color: "var(--muted)", cursor: "pointer",
                          fontSize: 16, lineHeight: 1, padding: 0,
                        }}
                      >×</button>
                    )}
                  </div>
                  <button type="submit" style={{
                    background: "var(--accent)", color: "#09090B",
                    border: "none", borderRadius: 10,
                    padding: "9px 20px",
                    fontFamily: "Poppins", fontSize: 13, fontWeight: 700,
                    cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
                  }}>
                    Search
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </section>

        {/* STATS */}
        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px 48px" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 10,
          }}>
            {[
              { label: "Jobs Found", value: loading ? 0 : totalCount, suffix: "+" },
              { label: "Companies", value: loading ? 0 : uniqueCompanies, suffix: "+" },
              { label: "Categories", value: portals.length, suffix: "" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ y: -3 }}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 16,
                  padding: "20px 16px",
                  transition: "border-color 0.3s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}
              >
                <div style={{
                  fontFamily: "JetBrains Mono",
                  fontSize: "clamp(1.2rem, 4vw, 2.8rem)",
                  fontWeight: 700,
                  color: "var(--text)",
                  lineHeight: 1.1,
                }}>
                  {loading ? "..." : <AnimatedNumber target={stat.value} suffix={stat.suffix} />}
                </div>
                <div style={{
                  fontFamily: "JetBrains Mono",
                  fontSize: "clamp(9px, 1.5vw, 11px)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  marginTop: 6,
                }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SOURCES */}
        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px 64px" }}>
          <p style={{ fontFamily: "JetBrains Mono", fontSize: 10, letterSpacing: "0.1em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 8 }}>
            BROWSE BY CATEGORY
          </p>
          <h2 style={{ fontSize: "clamp(1.4rem, 4vw, 2.4rem)", fontWeight: 800, marginBottom: 24, color: "var(--text)" }}>
            Sources
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
          }} className="portal-grid">
            {portals.map((portal, index) => (
              <PortalCard key={portal.slug} portal={portal} index={index} />
            ))}
          </div>
        </section>

        {/* RECENTLY VIEWED */}
        {recent.length > 0 && (
          <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px 48px" }}>
            <p style={{ fontFamily: "JetBrains Mono", fontSize: 10, letterSpacing: "0.1em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 8 }}>
              RECENTLY VIEWED
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <h2 style={{ fontSize: "clamp(1.3rem, 3vw, 2rem)", fontWeight: 800, color: "var(--text)" }}>
                Pick up where you left off
              </h2>
              <Clock size={20} style={{ color: "var(--muted)", flexShrink: 0 }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {recent.slice(0, 4).map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </section>
        )}

        {/* LATEST JOBS */}
        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px 80px" }}>
          <p style={{ fontFamily: "JetBrains Mono", fontSize: 10, letterSpacing: "0.1em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 8 }}>
            JUST LANDED
          </p>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: 10, marginBottom: 20,
          }}>
            <h2 style={{ fontSize: "clamp(1.3rem, 3vw, 2.4rem)", fontWeight: 800, color: "var(--text)" }}>
              Latest Opportunities
            </h2>
            <button
              onClick={refresh}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                fontFamily: "JetBrains Mono", fontSize: 11,
                color: "var(--muted)", background: "none",
                border: "1px solid var(--border)", borderRadius: 999,
                padding: "6px 14px", cursor: "pointer",
                transition: "color 0.15s, border-color 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.borderColor = "var(--accent)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.borderColor = "var(--border)"; }}
            >
              <RefreshCw size={12} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
              <span style={{ display: "none" }} className="refresh-label">
                {lastUpdated ? "Updated " + timeAgo(lastUpdated) : "Updating..."}
              </span>
              <span>Refresh</span>
            </button>
          </div>

          {isDemo && <DemoBanner message={error} />}

          {loading ? (
            <JobsLoading />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {latest.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </section>

        <Footer />
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }

        /* PORTAL GRID — responsive */
        @media(max-width: 900px) {
          .portal-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media(max-width: 600px) {
          .portal-grid { grid-template-columns: repeat(1, 1fr) !important; }
        }

        /* SEARCH fix on very small screens */
        @media(max-width: 400px) {
          form input { font-size: 12px !important; }
        }

        /* STATS font scale */
        @media(max-width: 480px) {
          .stats-num { font-size: 1.3rem !important; }
        }
      `}</style>
    </>
  );
}