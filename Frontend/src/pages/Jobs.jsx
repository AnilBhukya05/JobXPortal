import {
  useParams,
  useSearchParams,
  useNavigate,
  Link,
} from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobCard from "../components/JobCard";
import FilterSidebar from "../components/FilterSidebar";
import SearchBar from "../components/SearchBar";
import SEO from "../components/SEO";
import { JobsLoading, DemoBanner } from "../components/JobsStatus";
import { useJobs } from "../context/JobsContext";
import { portals } from "../data/portals";

export default function Jobs() {
  const { portal } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const { jobs, loading, error, isDemo, search } = useJobs();

  const [days, setDays] = useState(3650);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [jobType, setJobType] = useState([]);
  const [experience, setExperience] = useState([]);
  const [category, setCategory] = useState("");
  const [keyword, setKeyword] = useState(searchParams.get("q") || "");

  const JOBS_PER_PAGE = 10;

  const currentPage = Math.max(
    1,
    Number(searchParams.get("page")) || 1
  );

  const whereLoc = searchParams.get("where") || "india";

  const portalMeta = portals.find(
    (p) => p.slug === portal
  );

  const heading = portalMeta
    ? portalMeta.name
    : "All";

  useEffect(() => {
    const q = searchParams.get("q");

    if (
      portalMeta &&
      portalMeta.query &&
      portalMeta.query.what
    ) {
      search({
        what: portalMeta.query.what,
        where: whereLoc,
      });
    } else if (q) {
      search({
        what: q,
        where: whereLoc,
      });
    } else {
      search({
        what: "jobs",
        where: whereLoc,
      });
    }

    setCategory("");
    setKeyword(q || "");

    const nextParams = new URLSearchParams(
      searchParams
    );

    nextParams.set("page", "1");

    setSearchParams(nextParams, {
      replace: true,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portal]);

  useEffect(() => {
    if (category !== "") {
      search({
        what: category,
        where: whereLoc,
      });

      const nextParams = new URLSearchParams(
        searchParams
      );

      nextParams.set("page", "1");

      setSearchParams(nextParams, {
        replace: true,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      if (
        job.postedDaysAgo != null &&
        job.postedDaysAgo > days
      ) {
        return false;
      }

      if (remoteOnly && !job.remote) {
        return false;
      }

      if (
        jobType.length &&
        !jobType.includes(job.type)
      ) {
        return false;
      }

      if (
        experience.length &&
        job.experienceBucket &&
        job.experienceBucket !== "unknown" &&
        !experience.includes(job.experienceBucket)
      ) {
        return false;
      }

      if (keyword) {
        const searchText = (
          (job.title || "") +
          " " +
          (job.company || "") +
          " " +
          (job.tags || []).join(" ")
        ).toLowerCase();

        if (
          !searchText.includes(
            keyword.toLowerCase()
          )
        ) {
          return false;
        }
      }

      return true;
    });
  }, [
    jobs,
    days,
    remoteOnly,
    jobType,
    experience,
    keyword,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filtered.length / JOBS_PER_PAGE
    )
  );

  const safePage = Math.min(
    currentPage,
    totalPages
  );

  const startIndex =
    (safePage - 1) * JOBS_PER_PAGE;

  const endIndex =
    startIndex + JOBS_PER_PAGE;

  const paginatedJobs = filtered.slice(
    startIndex,
    endIndex
  );

  function goToPage(page) {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    const nextParams = new URLSearchParams(
      searchParams
    );

    nextParams.set(
      "page",
      String(page)
    );

    setSearchParams(nextParams);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleSearchSubmit() {
    setCategory("");

    search({
      what: keyword || "jobs",
      where: whereLoc,
    });

    const nextParams = new URLSearchParams(
      searchParams
    );

    if (keyword) {
      nextParams.set("q", keyword);
    } else {
      nextParams.delete("q");
    }

    nextParams.set("page", "1");

    setSearchParams(nextParams);
  }

  const activeFilterCount =
    (days < 30 ? 1 : 0) +
    (remoteOnly ? 1 : 0) +
    jobType.length +
    experience.length +
    (category ? 1 : 0);

  const seoTitle =
    heading === "All"
      ? "Find Jobs in India — Latest Jobs & Career Opportunities | JobXPortal"
      : `${heading} Jobs — Latest Career Opportunities | JobXPortal`;

  const seoDescription =
    heading === "All"
      ? "Search the latest jobs in India across multiple job sources and company career pages. Find IT, software, fresher, remote and other career opportunities on JobXPortal."
      : `Find the latest ${heading} jobs and career opportunities on JobXPortal. Search, filter and explore job openings from multiple sources.`;

  function getPageNumbers() {
    const pages = [];

    if (totalPages <= 7) {
      for (
        let i = 1;
        i <= totalPages;
        i++
      ) {
        pages.push(i);
      }

      return pages;
    }

    pages.push(1);

    if (safePage > 4) {
      pages.push("...");
    }

    const start = Math.max(
      2,
      safePage - 1
    );

    const end = Math.min(
      totalPages - 1,
      safePage + 1
    );

    for (
      let i = start;
      i <= end;
      i++
    ) {
      pages.push(i);
    }

    if (
      safePage <
      totalPages - 3
    ) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  }

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        path="/jobs"
      />

      <Navbar />

      <main
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
              "32px 24px 64px",
          }}
        >
          <button
            onClick={() => navigate(-1)}
            className="cursor-pointer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily:
                "JetBrains Mono",
              fontSize: 12,
              color: "#64748B",
              background: "none",
              border: "none",
              marginBottom: 24,
              letterSpacing:
                "0.08em",
              transition:
                "color 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color =
                "#4F46E5";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color =
                "#64748B";
            }}
          >
            <ArrowLeft size={14} />
            Back
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontFamily:
                "JetBrains Mono",
              fontSize: 11,
              letterSpacing:
                "0.1em",
              color: "#94A3B8",
              marginBottom: 8,
              textTransform:
                "uppercase",
            }}
          >
            <Link
              to="/"
              className="cursor-pointer"
              style={{
                color: "#64748B",
                textDecoration:
                  "none",
                transition:
                  "color 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color =
                  "#4F46E5")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color =
                  "#64748B")
              }
            >
              HOME
            </Link>

            <span>/</span>

            <Link
              to="/jobs"
              className="cursor-pointer"
              style={{
                color: "#64748B",
                textDecoration:
                  "none",
                transition:
                  "color 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color =
                  "#4F46E5")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color =
                  "#64748B")
              }
            >
              {heading}
            </Link>

            <span>/</span>

            <button
              onClick={() =>
                search({
                  what:
                    keyword ||
                    "jobs",
                  where: "india",
                })
              }
              className="cursor-pointer"
              style={{
                background:
                  "none",
                border: "none",
                color: "#64748B",
                fontFamily:
                  "JetBrains Mono",
                fontSize: 11,
                letterSpacing:
                  "0.1em",
                padding: 0,
                transition:
                  "color 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color =
                  "#4F46E5")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color =
                  "#64748B")
              }
            >
              {whereLoc.toUpperCase()}
            </button>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent:
                "space-between",
              gap: 20,
              marginBottom: 8,
              flexWrap: "wrap",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize:
                    "clamp(1.8rem, 4vw, 2.8rem)",
                  fontWeight: 800,
                  color: "#0B132B",
                  margin: 0,
                  lineHeight: 1.15,
                }}
              >
                {heading} Jobs
              </h1>

              <p
                style={{
                  color: "#64748B",
                  fontSize: 13,
                  marginTop: 8,
                  fontFamily:
                    "JetBrains Mono",
                }}
              >
                {!loading && (
                  <>
                    Showing{" "}
                    <span
                      style={{
                        color:
                          "#4F46E5",
                        fontWeight: 700,
                      }}
                    >
                      {filtered.length ===
                      0
                        ? 0
                        : startIndex +
                          1}
                      –
                      {Math.min(
                        endIndex,
                        filtered.length
                      )}
                    </span>{" "}
                    of{" "}
                    <span
                      style={{
                        color:
                          "#4F46E5",
                        fontWeight: 700,
                      }}
                    >
                      {filtered.length}
                    </span>{" "}
                    jobs

                    {activeFilterCount >
                      0 && (
                      <span
                        style={{
                          color:
                            "#059669",
                          marginLeft: 8,
                        }}
                      >
                        (
                        {
                          activeFilterCount
                        }{" "}
                        filter
                        {activeFilterCount >
                        1
                          ? "s"
                          : ""}{" "}
                        active)
                      </span>
                    )}
                  </>
                )}
              </p>
            </div>
          </div>

          <div
            className="jobs-search-row"
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 26,
              maxWidth: 700,
            }}
          >
            <div
              style={{
                flex: 1,
                minWidth: 0,
              }}
            >
              <SearchBar
                keyword={keyword}
                setKeyword={setKeyword}
              />
            </div>

            <button
              onClick={
                handleSearchSubmit
              }
              className="cursor-pointer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent:
                  "center",
                gap: 7,
                padding:
                  "0 22px",
                background:
                  "#4F46E5",
                color: "#FFFFFF",
                border: "none",
                borderRadius: 12,
                fontFamily:
                  "Poppins",
                fontSize: 13,
                fontWeight: 700,
                flexShrink: 0,
                transition:
                  "all 0.2s ease",
                boxShadow:
                  "0 6px 18px rgba(79,70,229,0.16)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "#4338CA";
                e.currentTarget.style.transform =
                  "translateY(-1px)";
                e.currentTarget.style.boxShadow =
                  "0 10px 24px rgba(79,70,229,0.22)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  "#4F46E5";
                e.currentTarget.style.transform =
                  "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 6px 18px rgba(79,70,229,0.16)";
              }}
            >
              <Search size={15} />
              Search
            </button>
          </div>

          {isDemo && (
            <DemoBanner
              message={error}
            />
          )}

          <div
            className="jobs-layout"
            style={{
              display: "grid",
              gridTemplateColumns:
                "280px 1fr",
              gap: 24,
              alignItems: "start",
            }}
          >
            <div
              className="sidebar-wrapper"
              style={{
                position: "sticky",
                top: 80,
                height: "fit-content",
                alignSelf: "start",
                zIndex: 10,
              }}
            >
              <FilterSidebar
                days={days}
                setDays={setDays}
                remoteOnly={remoteOnly}
                setRemoteOnly={
                  setRemoteOnly
                }
                jobType={jobType}
                setJobType={setJobType}
                experience={
                  experience
                }
                setExperience={
                  setExperience
                }
                category={category}
                setCategory={
                  setCategory
                }
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection:
                  "column",
                gap: 14,
              }}
            >
              {loading ? (
                <JobsLoading />
              ) : paginatedJobs.length ===
                0 ? (
                <div
                  style={{
                    background:
                      "#FFFFFF",
                    border:
                      "1px solid #E2E6F0",
                    borderRadius: 18,
                    padding:
                      "56px 24px",
                    textAlign:
                      "center",
                    boxShadow:
                      "0 4px 18px rgba(15,23,42,0.04)",
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius:
                        14,
                      background:
                        "#F4F3FF",
                      border:
                        "1px solid #E0E7FF",
                      display: "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      margin:
                        "0 auto 16px",
                      color:
                        "#4F46E5",
                    }}
                  >
                    <Search
                      size={22}
                    />
                  </div>

                  <p
                    style={{
                      color:
                        "#0B132B",
                      fontSize: 16,
                      fontWeight: 700,
                      marginBottom: 8,
                    }}
                  >
                    No jobs match your
                    filters.
                  </p>

                  <p
                    style={{
                      color:
                        "#64748B",
                      fontSize: 13,
                      fontFamily:
                        "JetBrains Mono",
                    }}
                  >
                    Try a different
                    category or clear
                    your filters.
                  </p>
                </div>
              ) : (
                <>
                  {paginatedJobs.map(
                    (job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                      />
                    )
                  )}

                  {totalPages > 1 && (
                    <div
                      className="pagination"
                      style={{
                        display:
                          "flex",
                        justifyContent:
                          "center",
                        alignItems:
                          "center",
                        gap: 8,
                        flexWrap:
                          "wrap",
                        marginTop: 20,
                        paddingTop: 12,
                      }}
                    >
                      <button
                        onClick={() =>
                          goToPage(
                            safePage - 1
                          )
                        }
                        disabled={
                          safePage ===
                          1
                        }
                        className="cursor-pointer"
                        style={{
                          padding:
                            "10px 16px",
                          background:
                            "#FFFFFF",
                          border:
                            "1px solid #E2E6F0",
                          borderRadius: 10,
                          color:
                            "#344054",
                          opacity:
                            safePage ===
                            1
                              ? 0.4
                              : 1,
                          fontFamily:
                            "Poppins",
                          fontSize: 13,
                          fontWeight: 600,
                          transition:
                            "all 0.15s",
                        }}
                      >
                        ← Previous
                      </button>

                      {getPageNumbers().map(
                        (
                          page,
                          index
                        ) => {
                          if (
                            page ===
                            "..."
                          ) {
                            return (
                              <span
                                key={`dots-${index}`}
                                style={{
                                  color:
                                    "#94A3B8",
                                  padding:
                                    "0 4px",
                                }}
                              >
                                ...
                              </span>
                            );
                          }

                          const active =
                            page ===
                            safePage;

                          return (
                            <button
                              key={page}
                              onClick={() =>
                                goToPage(
                                  page
                                )
                              }
                              className="cursor-pointer"
                              style={{
                                minWidth: 40,
                                height: 40,
                                padding:
                                  "0 10px",
                                background:
                                  active
                                    ? "#4F46E5"
                                    : "#FFFFFF",
                                color:
                                  active
                                    ? "#FFFFFF"
                                    : "#344054",
                                border:
                                  `1px solid ${
                                    active
                                      ? "#4F46E5"
                                      : "#E2E6F0"
                                  }`,
                                borderRadius: 10,
                                fontFamily:
                                  "Poppins",
                                fontSize: 13,
                                fontWeight: 700,
                                transition:
                                  "all 0.15s",
                                boxShadow:
                                  active
                                    ? "0 6px 16px rgba(79,70,229,0.18)"
                                    : "none",
                              }}
                            >
                              {page}
                            </button>
                          );
                        }
                      )}

                      <button
                        onClick={() =>
                          goToPage(
                            safePage + 1
                          )
                        }
                        disabled={
                          safePage ===
                          totalPages
                        }
                        className="cursor-pointer"
                        style={{
                          padding:
                            "10px 16px",
                          background:
                            "#FFFFFF",
                          border:
                            "1px solid #E2E6F0",
                          borderRadius: 10,
                          color:
                            "#344054",
                          opacity:
                            safePage ===
                            totalPages
                              ? 0.4
                              : 1,
                          fontFamily:
                            "Poppins",
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .jobs-layout {
            grid-template-columns: 1fr !important;
          }

          .sidebar-wrapper {
            position: static !important;
          }

          .jobs-search-row {
            max-width: 100% !important;
          }

          .pagination {
            gap: 6px !important;
          }

          .pagination button {
            font-size: 12px !important;
          }
        }

        @media (max-width: 520px) {
          .jobs-search-row {
            flex-direction: column !important;
          }

          .jobs-search-row button {
            min-height: 46px;
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}