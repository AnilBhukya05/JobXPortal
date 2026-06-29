import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PortalCard from "../components/PortalCard";
import JobCard from "../components/JobCard";
import SplitFlap from "../components/SplitFlap";
import { JobsLoading, DemoBanner } from "../components/JobsStatus";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import { timeAgo } from "../utils/time";

import { useJobs } from "../context/JobsContext";
import { portals } from "../data/portals";

import { useBookmarkContext } from "../context/BookmarkContext";
import { Clock } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const {
    jobs,
    totalCount,
    loading,
    error,
    isDemo,
    lastUpdated,
    refresh,
  } = useJobs();

  const { recent } = useBookmarkContext();

  const uniqueCompanies = new Set(jobs.map((j) => j.company)).size;
  const latest = [...jobs]
    .sort((a, b) => a.postedDaysAgo - b.postedDaysAgo)
    .slice(0, 4);

  function handleSearch(e) {
    e.preventDefault();
    const where = location.trim() || "india";
    navigate(
      "/jobs?q=" + encodeURIComponent(keyword) + "&where=" + encodeURIComponent(where)
    );
  }

  const { ref: statsRef, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
  const [displayedJobs, setDisplayedJobs] = useState(0);
  const [displayedCompanies, setDisplayedCompanies] = useState(0);
  const [displayedCategories, setDisplayedCategories] = useState(0);

  useEffect(() => {
    if (!inView || loading) return;

    const targetJobs = totalCount;
    const targetCompanies = uniqueCompanies;
    const targetCategories = portals.length;

    const jobStep = Math.max(1, Math.ceil(targetJobs / 60));
    const companyStep = Math.max(1, Math.ceil(targetCompanies / 30));
    const categoryStep = Math.max(1, Math.ceil(targetCategories / 10));

    let j = 0;
    let c = 0;
    let cat = 0;

    const timer = setInterval(() => {
      j = Math.min(targetJobs, j + jobStep);
      c = Math.min(targetCompanies, c + companyStep);
      cat = Math.min(targetCategories, cat + categoryStep);

      setDisplayedJobs(j);
      setDisplayedCompanies(c);
      setDisplayedCategories(cat);

      if (j >= targetJobs && c >= targetCompanies && cat >= targetCategories) {
        clearInterval(timer);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [inView, loading, totalCount, uniqueCompanies]);

  return (
    <>
      <Navbar />

      <div className="bg-[#0B0E14] text-[#F5F3EE] min-h-screen overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] md:w-[800px] h-[300px] md:h-[800px] bg-[#FFB020]/5 blur-[180px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
          {/* HERO */}
          <section className="pt-16 md:pt-24 pb-16 md:pb-24">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 border border-[#1E2330] bg-[#12151D] px-3 md:px-4 py-2 rounded-full mb-6 md:mb-8 font-mono text-[10px] md:text-xs tracking-widest text-[#8A8F9C]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-pulse shrink-0" />
                LIVE BOARD - UPDATED ON EVERY SEARCH
              </div>

              <h1 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95]">
                Now boarding:
                <br />
                <SplitFlap
                  words={[
                    "FRONTEND ENGINEER",
                    "PRODUCT DESIGNER",
                    "DATA ANALYST",
                    "DEVOPS ENGINEER",
                  ]}
                  className="text-[#FFB020]"
                />
              </h1>

              <p className="text-[#8A8F9C] text-base md:text-xl mt-6 md:mt-8 max-w-2xl">
                Real jobs from across the web, updated live — pulled
                live every time you search.
              </p>

              <form
                onSubmit={handleSearch}
                className="mt-8 md:mt-12 bg-[#12151D] border border-[#1E2330] rounded-2xl md:rounded-3xl p-3 flex flex-col gap-2"
              >
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Job title, skill or company"
                  className="w-full bg-transparent px-4 py-3 outline-none text-[#F5F3EE] placeholder:text-[#5b606e] text-sm"
                />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location (e.g. Bangalore)"
                  className="w-full bg-transparent px-4 py-3 outline-none text-[#F5F3EE] placeholder:text-[#5b606e] text-sm border-t border-[#1E2330]"
                />
                <button
                  type="submit"
                  className="cursor-pointer w-full bg-[#FFB020] text-[#0B0E14] px-6 py-3 rounded-xl font-semibold hover:bg-[#ffc454] transition text-sm"
                >
                  Search
                </button>
              </form>
            </motion.div>
          </section>

          {/* STATS */}
          <section ref={statsRef} className="grid grid-cols-3 gap-3 md:gap-6 mt-4">
            {[
              {
                label: "Jobs Found",
                value: loading ? "..." : displayedJobs.toLocaleString(),
              },
              {
                label: "Companies",
                value: loading ? "..." : displayedCompanies,
              },
              { label: "Categories", value: displayedCategories },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ y: -4 }}
                className="bg-[#12151D] border border-[#1E2330] rounded-2xl p-4 md:p-8 hover:border-[#FFB020]/40 transition-all duration-300"
              >
                <h2 className="font-mono text-2xl sm:text-4xl md:text-6xl font-bold text-[#F5F3EE]">
                  {stat.value}
                </h2>
                <p className="text-[#8A8F9C] mt-2 font-mono uppercase tracking-wider text-[10px] md:text-sm">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </section>

          {/* SOURCES */}
          <section className="mt-20 md:mt-32">
            <p className="font-mono text-xs tracking-widest text-[#8A8F9C] mb-2">
              BROWSE BY CATEGORY
            </p>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-8 md:mb-12">
              Sources
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 w-full">
              {portals.map((portal, index) => (
                <PortalCard key={portal.slug} portal={portal} index={index} />
              ))}
            </div>
          </section>

          {/* LATEST JOBS */}
          <section className="mt-20 md:mt-32 pb-20 md:pb-32">
            <p className="font-mono text-xs tracking-widest text-[#8A8F9C] mb-2">
              JUST LANDED
            </p>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 md:mb-12">
              <h2 className="text-3xl md:text-5xl font-display font-bold">
                Latest Opportunities
              </h2>
              <button
                onClick={refresh}
                className="flex items-center gap-2 font-mono text-xs text-[#8A8F9C] hover:text-[#FFB020] transition border border-[#1E2330] rounded-full px-3 md:px-4 py-2"
              >
                <RefreshCw
                  size={13}
                  className={loading ? "animate-spin" : ""}
                />
                <span className="hidden sm:inline">
                  {lastUpdated ? "Updated " + timeAgo(lastUpdated) : "Updating..."}
                </span>
                <span className="sm:hidden">Refresh</span>
              </button>
            </div>

            {isDemo && <DemoBanner message={error} />}

            {loading ? (
              <JobsLoading label="Pulling live listings..." />
            ) : (
              <div className="space-y-3 md:space-y-5">
                {latest.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </section>
        </div>


        {/* RECENTLY VIEWED */}
          {recent.length > 0 && (
            <section className="mt-20 md:mt-32 pb-12">
              <p className="font-mono text-xs tracking-widest text-[var(--muted)] mb-2">
                RECENTLY VIEWED
              </p>
              <div className="flex items-center gap-3 mb-8">
                <h2 className="text-3xl md:text-4xl font-display font-bold">
                  Pick up where you left off
                </h2>
                <Clock size={24} className="text-[var(--muted)]" />
              </div>
              <div className="space-y-3 md:space-y-4">
                {recent.slice(0, 4).map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </section>
          )}
          
        <Footer />
      </div>
    </>
  );
}