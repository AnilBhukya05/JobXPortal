import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobCard from "../components/JobCard";
import { JobsLoading } from "../components/JobsStatus";
import { fetchRemotiveJobs } from "../services/remotiveApi";

const PAGE_SIZE = 20;

export default function Remote() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState("");
  const [keyword, setKeyword] = useState("");
  const offsetRef = useRef(0);
  const searchRef = useRef("");

  async function load(search) {
    setLoading(true);
    setError("");
    setJobs([]);
    offsetRef.current = 0;
    searchRef.current = search;
    try {
      const result = await fetchRemotiveJobs({
        search,
        limit: PAGE_SIZE,
        offset: 0,
      });
      setJobs(result.jobs);
      setHasMore(result.hasMore);
    } catch (err) {
      setError("Could not load remote jobs. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function loadMore() {
    if (loadingMore) return;
    setLoadingMore(true);
    const nextOffset = offsetRef.current + PAGE_SIZE;
    try {
      const result = await fetchRemotiveJobs({
        search: searchRef.current,
        limit: PAGE_SIZE,
        offset: nextOffset,
      });
      offsetRef.current = nextOffset;
      setJobs((prev) => [...prev, ...result.jobs]);
      setHasMore(result.hasMore);
    } catch (err) {
      // silently fail on load more
    } finally {
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    load("");
  }, []);

  function handleSearch() {
    load(keyword);
  }

  function handleRefresh() {
    setKeyword("");
    load("");
  }

  return (
    <>
      <Navbar />
      <div className="bg-[#0B0E14] min-h-screen text-[#F5F3EE]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 font-mono text-sm text-[#8A8F9C] hover:text-[#10B981] transition mb-6"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <p className="font-mono text-xs tracking-widest text-[#8A8F9C] mb-2">
            GATE / REMOTE
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <h1 className="text-3xl md:text-5xl font-display font-bold">
              Work from anywhere
            </h1>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 font-mono text-xs text-[#8A8F9C] hover:text-[#10B981] transition border border-[#1E2330] rounded-full px-4 py-2 disabled:opacity-50"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          <p className="text-[#8A8F9C] text-sm mb-8">
            {loading
              ? "Fetching remote roles..."
              : jobs.length + " remote roles loaded"}
          </p>

          {/* SEARCH */}
          <div className="flex gap-2 md:gap-3 mb-8 max-w-xl">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search by title, skill or company..."
              className="flex-1 pl-4 pr-4 py-3 rounded-xl bg-[#12151D] border border-[#1E2330] text-[#F5F3EE] placeholder:text-[#5b606e] outline-none focus:border-[#10B981] transition text-sm"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-4 md:px-6 rounded-xl bg-[#10B981] text-[#0B0E14] font-semibold text-sm shrink-0 hover:bg-[#34D399] transition disabled:opacity-50"
            >
              Search
            </button>
          </div>

          {error && (
            <div className="bg-[#12151D] border border-[#fb7185]/30 rounded-2xl p-6 text-center text-[#fb7185] text-sm mb-6">
              {error}
              <button
                onClick={handleRefresh}
                className="ml-3 underline hover:text-[#F5F3EE]"
              >
                Try again
              </button>
            </div>
          )}

          {loading ? (
            <JobsLoading label="Fetching remote roles..." />
          ) : jobs.length === 0 ? (
            <div className="bg-[#12151D] border border-[#1E2330] rounded-2xl p-10 text-center">
              <p className="text-[#8A8F9C] mb-2">No remote roles found.</p>
              <p className="text-[#5b606e] text-sm font-mono">
                Try a different search term.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3 md:space-y-4">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center pt-6">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="px-6 py-3 rounded-xl border border-[#1E2330] text-[#F5F3EE] hover:border-[#10B981] transition font-mono text-sm disabled:opacity-50"
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
    </>
  );
}