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
    if (pg === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    setError("");

    try {
      const result = await fetchJobs({
        what: what
          ? what + " remote"
          : "remote work from home",
        where: "india",
        page: pg,
        resultsPerPage: 20,
      });

      const remoteOnly = result.jobs.filter(
        (j) =>
          j.remote ||
          /remote|work from home|wfh/i.test(
            j.title + " " + j.location
          )
      );

      if (append) {
        setJobs((prev) => [
          ...prev,
          ...remoteOnly,
        ]);
      } else {
        setJobs(remoteOnly);
      }

      setHasMore(result.jobs.length === 20);
      setPage(pg);
    } catch (err) {
      setError(
        "Could not load remote jobs: " +
          err.message
      );
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    load("", 1);
  }, []);

  function handleSearch() {
    setActiveSearch(
      keyword || "remote"
    );

    load(keyword, 1, false);
  }

  function handleLoadMore() {
    load(
      activeSearch,
      page + 1,
      true
    );
  }

  return (
    <>
      <Navbar />

      <div
        style={{
          background: "#F8FAFF",
          minHeight: "100vh",
          color: "#0B132B",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding:
              "32px 20px 64px",
          }}
        >
          {/* BACK */}

          <button
            onClick={() =>
              navigate(-1)
            }
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,

              fontFamily:
                "JetBrains Mono",
              fontSize: 12,

              color: "#64748B",

              background:
                "transparent",

              border: "none",

              cursor: "pointer",

              marginBottom: 24,

              letterSpacing:
                "0.08em",

              padding: 0,

              transition:
                "color 0.2s ease, transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color =
                "#4F46E5";

              e.currentTarget.style.transform =
                "translateX(-3px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color =
                "#64748B";

              e.currentTarget.style.transform =
                "translateX(0)";
            }}
          >
            <ArrowLeft size={14} />

            Back
          </button>

          {/* PAGE LABEL */}

          <p
            style={{
              fontFamily:
                "JetBrains Mono",
              fontSize: 11,
              letterSpacing:
                "0.1em",
              color: "#64748B",
              textTransform:
                "uppercase",
              marginBottom: 8,
            }}
          >
            GATE / REMOTE
          </p>

          {/* TITLE + REFRESH */}

          <div
            style={{
              display: "flex",
              alignItems:
                "center",
              justifyContent:
                "space-between",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 8,
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize:
                  "clamp(1.8rem, 4vw, 2.8rem)",
                fontWeight: 800,
                color: "#0B132B",
                letterSpacing:
                  "-0.035em",
                lineHeight: 1.1,
              }}
            >
              Work from anywhere
            </h1>

            <button
              onClick={() =>
                load(
                  activeSearch,
                  1,
                  false
                )
              }
              disabled={loading}
              style={{
                display: "flex",
                alignItems:
                  "center",
                gap: 7,

                fontFamily:
                  "JetBrains Mono",
                fontSize: 11,

                color: "#64748B",

                background:
                  "#FFFFFF",

                border:
                  "1px solid #E2E8F0",

                borderRadius: 999,

                padding:
                  "7px 14px",

                cursor:
                  loading
                    ? "not-allowed"
                    : "pointer",

                transition:
                  "all 0.2s ease",

                boxShadow:
                  "0 2px 8px rgba(15,23,42,0.04)",

                opacity:
                  loading ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.color =
                    "#4F46E5";

                  e.currentTarget.style.borderColor =
                    "#C7D2FE";

                  e.currentTarget.style.boxShadow =
                    "0 4px 14px rgba(79,70,229,0.08)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color =
                  "#64748B";

                e.currentTarget.style.borderColor =
                  "#E2E8F0";

                e.currentTarget.style.boxShadow =
                  "0 2px 8px rgba(15,23,42,0.04)";
              }}
            >
              <RefreshCw
                size={12}
                className={
                  loading
                    ? "spin"
                    : ""
                }
              />

              Refresh
            </button>
          </div>

          {/* RESULT COUNT */}

          <p
            style={{
              color: "#64748B",
              fontSize: 13,
              marginTop: 0,
              marginBottom: 24,
            }}
          >
            {loading
              ? "Searching remote roles..."
              : jobs.length +
                " remote roles found"}
          </p>

          {/* SEARCH */}

          <div
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 28,
              maxWidth: 540,
            }}
          >
            <input
              type="text"
              value={keyword}
              onChange={(e) =>
                setKeyword(
                  e.target.value
                )
              }
              onKeyDown={(e) =>
                e.key === "Enter" &&
                handleSearch()
              }
              placeholder="Search remote jobs (e.g. React, Marketing)..."
              style={{
                flex: 1,

                background:
                  "#FFFFFF",

                border:
                  "1px solid #DDE3EE",

                borderRadius: 10,

                padding:
                  "11px 14px",

                color:
                  "#0B132B",

                fontFamily:
                  "Poppins",

                fontSize: 13,

                outline: "none",

                transition:
                  "all 0.2s ease",

                boxShadow:
                  "0 2px 10px rgba(15,23,42,0.025)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor =
                  "#A5B4FC";

                e.currentTarget.style.boxShadow =
                  "0 0 0 3px rgba(79,70,229,0.07)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor =
                  "#DDE3EE";

                e.currentTarget.style.boxShadow =
                  "0 2px 10px rgba(15,23,42,0.025)";
              }}
            />

            <button
              onClick={handleSearch}
              disabled={loading}
              style={{
                padding:
                  "10px 20px",

                background:
                  "linear-gradient(135deg, #4F46E5, #7138E8)",

                color:
                  "#FFFFFF",

                border: "none",

                borderRadius: 10,

                cursor:
                  loading
                    ? "not-allowed"
                    : "pointer",

                fontFamily:
                  "Poppins",

                fontSize: 13,

                fontWeight: 700,

                flexShrink: 0,

                opacity:
                  loading ? 0.7 : 1,

                boxShadow:
                  "0 6px 16px rgba(79,70,229,0.15)",

                transition:
                  "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform =
                    "translateY(-1px)";

                  e.currentTarget.style.boxShadow =
                    "0 8px 20px rgba(79,70,229,0.20)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform =
                  "translateY(0)";

                e.currentTarget.style.boxShadow =
                  "0 6px 16px rgba(79,70,229,0.15)";
              }}
            >
              Search
            </button>
          </div>

          {/* ERROR */}

          {error && (
            <div
              style={{
                background:
                  "#FFFFFF",

                border:
                  "1px solid #FECACA",

                borderRadius: 12,

                padding:
                  "14px 18px",

                marginBottom: 20,

                color:
                  "#DC2626",

                fontFamily:
                  "Poppins",

                fontSize: 13,

                boxShadow:
                  "0 3px 12px rgba(220,38,38,0.04)",
              }}
            >
              {error}
            </div>
          )}

          {/* LOADING */}

          {loading ? (
            <JobsLoading />
          ) : jobs.length === 0 ? (
            /* EMPTY */

            <div
              style={{
                background:
                  "#FFFFFF",

                border:
                  "1px solid #E2E8F0",

                borderRadius: 16,

                padding:
                  "40px 24px",

                textAlign:
                  "center",

                boxShadow:
                  "0 5px 20px rgba(15,23,42,0.04)",
              }}
            >
              <p
                style={{
                  color:
                    "#64748B",

                  marginBottom: 8,
                }}
              >
                No remote roles found.
              </p>

              <p
                style={{
                  color:
                    "#94A3B8",

                  fontSize: 13,

                  fontFamily:
                    "JetBrains Mono",

                  margin: 0,
                }}
              >
                Try a different keyword above.
              </p>
            </div>
          ) : (
            <>
              {/* JOBS */}

              <div
                style={{
                  display: "flex",
                  flexDirection:
                    "column",
                  gap: 10,
                }}
              >
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                  />
                ))}
              </div>

              {/* LOAD MORE */}

              {hasMore && (
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "center",
                    marginTop: 28,
                  }}
                >
                  <button
                    onClick={
                      handleLoadMore
                    }
                    disabled={
                      loadingMore
                    }
                    style={{
                      padding:
                        "11px 28px",

                      background:
                        "#FFFFFF",

                      border:
                        "1px solid #DDE3EE",

                      borderRadius: 10,

                      color:
                        "#344054",

                      cursor:
                        loadingMore
                          ? "not-allowed"
                          : "pointer",

                      fontFamily:
                        "Poppins",

                      fontSize: 13,

                      fontWeight: 600,

                      opacity:
                        loadingMore
                          ? 0.6
                          : 1,

                      boxShadow:
                        "0 3px 12px rgba(15,23,42,0.035)",

                      transition:
                        "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!loadingMore) {
                        e.currentTarget.style.borderColor =
                          "#A5B4FC";

                        e.currentTarget.style.color =
                          "#4F46E5";

                        e.currentTarget.style.transform =
                          "translateY(-1px)";

                        e.currentTarget.style.boxShadow =
                          "0 6px 16px rgba(79,70,229,0.07)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor =
                        "#DDE3EE";

                      e.currentTarget.style.color =
                        "#344054";

                      e.currentTarget.style.transform =
                        "translateY(0)";

                      e.currentTarget.style.boxShadow =
                        "0 3px 12px rgba(15,23,42,0.035)";
                    }}
                  >
                    {loadingMore
                      ? "Loading more..."
                      : "Load More Remote Jobs"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <Footer />
      </div>

      <style>
        {`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }

          .spin {
            animation: spin 1s linear infinite;
          }

          @media (max-width: 560px) {
            .remote-search {
              flex-direction: column;
            }
          }
        `}
      </style>
    </>
  );
}