import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobCard from "../components/JobCard";
import { JobsLoading, DemoBanner } from "../components/JobsStatus";
import { useJobs } from "../context/JobsContext";
import { ChevronDown } from "lucide-react";

export default function Companies() {
  const [open, setOpen] = useState(null);
  const { jobs, loading, error, isDemo } = useJobs();

  const companies = useMemo(() => {
    const map = {};
    jobs.forEach((job) => {
      if (!map[job.company]) {
        map[job.company] = { name: job.company, location: job.location, jobs: [] };
      }
      map[job.company].jobs.push(job);
    });
    return Object.values(map).sort((a, b) => b.jobs.length - a.jobs.length);
  }, [jobs]);

  return (
    <>
      <Navbar />
      <div className="bg-[#0B0E14] min-h-screen text-[#F5F3EE]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <p className="font-mono text-xs tracking-widest text-[#8A8F9C] mb-2">
            CARRIERS
          </p>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-3">
            Companies hiring now
          </h1>
          <p className="text-[#8A8F9C] max-w-xl mb-10">
            Companies found in the current live search. Run a new search from
            the homepage to see a different set.
          </p>

          {isDemo && <DemoBanner message={error} />}

          {loading ? (
            <JobsLoading label="Pulling live listings..." />
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {companies.map((company) => {
                const isOpen = open === company.name;
                return (
                  <div
                    key={company.name}
                    className="bg-[#12151D] border border-[#1E2330] rounded-2xl overflow-hidden"
                  >
                    <button
                      onClick={() => setOpen(isOpen ? null : company.name)}
                      className="w-full flex items-center justify-between p-6 text-left"
                    >
                      <div>
                        <h3 className="text-xl font-bold">{company.name}</h3>
                        <p className="text-[#8A8F9C] text-sm font-mono mt-1">
                          {company.jobs.length} open - {company.location}
                        </p>
                      </div>
                      <ChevronDown
                        className={`text-[#8A8F9C] transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-6 space-y-4">
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