import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobCard from "../components/JobCard";
import SearchBar from "../components/SearchBar";
import { JobsLoading, DemoBanner } from "../components/JobsStatus";
import { useJobs } from "../context/JobsContext";

export default function Remote() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const { jobs, loading, loadingMore, error, isDemo, hasMore, search, loadMore } = useJobs();

  // Trigger a dedicated remote search when this page mounts
  useEffect(() => {
    search({ what: "remote developer", where: "india", remote: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const remoteJobs = useMemo(
    () =>
      jobs.filter((job) =>
        (job.title + " " + job.company + " " + (job.location || ""))
          .toLowerCase()
          .includes(keyword.toLowerCase())
      ),
    [jobs, keyword]
  );

  function handleSearch() {
    const what = keyword.trim()
      ? keyword + " remote"
      : "remote developer";
    search({ what, where: "india" });
  }

  return (
    <>
      <Navbar />
      <div className="bg-[#0B0E14] min-h-screen text-[#F5F3EE]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 font-mono text-sm text-[#8A8F9C] hover:text-[#FFB020] transition mb-6"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <p className="font-mono text-xs tracking-widest text-[#8A8F9C] mb-2">
            GATE / REMOTE
          </p>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-3">
            Work from anywhere
          </h1>
          <p className="text-[#8A8F9C] max-w-xl mb-8">
            {loading
              ? "Searching for remote roles..."
              : remoteJobs.length + " remote roles found"}
          </p>

          {/* SEARCH */}
          <div className="mb-8 max-w-xl flex gap-3">
            <div className="flex-1">
              <SearchBar keyword={keyword} setKeyword={setKeyword} />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 rounded-xl bg-[#FFB020] text-[#0B0E14] font-semibold text-sm shrink-0"
            >
              Search
            </button>
          </div>

          {isDemo && <DemoBanner message={error} />}

          {loading ? (
            <JobsLoading label="Searching remote roles..." />
          ) : remoteJobs.length === 0 ? (
            <div className="bg-[#12151D] border border-[#1E2330] rounded-2xl p-10 text-center">
              <p className="text-[#8A8F9C] mb-2">No remote roles found.</p>
              <p className="text-[#5b606e] text-sm font-mono">
                Try searching a specific skill above.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {remoteJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}

              {hasMore && (
                <div className="flex justify-center pt-4">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="px-6 py-3 rounded-xl border border-[#1E2330] text-[#F5F3EE] hover:border-[#FFB020] transition font-mono text-sm disabled:opacity-50"
                  >
                    {loadingMore ? "Loading more..." : "Load More Remote Jobs"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}