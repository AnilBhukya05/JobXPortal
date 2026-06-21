import { useParams, useSearchParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobCard from "../components/JobCard";
import FilterSidebar from "../components/FilterSidebar";
import SearchBar from "../components/SearchBar";
import { JobsLoading, DemoBanner } from "../components/JobsStatus";
import { useJobs } from "../context/JobsContext";
import { portals } from "../data/portals";

export default function Jobs() {
  const { portal } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { jobs, loading, error, isDemo, search } = useJobs();

  const [days, setDays] = useState(30);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [jobType, setJobType] = useState([]);
  const [keyword, setKeyword] = useState(searchParams.get("q") || "");

  const whereLoc = searchParams.get("where") || "india";

  const portalMeta = portals.find((p) => p.slug === portal);
  const heading = portalMeta ? portalMeta.name : "All";

  useEffect(() => {
    const q = searchParams.get("q");
    const what = q || (portalMeta && portalMeta.query.what) || "software developer";
    search({ what, where: whereLoc });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portal]);

  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      if (job.postedDaysAgo > days) return false;
      if (remoteOnly && !job.remote) return false;
      if (jobType.length && !jobType.includes(job.type)) return false;
      if (
        keyword &&
        !(job.title + " " + job.company + " " + job.tags.join(" "))
          .toLowerCase()
          .includes(keyword.toLowerCase())
      )
        return false;
      return true;
    });
  }, [jobs, days, remoteOnly, jobType, keyword]);

  function handleSearchSubmit() {
    search({ what: keyword || "software developer", where: whereLoc });
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

         <div className="flex items-center gap-2 font-mono text-xs tracking-widest text-[#8A8F9C] mb-2">
            <Link to="/" className="hover:text-[#FFB020] transition">
              LIVE
            </Link>
            <span>/</span>
            <Link to="/jobs" className="hover:text-[#FFB020] transition">
              {heading.toUpperCase()}
            </Link>
            <span>/</span>
            <button
              onClick={() =>
                search({ what: keyword || "software developer", where: "india" })
              }
              className="hover:text-[#FFB020] transition"
            >
              {whereLoc.toUpperCase()}
            </button>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-8">
            {heading} Jobs
          </h1>

          <div className="mb-8 max-w-xl flex gap-3">
            <div className="flex-1">
              <SearchBar keyword={keyword} setKeyword={setKeyword} />
            </div>
            <button
              onClick={handleSearchSubmit}
              className="px-6 rounded-xl bg-[#FFB020] text-[#0B0E14] font-semibold text-sm shrink-0"
            >
              Search
            </button>
          </div>

          {isDemo && <DemoBanner message={error} />}

          <div className="grid md:grid-cols-4 gap-6">
            <FilterSidebar
              days={days}
              setDays={setDays}
              remoteOnly={remoteOnly}
              setRemoteOnly={setRemoteOnly}
              jobType={jobType}
              setJobType={setJobType}
            />

            <div className="md:col-span-3 space-y-4">
              {loading ? (
                <JobsLoading label="Pulling live listings..." />
              ) : filtered.length === 0 ? (
                <div className="bg-[#12151D] border border-[#1E2330] rounded-2xl p-10 text-center text-[#8A8F9C]">
                  No jobs match right now. Try widening your filters.
                </div>
              ) : (
                filtered.map((job) => <JobCard key={job.id} job={job} />)
              )}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}