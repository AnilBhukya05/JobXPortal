import { Link, useParams } from "react-router-dom";
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

function formatLocation(value) {
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function JobLanding() {
  const { role, location } = useParams();
  const { jobs, loading } = useJobs();

  const roleName = ROLE_MAP[role] || formatLocation(role);
  const locationName = location ? formatLocation(location) : "";

  const searchText = `${roleName} ${locationName}`.toLowerCase();

  const filteredJobs = jobs.filter((job) => {
    const text = [job.title, job.company, job.location, ...(job.tags || [])]
      .join(" ")
      .toLowerCase();

    const roleMatch =
      role === "fresher-jobs"
        ? text.includes("fresher") ||
          text.includes("entry level") ||
          text.includes("entry-level") ||
          text.includes("junior")
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
        path={`/jobs/${role}/${location || ""}`}
      />

      <Navbar />

      <main className="jobs-page">
        <section className="jobs-hero">
          <div className="container">
            <p className="eyebrow">JobXPortal Jobs</p>

            <h1>
              {roleName} Jobs
              {locationName ? ` in ${locationName}` : ""}
            </h1>

            <p>
              Discover the latest {roleName.toLowerCase()} opportunities
              {locationName ? ` in ${locationName}` : ""} from multiple sources.
            </p>
          </div>
        </section>

        <section className="container jobs-content">
          <div className="jobs-heading">
            <div>
              <h2>
                {roleName} Jobs
                {locationName ? ` in ${locationName}` : ""}
              </h2>

              <p>
                {filteredJobs.length} job
                {filteredJobs.length === 1 ? "" : "s"} found
              </p>
            </div>

            <Link to="/jobs">View All Jobs</Link>
          </div>

          {loading ? (
            <div className="jobs-loading">Loading jobs...</div>
          ) : filteredJobs.length === 0 ? (
            <div className="jobs-empty">
              <h3>No matching jobs found</h3>

              <p>
                Try browsing all available jobs or searching for another role or
                location.
              </p>

              <Link to="/jobs">Browse All Jobs</Link>
            </div>
          ) : (
            <div className="jobs-grid">
              {filteredJobs.slice(0, 30).map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
