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
  Search,
  Brain,
  FileText,
  Target,
  Bookmark,
  ClipboardList,
  Users,
  Sparkles,
  ArrowRight,
  ShieldCheck,
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
    color: "text-[#4F46E5]",
    bg: "bg-[#4F46E5]/10 border-[#4F46E5]/20",
  },
  {
    name: "Naukri",
    icon: Briefcase,
    desc: "India's largest job board with millions of listings",
    color: "text-[#6366F1]",
    bg: "bg-[#6366F1]/10 border-[#6366F1]/20",
  },
  {
    name: "Glassdoor",
    icon: Building2,
    desc: "Jobs with company reviews and salary insights",
    color: "text-[#10B981]",
    bg: "bg-[#10B981]/10 border-[#10B981]/20",
  },
  {
    name: "Indeed",
    icon: Globe2,
    desc: "Global job search engine covering every industry",
    color: "text-[#7C3AED]",
    bg: "bg-[#7C3AED]/10 border-[#7C3AED]/20",
  },
  {
    name: "Wellfound",
    icon: Briefcase,
    desc: "Startup and early-stage tech roles",
    color: "text-[#8B5CF6]",
    bg: "bg-[#8B5CF6]/10 border-[#8B5CF6]/20",
  },
  {
    name: "Company Career Pages",
    icon: Building2,
    desc: "Direct listings from employer career portals",
    color: "text-[#059669]",
    bg: "bg-[#059669]/10 border-[#059669]/20",
  },
];

const seekerFeatures = [
  {
    icon: Search,
    title: "Search Jobs",
    desc: "Search opportunities across multiple job sources from one unified job board.",
  },
  {
    icon: Brain,
    title: "AI Resume Match",
    desc: "Compare your resume with a job description and understand how well your profile matches.",
  },
  {
    icon: FileText,
    title: "Resume Builder",
    desc: "Create and maintain a professional resume designed around your career profile.",
  },
  {
    icon: Sparkles,
    title: "AI Cover Letters",
    desc: "Generate personalized cover letters based on your profile and the job you're targeting.",
  },
  {
    icon: Target,
    title: "Interview Preparation",
    desc: "Prepare for technical, behavioral and situational interview questions with AI assistance.",
  },
  {
    icon: ClipboardList,
    title: "Application Tracker",
    desc: "Keep track of the jobs you have applied for and organize your job-search progress.",
  },
  {
    icon: Bookmark,
    title: "Save Jobs",
    desc: "Bookmark interesting opportunities and return to them whenever you're ready.",
  },
  {
    icon: Building2,
    title: "Explore Companies",
    desc: "Discover company career pages and explore opportunities directly from employers.",
  },
];

const employerFeatures = [
  {
    icon: Building2,
    title: "Create an Employer Profile",
    desc: "Build a company presence on JobXPortal and provide candidates with information about your organization.",
  },
  {
    icon: Briefcase,
    title: "Post Jobs",
    desc: "Create job listings and make your open positions discoverable to relevant candidates.",
  },
  {
    icon: Users,
    title: "Reach Candidates",
    desc: "Connect your open roles with students, fresh graduates and experienced professionals searching for opportunities.",
  },
];

const values = [
  {
    icon: Search,
    title: "One Search",
    desc: "Reduce the need to switch between multiple job websites during your daily job search.",
  },
  {
    icon: ShieldCheck,
    title: "Original Listings",
    desc: "Apply through the original job source instead of keeping candidates inside another application layer.",
  },
  {
    icon: Brain,
    title: "AI-Assisted Career Tools",
    desc: "Use AI to understand your resume, prepare for interviews and improve your applications.",
  },
  {
    icon: Sparkles,
    title: "Built for Modern Job Seekers",
    desc: "Designed around the real workflow of searching, preparing, applying and tracking opportunities.",
  },
];

