import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

export default function FilterSidebar({
  days,
  setDays,
  remoteOnly,
  setRemoteOnly,
  jobType,
  setJobType,
  experience,
  setExperience,
  category,
  setCategory,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const types = ["Full Time", "Part Time", "Contract"];

  const experienceOptions = [
    { label: "Fresher (0-1 yrs)", value: "fresher" },
    { label: "Junior (1-2 yrs)", value: "junior" },
    { label: "Mid-level (2-5 yrs)", value: "mid" },
    { label: "Senior (5+ yrs)", value: "senior" },
  ];

  const categories = [
    { label: "All Jobs", value: "" },
    { label: "IT and Software", value: "software developer" },
    { label: "Data and Analytics", value: "data analyst" },
    { label: "Design and UX", value: "designer" },
    { label: "Marketing", value: "marketing" },
    { label: "Sales", value: "sales" },
    { label: "Finance and Accounts", value: "finance accountant" },
    { label: "HR and Recruitment", value: "human resources" },
    { label: "Operations", value: "operations manager" },
    { label: "Customer Support", value: "customer support" },
    { label: "Teaching and Education", value: "teacher educator" },
    { label: "Healthcare", value: "doctor nurse healthcare" },
    { label: "Engineering (Non-IT)", value: "mechanical civil electrical engineer" },
    { label: "Legal", value: "lawyer legal" },
    { label: "Content and Writing", value: "content writer" },
  ];

  function clearAll() {
    setDays(30);
    setRemoteOnly(false);
    setJobType([]);
    setExperience([]);
    setCategory("");
    setMobileOpen(false);
  }

  const activeCount =
    (days < 30 ? 1 : 0) +
    (remoteOnly ? 1 : 0) +
    jobType.length +
    experience.length +
    (category ? 1 : 0);

  const filterContent = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-xs tracking-widest text-[#8A8F9C]">
          FILTERS
        </h2>
        <button
          onClick={clearAll}
          className="font-mono text-[10px] text-[#8A8F9C] hover:text-[#fb7185] transition tracking-wider"
        >
          CLEAR ALL
        </button>
      </div>

      {/* CATEGORY */}
      <div>
        <label className="text-sm text-[#F5F3EE] block mb-2">
          Job Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-[#0B0E14] border border-[#1E2330] rounded-lg px-3 py-2.5 text-sm text-[#F5F3EE] outline-none focus:border-[#FFB020] transition-colors"
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* POSTED WITHIN */}
      <div>
        <label className="text-sm text-[#F5F3EE] block mb-2">
          Added to feed within
        </label>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="w-full bg-[#0B0E14] border border-[#1E2330] rounded-lg px-3 py-2.5 text-sm text-[#F5F3EE] outline-none focus:border-[#FFB020] transition-colors"
        >
          <option value={1}>Last 24 Hours</option>
          <option value={3}>Last 3 Days</option>
          <option value={7}>Last 7 Days</option>
          <option value={30}>Last 30 Days</option>
        </select>
      </div>

      {/* JOB TYPE */}
      <div>
        <label className="text-sm text-[#F5F3EE] block mb-3">Job type</label>
        <div className="flex flex-col gap-2.5">
          {types.map((type) => (
            <label
              key={type}
              className="flex items-center gap-2 text-sm text-[#8A8F9C] cursor-pointer hover:text-[#F5F3EE] transition"
            >
              <input
                type="checkbox"
                checked={jobType.includes(type)}
                onChange={() =>
                  setJobType((prev) =>
                    prev.includes(type)
                      ? prev.filter((t) => t !== type)
                      : [...prev, type]
                  )
                }
                className="accent-[#FFB020]"
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      {/* EXPERIENCE */}
      <div>
        <label className="text-sm text-[#F5F3EE] block mb-3">Experience</label>
        <div className="flex flex-col gap-2.5">
          {experienceOptions.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 text-sm text-[#8A8F9C] cursor-pointer hover:text-[#F5F3EE] transition"
            >
              <input
                type="checkbox"
                checked={experience.includes(opt.value)}
                onChange={() =>
                  setExperience((prev) =>
                    prev.includes(opt.value)
                      ? prev.filter((e) => e !== opt.value)
                      : [...prev, opt.value]
                  )
                }
                className="accent-[#2DD4BF]"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {/* REMOTE ONLY */}
      <label className="flex items-center justify-between cursor-pointer">
        <span className="text-sm text-[#F5F3EE]">Remote only</span>
        <div
          onClick={() => setRemoteOnly((r) => !r)}
          className={"relative w-10 h-5 rounded-full transition-colors duration-300 cursor-pointer " + (remoteOnly ? "bg-[#2DD4BF]" : "bg-[#1E2330]")}
        >
          <span
            className={"absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-300 " + (remoteOnly ? "translate-x-5" : "translate-x-0")}
          />
        </div>
      </label>
    </div>
  );

  return (
    <>
      {/* MOBILE FILTER BUTTON */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#1E2330] text-[#F5F3EE] font-mono text-sm"
        >
          <SlidersHorizontal size={16} />
          Filters
          {activeCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#FFB020] text-[#0B0E14] text-xs font-bold flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-[#12151D] border-t border-[#1E2330] rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <span className="font-mono text-xs tracking-widest text-[#8A8F9C]">
                FILTERS
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-[#8A8F9C] hover:text-[#F5F3EE]"
              >
                <X size={20} />
              </button>
            </div>
            {filterContent}
            <button
              onClick={() => setMobileOpen(false)}
              className="w-full mt-6 py-3 rounded-xl bg-[#FFB020] text-[#0B0E14] font-semibold"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:block bg-[#12151D] border border-[#1E2330] rounded-2xl p-6 h-fit md:sticky md:top-28">
        {filterContent}
      </div>
    </>
  );
}