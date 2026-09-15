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
    <div
      className="
        bg-white
        border border-[#E2E6F0]
        rounded-2xl
        p-10
        text-center
        shadow-[0_4px_18px_rgba(15,23,42,0.04)]
      "
    >
      <AlertTriangle
        className="mx-auto text-[#E11D48] mb-3"
        size={28}
      />

      <p className="text-[#0B132B] font-semibold mb-1">
        Could not load jobs
      </p>

      <p className="text-[#64748B] text-sm mb-5">
        {message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="
            px-5 py-2.5
            rounded-lg
            bg-[#4F46E5]
            text-white
            font-semibold
            text-sm
            transition
            hover:bg-[#4338CA]
            active:scale-[0.98]
          "
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function DemoBanner({ message }) {
  return (
    <div
      className="
        mb-6
        px-4 py-3
        rounded-xl
        border border-[#F59E0B]/30
        bg-[#FFFBEB]
        text-[#B45309]
        text-sm
        font-mono
      "
    >
      Showing demo data — live feed unavailable ({message})
    </div>
  );
}