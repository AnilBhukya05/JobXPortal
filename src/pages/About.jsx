import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SplitFlap from "../components/SplitFlap";
import {
  Radar,
  Layers,
  CheckCircle2,
  Globe2,
  Briefcase,
  Building2,
  GraduationCap,
  Code2,
  Mail,
  Link2,
} from "lucide-react";
import anilPhoto from "../assets/anil.jpg";

const steps = [
  {
    n: "01",
    title: "We scan every gate",
    desc: "Jobs from LinkedIn, Naukri, Glassdoor, Indeed, Wellfound, Foundit and company career pages — all indexed continuously via Google for Jobs.",
    icon: Radar,
  },
  {
    n: "02",
    title: "We normalize the listing",
    desc: "Titles, locations, salary bands and experience levels are cleaned up so jobs from different sources read consistently.",
    icon: Layers,
  },
  {
    n: "03",
    title: "It lands on your board",
    desc: "One search, one list, ranked by how recently it was posted. Click Apply and you go straight to the original listing.",
    icon: CheckCircle2,
  },
];

const sources = [
  {
    name: "LinkedIn",
    icon: Link2,
    desc: "Professional network listings and recruiter posts",
    color: "text-[#0A66C2]",
    bg: "bg-[#0A66C2]/10 border-[#0A66C2]/20",
  },
  {
    name: "Naukri",
    icon: Briefcase,
    desc: "India's largest job board with millions of listings",
    color: "text-[#FF7555]",
    bg: "bg-[#FF7555]/10 border-[#FF7555]/20",
  },
  {
    name: "Glassdoor",
    icon: Building2,
    desc: "Jobs with company reviews and salary insights",
    color: "text-[#0CAA41]",
    bg: "bg-[#0CAA41]/10 border-[#0CAA41]/20",
  },
  {
    name: "Indeed",
    icon: Globe2,
    desc: "Global job search engine covering every industry",
    color: "text-[#2164F3]",
    bg: "bg-[#2164F3]/10 border-[#2164F3]/20",
  },
  {
    name: "Wellfound",
    icon: Briefcase,
    desc: "Startup and early-stage tech roles",
    color: "text-[#F5A623]",
    bg: "bg-[#F5A623]/10 border-[#F5A623]/20",
  },
  {
    name: "Company Career Pages",
    icon: Building2,
    desc: "Direct listings from employer career portals",
    color: "text-[#2DD4BF]",
    bg: "bg-[#2DD4BF]/10 border-[#2DD4BF]/20",
  },
];

