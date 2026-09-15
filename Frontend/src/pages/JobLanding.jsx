import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Briefcase, Search, MapPin, Sparkles } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobCard from "../components/JobCard";
import SEO from "../components/SEO";
import { useJobs } from "../context/JobsContext";

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

function formatLocation(value = "") {
  return value
    .split("-")
    .filter(Boolean)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}

export default function JobLanding() {
  const { role, location } = useParams();
  const { jobs, loading } = useJobs();

  const roleName =
    ROLE_MAP[role] || formatLocation(role);

  const locationName = location
    ? formatLocation(location)
    : "";

  const filteredJobs = jobs.filter((job) => {
    const text = [
      job.title,
      job.company,
      job.location,
      ...(job.tags || []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const roleMatch =
      role === "fresher-jobs"
        ? text.includes("fresher") ||
          text.includes("entry level") ||
          text.includes("entry-level") ||
          text.includes("junior") ||
          text.includes("intern")
        : text.includes(roleName.toLowerCase());

    const locationMatch = locationName
      ? text.includes(locationName.toLowerCase())
      : true;

    return roleMatch && locationMatch;
  });

  const title = locationName
    ? `${roleName} Jobs in ${locationName} | JobXPortal`
    : `${roleName} Jobs | JobXPortal`;

  const description = locationName
    ? `Find the latest ${roleName} jobs in ${locationName}. Search jobs, compare opportunities, and apply through JobXPortal.`
    : `Find the latest ${roleName} jobs on JobXPortal. Search and apply for relevant opportunities from multiple job sources.`;

  return (
    <>
      <SEO
        title={title}
        description={description}
        path={`/jobs/${role}${location ? `/${location}` : ""}`}
      />

      <Navbar />

      <main
        style={{
          minHeight: "100vh",
          background: "#F8FAFF",
          color: "#0B132B",
        }}
      >
        {/* HERO */}
        <section
          style={{
            background:
              "linear-gradient(135deg, #EEF2FF 0%, #F8FAFF 55%, #F5F3FF 100%)",
            borderBottom: "1px solid #E2E6F0",
            padding: "56px 24px 52px",
          }}
        >
          <div
            style={{
              maxWidth: 1180,
              margin: "0 auto",
            }}
          >
            {/* Breadcrumb */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 28,
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 11,
                color: "#64748B",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                flexWrap: "wrap",
              }}
            >
              <Link
                to="/"
                style={{
                  color: "#64748B",
                  textDecoration: "none",
                }}
              >
                HOME
              </Link>

              <span>/</span>

              <Link
                to="/jobs"
                style={{
                  color: "#64748B",
                  textDecoration: "none",
                }}
              >
                JOBS
              </Link>

              <span>/</span>

              <span style={{ color: "#4F46E5" }}>
                {roleName}
              </span>

              {locationName && (
                <>
                  <span>/</span>
                  <span style={{ color: "#4F46E5" }}>
                    {locationName}
                  </span>
                </>
              )}
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "7px 12px",
                borderRadius: 999,
                background: "#FFFFFF",
                border: "1px solid #DDE3F0",
                color: "#4F46E5",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 11,
                fontWeight: 700,
                marginBottom: 18,
              }}
            >
              <Briefcase size={14} />
              JOBXPORTAL JOBS
            </div>

            <h1
              style={{
                margin: 0,
                fontFamily: "Poppins, sans-serif",
                fontSize: "clamp(2rem, 5vw, 3.6rem)",
                lineHeight: 1.08,
                fontWeight: 800,
                letterSpacing: "-0.04em",
                color: "#0B132B",
                maxWidth: 850,
              }}
            >
              {roleName} Jobs
              {locationName
                ? ` in ${locationName}`
                : ""}
            </h1>

            <p
              style={{
                marginTop: 18,
                marginBottom: 0,
                maxWidth: 720,
                fontFamily: "Poppins, sans-serif",
                fontSize: 16,
                lineHeight: 1.7,
                color: "#64748B",
              }}
            >
              Discover the latest{" "}
              {roleName.toLowerCase()} opportunities
              {locationName
                ? ` in ${locationName}`
                : ""}{" "}
              from multiple sources.
            </p>

            {/* Search-style CTA */}
            <div
              style={{
                marginTop: 30,
                display: "flex",
                alignItems: "center",
                gap: 12,
                maxWidth: 650,
                flexWrap: "wrap",
              }}
            >
              <Link
                to="/jobs"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "13px 20px",
                  borderRadius: 11,
                  background:
                    "linear-gradient(135deg, #4F46E5, #7138E8)",
                  color: "#FFFFFF",
                  textDecoration: "none",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  boxShadow:
                    "0 10px 25px rgba(79,70,229,0.18)",
                }}
              >
                <Search size={16} />
                Search All Jobs
              </Link>

              {locationName && (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "12px 16px",
                    borderRadius: 11,
                    background: "#FFFFFF",
                    border: "1px solid #E2E6F0",
                    color: "#475569",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 13,
                  }}
                >
                  <MapPin
                    size={15}
                    color="#4F46E5"
                  />
                  {locationName}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <section
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            padding: "42px 24px 70px",
          }}
        >
          {/* Heading */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 20,
              marginBottom: 26,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <Sparkles
                  size={17}
                  color="#4F46E5"
                />

                <span
                  style={{
                    fontFamily:
                      "JetBrains Mono, monospace",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: "#4F46E5",
                    textTransform: "uppercase",
                  }}
                >
                  Latest Opportunities
                </span>
              </div>

              <h2
                style={{
                  margin: 0,
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                  fontWeight: 800,
                  color: "#0B132B",
                  letterSpacing: "-0.025em",
                }}
              >
                {roleName} Jobs
                {locationName
                  ? ` in ${locationName}`
                  : ""}
              </h2>

              <p
                style={{
                  marginTop: 7,
                  marginBottom: 0,
                  fontFamily:
                    "JetBrains Mono, monospace",
                  fontSize: 12,
                  color: "#64748B",
                }}
              >
                {filteredJobs.length} job
                {filteredJobs.length === 1
                  ? ""
                  : "s"}{" "}
                found
              </p>
            </div>

            <Link
              to="/jobs"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "11px 16px",
                borderRadius: 10,
                background: "#FFFFFF",
                border: "1px solid #DDE3F0",
                color: "#4F46E5",
                textDecoration: "none",
                fontFamily:
                  "Poppins, sans-serif",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              View All Jobs →
            </Link>
          </div>

          {/* Loading */}
          {loading ? (
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E6F0",
                borderRadius: 16,
                padding: "60px 24px",
                textAlign: "center",
                boxShadow:
                  "0 8px 30px rgba(15,23,42,0.04)",
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  border:
                    "3px solid #E2E6F0",
                  borderTopColor: "#4F46E5",
                  margin: "0 auto 16px",
                  animation:
                    "jobxportal-spin 0.8s linear infinite",
                }}
              />

              <p
                style={{
                  margin: 0,
                  color: "#64748B",
                  fontFamily:
                    "Poppins, sans-serif",
                  fontSize: 14,
                }}
              >
                Loading jobs...
              </p>
            </div>
          ) : filteredJobs.length === 0 ? (
            /* EMPTY */
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E6F0",
                borderRadius: 18,
                padding: "64px 24px",
                textAlign: "center",
                boxShadow:
                  "0 8px 30px rgba(15,23,42,0.04)",
              }}
            >
              <div
                style={{
                  width: 58,
                  height: 58,
                  margin: "0 auto 18px",
                  borderRadius: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#EEF2FF",
                  color: "#4F46E5",
                }}
              >
                <Briefcase size={27} />
              </div>

              <h3
                style={{
                  margin: "0 0 9px",
                  fontFamily:
                    "Poppins, sans-serif",
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#0B132B",
                }}
              >
                No matching jobs found
              </h3>

              <p
                style={{
                  maxWidth: 520,
                  margin: "0 auto 24px",
                  color: "#64748B",
                  fontFamily:
                    "Poppins, sans-serif",
                  fontSize: 14,
                  lineHeight: 1.7,
                }}
              >
                Try browsing all available jobs or
                searching for another role or
                location.
              </p>

              <Link
                to="/jobs"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "12px 20px",
                  borderRadius: 10,
                  background:
                    "linear-gradient(135deg, #4F46E5, #7138E8)",
                  color: "#FFFFFF",
                  textDecoration: "none",
                  fontFamily:
                    "Poppins, sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                Browse All Jobs
              </Link>
            </div>
          ) : (
            /* JOBS */
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              {filteredJobs
                .slice(0, 30)
                .map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                  />
                ))}
            </div>
          )}
        </section>
      </main>

      <Footer />

      <style>{`
        @keyframes jobxportal-spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}