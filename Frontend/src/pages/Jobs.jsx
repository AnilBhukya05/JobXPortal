import { useParams, useSearchParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobCard from "../components/JobCard";
import FilterSidebar from "../components/FilterSidebar";
import SearchBar from "../components/SearchBar";
import { JobsLoading, DemoBanner } from "../components/JobsStatus";
import { useJobs } from "../context/JobsContext";
import { portals } from "../data/portals";

export default function Jobs() {
  const { portal } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    jobs, loading, loadingMore,
    error, isDemo, hasMore,
    search, loadMore,
  } = useJobs();

  const [days, setDays] = useState(30);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [jobType, setJobType] = useState([]);
  const [experience, setExperience] = useState([]);
  const [category, setCategory] = useState("");
  const [keyword, setKeyword] = useState(searchParams.get("q") || "");

  const whereLoc = searchParams.get("where") || "india";
  const portalMeta = portals.find((p) => p.slug === portal);
  const heading = portalMeta ? portalMeta.name : "All";

  useEffect(() => {
    const q = searchParams.get("q");
    if (portalMeta && portalMeta.query && portalMeta.query.what) {
      search({ what: portalMeta.query.what, where: whereLoc });
    } else if (q) {
      search({ what: q, where: whereLoc });
    } else {
      search({ what: "jobs", where: whereLoc });
    }
    setCategory("");
    setKeyword(searchParams.get("q") || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portal]);

  useEffect(() => {
    if (category !== "") {
      search({ what: category, where: whereLoc });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      if (job.postedDaysAgo > days) return false;
      if (remoteOnly && !job.remote) return false;
      if (jobType.length && !jobType.includes(job.type)) return false;
      if (
        experience.length &&
        job.experienceBucket &&
        job.experienceBucket !== "unknown" &&
        !experience.includes(job.experienceBucket)
      ) return false;
      if (
        keyword &&
        !(job.title + " " + job.company + " " + job.tags.join(" "))
          .toLowerCase()
          .includes(keyword.toLowerCase())
      ) return false;
      return true;
    });
  }, [jobs, days, remoteOnly, jobType, experience, keyword]);

  function handleSearchSubmit() {
    setCategory("");
    search({ what: keyword || "jobs", where: whereLoc });
  }

  const activeFilterCount =
    (days < 30 ? 1 : 0) +
    (remoteOnly ? 1 : 0) +
    jobType.length +
    experience.length +
    (category ? 1 : 0);

  return (
    <>
      <Navbar />
      <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--text)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 64px" }}>

          {/* BACK */}
          <button onClick={() => navigate(-1)} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontFamily: "JetBrains Mono", fontSize: 12, color: "var(--muted)",
            background: "none", border: "none", cursor: "pointer", marginBottom: 24,
            letterSpacing: "0.08em",
          }}>
            <ArrowLeft size={14} /> Back
          </button>

          {/* BREADCRUMB */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            fontFamily: "JetBrains Mono", fontSize: 11, letterSpacing: "0.1em",
            color: "var(--muted)", marginBottom: 8, textTransform: "uppercase",
          }}>
            <Link to="/" style={{ color: "var(--muted)", textDecoration: "none" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "var(--muted)"}
            >LIVE</Link>
            <span>/</span>
            <Link to="/jobs" style={{ color: "var(--muted)", textDecoration: "none" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "var(--muted)"}
            >{heading}</Link>
            <span>/</span>
            <button onClick={() => search({ what: keyword || "jobs", where: "india" })} style={{
              background: "none", border: "none", cursor: "pointer",
              color: "var(--muted)", fontFamily: "JetBrains Mono",
              fontSize: 11, letterSpacing: "0.1em", padding: 0,
            }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "var(--muted)"}
            >{whereLoc.toUpperCase()}</button>
          </div>

          {/* HEADING */}
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, marginBottom: 6 }}>
            {heading} Jobs
          </h1>

          {!loading && (
            <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 20, fontFamily: "JetBrains Mono" }}>
              Showing <span style={{ color: "var(--accent)" }}>{filtered.length}</span> of {jobs.length} loaded
              {activeFilterCount > 0 && (
                <span style={{ color: "var(--teal)", marginLeft: 8 }}>
                  ({activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active)
                </span>
              )}
            </p>
          )}

          {/* SEARCH BAR */}
          <div style={{ display: "flex", gap: 10, marginBottom: 24, maxWidth: 600 }}>
            <div style={{ flex: 1 }}>
              <SearchBar keyword={keyword} setKeyword={setKeyword} />
            </div>
            <button onClick={handleSearchSubmit} style={{
              padding: "0 20px", background: "var(--accent)", color: "#09090B",
              border: "none", borderRadius: 12, cursor: "pointer",
              fontFamily: "Poppins", fontSize: 13, fontWeight: 700, flexShrink: 0,
            }}>
              Search
            </button>
          </div>

          {isDemo && <DemoBanner message={error} />}

          {/* MAIN LAYOUT */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "280px 1fr",
            gap: 24,
            alignItems: "start",
          }} className="jobs-layout">

            {/* SIDEBAR WRAPPER — sticky applied here */}
            <div style={{
              position: "sticky",
              top: 80,
              height: "fit-content",
              alignSelf: "start",
              zIndex: 10,
            }} className="sidebar-wrapper">
              <FilterSidebar
                days={days} setDays={setDays}
                remoteOnly={remoteOnly} setRemoteOnly={setRemoteOnly}
                jobType={jobType} setJobType={setJobType}
                experience={experience} setExperience={setExperience}
                category={category} setCategory={setCategory}
              />
            </div>

            {/* JOB LIST */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {loading ? (
                <JobsLoading />
              ) : filtered.length === 0 ? (
                <div style={{
                  background: "var(--surface)", border: "1px solid var(--border)",
                  borderRadius: 16, padding: "40px 24px", textAlign: "center",
                }}>
                  <p style={{ color: "var(--muted)", marginBottom: 8 }}>No jobs match your filters.</p>
                  <p style={{ color: "var(--muted)", fontSize: 13, fontFamily: "JetBrains Mono" }}>
                    Try a different category or clear your filters.
                  </p>
                </div>
              ) : (
                <>
                  {filtered.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}

                  {hasMore && (
                    <div style={{ display: "flex", justifyContent: "center", paddingTop: 16 }}>
                      <button onClick={loadMore} disabled={loadingMore} style={{
                        padding: "12px 28px",
                        background: "none", border: "1px solid var(--border)",
                        borderRadius: 12, color: "var(--text)", cursor: "pointer",
                        fontFamily: "Poppins", fontSize: 13, fontWeight: 600,
                        opacity: loadingMore ? 0.6 : 1,
                        transition: "border-color 0.15s",
                      }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                      >
                        {loadingMore ? "Loading more..." : "Load More Jobs"}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>

      <style>{`
        @media(max-width: 768px) {
          .jobs-layout {
            grid-template-columns: 1fr !important;
          }
          .sidebar-wrapper {
            position: static !important;
          }
        }
      `}</style>
    </>
  );
}