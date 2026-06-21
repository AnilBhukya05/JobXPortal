import { Loader2, AlertTriangle } from "lucide-react";

export function JobsLoading({ label }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-[#8A8F9C] font-mono text-sm">
      <Loader2 size={18} className="animate-spin" />
      {label || "Loading jobs..."}
    </div>
  );
}

export function JobsError({ message, onRetry }) {
  return (
    <div className="bg-[#12151D] border border-[#1E2330] rounded-2xl p-10 text-center">
      <AlertTriangle className="mx-auto text-[#fb7185] mb-3" size={28} />
      <p className="text-[#F5F3EE] font-semibold mb-1">Could not load jobs</p>
      <p className="text-[#8A8F9C] text-sm mb-5">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-5 py-2.5 rounded-lg bg-[#FFB020] text-[#0B0E14] font-semibold text-sm"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function DemoBanner({ message }) {
  return (
    <div className="mb-6 px-4 py-3 rounded-xl border border-[#FFB020]/30 bg-[#FFB020]/5 text-[#FFB020] text-sm font-mono">
      Showing demo data - live feed unavailable ({message})
    </div>
  );
}