import { Link } from "react-router-dom";
import { statusFor } from "../data/jobs";

const statusStyles = {
  NEW: "text-[#2DD4BF] border-[#2DD4BF]/40 bg-[#2DD4BF]/10",
  LIVE: "text-[#FFB020] border-[#FFB020]/40 bg-[#FFB020]/10",
  "CLOSING SOON": "text-[#fb7185] border-[#fb7185]/40 bg-[#fb7185]/10",
};

export default function JobCard({ job }) {
  const status = statusFor(job.postedDaysAgo);

  return (
    <div className="bg-[#12151D] border border-[#1E2330] rounded-2xl p-6 hover:border-[#FFB020]/50 transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-xl font-bold text-[#F5F3EE]">{job.title}</h3>
            <span
              className={"font-mono text-[11px] tracking-wider px-2 py-0.5 rounded border " + statusStyles[status]}
            >
              {status}
            </span>
          </div>

          <p className="text-[#8A8F9C] mt-2 font-mono text-sm">
            {job.company} - {job.location} - {job.type}
          </p>

          <div className="flex flex-wrap gap-2 mt-3">
            {job.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-mono px-2 py-1 rounded bg-[#1E2330] text-[#8A8F9C]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex md:flex-col items-center md:items-end gap-3 md:gap-2 shrink-0">
          <span className="font-mono text-sm text-[#FFB020]">{job.salary}</span>
          <div className="flex gap-2">
            <Link
              to={"/job/" + job.id}
              className="px-4 py-2 rounded-lg border border-[#1E2330] text-[#F5F3EE] hover:border-[#2DD4BF] transition text-sm"
            >
              View
            </Link>
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-lg bg-[#2DD4BF] text-[#0B0E14] font-semibold text-sm hover:bg-[#5eead4] transition"
            >
              Apply
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}