export default function About() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#F8FAFF] text-[#0B132B]">

        <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20">

          {/* HERO */}
          <section className="mb-20 md:mb-28">
            <p className="font-mono text-xs tracking-widest text-[#64748B] mb-3">
              ABOUT JOBXPORTAL
            </p>

            <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight mb-6 text-[#0B132B]">
              Built for{" "}
              <SplitFlap
                words={[
                  "JOB SEEKERS",
                  "CAREER CHANGERS",
                  "FRESH GRADS",
                  "REMOTE WORKERS",
                ]}
                className="text-[#4F46E5]"
              />
            </h1>

            <p className="text-[#64748B] text-base md:text-lg max-w-3xl leading-relaxed">
              JobXPortal is an all-in-one career platform designed to simplify
              the modern job search. Instead of jumping between multiple job
              websites, candidates can discover opportunities, explore
              companies, prepare applications, use AI-powered career tools and
              track their progress from one place.
            </p>

            <div className="flex flex-wrap gap-3 mt-8">
              <div className="px-4 py-2 rounded-full bg-white border border-[#E2E6F0] text-sm text-[#475569]">
                Job Discovery
              </div>

              <div className="px-4 py-2 rounded-full bg-white border border-[#E2E6F0] text-sm text-[#475569]">
                AI Career Tools
              </div>

              <div className="px-4 py-2 rounded-full bg-white border border-[#E2E6F0] text-sm text-[#475569]">
                Resume Tools
              </div>

              <div className="px-4 py-2 rounded-full bg-white border border-[#E2E6F0] text-sm text-[#475569]">
                Employer Job Posting
              </div>
            </div>
          </section>

          {/* WHAT IS JOBXPORTAL */}
          <section className="mb-20 md:mb-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

              <div>
                <p className="font-mono text-xs tracking-widest text-[#64748B] mb-4">
                  THE IDEA
                </p>

                <h2 className="text-3xl md:text-4xl font-display font-bold mb-5 text-[#0B132B]">
                  What is JobXPortal?
                </h2>

                <p className="text-[#64748B] leading-relaxed mb-5">
                  JobXPortal brings job discovery and career preparation
                  together into one platform. It combines job aggregation,
                  company career discovery, AI-powered tools and application
                  management into a single workflow.
                </p>

                <p className="text-[#64748B] leading-relaxed">
                  The goal is simple: make finding the right opportunity easier,
                  help candidates prepare better and give employers another
                  way to connect with potential talent.
                </p>
              </div>

              <div className="bg-white border border-[#E2E6F0] rounded-3xl p-6 md:p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                <div className="grid grid-cols-2 gap-4">

                  <div className="p-5 rounded-2xl bg-[#F8FAFF] border border-[#E2E6F0]">
                    <Search className="text-[#4F46E5] mb-4" size={24} />
                    <h3 className="font-bold mb-1">Discover</h3>
                    <p className="text-xs text-[#64748B]">
                      Find relevant opportunities
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#F8FAFF] border border-[#E2E6F0]">
                    <Brain className="text-[#7C3AED] mb-4" size={24} />
                    <h3 className="font-bold mb-1">Prepare</h3>
                    <p className="text-xs text-[#64748B]">
                      Improve your applications
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#F8FAFF] border border-[#E2E6F0]">
                    <Target className="text-[#10B981] mb-4" size={24} />
                    <h3 className="font-bold mb-1">Apply</h3>
                    <p className="text-xs text-[#64748B]">
                      Reach the original listing
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#F8FAFF] border border-[#E2E6F0]">
                    <ClipboardList className="text-[#F59E0B] mb-4" size={24} />
                    <h3 className="font-bold mb-1">Track</h3>
                    <p className="text-xs text-[#64748B]">
                      Manage your applications
                    </p>
                  </div>

                </div>
              </div>

            </div>
          </section>

          {/* WHY BUILT */}
          <section className="mb-20 md:mb-28">
            <p className="font-mono text-xs tracking-widest text-[#64748B] mb-4">
              WHY IT EXISTS
            </p>

            <h2 className="text-2xl md:text-4xl font-display font-bold mb-5 text-[#0B132B]">
              Less searching. More applying.
            </h2>

            <p className="text-[#64748B] max-w-3xl leading-relaxed mb-8">
              Job searching can become repetitive very quickly. Candidates
              often search the same role across several websites, compare
              duplicate listings, open company career pages separately and
              then use different tools to prepare their applications.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {values.map((item) => (
                <div
                  key={item.title}
                  className="
                    bg-white
                    border border-[#E2E6F0]
                    rounded-2xl
                    p-6
                    hover:-translate-y-1
                    hover:border-[#4F46E5]/30
                    hover:shadow-[0_15px_40px_rgba(15,23,42,0.06)]
                    transition-all duration-300
                  "
                >
                  <item.icon
                    size={24}
                    className="text-[#4F46E5] mb-4"
                  />

                  <h3 className="font-bold text-lg mb-2 text-[#0B132B]">
                    {item.title}
                  </h3>

                  <p className="text-[#64748B] text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* FOR JOB SEEKERS */}
          <section className="mb-20 md:mb-28">
            <p className="font-mono text-xs tracking-widest text-[#64748B] mb-4">
              FOR JOB SEEKERS
            </p>

            <h2 className="text-2xl md:text-4xl font-display font-bold mb-3 text-[#0B132B]">
              Everything you need for the job search
            </h2>

            <p className="text-[#64748B] max-w-2xl mb-8">
              JobXPortal goes beyond simply showing job listings. The platform
              includes tools to help you move from discovering a job to
              preparing and tracking your application.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {seekerFeatures.map((feature) => (
                <div
                  key={feature.title}
                  className="
                    bg-white
                    border border-[#E2E6F0]
                    rounded-2xl
                    p-5
                    hover:-translate-y-1
                    hover:border-[#4F46E5]/30
                    hover:shadow-[0_15px_35px_rgba(15,23,42,0.06)]
                    transition-all duration-300
                  "
                >
                  <div className="w-10 h-10 rounded-xl bg-[#4F46E5]/10 flex items-center justify-center mb-4">
                    <feature.icon
                      size={19}
                      className="text-[#4F46E5]"
                    />
                  </div>

                  <h3 className="font-bold text-sm mb-2 text-[#0B132B]">
                    {feature.title}
                  </h3>

                  <p className="text-[#64748B] text-xs leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* FOR EMPLOYERS */}
          <section className="mb-20 md:mb-28">
            <div className="bg-[#0B132B] rounded-3xl p-7 md:p-10 text-white">

              <div className="max-w-2xl mb-8">
                <p className="font-mono text-xs tracking-widest text-[#A5B4FC] mb-4">
                  FOR EMPLOYERS
                </p>

                <h2 className="text-2xl md:text-4xl font-display font-bold mb-4">
                  Your jobs. In front of the right candidates.
                </h2>

                <p className="text-[#CBD5E1] text-sm md:text-base leading-relaxed">
                  JobXPortal is not only for candidates. Employers can create
                  an account, build their company presence and publish job
                  opportunities for people actively looking for their next
                  role.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {employerFeatures.map((feature) => (
                  <div
                    key={feature.title}
                    className="
                      bg-white/5
                      border border-white/10
                      rounded-2xl
                      p-5
                      hover:bg-white/10
                      transition
                    "
                  >
                    <feature.icon
                      size={23}
                      className="text-[#A5B4FC] mb-4"
                    />

                    <h3 className="font-bold mb-2">
                      {feature.title}
                    </h3>

                    <p className="text-[#CBD5E1] text-xs leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          </section>

          {/* HOW IT WORKS */}
          <section className="mb-20 md:mb-28">
            <p className="font-mono text-xs tracking-widest text-[#64748B] mb-4">
              HOW IT WORKS
            </p>

            <h2 className="text-2xl md:text-3xl font-display font-bold mb-6 md:mb-8 text-[#0B132B]">
              Three steps, zero tabs
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {steps.map((step) => (
                <div
                  key={step.n}
                  className="
                    bg-white
                    border border-[#E2E6F0]
                    rounded-2xl
                    p-6 md:p-7
                    hover:border-[#4F46E5]/40
                    hover:-translate-y-1
                    hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]
                    transition-all duration-300
                  "
                >
                  <span className="font-mono text-xs text-[#4F46E5]">
                    {step.n}
                  </span>

                  <step.icon
                    className="text-[#10B981] mt-4 mb-4"
                    size={26}
                  />

                  <h3 className="text-base md:text-lg font-bold mb-2">
                    {step.title}
                  </h3>

                  <p className="text-[#64748B] text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* AI CAREER TOOLS */}
          <section className="mb-20 md:mb-28">
            <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-8 items-start">

              <div>
                <p className="font-mono text-xs tracking-widest text-[#64748B] mb-4">
                  AI CAREER TOOLS
                </p>

                <h2 className="text-2xl md:text-4xl font-display font-bold mb-4 text-[#0B132B]">
                  AI that supports your career workflow
                </h2>

                <p className="text-[#64748B] leading-relaxed">
                  JobXPortal uses AI-assisted tools to help candidates
                  understand their fit for a role, create application
                  materials and prepare for interviews.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="bg-white border border-[#E2E6F0] rounded-2xl p-5">
                  <Brain className="text-[#7C3AED] mb-4" size={23} />
                  <h3 className="font-bold mb-2">Resume Matching</h3>
                  <p className="text-[#64748B] text-sm leading-relaxed">
                    Understand your resume's compatibility with a specific
                    job opportunity.
                  </p>
                </div>

                <div className="bg-white border border-[#E2E6F0] rounded-2xl p-5">
                  <FileText className="text-[#4F46E5] mb-4" size={23} />
                  <h3 className="font-bold mb-2">Cover Letters</h3>
                  <p className="text-[#64748B] text-sm leading-relaxed">
                    Generate role-focused cover letters to personalize your
                    applications.
                  </p>
                </div>

                <div className="bg-white border border-[#E2E6F0] rounded-2xl p-5">
                  <Target className="text-[#10B981] mb-4" size={23} />
                  <h3 className="font-bold mb-2">Interview Prep</h3>
                  <p className="text-[#64748B] text-sm leading-relaxed">
                    Practice different interview categories and prepare before
                    speaking with recruiters.
                  </p>
                </div>

                <div className="bg-white border border-[#E2E6F0] rounded-2xl p-5">
                  <Sparkles className="text-[#F59E0B] mb-4" size={23} />
                  <h3 className="font-bold mb-2">Career Assistance</h3>
                  <p className="text-[#64748B] text-sm leading-relaxed">
                    Use AI-powered assistance as part of your broader job
                    search and application workflow.
                  </p>
                </div>

              </div>

            </div>
          </section>

          {/* SOURCES */}
          <section className="mb-20 md:mb-28">
            <p className="font-mono text-xs tracking-widest text-[#64748B] mb-4">
              JOB SOURCES
            </p>

            <h2 className="text-2xl md:text-3xl font-display font-bold mb-3 text-[#0B132B]">
              Every major portal. One search.
            </h2>

            <p className="text-[#64748B] mb-6 md:mb-8 max-w-xl text-sm md:text-base">
              Our live feed is powered by Google for Jobs which continuously
              indexes listings from all of these sources and more.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {sources.map((source) => (
                <div
                  key={source.name}
                  className={
                    "flex items-start gap-3 md:gap-4 p-4 md:p-5 rounded-2xl border bg-white " +
                    source.bg +
                    " hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition-all duration-300"
                  }
                >
                  <div
                    className={
                      "w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center shrink-0 " +
                      source.color +
                      " bg-[#F8FAFF]"
                    }
                  >
                    <source.icon size={18} />
                  </div>

                  <div>
                    <h3 className={"font-bold text-sm " + source.color}>
                      {source.name}
                    </h3>

                    <p className="text-[#64748B] text-xs mt-1 leading-relaxed">
                      {source.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FOUNDER */}
          <section className="mb-20 md:mb-24">
            <p className="font-mono text-xs tracking-widest text-[#64748B] mb-4">
              FOUNDER
            </p>

            <h2 className="text-2xl md:text-3xl font-display font-bold mb-6 md:mb-8 text-[#0B132B]">
              The person behind the board
            </h2>

            <div
              className="
                bg-white
                border border-[#E2E6F0]
                rounded-2xl
                p-6 md:p-10
                hover:border-[#4F46E5]/30
                hover:shadow-[0_18px_45px_rgba(15,23,42,0.07)]
                transition-all duration-300
              "
            >
              <div className="flex flex-col sm:flex-row gap-6 md:gap-8 items-start">

                {/* AVATAR */}
                {/* <div className="shrink-0">
                  <img
                    src={anilPhoto}
                    alt="Anil Bhukya"
                    className="w-24 h-32 md:w-28 md:h-36 rounded-2xl object-cover object-top border-2 border-[#4F46E5]/30"
                  />
                </div> */}

                <div className="shrink-0">
                  <div
                    className="
                      w-24 h-24
                      rounded-2xl
                      bg-gradient-to-br
                      from-[#4F46E5]
                      to-[#10B981]
                      flex items-center justify-center
                      text-4xl
                      font-display
                      font-bold
                      text-white
                      shadow-lg shadow-indigo-500/10
                    "
                  >
                    A
                  </div>
                </div>

                <div className="flex-1">

                  <h3 className="text-xl md:text-2xl font-display font-bold text-[#0B132B]">
                    Anil Bhukya
                  </h3>

                  <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-2 mb-4">

                    <span
                      className="
                        inline-flex items-center gap-1.5
                        font-mono text-xs
                        px-3 py-1
                        rounded-full
                        bg-[#4F46E5]/10
                        border border-[#4F46E5]/20
                        text-[#4F46E5]
                      "
                    >
                      <GraduationCap size={11} />
                      B.Tech Graduate
                    </span>

                    <span
                      className="
                        inline-flex items-center gap-1.5
                        font-mono text-xs
                        px-3 py-1
                        rounded-full
                        bg-[#10B981]/10
                        border border-[#10B981]/20
                        text-[#059669]
                      "
                    >
                      Founder, JobXPortal
                    </span>

                  </div>

                  <p className="text-[#64748B] leading-relaxed mb-4 text-sm md:text-base">
                    Built JobXPortal after spending too much time switching
                    between LinkedIn, Naukri, Glassdoor and company career pages
                    every morning during my own job search. The idea was simple:
                    one board, every opening, no extra tabs.
                  </p>

                  <p className="text-[#64748B] leading-relaxed mb-6 text-sm md:text-base">
                    JobXPortal is designed with students and fresh graduates in
                    mind — no login walls, no paid tiers, just a clean search
                    that sends you straight to the original job posting.
                  </p>

                  <div className="flex flex-wrap gap-2 md:gap-3">

                    <a
                      href="https://github.com/AnilBhukya05"
                      target="_blank"
                      rel="noreferrer"
                      className="
                        inline-flex items-center gap-2
                        px-3 md:px-4 py-2
                        rounded-lg
                        border border-[#E2E6F0]
                        text-[#64748B]
                        hover:text-[#4F46E5]
                        hover:border-[#4F46E5]
                        hover:bg-[#4F46E5]/5
                        transition
                        text-xs md:text-sm
                        font-mono
                      "
                    >
                      <Code2 size={14} />
                      GitHub
                    </a>

                    <a
                      href="https://www.linkedin.com/in/anilbhukya05/"
                      target="_blank"
                      rel="noreferrer"
                      className="
                        inline-flex items-center gap-2
                        px-3 md:px-4 py-2
                        rounded-lg
                        border border-[#E2E6F0]
                        text-[#64748B]
                        hover:text-[#4F46E5]
                        hover:border-[#4F46E5]
                        hover:bg-[#4F46E5]/5
                        transition
                        text-xs md:text-sm
                        font-mono
                      "
                    >
                      <Link2 size={14} />
                      LinkedIn
                    </a>

                    <a
                      href="mailto:anilbhukya1412@gmail.com"
                      className="
                        inline-flex items-center gap-2
                        px-3 md:px-4 py-2
                        rounded-lg
                        border border-[#E2E6F0]
                        text-[#64748B]
                        hover:text-[#10B981]
                        hover:border-[#10B981]
                        hover:bg-[#10B981]/5
                        transition
                        text-xs md:text-sm
                        font-mono
                      "
                    >
                      <Mail size={14} />
                      Contact
                    </a>

                  </div>

                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section>
            <div
              className="
                rounded-3xl
                bg-gradient-to-br
                from-[#EEF2FF]
                via-white
                to-[#ECFDF5]
                border border-[#E2E6F0]
                p-8 md:p-12
                text-center
              "
            >
              <div className="w-12 h-12 rounded-2xl bg-[#4F46E5]/10 flex items-center justify-center mx-auto mb-5">
                <Sparkles
                  size={24}
                  className="text-[#4F46E5]"
                />
              </div>

              <h2 className="text-2xl md:text-4xl font-display font-bold text-[#0B132B] mb-4">
                Your next opportunity starts here.
              </h2>

              <p className="text-[#64748B] max-w-xl mx-auto text-sm md:text-base leading-relaxed mb-7">
                Search jobs, explore companies, prepare your applications and
                take the next step in your career with JobXPortal.
              </p>

              <a
                href="/jobs"
                className="
                  inline-flex items-center gap-2
                  px-5 py-3
                  rounded-xl
                  bg-[#4F46E5]
                  text-white
                  font-semibold
                  text-sm
                  hover:bg-[#4338CA]
                  hover:-translate-y-0.5
                  transition-all
                  shadow-lg shadow-indigo-500/20
                "
              >
                Explore Jobs
                <ArrowRight size={16} />
              </a>
            </div>
          </section>

        </div>

        <Footer />
      </div>
    </>
  );
}