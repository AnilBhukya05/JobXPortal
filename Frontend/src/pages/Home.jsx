import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PortalCard from "../components/PortalCard";
import JobCard from "../components/JobCard";
import SplitFlap from "../components/SplitFlap";
import { JobsLoading, DemoBanner } from "../components/JobsStatus";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";

import {
  Search,
  MapPin,
  ArrowRight,
  Zap,
  SlidersHorizontal,
  Building2,
  Bookmark,
  RefreshCw,
  Clock,
  CheckCircle2,
  Sparkles,
  BriefcaseBusiness,
  Globe2,
  ShieldCheck,
} from "lucide-react";

import { useJobs } from "../context/JobsContext";
import { portals } from "../data/portals";
import { useBookmarkContext } from "../context/BookmarkContext";

function AnimatedNumber({ target, suffix = "" }) {
  const [count, setCount] = useState(0);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.4,
  });

  useEffect(() => {
    if (!inView || target === 0) return;

    let start = 0;

    const step = Math.max(1, Math.ceil(target / 60));

    const timer = setInterval(() => {
      start = Math.min(target, start + step);

      setCount(start);

      if (start >= target) {
        clearInterval(timer);
      }
    }, 25);

    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

const quickSearches = [
  {
    label: "Remote",
    value: "remote",
  },
  {
    label: "Full Time",
    value: "full time",
  },
  {
    label: "Part Time",
    value: "part time",
  },
  {
    label: "Internship",
    value: "internship",
  },
  {
    label: "Freshers",
    value: "fresher",
  },
];

const features = [
  {
    icon: Zap,
    title: "Real-time Job Updates",
    description:
      "Find fresh opportunities collected from multiple job sources.",
    className: "bg-blue-50 border-blue-100",
    iconClass: "bg-blue-100 text-blue-600",
  },
  {
    icon: SlidersHorizontal,
    title: "Advanced Filters",
    description: "Filter jobs by role, location, experience, type and more.",
    className: "bg-violet-50 border-violet-100",
    iconClass: "bg-violet-100 text-violet-600",
  },
  {
    icon: Building2,
    title: "Explore Companies",
    description: "Discover leading companies and their career opportunities.",
    className: "bg-emerald-50 border-emerald-100",
    iconClass: "bg-emerald-100 text-emerald-600",
  },
  {
    icon: Bookmark,
    title: "Save & Track Jobs",
    description: "Bookmark opportunities and keep your applications organized.",
    className: "bg-amber-50 border-amber-100",
    iconClass: "bg-amber-100 text-amber-600",
  },
];

export default function Home() {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const { jobs, totalCount, loading, error, isDemo, lastUpdated, refresh } =
    useJobs();

  const { recent } = useBookmarkContext();

  const uniqueCompanies = new Set(jobs.map((job) => job.company)).size;

  const latest = [...jobs]
    .sort((a, b) => a.postedDaysAgo - b.postedDaysAgo)
    .slice(0, 5);

  function handleSearch(e) {
    e.preventDefault();

    const where = location.trim() || "india";

    navigate(
      "/jobs?q=" +
        encodeURIComponent(keyword) +
        "&where=" +
        encodeURIComponent(where),
    );
  }

  function handleQuickSearch(value) {
    setKeyword(value);

    navigate("/jobs?q=" + encodeURIComponent(value) + "&where=india");
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen overflow-hidden bg-white text-[#101828]">
        {/* HERO */}

        <section className="relative overflow-hidden bg-gradient-to-br from-[#F8FBFF] via-white to-[#F3F0FF]">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-blue-200/30 blur-[100px]" />

            <div className="absolute right-[-180px] top-[-100px] h-[600px] w-[600px] rounded-full bg-violet-200/35 blur-[110px]" />

            <div className="absolute bottom-[-200px] left-[35%] h-[500px] w-[500px] rounded-full bg-cyan-100/30 blur-[100px]" />
          </div>

          <div className="relative mx-auto max-w-[1450px] px-5 pb-16 pt-10 sm:px-8 lg:px-12 lg:pb-24 lg:pt-14">
            <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
              {/* LEFT */}

              <motion.div
                initial={{
                  opacity: 0,
                  x: -30,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  duration: 0.6,
                }}
                className="relative z-10"
              >
                {/* Heading */}

                <h1 className="max-w-[720px] text-5xl font-black leading-[0.98] tracking-[-0.045em] text-[#101828] sm:text-6xl lg:text-[76px]">
                  Find Your Next
                  <span className="block bg-gradient-to-r from-[#3047E8] via-[#6135E8] to-[#7C3AED] bg-clip-text text-transparent">
                    Opportunity
                  </span>
                </h1>

                <div className="mt-5 h-[48px] overflow-hidden text-2xl font-extrabold text-[#334155] sm:text-3xl lg:text-4xl">
                  <SplitFlap
                    words={[
                      "FRONTEND ENGINEER",
                      "PRODUCT DESIGNER",
                      "DATA ANALYST",
                      "DEVOPS ENGINEER",
                    ]}
                    style={{
                      color: "#4F46E5",
                      fontWeight: 800,
                      fontSize: "clamp(1.4rem, 3vw, 2.3rem)",
                      lineHeight: 1.2,
                    }}
                  />
                </div>

                <p className="mt-5 max-w-[610px] text-base leading-7 text-[#667085] sm:text-lg">
                  Search thousands of jobs from leading job portals, company
                  career pages and more — all in one smart platform.
                </p>

                {/* SEARCH */}

                <form
                  onSubmit={handleSearch}
                  className="mt-8 max-w-[720px] rounded-2xl border border-[#DDE3F0] bg-white p-2 shadow-[0_15px_50px_rgba(38,64,130,0.12)]"
                >
                  <div className="grid gap-2 md:grid-cols-[1fr_0.8fr_auto]">
                    <div className="flex min-w-0 items-center gap-3 rounded-xl px-4 py-3">
                      <Search size={21} className="shrink-0 text-[#475467]" />

                      <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Job title, skills or company"
                        className="w-full bg-transparent text-sm font-medium text-[#101828] outline-none placeholder:text-[#98A2B3]"
                      />
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-[#EEF1F6] bg-[#FAFBFD] px-4 py-3">
                      <MapPin size={20} className="shrink-0 text-[#475467]" />

                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Location"
                        className="w-full bg-transparent text-sm font-medium text-[#101828] outline-none placeholder:text-[#98A2B3]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#3949E8] to-[#7138E8] px-7 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:shadow-xl"
                    >
                      Search Jobs
                      <ArrowRight size={17} />
                    </button>
                  </div>
                </form>

                {/* QUICK FILTERS */}

                <div className="mt-5 flex flex-wrap gap-2">
                  {quickSearches.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => handleQuickSearch(item.value)}
                      className="cursor-pointer rounded-full border border-[#D8DEEA] bg-white px-4 py-2 text-xs font-semibold text-[#475467] shadow-sm transition hover:border-[#635BFF] hover:bg-[#F5F3FF] hover:text-[#4F46E5]"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* RIGHT VISUAL */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 35,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.7,
                  delay: 0.15,
                }}
                className="relative hidden lg:block lg:scale-[0.94] lg:origin-center"
              >
                {/* Glow */}

                <div className="absolute inset-10 rounded-full bg-indigo-300/20 blur-[80px]" />

                {/* Browser */}

                <div className="relative rotate-[1deg] rounded-[24px] border border-[#D9DFF0] bg-white p-3 shadow-[0_35px_90px_rgba(38,55,110,0.18)]">
                  {/* Browser header */}

                  <div className="flex h-9 items-center gap-2 border-b border-[#EEF1F6] px-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#FF6B6B]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#FFC857]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#42D392]" />

                    <div className="ml-4 h-5 flex-1 rounded-full bg-[#F4F6FA]" />
                  </div>

                  <div className="grid min-h-[430px] grid-cols-[145px_1fr] gap-3 p-3">
                    {/* Sidebar */}

                    <div className="rounded-xl border border-[#EEF1F6] bg-[#FBFCFE] p-3">
                      <div className="mb-5 h-7 w-24 rounded bg-gradient-to-r from-[#3949E8] to-[#7C3AED]" />

                      <p className="mb-3 text-[9px] font-bold uppercase tracking-wider text-[#98A2B3]">
                        Filters
                      </p>

                      {[
                        "Full Time",
                        "Internship",
                        "Remote",
                        "Freshers",
                        "1–3 years",
                      ].map((item) => (
                        <div
                          key={item}
                          className="mb-3 flex items-center gap-2"
                        >
                          <span className="h-3 w-3 rounded border border-[#C9D1E1]" />

                          <span className="text-[9px] text-[#667085]">
                            {item}
                          </span>
                        </div>
                      ))}

                      <div className="mt-6 h-24 rounded-lg bg-gradient-to-br from-indigo-50 to-violet-50" />
                    </div>

                    {/* Jobs */}

                    <div>
                      <div className="mb-3 flex gap-2">
                        <div className="flex h-9 flex-1 items-center rounded-lg border border-[#E4E7EC] px-3">
                          <Search size={13} className="text-[#98A2B3]" />

                          <span className="ml-2 text-[9px] text-[#98A2B3]">
                            Search jobs, companies or skills...
                          </span>
                        </div>

                        <div className="h-9 w-16 rounded-lg bg-gradient-to-r from-[#3949E8] to-[#7138E8]" />
                      </div>

                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#344054]">
                          Showing latest jobs
                        </span>

                        <span className="text-[9px] text-[#98A2B3]">
                          Latest
                        </span>
                      </div>

                      {[
                        {
                          title: "Software Engineer",
                          company: "Technology Company",
                          location: "Bangalore, India",
                          tags: ["React", "Python"],
                        },
                        {
                          title: "Frontend Developer",
                          company: "Product Company",
                          location: "Hyderabad, India",
                          tags: ["React", "TypeScript"],
                        },
                        {
                          title: "SDE Intern",
                          company: "Global Company",
                          location: "Remote",
                          tags: ["Java", "DSA"],
                        },
                        {
                          title: "Backend Developer",
                          company: "Fintech Company",
                          location: "Pune, India",
                          tags: ["Node.js", "MongoDB"],
                        },
                      ].map((job) => (
                        <div
                          key={job.title}
                          className="mb-2 rounded-xl border border-[#EEF1F6] bg-white p-3 shadow-sm"
                        >
                          <div className="flex gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-50 to-violet-100 text-xs font-black text-indigo-600">
                              {job.title.charAt(0)}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex justify-between gap-2">
                                <p className="truncate text-[10px] font-bold text-[#1D2939]">
                                  {job.title}
                                </p>

                                <Bookmark
                                  size={11}
                                  className="shrink-0 text-[#98A2B3]"
                                />
                              </div>

                              <p className="mt-1 text-[8px] font-semibold text-[#667085]">
                                {job.company}
                              </p>

                              <p className="mt-1 text-[8px] text-[#98A2B3]">
                                {job.location}
                              </p>

                              <div className="mt-2 flex gap-1">
                                {job.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="rounded bg-[#F1F3FF] px-1.5 py-0.5 text-[7px] font-medium text-[#5965D8]"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating card */}

                <div className="absolute -bottom-8 -left-8 rounded-2xl border border-white bg-white p-4 shadow-[0_20px_50px_rgba(38,55,110,0.18)]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <CheckCircle2 size={20} />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-[#101828]">
                        Fresh jobs
                      </p>

                      <p className="text-xs text-[#667085]">
                        Updated regularly
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* PLATFORM STRIP */}

        <section className="border-y border-[#EAECF0] bg-white">
          <div className="mx-auto flex max-w-[1450px] flex-col gap-6 px-5 py-7 sm:px-8 lg:flex-row lg:items-center lg:px-12">
            <p className="shrink-0 text-sm font-semibold text-[#667085]">
              Jobs from top platforms
            </p>

            <div className="hidden h-8 w-px bg-[#D0D5DD] lg:block" />

            <div className="grid flex-1 grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
              {[
                "LinkedIn",
                "naukri",
                "foundit",
                "indeed",
                "wellfound",
                "Company Careers",
              ].map((name, index) => (
                <div
                  key={name}
                  className="flex items-center justify-center gap-2 text-sm font-bold text-[#344054] sm:justify-start"
                >
                  {index === 5 && (
                    <Building2 size={20} className="text-[#475467]" />
                  )}

                  <span className={index < 5 ? "text-[#344054]" : ""}>
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STATS */}

        <section className="bg-white py-10">
          <div className="mx-auto grid max-w-[1250px] grid-cols-2 gap-4 px-5 sm:grid-cols-4 sm:px-8">
            {[
              {
                label: "Job Listings",
                value: loading ? 0 : totalCount,
                suffix: "+",
                icon: BriefcaseBusiness,
              },
              {
                label: "Companies",
                value: loading ? 0 : uniqueCompanies,
                suffix: "+",
                icon: Building2,
              },
              {
                label: "Job Sources",
                value: portals.length,
                suffix: "",
                icon: Globe2,
              },
              {
                label: "Free to Use",
                value: 100,
                suffix: "%",
                icon: ShieldCheck,
              },
            ].map((stat) => {
              const Icon = stat.icon;

              return (
                <motion.div
                  key={stat.label}
                  whileHover={{
                    y: -4,
                  }}
                  className="cursor-pointer rounded-2xl border border-[#EAECF0] bg-white p-5 shadow-sm transition hover:shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F1F3FF] text-[#4F46E5]">
                      <Icon size={21} />
                    </div>

                    <div>
                      <div className="text-2xl font-black tracking-tight text-[#101828] sm:text-3xl">
                        <AnimatedNumber
                          target={stat.value}
                          suffix={stat.suffix}
                        />
                      </div>

                      <p className="mt-1 text-xs font-medium text-[#667085]">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* FEATURES */}

        <section className="bg-[#F8FAFC] py-16 sm:py-20">
          <div className="mx-auto max-w-[1250px] px-5 sm:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#635BFF]">
                EVERYTHING IN ONE PLACE
              </span>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-[#101828] sm:text-4xl">
                A smarter way to find your next job
              </h2>

              <p className="mt-4 text-sm leading-6 text-[#667085] sm:text-base">
                JobXPortal brings job discovery, company opportunities and
                career tools together in one simple platform.
              </p>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <motion.div
                    key={feature.title}
                    whileHover={{
                      y: -6,
                    }}
                    className={`cursor-pointer rounded-2xl border p-6 shadow-sm transition hover:shadow-lg ${feature.className}`}
                  >
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.iconClass}`}
                    >
                      <Icon size={23} />
                    </div>

                    <h3 className="mt-5 text-base font-bold text-[#101828]">
                      {feature.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#667085]">
                      {feature.description}
                    </p>

                    <button
                      type="button"
                      onClick={() => navigate("/jobs")}
                      className="mt-5 inline-flex cursor-pointer items-center gap-1 text-xs font-bold text-[#4F46E5]"
                    >
                      Explore
                      <ArrowRight size={14} />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SOURCES */}

        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-[1250px] px-5 sm:px-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#635BFF]">
                  BROWSE SOURCES
                </span>

                <h2 className="mt-2 text-3xl font-black tracking-tight text-[#101828]">
                  Explore job sources
                </h2>

                <p className="mt-2 max-w-xl text-sm text-[#667085]">
                  Search opportunities from multiple job platforms without
                  opening them one by one.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/jobs")}
                className="inline-flex cursor-pointer items-center gap-2 self-start rounded-xl border border-[#D0D5DD] bg-white px-4 py-2.5 text-sm font-bold text-[#344054] transition hover:border-[#635BFF] hover:text-[#4F46E5] sm:self-auto"
              >
                View All Jobs
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {portals.map((portal, index) => (
                <PortalCard key={portal.slug} portal={portal} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* RECENTLY VIEWED */}

        {recent.length > 0 && (
          <section className="bg-[#F8FAFC] py-16">
            <div className="mx-auto max-w-[1250px] px-5 sm:px-8">
              <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#635BFF]">
                    RECENT ACTIVITY
                  </span>

                  <h2 className="mt-2 text-2xl font-black text-[#101828] sm:text-3xl">
                    Pick up where you left off
                  </h2>
                </div>

                <Clock size={22} className="text-[#98A2B3]" />
              </div>

              <div className="flex flex-col gap-3">
                {recent.slice(0, 4).map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* LATEST JOBS */}

        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-[1250px] px-5 sm:px-8">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#635BFF]">
                  JUST LANDED
                </span>

                <h2 className="mt-2 text-3xl font-black tracking-tight text-[#101828]">
                  Latest Opportunities
                </h2>

                <p className="mt-2 text-sm text-[#667085]">
                  Fresh opportunities available across multiple sources.
                </p>
              </div>

              <button
                type="button"
                onClick={refresh}
                className="inline-flex cursor-pointer items-center gap-2 self-start rounded-xl border border-[#D0D5DD] bg-white px-4 py-2.5 text-xs font-bold text-[#475467] transition hover:border-[#635BFF] hover:text-[#4F46E5]"
              >
                <RefreshCw
                  size={14}
                  className={loading ? "animate-spin" : ""}
                />

                {lastUpdated ? "Refresh" : "Update Jobs"}
              </button>
            </div>

            {isDemo && (
              <div className="mb-5">
                <DemoBanner message={error} />
              </div>
            )}

            {loading ? (
              <JobsLoading />
            ) : latest.length > 0 ? (
              <div className="flex flex-col gap-3">
                {latest.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#D0D5DD] bg-[#F8FAFC] py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF2FF] text-[#635BFF]">
                  <BriefcaseBusiness size={25} />
                </div>

                <h3 className="mt-4 text-lg font-bold text-[#101828]">
                  No jobs available right now
                </h3>

                <p className="mt-2 text-sm text-[#667085]">
                  Try searching for a different role or location.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/jobs")}
                  className="mt-5 cursor-pointer rounded-xl bg-[#4F46E5] px-5 py-2.5 text-sm font-bold text-white"
                >
                  Browse Jobs
                </button>
              </div>
            )}
          </div>
        </section>

        {/* CTA */}

        <section className="relative overflow-hidden border-t border-[#E9EDF5] bg-gradient-to-br from-[#F4F7FF] via-[#F9F8FF] to-[#F2EEFF] py-16 sm:py-20">
          {/* Soft background glow */}

          <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-[#C7D2FE]/35 blur-[100px]" />

          <div className="pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-[#DDD6FE]/40 blur-[110px]" />

          <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E0E7FF]/40 blur-[100px]" />

          <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
            {/* Icon */}

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#D9DDF5] bg-white text-[#4F46E5] shadow-[0_10px_30px_rgba(79,70,229,0.10)]">
              <Sparkles size={25} />
            </div>

            {/* Heading */}

            <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-black leading-tight tracking-[-0.035em] text-[#101828] sm:text-5xl">
              Your next opportunity is closer than you think.
            </h2>

            {/* Description */}

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#667085] sm:text-base">
              Search thousands of opportunities, discover companies and take
              control of your career with JobXPortal.
            </p>

            {/* Buttons */}

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate("/jobs")}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#4F46E5] px-6 py-3 text-sm font-bold text-white shadow-[0_10px_25px_rgba(79,70,229,0.20)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#4338CA] hover:shadow-[0_14px_30px_rgba(79,70,229,0.25)]"
              >
                Find Jobs
                <ArrowRight size={17} />
              </button>

              <button
                type="button"
                onClick={() => navigate("/companies")}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#D8DCEF] bg-white px-6 py-3 text-sm font-bold text-[#344054] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#C7C9E8] hover:bg-[#FAFAFF] hover:text-[#4F46E5] hover:shadow-md"
              >
                Explore Companies
                <Building2 size={17} />
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
