import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobCard from "../components/JobCard";
import { JobsLoading } from "../components/JobsStatus";
import { fetchJobs } from "../services/jobsApi";

export default function Remote() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [activeSearch, setActiveSearch] = useState("remote");

  async function load(what, pg, append = false) {
    if (pg === 1) setLoading(true);
    else setLoadingMore(true);
    setError("");

    try {
      // Adzuna: search "remote" + keyword, then filter results that are remote
      const result = await fetchJobs({
        what: what ? what + " remote" : "remote work from home",
        where: "india",
        page: pg,
        resultsPerPage: 20,
      });

      // Only keep jobs that are actually remote
      const remoteOnly = result.jobs.filter(
        (j) => j.remote || /remote|work from home|wfh/i.test(j.title + " " + j.location)
      );

      if (append) {
        setJobs((prev) => [...prev, ...remoteOnly]);
      } else {
        setJobs(remoteOnly);
      }

      setHasMore(result.jobs.length === 20);
      setPage(pg);
    } catch (err) {
      setError("Could not load remote jobs: " + err.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    load("", 1);
  }, []);

  function handleSearch() {
    setActiveSearch(keyword || "remote");
    load(keyword, 1, false);
  }

  function handleLoadMore() {
    load(activeSearch, page + 1, true);
  }

  return (
    <>
      <Navbar />
      <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--text)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 20px 64px" }}>

          <button onClick={() => navigate(-1)} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontFamily: "JetBrains Mono", fontSize: 12, color: "var(--muted)",
            background: "none", border: "none", cursor: "pointer", marginBottom: 24,
            letterSpacing: "0.08em",
          }}>
            <ArrowLeft size={14} /> Back
          </button>

          <p style={{ fontFamily: "JetBrains Mono", fontSize: 11, letterSpacing: "0.1em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 8 }}>
            GATE / REMOTE
          </p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 8 }}>
            <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800 }}>
              Work from anywhere
            </h1>
            <button
              onClick={() => load(activeSearch, 1, false)}
              disabled={loading}
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
              <RefreshCw size={12} className={loading ? "spin" : ""} />
              Refresh
            </button>
          </div>

          <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 24 }}>
            {loading ? "Searching remote roles..." : jobs.length + " remote roles found"}
          </p>

          {/* SEARCH */}
          <div style={{ display: "flex", gap: 10, marginBottom: 28, maxWidth: 540 }}>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search remote jobs (e.g. React, Marketing)..."
              style={{
                flex: 1, background: "var(--surface)",
                border: "1px solid var(--border)", borderRadius: 10,
                padding: "10px 14px", color: "var(--text)",
                fontFamily: "Poppins", fontSize: 13, outline: "none",
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
              onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              style={{
                padding: "10px 20px", background: "var(--accent)", color: "#09090B",
                border: "none", borderRadius: 10, cursor: "pointer",
                fontFamily: "Poppins", fontSize: 13, fontWeight: 700,
                flexShrink: 0, opacity: loading ? 0.7 : 1,
              }}
            >
              Search
            </button>
          </div>

          {error && (
            <div style={{
              background: "var(--surface)", border: "1px solid rgba(251,113,133,0.3)",
              borderRadius: 12, padding: "14px 18px", marginBottom: 20,
              color: "#fb7185", fontFamily: "Poppins", fontSize: 13,
            }}>
              {error}
            </div>
          )}

          {loading ? (
            <JobsLoading />
          ) : jobs.length === 0 ? (
            <div style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 16, padding: "40px 24px", textAlign: "center",
            }}>
              <p style={{ color: "var(--muted)", marginBottom: 8 }}>No remote roles found.</p>
              <p style={{ color: "var(--muted)", fontSize: 13, fontFamily: "JetBrains Mono" }}>
                Try a different keyword above.
              </p>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>

              {hasMore && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    style={{
                      padding: "11px 28px",
                      background: "none", border: "1px solid var(--border)",
                      borderRadius: 10, color: "var(--text)", cursor: "pointer",
                      fontFamily: "Poppins", fontSize: 13, fontWeight: 600,
                      opacity: loadingMore ? 0.6 : 1,
                      transition: "border-color 0.15s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                  >
                    {loadingMore ? "Loading more..." : "Load More Remote Jobs"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        <Footer />
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } .spin { animation: spin 1s linear infinite; }`}</style>
    </>
  );
}