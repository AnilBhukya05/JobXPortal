import { AlertTriangle } from "lucide-react";
import JobCardSkeleton from "./JobCardSkeleton";

export function JobsLoading({ count = 5 }) {
  return (
    <div className="space-y-3 md:space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <JobCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function JobsError({ message, onRetry }) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-10 text-center">
      <AlertTriangle className="mx-auto text-[#fb7185] mb-3" size={28} />
      <p className="text-[var(--text)] font-semibold mb-1">Could not load jobs</p>
      <p className="text-[var(--muted)] text-sm mb-5">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-5 py-2.5 rounded-lg bg-[#10B981] text-[#0B0E14] font-semibold text-sm"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function DemoBanner({ message }) {
  return (
    <div className="mb-6 px-4 py-3 rounded-xl border border-[#10B981]/30 bg-[#10B981]/5 text-[#10B981] text-sm font-mono">
      Showing demo data — live feed unavailable ({message})
    </div>
  );
}