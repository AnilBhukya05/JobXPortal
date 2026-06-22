import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { fetchJSearchJobs } from "../services/jsearchApi";
import { fetchJobs as fetchAdzunaJobs } from "../services/jobsApi";
import { jobs as demoJobs } from "../data/jobs";

const JobsContext = createContext(null);
const REFRESH_INTERVAL = 5 * 60 * 1000;
const ADZUNA_RESULTS_PER_PAGE = 20;
const MAX_PAGES = 5;
const FULL_PAGE_THRESHOLD = 5;

export function JobsProvider({ children }) {
  const [jobs, setJobs] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [isDemo, setIsDemo] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  const lastQueryRef = useRef({ what: "software developer", where: "india" });
  const pageRef = useRef(1);
  const providerRef = useRef("jsearch");

  const search = useCallback(async (query) => {
    setLoading(true);
    setError("");
    const merged = Object.assign({ what: "software developer", where: "india" }, query || {});
    lastQueryRef.current = merged;
    pageRef.current = 1;

    // 1) Try JSearch first (primary - real multi-portal data)
    try {
      const result = await fetchJSearchJobs(Object.assign({}, merged, { page: 1 }));
      providerRef.current = "jsearch";
      setJobs(result.jobs);
      setTotalCount(result.count);
      setHasMore(result.jobs.length >= FULL_PAGE_THRESHOLD);
      setIsDemo(false);
      setLastUpdated(new Date());
      setLoading(false);
      return;
    } catch (jsearchErr) {
      // fall through to Adzuna
    }

    // 2) Try Adzuna as backup
    try {
      const result = await fetchAdzunaJobs(
        Object.assign({}, merged, { page: 1, resultsPerPage: ADZUNA_RESULTS_PER_PAGE })
      );
      providerRef.current = "adzuna";
      setJobs(result.jobs);
      setTotalCount(result.count);
      setHasMore(result.jobs.length >= FULL_PAGE_THRESHOLD);
      setIsDemo(false);
      setLastUpdated(new Date());
      setLoading(false);
      return;
    } catch (adzunaErr) {
      // 3) Fall back to local demo data
      providerRef.current = "demo";
      const keyword = (merged.what || "").toLowerCase();
      const filtered = keyword
        ? demoJobs.filter((job) =>
            (job.title + " " + job.company + " " + job.tags.join(" "))
              .toLowerCase()
              .includes(keyword)
          )
        : demoJobs;

      const finalFallback = (filtered.length ? filtered : demoJobs).map((job) =>
        Object.assign({}, job, { source: job.source || "Demo Listing" })
      );

      setJobs(finalFallback);
      setTotalCount(finalFallback.length);
      setHasMore(false);
      setIsDemo(true);
      setError(adzunaErr.message || "Could not reach any live job feed.");
      setLastUpdated(new Date());
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (loadingMore || isDemo || !hasMore) return;
    if (pageRef.current >= MAX_PAGES) {
      setHasMore(false);
      return;
    }

    setLoadingMore(true);
    const nextPage = pageRef.current + 1;

    try {
      let result;
      if (providerRef.current === "jsearch") {
        result = await fetchJSearchJobs(
          Object.assign({}, lastQueryRef.current, { page: nextPage })
        );
      } else {
        result = await fetchAdzunaJobs(
          Object.assign({}, lastQueryRef.current, {
            page: nextPage,
            resultsPerPage: ADZUNA_RESULTS_PER_PAGE,
          })
        );
      }

      pageRef.current = nextPage;
      setJobs((prev) => prev.concat(result.jobs));
      setHasMore(result.jobs.length >= FULL_PAGE_THRESHOLD && nextPage < MAX_PAGES);
    } catch (err) {
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, isDemo, hasMore]);

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
      value={{
        jobs,
        totalCount,
        loading,
        loadingMore,
        error,
        isDemo,
        lastUpdated,
        hasMore,
        search,
        refresh,
        loadMore,
        getJobById,
        provider: providerRef.current,
      }}
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