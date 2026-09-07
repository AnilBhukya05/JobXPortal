export default function JobCardSkeleton() {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 md:p-6">
      <div className="flex flex-col gap-4">
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
        <div className="flex items-center justify-between">
          <div className="skeleton h-4 w-28 rounded" />
          <div className="flex gap-2">
            <div className="skeleton h-8 w-16 rounded-lg" />
            <div className="skeleton h-8 w-16 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}