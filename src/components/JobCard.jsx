import { Link } from "react-router-dom";
import { Bookmark, Share2 } from "lucide-react";
import { statusFor } from "../data/jobs";
import { useBookmarkContext } from "../context/BookmarkContext";
import { useToast } from "../context/ToastContext";

const statusStyles = {
  NEW: "text-[#2DD4BF] border-[#2DD4BF]/40 bg-[#2DD4BF]/10",
  LIVE: "text-[#10B981] border-[#10B981]/40 bg-[#10B981]/10",
  "CLOSING SOON": "text-[#fb7185] border-[#fb7185]/40 bg-[#fb7185]/10",
};

export default function JobCard({ job }) {
  const status = statusFor(job.postedDaysAgo);
  const { toggle, isBookmarked } = useBookmarkContext();
  const { toast } = useToast();
  const saved = isBookmarked(job.id);

  function handleBookmark(e) {
    e.preventDefault();
    toggle(job);
    toast(saved ? "Bookmark removed" : "Job saved!", saved ? "info" : "success");
  }

  function handleShare(e) {
    e.preventDefault();
    const url = job.applyUrl || window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast("Apply link copied to clipboard!", "info");
    });
  }

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 md:p-6 hover:border-[#10B981]/50 transition-colors duration-300">
      <div className="flex flex-col gap-4">
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 flex-wrap flex-1">
              <h3 className="text-base md:text-xl font-bold text-[var(--text)] leading-snug">
                {job.title}
              </h3>
              <span
                className={"font-mono text-[10px] tracking-wider px-2 py-0.5 rounded border shrink-0 mt-0.5 " + statusStyles[status]}
              >
                {status}
              </span>
            </div>

            {/* ACTION ICONS */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleShare}
                title="Copy apply link"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--muted)] hover:text-[#10B981] hover:bg-[#10B981]/10 transition"
              >
                <Share2 size={15} />
              </button>
              <button
                onClick={handleBookmark}
                title={saved ? "Remove bookmark" : "Save job"}
                className={"w-8 h-8 rounded-lg flex items-center justify-center transition " + (saved ? "text-[#10B981] bg-[#10B981]/10" : "text-[var(--muted)] hover:text-[#10B981] hover:bg-[#10B981]/10")}
              >
                <Bookmark size={15} className={saved ? "fill-[#10B981]" : ""} />
              </button>
            </div>
          </div>

          <p className="text-[var(--muted)] mt-2 font-mono text-xs md:text-sm">
            {job.company} - {job.location} - {job.type}
          </p>

          <div className="flex flex-wrap gap-2 mt-3">
            {job.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-mono px-2 py-1 rounded bg-[var(--border)] text-[var(--muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-sm text-[#10B981]">{job.salary}</span>
          <div className="flex gap-2">
            <Link
              to={"/job/" + job.id}
              className="px-3 md:px-4 py-2 rounded-lg border border-[var(--border)] text-[var(--text)] hover:border-[#2DD4BF] transition text-xs md:text-sm"
            >
              View
            </Link>
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 md:px-4 py-2 rounded-lg bg-[#2DD4BF] text-[#0B0E14] font-semibold text-xs md:text-sm hover:bg-[#5eead4] transition"
            >
              Apply
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}