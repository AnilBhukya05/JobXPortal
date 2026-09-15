import {
  useParams,
  useSearchParams,
  useNavigate,
  Link,
} from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobCard from "../components/JobCard";
import FilterSidebar from "../components/FilterSidebar";
import SearchBar from "../components/SearchBar";
import SEO from "../components/SEO";
import {
  JobsLoading,
  DemoBanner,
} from "../components/JobsStatus";
import { useJobs } from "../context/JobsContext";
import { portals } from "../data/portals";

/* ============================================================
   ROLE MAP
============================================================ */

const ROLE_MAP = {
  "frontend-developer": "Frontend Developer",
  "react-developer": "React Developer",
  "java-developer": "Java Developer",
  "python-developer": "Python Developer",
  "software-developer": "Software Developer",
  "full-stack-developer": "Full Stack Developer",
  "backend-developer": "Backend Developer",
  "javascript-developer": "JavaScript Developer",
  "fresher-jobs": "Fresher",
};

/* ============================================================
   ROLE KEYWORDS
   Helps match related job titles.
============================================================ */

const ROLE_KEYWORDS = {
  "frontend-developer": [
    "frontend",
    "front end",
    "front-end",
    "ui developer",
    "web developer",
    "react developer",
    "javascript developer",
  ],

  "react-developer": [
    "react",
    "react.js",
    "reactjs",
  ],

  "java-developer": [
    "java",
    "java developer",
    "java engineer",
    "spring boot",
  ],

  "python-developer": [
    "python",
    "python developer",
    "django",
    "flask",
    "fastapi",
  ],

  "software-developer": [
    "software developer",
    "software engineer",
    "application developer",
    "developer",
  ],

  "full-stack-developer": [
    "full stack",
    "fullstack",
    "full-stack",
  ],

  "backend-developer": [
    "backend",
    "back end",
    "back-end",
    "backend developer",
    "backend engineer",
    "server-side",
    "node.js",
    "nodejs",
    "express",
    "api developer",
  ],

  "javascript-developer": [
    "javascript",
    "javascript developer",
    "js developer",
    "node.js",
    "nodejs",
  ],

  "fresher-jobs": [
    "fresher",
    "entry level",
    "entry-level",
    "junior",
    "graduate",
    "trainee",
    "intern",
  ],
};

/* ============================================================
   FORMAT SLUG
============================================================ */

function formatSlug(value = "") {
  return value
    .split("-")
    .filter(Boolean)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}

/* ============================================================
   JOB ROLE MATCH
============================================================ */