export default function About() {
  return (
    <>
      <Navbar />
      <div className="bg-[#0B0E14] min-h-screen text-[#F5F3EE]">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-20">

          {/* HERO */}
          <p className="font-mono text-xs tracking-widest text-[#8A8F9C] mb-3">
            ABOUT THE BOARD
          </p>
          <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight mb-6">
            Built for{" "}
            <SplitFlap
              words={["JOB SEEKERS", "CAREER CHANGERS", "FRESH GRADS", "REMOTE WORKERS"]}
              className="text-[#FFB020]"
            />
          </h1>
          <p className="text-[#8A8F9C] text-base md:text-lg max-w-2xl mb-14 md:mb-20">
            JobXPortal exists because checking six different job sites every
            morning is a waste of a job search. We pull real listings from
            every major portal into one board so you can spend your time on
            applications, not tabs.
          </p>

          {/* HOW IT WORKS */}
          <p className="font-mono text-xs tracking-widest text-[#8A8F9C] mb-4">
            HOW IT WORKS
          </p>
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-6 md:mb-8">
            Three steps, zero tabs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-16 md:mb-24">
            {steps.map((step) => (
              <div
                key={step.n}
                className="bg-[#12151D] border border-[#1E2330] rounded-2xl p-6 md:p-7 hover:border-[#FFB020]/30 transition-colors duration-300"
              >
                <span className="font-mono text-xs text-[#FFB020]">{step.n}</span>
                <step.icon className="text-[#2DD4BF] mt-4 mb-4" size={26} />
                <h3 className="text-base md:text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-[#8A8F9C] text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* SOURCES */}
          <p className="font-mono text-xs tracking-widest text-[#8A8F9C] mb-4">
            JOB SOURCES
          </p>
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">
            Every major portal. One search.
          </h2>
          <p className="text-[#8A8F9C] mb-6 md:mb-8 max-w-xl text-sm md:text-base">
            Our live feed is powered by Google for Jobs which continuously
            indexes listings from all of these sources and more.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-16 md:mb-24">
            {sources.map((source) => (
              <div
                key={source.name}
                className={"flex items-start gap-3 md:gap-4 p-4 md:p-5 rounded-2xl border " + source.bg + " transition-all duration-300"}
              >
                <div
                  className={"w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center shrink-0 " + source.color + " bg-white/5"}
                >
                  <source.icon size={18} />
                </div>
                <div>
                  <h3 className={"font-bold text-sm " + source.color}>{source.name}</h3>
                  <p className="text-[#8A8F9C] text-xs mt-1 leading-relaxed">{source.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* FOUNDER */}
          <p className="font-mono text-xs tracking-widest text-[#8A8F9C] mb-4">
            FOUNDER
          </p>
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-6 md:mb-8">
            The person behind the board
          </h2>

          <div className="bg-[#12151D] border border-[#1E2330] rounded-2xl p-6 md:p-10">
            <div className="flex flex-col sm:flex-row gap-6 md:gap-8 items-start">

              {/* AVATAR */}
              <div className="shrink-0">
                <img
                  src={anilPhoto}
                  alt="Anil Bhukya"
                  className="w-24 h-32 md:w-28 md:h-36 rounded-2xl object-cover object-top border-2 border-[#FFB020]/30"
                />
              </div>

              {/* INFO */}
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-display font-bold text-[#F5F3EE]">
                  Anil Bhukya
                </h3>

                <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs px-3 py-1 rounded-full bg-[#FFB020]/10 border border-[#FFB020]/30 text-[#FFB020]">
                    <GraduationCap size={11} />
                    B.Tech Graduate
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs px-3 py-1 rounded-full bg-[#2DD4BF]/10 border border-[#2DD4BF]/30 text-[#2DD4BF]">
                    Founder, JobXPortal
                  </span>
                </div>

                <p className="text-[#8A8F9C] leading-relaxed mb-4 text-sm md:text-base">
                  Built JobXPortal after spending too much time switching
                  between LinkedIn, Naukri, Glassdoor and company career pages
                  every morning during my own job search. The idea was simple:
                  one board, every opening, no extra tabs.
                </p>

                <p className="text-[#8A8F9C] leading-relaxed mb-6 text-sm md:text-base">
                  JobXPortal is designed with students and fresh graduates in
                  mind — no login walls, no paid tiers, just a clean search
                  that sends you straight to the original job posting.
                </p>

                <div className="flex flex-wrap gap-2 md:gap-3">
                  <a                
                    href="https://github.com/AnilBhukya05"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg border border-[#1E2330] text-[#8A8F9C] hover:text-[#F5F3EE] hover:border-[#FFB020] transition text-xs md:text-sm font-mono"
                  >
                    <Code2 size={14} />
                    GitHub
                  </a>
                  <a
                    href="https://www.linkedin.com/in/anil-bhukya"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg border border-[#1E2330] text-[#8A8F9C] hover:text-[#F5F3EE] hover:border-[#0A66C2] transition text-xs md:text-sm font-mono"
                  >
                    <Link2 size={14} />
                    LinkedIn
                  </a>
                  <a
                    href="mailto:anilbhukya@gmail.com"
                    className="inline-flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg border border-[#1E2330] text-[#8A8F9C] hover:text-[#F5F3EE] hover:border-[#2DD4BF] transition text-xs md:text-sm font-mono"
                  >
                    <Mail size={14} />
                    Contact
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
        <Footer />
      </div>
    </>
  );
}