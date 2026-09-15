import { motion } from "framer-motion";
import { ArrowUpRight, Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const accents = [
  {
    bg: "from-blue-50 to-indigo-50",
    icon: "bg-blue-100 text-blue-600",
    border: "hover:border-blue-200",
    text: "group-hover:text-blue-600",
  },
  {
    bg: "from-violet-50 to-purple-50",
    icon: "bg-violet-100 text-violet-600",
    border: "hover:border-violet-200",
    text: "group-hover:text-violet-600",
  },
  {
    bg: "from-cyan-50 to-blue-50",
    icon: "bg-cyan-100 text-cyan-600",
    border: "hover:border-cyan-200",
    text: "group-hover:text-cyan-600",
  },
  {
    bg: "from-emerald-50 to-teal-50",
    icon: "bg-emerald-100 text-emerald-600",
    border: "hover:border-emerald-200",
    text: "group-hover:text-emerald-600",
  },
  {
    bg: "from-orange-50 to-amber-50",
    icon: "bg-orange-100 text-orange-600",
    border: "hover:border-orange-200",
    text: "group-hover:text-orange-600",
  },
  {
    bg: "from-pink-50 to-rose-50",
    icon: "bg-pink-100 text-pink-600",
    border: "hover:border-pink-200",
    text: "group-hover:text-pink-600",
  },
  {
    bg: "from-indigo-50 to-blue-50",
    icon: "bg-indigo-100 text-indigo-600",
    border: "hover:border-indigo-200",
    text: "group-hover:text-indigo-600",
  },
  {
    bg: "from-fuchsia-50 to-violet-50",
    icon: "bg-fuchsia-100 text-fuchsia-600",
    border: "hover:border-fuchsia-200",
    text: "group-hover:text-fuchsia-600",
  },
];

export default function PortalCard({ portal, index = 0 }) {
  const navigate = useNavigate();

  const theme = accents[index % accents.length];

  function openJobs() {
    navigate(`/jobs/${portal.slug}`);
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.45,
        delay: index * 0.05,
      }}
      whileHover={{
        y: -7,
      }}
      className={`group relative cursor-pointer overflow-hidden rounded-[24px] border border-[#E7EAF0] bg-white p-5 shadow-[0_6px_25px_rgba(15,23,42,0.05)] transition-all duration-300 hover:shadow-[0_22px_55px_rgba(15,23,42,0.10)] ${theme.border}`}
    >
      {/* Background glow */}

      <div
        className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br ${theme.bg} opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100`}
      />

      {/* Top */}

      <div className="relative flex items-center justify-between">
        <span className="rounded-full bg-[#F8FAFC] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#667085]">
          Job Source
        </span>
      </div>

      {/* Logo */}

      <div className="relative mt-6 flex items-center gap-4">
        <div
          className={`flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-[20px] bg-gradient-to-br ${theme.bg} shadow-sm transition-transform duration-300 group-hover:scale-105`}
        >
          {portal.logo || portal.icon ? (
            typeof (portal.logo || portal.icon) === "string" ? (
              <img
                src={portal.logo || portal.icon}
                alt={portal.name || "Job portal"}
                className="h-10 w-10 object-contain"
              />
            ) : (
              (() => {
                const Icon = portal.icon;

                return <Icon size={34} strokeWidth={1.8} />;
              })()
            )
          ) : (
            <span className="text-2xl font-black">
              {portal.name?.charAt(0)?.toUpperCase()}
            </span>
          )}
        </div>

        <div className="min-w-0">
          <h3
            className={`truncate text-lg font-extrabold tracking-tight text-[#101828] transition-colors ${theme.text}`}
          >
            {portal.name}
          </h3>

          <p className="mt-1 text-xs font-medium text-[#98A2B3]">
            Find your next opportunity
          </p>
        </div>
      </div>

      {/* Description */}

      <p className="relative mt-5 min-h-[48px] text-sm leading-6 text-[#667085]">
        {portal.description ||
          "Explore the latest job opportunities and discover roles that match your career goals."}
      </p>

      {/* Bottom */}

      <div className="relative mt-6 flex items-center justify-between border-t border-[#F0F2F5] pt-4">
        <button
          type="button"
          onClick={openJobs}
          className={`cursor-pointer inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#475467] transition-all ${theme.text}`}
        >
          Explore Jobs
          <ArrowUpRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </button>

        <span className="text-[11px] font-medium text-[#98A2B3]">
          View opportunities
        </span>
      </div>

      {/* Bottom gradient */}

      <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-[#3949E8] via-[#6D3FEA] to-[#00C896] transition-all duration-500 group-hover:w-full" />
    </motion.div>
  );
}
