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

  // ANIMATED STATS
  const { ref: statsRef, inView } = useInView({ triggerOnce: true, threshold: 0.4 });
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#FFB020]/5 blur-[180px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative">
          {/* HERO */}
          <section className="pt-24 pb-24">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 border border-[#1E2330] bg-[#12151D] px-4 py-2 rounded-full mb-8 font-mono text-xs tracking-widest text-[#8A8F9C]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-pulse" />
                LIVE BOARD - REAL LISTINGS, UPDATED ON EVERY SEARCH
              </div>

              <h1 className="font-display text-6xl md:text-8xl font-bold tracking-tight leading-[0.95]">
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

              <p className="text-[#8A8F9C] text-xl mt-8 max-w-2xl">
                Real jobs, pulled live every time you search. No more checking
                six tabs before breakfast.
              </p>

              <form
                onSubmit={handleSearch}
                className="mt-12 bg-[#12151D] border border-[#1E2330] rounded-3xl p-3 flex flex-col md:flex-row gap-3"
              >
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Job title, skill or company"
                  className="flex-1 bg-transparent px-5 py-4 outline-none text-[#F5F3EE] placeholder:text-[#5b606e]"
                />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location (e.g. Bangalore, India)"
                  className="flex-1 bg-transparent px-5 py-4 outline-none text-[#F5F3EE] placeholder:text-[#5b606e]"
                />
                <button
                  type="submit"
                  className="bg-[#FFB020] text-[#0B0E14] px-8 py-4 rounded-2xl font-semibold hover:bg-[#ffc454] transition"
                >
                  Search
                </button>
              </form>
            </motion.div>
          </section>

          {/* STATS */}
          <section ref={statsRef} className="grid md:grid-cols-3 gap-6 mt-4">
            {[
              {
                label: "Jobs Found",
                value: loading ? "..." : displayedJobs.toLocaleString(),
              },
              {
                label: "Companies This Page",
                value: loading ? "..." : displayedCompanies,
              },
              { label: "Categories", value: displayedCategories },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ y: -4 }}
                className="bg-[#12151D] border border-[#1E2330] rounded-3xl p-8 hover:border-[#FFB020]/40 transition-all duration-300"
              >
                <h2 className="font-mono text-6xl font-bold text-[#F5F3EE]">
                  {stat.value}
                </h2>
                <p className="text-[#8A8F9C] mt-3 font-mono uppercase tracking-wider text-sm">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </section>

          {/* SOURCES */}
          <section className="mt-32">
            <p className="font-mono text-xs tracking-widest text-[#8A8F9C] mb-2">
              BROWSE BY CATEGORY
            </p>
            <h2 className="text-5xl font-display font-bold mb-12">Sources</h2>

            <div className="grid md:grid-cols-3 gap-6">
              {portals.map((portal) => (
                <PortalCard key={portal.slug} portal={portal} />
              ))}
            </div>
          </section>

          {/* LATEST JOBS */}
          <section className="mt-32 pb-32">
            <p className="font-mono text-xs tracking-widest text-[#8A8F9C] mb-2">
              JUST LANDED
            </p>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-12">
              <h2 className="text-5xl font-display font-bold">
                Latest Opportunities
              </h2>
              <button
                onClick={refresh}
                className="flex items-center gap-2 font-mono text-xs text-[#8A8F9C] hover:text-[#FFB020] transition border border-[#1E2330] rounded-full px-4 py-2"
              >
                <RefreshCw
                  size={14}
                  className={loading ? "animate-spin" : ""}
                />
                {lastUpdated
                  ? "Updated " + timeAgo(lastUpdated)
                  : "Updating..."}
              </button>
            </div>

            {isDemo && <DemoBanner message={error} />}

            {loading ? (
              <JobsLoading label="Pulling live listings..." />
            ) : (
              <div className="space-y-5">
                {latest.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </section>
        </div>

        <Footer />
      </div>
    </>
  );
}