function matchesRole(job, role) {
  if (!role) return true;

  const text = [
    job.title,
    job.company,
    job.location,
    ...(job.tags || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const keywords = ROLE_KEYWORDS[role];

  if (keywords && keywords.length) {
    return keywords.some((keyword) =>
      text.includes(keyword.toLowerCase())
    );
  }

  const roleName =
    ROLE_MAP[role] || formatSlug(role);

  return text.includes(roleName.toLowerCase());
}

/* ============================================================
   LOCATION MATCH
============================================================ */

function matchesLocation(job, location) {
  if (!location) return true;

  const locationName = formatSlug(location)
    .toLowerCase();

  const jobText = [
    job.location,
    job.title,
    job.company,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return jobText.includes(locationName);
}

/* ============================================================
   COMPONENT
============================================================ */

export default function Jobs() {
  const {
    portal,
    role,
    location: roleLocation,
  } = useParams();

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const navigate = useNavigate();

  const {
    jobs,
    loading,
    error,
    isDemo,
    search,
  } = useJobs();

  /* ==========================================================
     FILTER STATE
  ========================================================== */

  const [days, setDays] = useState(3650);

  const [remoteOnly, setRemoteOnly] =
    useState(false);

  const [jobType, setJobType] = useState([]);

  const [experience, setExperience] =
    useState([]);

  const [category, setCategory] =
    useState("");

  const [keyword, setKeyword] = useState(
    searchParams.get("q") || ""
  );

  /* ==========================================================
     PAGINATION
  ========================================================== */

  const JOBS_PER_PAGE = 10;

  const currentPage = Math.max(
    1,
    Number(searchParams.get("page")) || 1
  );

  /* ==========================================================
     LOCATION
  ========================================================== */

  const whereLoc =
    searchParams.get("where") ||
    "india";

  /* ==========================================================
     PORTAL
  ========================================================== */

  const portalMeta = portals.find(
    (p) => p.slug === portal
  );

  /* ==========================================================
     ROLE NAME
  ========================================================== */

  const roleName = role
    ? ROLE_MAP[role] || formatSlug(role)
    : "";

  const roleLocationName = roleLocation
    ? formatSlug(roleLocation)
    : "";

  /* ==========================================================
     PAGE HEADING
  ========================================================== */

  const heading = portalMeta
    ? portalMeta.name
    : roleName
    ? roleName
    : "All";

  /* ==========================================================
     INITIAL SEARCH
  ========================================================== */

  useEffect(() => {
    const q = searchParams.get("q");

    /*
      If this is a role landing URL:

      /jobs/backend-developer

      Search the backend role directly instead of
      first loading generic "jobs".
    */

    if (role) {
      search({
        what: roleName,
        where:
          roleLocationName ||
          whereLoc,
      });
    }

    /*
      Portal page:

      /jobs/source/linkedin
    */

    else if (
      portalMeta &&
      portalMeta.query &&
      portalMeta.query.what
    ) {
      search({
        what: portalMeta.query.what,
        where: whereLoc,
      });
    }

    /*
      Search query:

      /jobs?q=react
    */

    else if (q) {
      search({
        what: q,
        where: whereLoc,
      });
    }

    /*
      Normal Jobs page.
    */

    else {
      search({
        what: "jobs",
        where: whereLoc,
      });
    }

    setCategory("");

    setKeyword(q || (role ? roleName : ""));

    const nextParams =
      new URLSearchParams(searchParams);

    nextParams.set("page", "1");

    setSearchParams(nextParams, {
      replace: true,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portal, role, roleLocation]);

  /* ==========================================================
     CATEGORY SEARCH
  ========================================================== */

  useEffect(() => {
    if (category !== "") {
      search({
        what: category,
        where: whereLoc,
      });

      const nextParams =
        new URLSearchParams(searchParams);

      nextParams.set("page", "1");

      setSearchParams(nextParams, {
        replace: true,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  /* ==========================================================
     FILTER JOBS
  ========================================================== */

  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      /* --------------------------------------------
         DATE FILTER
      -------------------------------------------- */

      if (
        job.postedDaysAgo != null &&
        job.postedDaysAgo > days
      ) {
        return false;
      }

      /* --------------------------------------------
         REMOTE FILTER
      -------------------------------------------- */

      if (
        remoteOnly &&
        !job.remote
      ) {
        return false;
      }

      /* --------------------------------------------
         JOB TYPE FILTER
      -------------------------------------------- */

      if (
        jobType.length &&
        !jobType.includes(job.type)
      ) {
        return false;
      }

      /* --------------------------------------------
         EXPERIENCE FILTER
      -------------------------------------------- */

      if (
        experience.length &&
        job.experienceBucket &&
        job.experienceBucket !== "unknown" &&
        !experience.includes(
          job.experienceBucket
        )
      ) {
        return false;
      }

      /* --------------------------------------------
         KEYWORD FILTER
      -------------------------------------------- */

      if (keyword && !role) {
        const searchText = (
          (job.title || "") +
          " " +
          (job.company || "") +
          " " +
          (job.location || "") +
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

      /* --------------------------------------------
         ROLE FILTER
      -------------------------------------------- */

      if (
        role &&
        !matchesRole(job, role)
      ) {
        return false;
      }

      /* --------------------------------------------
         LOCATION FILTER
      -------------------------------------------- */

      if (
        roleLocation &&
        !matchesLocation(
          job,
          roleLocation
        )
      ) {
        return false;
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
    role,
    roleLocation,
  ]);

  /* ==========================================================
     PAGINATION CALCULATION
  ========================================================== */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filtered.length /
        JOBS_PER_PAGE
    )
  );

  const safePage = Math.min(
    currentPage,
    totalPages
  );

  const startIndex =
    (safePage - 1) *
    JOBS_PER_PAGE;

  const endIndex =
    startIndex +
    JOBS_PER_PAGE;

  const paginatedJobs =
    filtered.slice(
      startIndex,
      endIndex
    );

  /* ==========================================================
     PAGE CHANGE
  ========================================================== */

  function goToPage(page) {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    const nextParams =
      new URLSearchParams(
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

  /* ==========================================================
     SEARCH
  ========================================================== */

  function handleSearchSubmit() {
    setCategory("");

    search({
      what:
        keyword ||
        "jobs",
      where: whereLoc,
    });

    const nextParams =
      new URLSearchParams(
        searchParams
      );

    if (keyword) {
      nextParams.set(
        "q",
        keyword
      );
    } else {
      nextParams.delete("q");
    }

    nextParams.set(
      "page",
      "1"
    );

    setSearchParams(
      nextParams
    );
  }

  /* ==========================================================
     ACTIVE FILTER COUNT
  ========================================================== */

  const activeFilterCount =
    (days < 30 ? 1 : 0) +
    (remoteOnly ? 1 : 0) +
    jobType.length +
    experience.length +
    (category ? 1 : 0);

  /* ==========================================================
     SEO
  ========================================================== */

  const seoTitle = role
    ? roleLocationName
      ? `${roleName} Jobs in ${roleLocationName} | JobXPortal`
      : `${roleName} Jobs | JobXPortal`
    : heading === "All"
    ? "Find Jobs in India — Latest Jobs & Career Opportunities | JobXPortal"
    : `${heading} Jobs — Latest Career Opportunities | JobXPortal`;

  const seoDescription = role
    ? roleLocationName
      ? `Find the latest ${roleName} jobs in ${roleLocationName}. Search, filter and explore relevant opportunities on JobXPortal.`
      : `Find the latest ${roleName} jobs on JobXPortal. Search, filter and explore relevant opportunities from multiple sources.`
    : heading === "All"
    ? "Search the latest jobs in India across multiple job sources and company career pages. Find IT, software, fresher, remote and other career opportunities on JobXPortal."
    : `Find the latest ${heading} jobs and career opportunities on JobXPortal. Search, filter and explore job openings from multiple sources.`;

  const seoPath = role
    ? `/jobs/${role}${
        roleLocation
          ? `/${roleLocation}`
          : ""
      }`
    : "/jobs";

  /* ==========================================================
     PAGE NUMBERS
  ========================================================== */

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

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        path={seoPath}
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
          {/* ==================================================
              BACK
          ================================================== */}

          <button
            onClick={() =>
              navigate(-1)
            }
            style={{
              display:
                "inline-flex",
              alignItems:
                "center",
              gap: 8,
              fontFamily:
                "JetBrains Mono",
              fontSize: 12,
              color: "#64748B",
              background:
                "transparent",
              border: "none",
              cursor: "pointer",
              marginBottom: 22,
              letterSpacing:
                "0.08em",
            }}
          >
            <ArrowLeft
              size={14}
            />
            Back
          </button>

          {/* ==================================================
              BREADCRUMB
          ================================================== */}

          <div
            style={{
              display:
                "flex",
              alignItems:
                "center",
              gap: 8,
              fontFamily:
                "JetBrains Mono",
              fontSize: 11,
              letterSpacing:
                "0.1em",
              color: "#64748B",
              marginBottom: 8,
              textTransform:
                "uppercase",
              flexWrap: "wrap",
            }}
          >
            <Link
              to="/"
              style={{
                color: "#64748B",
                textDecoration:
                  "none",
              }}
            >
              HOME
            </Link>

            <span>/</span>

            <Link
              to="/jobs"
              style={{
                color: "#64748B",
                textDecoration:
                  "none",
              }}
            >
              JOBS
            </Link>

            <span>/</span>

            <span
              style={{
                color: "#4F46E5",
              }}
            >
              {heading}
            </span>

            {(roleLocationName ||
              !role) && (
              <>
                <span>/</span>

                <span
                  style={{
                    color: "#4F46E5",
                  }}
                >
                  {roleLocationName ||
                    whereLoc.toUpperCase()}
                </span>
              </>
            )}
          </div>

          {/* ==================================================
              HEADING
          ================================================== */}

          <h1
            style={{
              fontFamily:
                "Poppins, sans-serif",
              fontSize:
                "clamp(1.9rem, 4vw, 2.8rem)",
              fontWeight: 800,
              letterSpacing:
                "-0.035em",
              margin:
                "0 0 6px",
              color: "#0B132B",
            }}
          >
            {heading} Jobs
            {roleLocationName
              ? ` in ${roleLocationName}`
              : ""}
          </h1>

          {/* ==================================================
              RESULT COUNT
          ================================================== */}

          {!loading && (
            <p
              style={{
                color: "#64748B",
                fontSize: 13,
                marginBottom: 20,
                fontFamily:
                  "JetBrains Mono",
              }}
            >
              Showing{" "}
              <span
                style={{
                  color: "#4F46E5",
                }}
              >
                {filtered.length ===
                0
                  ? 0
                  : startIndex + 1}
                –
                {Math.min(
                  endIndex,
                  filtered.length
                )}
              </span>{" "}
              of{" "}
              <span
                style={{
                  color: "#4F46E5",
                }}
              >
                {filtered.length}
              </span>{" "}
              jobs
              {activeFilterCount >
                0 && (
                <span
                  style={{
                    color: "#10B981",
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
            </p>
          )}

          {/* ==================================================
              SEARCH
          ================================================== */}

          <div
            className="jobs-search-row"
            style={{
              display:
                "flex",
              gap: 10,
              marginBottom: 24,
              maxWidth: 600,
            }}
          >
            <div
              style={{
                flex: 1,
              }}
            >
              <SearchBar
                keyword={
                  keyword
                }
                setKeyword={
                  setKeyword
                }
              />
            </div>

            <button
              onClick={
                handleSearchSubmit
              }
              style={{
                padding:
                  "0 20px",
                background:
                  "#4F46E5",
                color:
                  "#FFFFFF",
                border: "none",
                borderRadius: 12,
                cursor:
                  "pointer",
                fontFamily:
                  "Poppins",
                fontSize: 13,
                fontWeight: 700,
                flexShrink: 0,
                boxShadow:
                  "0 7px 18px rgba(79,70,229,0.14)",
              }}
            >
              Search
            </button>
          </div>

          {/* ==================================================
              DEMO
          ================================================== */}

          {isDemo && (
            <DemoBanner
              message={error}
            />
          )}

          {/* ==================================================
              MAIN LAYOUT
          ================================================== */}

          <div
            className="jobs-layout"
            style={{
              display:
                "grid",
              gridTemplateColumns:
                "280px 1fr",
              gap: 24,
              alignItems:
                "start",
            }}
          >
            {/* ==================================================
                SIDEBAR
            ================================================== */}

            <div
              className="sidebar-wrapper"
              style={{
                position:
                  "sticky",
                top: 80,
                height:
                  "fit-content",
                alignSelf:
                  "start",
                zIndex: 10,
              }}
            >
              <FilterSidebar
                days={days}
                setDays={
                  setDays
                }
                remoteOnly={
                  remoteOnly
                }
                setRemoteOnly={
                  setRemoteOnly
                }
                jobType={
                  jobType
                }
                setJobType={
                  setJobType
                }
                experience={
                  experience
                }
                setExperience={
                  setExperience
                }
                category={
                  category
                }
                setCategory={
                  setCategory
                }
              />
            </div>

            {/* ==================================================
                JOB LIST
            ================================================== */}

            <div
              style={{
                display:
                  "flex",
                flexDirection:
                  "column",
                gap: 12,
              }}
            >
              {loading ? (
                <JobsLoading />
              ) : paginatedJobs.length ===
                0 ? (
                /* ============================================
                   NO RESULTS
                ============================================ */

                <div
                  style={{
                    background:
                      "#FFFFFF",
                    border:
                      "1px solid #E2E6F0",
                    borderRadius: 16,
                    padding:
                      "48px 24px",
                    textAlign:
                      "center",
                    boxShadow:
                      "0 4px 18px rgba(15,23,42,0.035)",
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      margin:
                        "0 auto 14px",
                      borderRadius: 14,
                      background:
                        "#EEF2FF",
                      display:
                        "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      color:
                        "#4F46E5",
                      fontSize: 22,
                    }}
                  >
                    💼
                  </div>

                  <p
                    style={{
                      color:
                        "#0B132B",
                      marginBottom: 8,
                      fontFamily:
                        "Poppins",
                      fontWeight:
                        700,
                      fontSize: 15,
                    }}
                  >
                    No jobs match
                    your filters.
                  </p>

                  <p
                    style={{
                      color:
                        "#64748B",
                      fontSize: 13,
                      fontFamily:
                        "JetBrains Mono",
                      marginBottom: 18,
                    }}
                  >
                    Try a different
                    category or
                    clear your
                    filters.
                  </p>

                  {role && (
                    <Link
                      to="/jobs"
                      style={{
                        display:
                          "inline-flex",
                        alignItems:
                          "center",
                        padding:
                          "10px 17px",
                        borderRadius:
                          9,
                        background:
                          "#4F46E5",
                        color:
                          "#FFFFFF",
                        textDecoration:
                          "none",
                        fontFamily:
                          "Poppins",
                        fontSize: 12,
                        fontWeight:
                          700,
                      }}
                    >
                      Browse All Jobs
                    </Link>
                  )}
                </div>
              ) : (
                <>
                  {/* ==========================================
                      JOB CARDS
                  ========================================== */}

                  {paginatedJobs.map(
                    (job) => (
                      <JobCard
                        key={
                          job.id
                        }
                        job={
                          job
                        }
                      />
                    )
                  )}

                  {/* ==========================================
                      PAGINATION
                  ========================================== */}

                  {totalPages >
                    1 && (
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
                        marginTop: 24,
                        paddingTop: 16,
                      }}
                    >
                      {/* PREVIOUS */}

                      <button
                        onClick={() =>
                          goToPage(
                            safePage -
                              1
                          )
                        }
                        disabled={
                          safePage ===
                          1
                        }
                        style={{
                          padding:
                            "10px 16px",
                          background:
                            "#FFFFFF",
                          border:
                            "1px solid #E2E6F0",
                          borderRadius:
                            10,
                          color:
                            "#0B132B",
                          cursor:
                            safePage ===
                            1
                              ? "not-allowed"
                              : "pointer",
                          opacity:
                            safePage ===
                            1
                              ? 0.4
                              : 1,
                          fontFamily:
                            "Poppins",
                          fontSize: 13,
                          fontWeight:
                            600,
                        }}
                      >
                        ← Previous
                      </button>

                      {/* PAGE NUMBERS */}

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
                                    "#64748B",
                                  padding:
                                    "0 4px",
                                }}
                              >
                                ...
                              </span>
                            );
                          }

                          return (
                            <button
                              key={
                                page
                              }
                              onClick={() =>
                                goToPage(
                                  page
                                )
                              }
                              style={{
                                minWidth: 40,
                                height: 40,
                                padding:
                                  "0 10px",
                                background:
                                  page ===
                                  safePage
                                    ? "#4F46E5"
                                    : "#FFFFFF",
                                color:
                                  page ===
                                  safePage
                                    ? "#FFFFFF"
                                    : "#0B132B",
                                border:
                                  `1px solid ${
                                    page ===
                                    safePage
                                      ? "#4F46E5"
                                      : "#E2E6F0"
                                  }`,
                                borderRadius:
                                  10,
                                cursor:
                                  "pointer",
                                fontFamily:
                                  "Poppins",
                                fontSize: 13,
                                fontWeight:
                                  700,
                              }}
                            >
                              {page}
                            </button>
                          );
                        }
                      )}

                      {/* NEXT */}

                      <button
                        onClick={() =>
                          goToPage(
                            safePage +
                              1
                          )
                        }
                        disabled={
                          safePage ===
                          totalPages
                        }
                        style={{
                          padding:
                            "10px 16px",
                          background:
                            "#FFFFFF",
                          border:
                            "1px solid #E2E6F0",
                          borderRadius:
                            10,
                          color:
                            "#0B132B",
                          cursor:
                            safePage ===
                            totalPages
                              ? "not-allowed"
                              : "pointer",
                          opacity:
                            safePage ===
                            totalPages
                              ? 0.4
                              : 1,
                          fontFamily:
                            "Poppins",
                          fontSize: 13,
                          fontWeight:
                            600,
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

      {/* ========================================================
          RESPONSIVE
      ======================================================== */}

      <style>{`
        @media (max-width: 768px) {
          .jobs-layout {
            grid-template-columns: 1fr !important;
          }

          .sidebar-wrapper {
            position: static !important;
          }

          .pagination {
            gap: 6px !important;
          }

          .pagination button {
            font-size: 12px !important;
          }
        }

        @media (max-width: 560px) {
          .jobs-search-row {
            max-width: 100% !important;
          }
        }

        @media (max-width: 480px) {
          .jobs-search-row {
            flex-direction: column !important;
          }

          .jobs-search-row button {
            min-height: 44px;
          }
        }
      `}</style>
    </>
  );
}