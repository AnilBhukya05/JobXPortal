import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobCard from "../components/JobCard";
import { JobsLoading, DemoBanner } from "../components/JobsStatus";
import { useJobs } from "../context/JobsContext";
import { ChevronDown, Search, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Companies() {
  const [open, setOpen] = useState(null);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const { jobs, loading, error, isDemo } = useJobs();

  const companies = useMemo(() => {
    const map = {};
    jobs.forEach((job) => {
      if (!map[job.company]) {
        map[job.company] = {
          name: job.company,
          location: job.location,
          jobs: [],
        };
      }
      map[job.company].jobs.push(job);
    });
    return Object.values(map)
      .sort((a, b) => b.jobs.length - a.jobs.length)
      .filter((c) =>
        c.name.toLowerCase().includes(keyword.toLowerCase())
      );
  }, [jobs, keyword]);

  return (
    <>
      <Navbar />
      <div className="bg-[#0B0E14] min-h-screen text-[#F5F3EE]">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 font-mono text-sm text-[#8A8F9C] hover:text-[#FFB020] transition mb-6"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <p className="font-mono text-xs tracking-widest text-[#8A8F9C] mb-2">
            CARRIERS
          </p>
          <h1 className="text-3xl md:text-5xl font-display font-bold mb-3">
            Companies hiring now
          </h1>
          <p className="text-[#8A8F9C] max-w-xl mb-6 md:mb-8 text-sm md:text-base">
            {companies.length} companies with active openings in the current
            live search.
          </p>

          <div className="relative mb-6 md:mb-8 max-w-md">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A8F9C]"
            />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search companies..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#12151D] border border-[#1E2330] text-[#F5F3EE] placeholder:text-[#5b606e] outline-none focus:border-[#FFB020] transition text-sm"
            />
          </div>

          {isDemo && <DemoBanner message={error} />}

          {loading ? (
            <JobsLoading label="Pulling live listings..." />
          ) : companies.length === 0 ? (
            <div className="bg-[#12151D] border border-[#1E2330] rounded-2xl p-8 text-center text-[#8A8F9C]">
              No companies found matching your search.
            </div>
          ) : (
            <div className="flex flex-col gap-3 md:gap-4">
              {companies.map((company) => {
                const isOpen = open === company.name;
                return (
                  <div
                    key={company.name}
                    className={"bg-[#12151D] border rounded-2xl overflow-hidden transition-colors duration-300 " + (isOpen ? "border-[#FFB020]/50" : "border-[#1E2330]")}
                  >
                    <button
                      onClick={() => setOpen(isOpen ? null : company.name)}
                      className="w-full flex items-center justify-between p-4 md:p-6 text-left"
                    >
                      <div className="flex items-center gap-3 md:gap-4">
                        <div
                          className={"w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center font-bold text-base md:text-lg shrink-0 " + (isOpen ? "bg-[#FFB020] text-[#0B0E14]" : "bg-[#1E2330] text-[#8A8F9C]")}
                        >
                          {company.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-base md:text-lg font-bold">
                            {company.name}
                          </h3>
                          <p className="text-[#8A8F9C] text-xs md:text-sm font-mono mt-0.5">
                            {company.jobs.length}{" "}
                            {company.jobs.length === 1 ? "opening" : "openings"}{" "}
                            - {company.location}
                          </p>
                        </div>
                      </div>
                      <ChevronDown
                        size={18}
                        className={"text-[#8A8F9C] transition-transform duration-300 shrink-0 " + (isOpen ? "rotate-180 text-[#FFB020]" : "")}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-4 md:px-6 pb-4 md:pb-6 space-y-3 md:space-y-4 border-t border-[#1E2330] pt-4">
                        {company.jobs.map((job) => (
                          <JobCard key={job.id} job={job} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}