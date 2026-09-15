export default function JobCardSkeleton() {
  return (
    <div
      className="
        bg-white
        border border-[#E2E6F0]
        rounded-2xl
        p-4 md:p-6
        shadow-[0_4px_18px_rgba(15,23,42,0.035)]
        overflow-hidden
      "
    >
      <div className="flex flex-col gap-4">
        {/* JOB INFORMATION */}
        <div className="flex-1">
          <div className="flex items-start gap-2 flex-wrap">
            <div className="skeleton h-5 w-48 rounded" />
            <div className="skeleton h-4 w-16 rounded" />
          </div>

          <div className="skeleton h-3 w-64 rounded mt-3" />

          <div className="flex gap-2 mt-3">
            <div className="skeleton h-5 w-16 rounded" />
            <div className="skeleton h-5 w-20 rounded" />
            <div className="skeleton h-5 w-14 rounded" />
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div className="flex items-center justify-between gap-4">
          <div className="skeleton h-4 w-28 rounded" />

          <div className="flex gap-2">
            <div className="skeleton h-8 w-16 rounded-lg" />
            <div className="skeleton h-8 w-16 rounded-lg" />
          </div>
        </div>
      </div>

      <style>{`
        .skeleton {
          background: #EEF2F7;
          position: relative;
          overflow: hidden;
        }

        .skeleton::after {
          content: "";
          position: absolute;
          inset: 0;
          transform: translateX(-100%);
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.9) 50%,
            transparent 100%
          );
          animation: skeleton-shimmer 1.5s infinite;
        }

        @keyframes skeleton-shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}