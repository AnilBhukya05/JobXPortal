import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { fetchJobs } from "../services/jobsApi";
import { jobs as demoJobs } from "../data/jobs";

const JobsContext = createContext(null);
const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function JobsProvider({ children }) {
  const [jobs, setJobs] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDemo, setIsDemo] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const lastQueryRef = useRef({ what: "software developer", where: "india" });

  const search = useCallback(async (query) => {
    setLoading(true);
    setError("");
    const merged = Object.assign({ what: "software developer", where: "india" }, query || {});
    lastQueryRef.current = merged;

    try {
      const result = await fetchJobs(merged);
      setJobs(result.jobs);
      setTotalCount(result.count);
      setIsDemo(false);
      setLastUpdated(new Date());
    } catch (err) {
      const keyword = (merged.what || "").toLowerCase();
      const fallback = keyword
        ? demoJobs.filter((job) =>
            (job.title + " " + job.company + " " + job.tags.join(" "))
              .toLowerCase()
              .includes(keyword)
          )
        : demoJobs;

      const finalFallback = fallback.length ? fallback : demoJobs;
      setJobs(finalFallback);
      setTotalCount(finalFallback.length);
      setIsDemo(true);
      setError(err.message || "Could not reach the live job feed.");
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(() => {
    search(lastQueryRef.current);
  }, [search]);

  useEffect(() => {
    search();
  }, [search]);

  useEffect(() => {
    const interval = setInterval(() => {
      search(lastQueryRef.current);
    }, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [search]);

  function getJobById(id) {
    return jobs.find((job) => String(job.id) === String(id));
  }

  return (
    <JobsContext.Provider
      value={{ jobs, totalCount, loading, error, isDemo, lastUpdated, search, refresh, getJobById }}
    >
      {children}
    </JobsContext.Provider>
  );
}

export function useJobs() {
  const ctx = useContext(JobsContext);
  if (!ctx) throw new Error("useJobs must be used inside a JobsProvider");
  return ctx;
}