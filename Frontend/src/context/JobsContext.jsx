import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { fetchJSearchJobs } from "../services/jsearchApi";
import { fetchJobs as fetchAdzunaJobs } from "../services/jobsApi";
import { fetchPublicJobsApi } from "../services/employerJobsService";
import { jobs as demoJobs } from "../data/jobs";

const JobsContext = createContext(null);

const REFRESH_INTERVAL = 5 * 60 * 1000;
const ADZUNA_RESULTS_PER_PAGE = 20;
const MAX_PAGES = 5;

export function JobsProvider({ children }) {
  const [jobs, setJobs] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [isDemo, setIsDemo] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  const lastQueryRef = useRef({
    what: "software developer",
    where: "india",
  });

  const pageRef = useRef(1);
  const providerRef = useRef("jsearch");
  const searchIdRef = useRef(0);

  // Remove duplicate jobs
  const mergeUniqueJobs = useCallback((jobArrays) => {
    const map = new Map();

    jobArrays.flat().forEach((job) => {
      if (!job) return;

      const key =
        job.id ||
        `${job.title || ""}-${job.company || ""}-${job.location || ""}`;

      if (!map.has(String(key))) {
        map.set(String(key), job);
      }
    });

    return Array.from(map.values());
  }, []);

  // Search jobs from available sources
  const search = useCallback(
    async (query) => {
      const currentSearchId = ++searchIdRef.current;

      setLoading(true);
      setError("");

      const merged = Object.assign(
        {
          what: "jobs",
          where: "india",
        },
        query || {},
      );

      lastQueryRef.current = merged;
      pageRef.current = 1;

      // Fetch employer-posted jobs
      const employerJobsPromise = fetchPublicJobsApi({
        what: merged.what,
        where: merged.where,
      }).catch(() => ({
        jobs: [],
        count: 0,
      }));

      // Try JSearch first
      try {
        const [firstResult, employerResult] = await Promise.all([
          fetchJSearchJobs({
            ...merged,
            page: 1,
          }),
          employerJobsPromise,
        ]);

        if (currentSearchId !== searchIdRef.current) {
          return;
        }

        providerRef.current = "jsearch";

        const allLiveJobs = [];

        if (firstResult && Array.isArray(firstResult.jobs)) {
          allLiveJobs.push(firstResult.jobs);
        }

        const resultCount = Number(firstResult.count) || 0;

        const resultsPerPage = firstResult?.jobs?.length || 20;

        let pagesNeeded = Math.ceil(resultCount / resultsPerPage);

        pagesNeeded = Math.max(1, pagesNeeded);
        pagesNeeded = Math.min(pagesNeeded, MAX_PAGES);

        // Fetch remaining JSearch pages
        for (let page = 2; page <= pagesNeeded; page++) {
          if (currentSearchId !== searchIdRef.current) {
            return;
          }

          try {
            const result = await fetchJSearchJobs({
              ...merged,
              page,
            });

            if (result && Array.isArray(result.jobs)) {
              allLiveJobs.push(result.jobs);

              if (result.jobs.length < resultsPerPage) {
                break;
              }
            } else {
              break;
            }
          } catch (pageError) {
            console.warn(`JSearch page ${page} failed:`, pageError);
            break;
          }
        }

        const combined = mergeUniqueJobs([
          employerResult.jobs || [],
          ...allLiveJobs,
        ]);

        setJobs(combined);

        setTotalCount(resultCount + (employerResult.jobs || []).length);

        setHasMore(false);
        setIsDemo(false);
        setLastUpdated(new Date());
        setLoading(false);

        return;
      } catch (jsearchErr) {
        console.warn("JSearch failed:", jsearchErr);
      }

      // Try Adzuna as backup
      try {
        const [firstResult, employerResult] = await Promise.all([
          fetchAdzunaJobs({
            ...merged,
            page: 1,
            resultsPerPage: ADZUNA_RESULTS_PER_PAGE,
          }),
          employerJobsPromise,
        ]);

        if (currentSearchId !== searchIdRef.current) {
          return;
        }

        providerRef.current = "adzuna";

        const allLiveJobs = [];

        if (firstResult && Array.isArray(firstResult.jobs)) {
          allLiveJobs.push(firstResult.jobs);
        }

        const resultCount = Number(firstResult.count) || 0;

        let pagesNeeded = Math.ceil(resultCount / ADZUNA_RESULTS_PER_PAGE);

        pagesNeeded = Math.max(1, pagesNeeded);
        pagesNeeded = Math.min(pagesNeeded, MAX_PAGES);

        // Fetch remaining Adzuna pages
        for (let page = 2; page <= pagesNeeded; page++) {
          if (currentSearchId !== searchIdRef.current) {
            return;
          }

          try {
            const result = await fetchAdzunaJobs({
              ...merged,
              page,
              resultsPerPage: ADZUNA_RESULTS_PER_PAGE,
            });

            if (result && Array.isArray(result.jobs)) {
              allLiveJobs.push(result.jobs);

              if (result.jobs.length < ADZUNA_RESULTS_PER_PAGE) {
                break;
              }
            } else {
              break;
            }
          } catch (pageError) {
            console.warn(`Adzuna page ${page} failed:`, pageError);
            break;
          }
        }

        const combined = mergeUniqueJobs([
          employerResult.jobs || [],
          ...allLiveJobs,
        ]);

        setJobs(combined);

        setTotalCount(resultCount + (employerResult.jobs || []).length);

        setHasMore(false);
        setIsDemo(false);
        setLastUpdated(new Date());
        setLoading(false);

        return;
      } catch (adzunaErr) {
        console.warn("Adzuna failed:", adzunaErr);
      }

      // Use demo jobs if live APIs fail
      try {
        const employerResult = await employerJobsPromise;

        if (currentSearchId !== searchIdRef.current) {
          return;
        }

        providerRef.current = "demo";

        const keyword = (merged.what || "").toLowerCase();

        const filtered = keyword
          ? demoJobs.filter((job) =>
              (
                (job.title || "") +
                " " +
                (job.company || "") +
                " " +
                (job.tags || []).join(" ")
              )
                .toLowerCase()
                .includes(keyword),
            )
          : demoJobs;

        const finalFallback = (filtered.length ? filtered : demoJobs).map(
          (job) => ({
            ...job,
            source: job.source || "Demo Listing",
          }),
        );

        const combined = mergeUniqueJobs([
          employerResult.jobs || [],
          finalFallback,
        ]);

        setJobs(combined);
        setTotalCount(combined.length);
        setHasMore(false);
        setIsDemo(true);

        setError(
          "Could not reach any live job feed. Showing available listings.",
        );

        setLastUpdated(new Date());
        setLoading(false);
      } catch {
        setJobs([]);
        setTotalCount(0);
        setHasMore(false);
        setIsDemo(true);
        setError("Could not load jobs.");
        setLoading(false);
      }
    },
    [mergeUniqueJobs],
  );

  // Kept for compatibility with other components
  const loadMore = useCallback(async () => {
    return;
  }, []);

  // Refresh current search
  const refresh = useCallback(() => {
    search(lastQueryRef.current);
  }, [search]);

  // Initial job search
  useEffect(() => {
    search();
  }, [search]);

  // Refresh jobs every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      search(lastQueryRef.current);
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [search]);

  // Find a job by ID
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

  if (!ctx) {
    throw new Error("useJobs must be used inside a JobsProvider");
  }

  return ctx;
}
