import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobCard from "../components/JobCard";
import SearchBar from "../components/SearchBar";
import { JobsLoading, DemoBanner } from "../components/JobsStatus";
import { useJobs } from "../context/JobsContext";

export default function Remote() {
  const [keyword, setKeyword] = useState("");
  const { jobs, loading, error, isDemo } = useJobs();

  const remoteJobs = useMemo(
    () =>
      jobs
        .filter((job) => job.remote)
        .filter((job) =>
          (job.title + " " + job.company).toLowerCase().includes(keyword.toLowerCase())
        ),
    [jobs, keyword]
  );

  return (
    <>
      <Navbar />
      <div className="bg-[#0B0E14] min-h-screen text-[#F5F3EE]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <p className="font-mono text-xs tracking-widest text-[#8A8F9C] mb-2">
            GATE / REMOTE
          </p>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-3">
            Work from anywhere
          </h1>
          <p className="text-[#8A8F9C] max-w-xl mb-8">
            Remote roles found in the current live search results.
          </p>

          <div className="mb-8 max-w-xl">
            <SearchBar keyword={keyword} setKeyword={setKeyword} />
          </div>

          {isDemo && <DemoBanner message={error} />}

          {loading ? (
            <JobsLoading label="Pulling live listings..." />
          ) : remoteJobs.length === 0 ? (
            <div className="bg-[#12151D] border border-[#1E2330] rounded-2xl p-10 text-center text-[#8A8F9C]">
              No remote roles in the current results. Try a different search
              from the homepage.
            </div>
          ) : (
            <div className="space-y-4">
              {remoteJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}